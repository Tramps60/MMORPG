use axum::{extract::{ws::{Message, WebSocket}, WebSocketUpgrade}, response::Response, Error};
use futures::{stream::SplitSink, StreamExt};

use crate::types::ClientMessage;
use crate::messages::{handle_new_connection_message, handle_position_message};

pub async fn websocket_handler(
    websocket: WebSocketUpgrade,
) -> Response {
    websocket.on_upgrade(handle_socket)
}

async fn handle_socket(socket: WebSocket) {
    tokio::spawn(async move {
        let (mut sender, mut reciever) = socket.split();

        while let Some(msg) = reciever.next().await {
            if let Err(e) = handle_message(msg, &mut sender).await {
                println!("there was an error handling the message: {}", e)
            }
        }
    });
}

async fn handle_message(
    msg: Result<Message, Error>, 
    sender: &mut SplitSink<WebSocket, Message>
) -> Result<(), Box<dyn std::error::Error>> {
    let Message::Text(text) = msg? else {
        return Ok(());
    };

    println!("received message: {}", text);
    let client_message = match serde_json::from_str::<ClientMessage>(&text) {
        Ok(msg) => msg,
        Err(e) => {
            println!("Parse error: {}", e);
            return Ok(())
        }
    };

    match client_message {
        ClientMessage::Position(payload) => handle_position_message(payload, sender).await?,
        ClientMessage::NewConnection(payload) => handle_new_connection_message(payload, sender).await?
    }

    Ok(())
}