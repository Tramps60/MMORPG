use serde::{Deserialize, Serialize};

pub struct Client {
    pub client_id: String,
    pub world_position: Position
}

impl Client {
    pub fn new() -> Self {
    let client_id = uuid::Uuid::new_v4().to_string();

    let position = Position { x: 2.0, y: 2.0 };

        Self { client_id, world_position: position }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClientMessagePayload<T> {
    pub client_id: String,
    pub data: T,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Position {
    pub x: f32,
    pub y: f32
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NewConnection {
    pub client_id: String,
    pub position: Position
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum ClientMessage {
    Position(ClientMessagePayload<Position>),
    NewConnection(ClientMessagePayload<NewConnection>)
}