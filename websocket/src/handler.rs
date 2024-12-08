use std::sync::Arc;

use axum::{extract::{ws::{Message, WebSocket}, State, WebSocketUpgrade}, response::Response, Error};
use futures::{SinkExt, StreamExt};
use tokio::sync::broadcast;

use crate::{types::{ClientMessage, ClientMessagePayload, NoDataMessage, NewConnection, Position}, Client, GameState};
use crate::messages::handle_position_message;

pub async fn websocket_handler(
    websocket: WebSocketUpgrade,
    State(game_state): State<Arc<GameState>>
) -> Response {
    websocket.on_upgrade(|socket| handle_socket(socket, game_state))
}

async fn handle_socket(
    socket: WebSocket,
    game_state: Arc<GameState>,
) {
    let new_client = Client::new(); 
    let client_id = new_client.client_id.clone();
    let position = new_client.world_position.clone();
    game_state.clients.lock().await.push(new_client);

    let (mut sender, mut reciever) = socket.split();
    let mut broadcast_reciever = game_state.broadcast_sender.subscribe();

    let initial_data = ClientMessage::NewConnection(ClientMessagePayload {
        client_id: client_id.clone(),
        data: NewConnection { position: position.clone() }
    });

    if let Ok(msg) = serde_json::to_string(&initial_data) {
        if let Err(e) = sender.send(Message::Text(msg)).await {
            println!("Error sending initital client data: {}", e);
            return;
        }
    };

    let clients = game_state.clients.lock().await;

    for client in clients.iter() {
        if client.client_id != client_id.clone() {
            let position_data = ClientMessage::Position(ClientMessagePayload {
                client_id: client.client_id.clone(),
                data: client.world_position.clone(),
            });
            if let Ok(msg) = serde_json::to_string(&position_data) {
                if let Err(e) = sender.send(Message::Text(msg)).await {
                    println!("Error sending existing client position: {}", e)
                }
            }
        }
    }

    let game_state_clone = game_state.clone();

    let (ready_tx, ready_rx) = tokio::sync::oneshot::channel();

    let client_id_for_send = client_id.clone();
    let client_id_for_recieve = client_id.clone();
    tokio::spawn(async move {

        let broadcast_sender = game_state_clone.broadcast_sender.clone();

        // Message to send to frontend from broadcast
        // For when the client gets a message from another client
        let mut send_task = tokio::spawn(async move {
            while let Ok(msg) = broadcast_reciever.recv().await {
                let broadcaster_id = match &msg {
                    ClientMessage::Position(payload) => &payload.client_id,
                    ClientMessage::NewConnection(payload) => &payload.client_id,
                    _ => &String::from("hello")
                };

                if broadcaster_id != &client_id_for_send {
                    if let Ok(msg_for_client) = serde_json::to_string(&msg) {
                        if let Err(e) = sender.send(Message::Text(msg_for_client)).await {
                            println!("Error sending broadcast message to client: {}", e);
                        }
                    }
                }
            }
        });

        // Message to broadcast from the frontend
        // For when the client needs to broadcast a message to other clients
        let mut recieve_task = tokio::spawn(async move {
            while let Some(msg) = reciever.next().await {
                if let Err(e) = handle_message(msg, &broadcast_sender).await {
                    println!("error handling message: {}", e)
                }
            }
            // disconnection so remove from game_state
            if let Err(e) = broadcast_sender.send(ClientMessage::Disconnection(ClientMessagePayload {
                client_id: client_id_for_recieve.clone(),
                data: NoDataMessage {}
            })) {
                println!("error broadcasting disconnection: {}", e);
            }

            game_state_clone.remove_client(&client_id_for_recieve).await
        });

        let _ = ready_tx.send(());

        tokio::select! {
            _ = (&mut send_task) => recieve_task.abort(),
            _ = (&mut recieve_task) => send_task.abort(),
        }
    });

    ready_rx.await.unwrap();

    let broadcast_data = ClientMessage::Position(ClientMessagePayload {
        client_id: client_id.clone(),
        data: Position { x: position.x, y: position.y}
    });

    if let Err(e) = game_state.broadcast_sender.send(broadcast_data) {
        println!("Error broadcasting new connection: {}", e);
    };
}

async fn handle_message(
    msg: Result<Message, Error>, 
    broadcast_sender: &broadcast::Sender<ClientMessage>
) -> Result<(), Error> {
    let text = match msg? {
        Message::Text(text) => {
            println!("Text message content: {}", text);
            text
        },
        _ => return Ok(())
    };

    let client_message = match serde_json::from_str::<ClientMessage>(&text) {
        Ok(msg) => msg,
        Err(e) => {
            println!("error parsing message from client: {}", e);
            return Ok(());
        }
    };

    match client_message {
        ClientMessage::Position(payload) => handle_position_message(payload, broadcast_sender).await,
        _ => ()
    }

    Ok(())
}