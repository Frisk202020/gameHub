mod util;
mod response;
mod celestopia;
mod shared_handler;
mod log;

use std::{env, fs::OpenOptions, net::SocketAddr};
use axum::{routing, Router};
use chrono::Utc;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter, Layer, Registry};
use util::*;
use anyhow::Result;
use tower_http::cors::{Any, CorsLayer};

use crate::{celestopia::{list, load, save}, log::{get_latest_log, get_log_handler, log_list}, shared_handler::{get_file, service}};

#[tokio::main]
async fn main() -> Result<()> {
    let now = Utc::now().format(FORMAT).to_string();
    let path = correct_path(
        env::current_exe().inspect_err(|_| println!("Failed to get current exe path"))?, 
        &ServerDirectory::Log, 
        Some(FileDescriptior::new_log(&now))
    );
    let log_file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path).inspect_err(|_| println!("Failed to create log file at: {}", path.display()))?;

    Registry::default()
        .with(
            fmt::layer()
                .json()
                .with_writer(log_file)
                .with_filter(EnvFilter::try_from_default_env().unwrap_or(EnvFilter::new("TRACE")))
        ).init();

    axum::serve(
        tokio::net::TcpListener::bind("0.0.0.0:10000".parse::<SocketAddr>()?).await?,
        Router::new()
            .route("/get_file/{*path}", routing::get(get_file))
            .route("/get-latest-log", routing::get(get_latest_log))
            .route("/get-log-list", routing::get(log_list))
            .route("/get_log/{*name}", routing::get(get_log_handler))
            .nest_service("/naval", service("../naval/code"))
            .nest_service("/celestopia", service("../celestopia"))
            .nest_service("/logs", service("log"))  
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