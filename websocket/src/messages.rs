use axum::{extract::ws::{Message, WebSocket}, Error};
use futures::{stream::SplitSink, SinkExt};
use serde_json::json;

use crate::types::{ClientMessagePayload, NewConnection, Position};

pub async fn handle_position_message(
    payload: ClientMessagePayload<Position>,
    sender: &mut SplitSink<WebSocket, Message>
) -> Result<(), Error> {

    let response = json!({
        "type": "Position",
        "client_id": payload.client_id,
        "data": {
            "x": payload.data.x,
            "y": payload.data.y
        }
    });

    sender.send(Message::Text(response.to_string())).await?;

    Ok(())
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
    sender: &mut SplitSink<WebSocket, Message>
) -> Result<(), Error> {

    let response = json!({
        "type": "NewConnection",
        "client_id": payload.client_id,
        "data": {
            "x": 2,
            "y": 2,
        },
    });

    sender.send(Message::Text(response.to_string())).await?;

    Ok(())
}