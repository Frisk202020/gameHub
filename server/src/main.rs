mod util;
mod response;
mod celestopia;
mod shared_handler;
mod log;

use std::{env, fs::OpenOptions, net::{IpAddr, SocketAddr}};
use axum::{routing, Router};
use chrono::Utc;
use tokio::task::JoinHandle;
use tracing::{error, info};
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

    let listener = tokio::net::TcpListener::bind("0.0.0.0:10000".parse::<SocketAddr>()?).await?;
    let router = Router::new()
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
            );
    let _: JoinHandle<Result<()>> = tokio::spawn(async move {axum::serve(listener, router).await?; Ok(())});  // axum::serve never returns

    println!("Serveur activé !");
    println!("Vous pouvez désormais vous connecter au server.");
    println!("Voici la liste des addresses ouvertes à la connexion :");
    println!();

    let adapters = ipconfig::get_adapters()?;
    for adapter in adapters {
        let addresses = adapter.ip_addresses();
        let ip4 = addresses.iter().filter(|x| x.is_ipv4()).collect::<Vec<&IpAddr>>();
        println!("{}: {:?}", adapter.description(), ip4);
    }
    println!("L'addresse 127.0.0.1 (ou lacalhost) n'est accessible que depuis votre ordinateur. Pour accéder au serveur depuis un autre ordinateur connecté au même réseau WI-FI, utilisez l'addresse associée à 'Wireless LAN'.");
    println!();
    println!("/celestopia : accès au jeu 'Conquète de Celestopia'.");
    println!("/naval : accès au jeu de bataille navale.");
    println!("/logs : accès aux logs du serveur.");
    println!();
    println!("Vous pouvez entrer la commande Ctrl+C pour désactiver le serveur.");

    let shut = tokio::signal::ctrl_c().await;
    match shut {
        Ok(()) => info!("Shutting down server."),
        Err(e) => error!("Error on shutdown: {e}")
    }

    println!("Serveur désactivé.");
    Ok(())
}