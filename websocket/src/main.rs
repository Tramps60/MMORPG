use axum::{routing::get, Router};
use tokio::net::TcpListener;

mod handler;
mod messages;
mod types;

use handler::websocket_handler;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/ws", get(websocket_handler));

    let listener = TcpListener::bind("localhost:1111").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}