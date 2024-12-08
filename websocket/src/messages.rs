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