mod util;
mod celestopia;

use std::net::SocketAddr;

use axum::{routing, Router};
use util::*;
use anyhow::Result;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() -> Result<()> {
    axum::serve(
        tokio::net::TcpListener::bind("0.0.0.0:10000".parse::<SocketAddr>()?).await?,
        Router::new()
            .route("/get_file/{*path}", routing::get(get_file))
            .nest_service("/naval", service("../naval/code"))
            .nest_service("/celestopia", service("../celestopia"))    
            .layer(
                CorsLayer::new()
                    .allow_headers(Any)
                    .allow_methods(Any)
                    .allow_origin(Any)
            )
    ).await?;

    Ok(())
}