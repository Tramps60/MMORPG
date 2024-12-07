use tokio::sync::broadcast;

use crate::types::{ClientMessage, ClientMessagePayload, NewConnection, Position};

pub async fn handle_position_message(
    payload: ClientMessagePayload<Position>,
    broadcast_sender: &broadcast::Sender<ClientMessage>
) {
    if let Err(e) = broadcast_sender.send(ClientMessage::Position(payload)) {
        println!("error broadcasting message: {}", e);
    };
}

/**
 * Configure client id and starting position for player
 * on successful websocket connection. for now done in 
 * memory. In the future will get position and id from
 * db. Websocket will keep in memory state of all players.
 * Player state will be persisted when connection is closed.
 * this actually shouldnt be sent from the frontend, it will
 * be send from backend on inital websocket connection
 */
pub async fn handle_new_connection_message(
    payload: ClientMessagePayload<NewConnection>,
    broadcast_sender: &broadcast::Sender<ClientMessage>
) {
    if let Err(e) = broadcast_sender.send(ClientMessage::NewConnection(payload)) {
        println!("error broadcasting message: {}", e);
    };
}