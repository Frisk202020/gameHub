mod response;
mod celestopia;
mod api;
mod util;

use std::{env, net::SocketAddr};
use axum::{Router, response::Redirect, routing};
use tokio::{net::TcpListener, task::JoinHandle};
use tower::ServiceBuilder;
use tracing::{error, info};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter, Layer, Registry};
use anyhow::Result;
use tower_http::{cors::{Any, CorsLayer}, services::ServeDir};

use crate::{api::internal_api, celestopia::{list, load, save}};

#[tokio::main]
async fn main() -> Result<()> {
    let mut args = env::args();
    if args.len() < 3 {
        println!("Please provide a golden path key and golden path");
        return Ok(());
    }
    let golden_key = args.nth(1).unwrap(); let golden_path = args.next().unwrap(); 

    Registry::default()
        .with(
            fmt::layer()
                .json()
                //.with_writer(log_file)
                .with_filter(EnvFilter::try_from_default_env().unwrap_or(EnvFilter::new("TRACE")))
        ).init();

    let listener = TcpListener::bind("0.0.0.0:10000".parse::<SocketAddr>()?).await?;
    let router = Router::new()
            .fallback_service(service("../index"))

            .route("/naval", routing::get(Redirect::permanent("/naval/")))
            .nest_service("/naval/", service("../naval"))

            .route("/celestopia", routing::get(Redirect::permanent("/celestopia/")))
            .nest_service("/celestopia/", service("../celestopia"))
            .route("/celestopia/save", routing::post(save))
            .route("/celestopia/load/{name}", routing::get(load))
            .route("/celestopia/database", routing::get(list))

            .route("/lost-in-the-void", routing::get(Redirect::permanent("/lost-in-the-void/")))
            .nest_service("/lost-in-the-void/", service("../lost-in-the-void"))  
            .layer(
                CorsLayer::new()
                    .allow_headers(Any)
                    .allow_methods(Any)
                    .allow_origin(Any)
            );
    let _: JoinHandle<Result<()>> = tokio::spawn(
        async move {axum::serve(listener, router).await?; Ok(())}
    );  // axum::serve never returns

    let internal_listener = TcpListener::bind(
        "127.0.0.1:9000".parse::<SocketAddr>()?
    ).await?;
    let internal_api = internal_api(golden_key, golden_path).await?;
    let _: JoinHandle<Result<()>> = tokio::spawn(
        async move {axum::serve(internal_listener, internal_api).await?; Ok(())}
    );
    println!("Serveur activé !");

    let shut = tokio::signal::ctrl_c().await;
    match shut {
        Ok(()) => info!("Shutting down server."),
        Err(e) => error!("Error on shutdown: {e}")
    }

    println!("Serveur désactivé.");
    Ok(())
}

fn service(path: &str) -> ServeDir {
    ServiceBuilder::new().service(ServeDir::new(path))
}