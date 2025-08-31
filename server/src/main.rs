mod util;
mod celestopia;

use std::net::SocketAddr;
use axum::{routing, Router};
use tracing_subscriber::{fmt, EnvFilter};
use util::*;
use anyhow::Result;
use tower_http::cors::{Any, CorsLayer};

use crate::celestopia::{list, load, save};

#[tokio::main]
async fn main() -> Result<()> {
    fmt().with_env_filter(EnvFilter::try_from_default_env().unwrap_or(EnvFilter::new("TRACE"))).init();
    axum::serve(
        tokio::net::TcpListener::bind("0.0.0.0:10000".parse::<SocketAddr>()?).await?,
        Router::new()
            .route("/get_file/{*path}", routing::get(get_file))
            .nest_service("/naval", service("../naval/code"))
            .nest_service("/celestopia", service("../celestopia"))  
            .nest_service("/test", service("../test"))
            .route("/celestopia/save", routing::post(save))
            .route("/celestopia/load/{name}", routing::get(load))
            .route("/celestopia/database", routing::get(list))
            .layer(
                CorsLayer::new()
                    .allow_headers(Any)
                    .allow_methods(Any)
                    .allow_origin(Any)
            )
    ).await?;

    Ok(())
}