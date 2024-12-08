use std::sync::Arc;

mod handler;
mod messages;
mod types;

use axum::{extract::State, Json};
use handler::websocket_handler;
use types::{Client, ClientMessage};

struct GameState {
    clients: tokio::sync::Mutex<Vec<Client>>,
    broadcast_sender: tokio::sync::broadcast::Sender<ClientMessage> 
}

impl GameState {
    fn new () -> Self {
        let (broadcast_sender, _) = tokio::sync::broadcast::channel::<ClientMessage>(10);
        Self { 
            clients: tokio::sync::Mutex::new(vec![]), 
            broadcast_sender,
        }
    }

    async fn remove_client(&self, client_id: &str) {
        let mut clients = self.clients.lock().await;
        clients.retain(|client| client.client_id != client_id);
    }
}

#[tokio::main]
async fn main() {
    let game_state = Arc::new(GameState::new());

    let app = axum::Router::new()
        .route("/ws", axum::routing::get(websocket_handler))
        .route("/clients", axum::routing::get(get_clients))
        .with_state(game_state);

    let listener = tokio::net::TcpListener::bind("localhost:1111").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_clients(
    State(game_state): State<Arc<GameState>>
) -> Json<Vec<Client>> {
   let clients = game_state.clients.lock().await;
   Json(clients.clone())
}