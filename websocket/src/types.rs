use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientMessagePayload<T> {
    pub client_id: String,
    pub data: T,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Position {
    pub x: f32,
    pub y: f32
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewConnection {
    pub client_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ClientMessage {
    Position(ClientMessagePayload<Position>),
    NewConnection(ClientMessagePayload<NewConnection>)
}