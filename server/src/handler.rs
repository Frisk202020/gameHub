use axum::{extract::Path, http::{header, HeaderMap, StatusCode}, response::IntoResponse};
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use tokio::{fs::File, io::AsyncReadExt};
use tower::ServiceBuilder;
use tower_http::services::ServeDir;
use tracing::{trace, error};

use crate::{response::Response, util::{read_dir, ServerDirectory, FORMAT}};

pub fn service(path: &str) -> ServeDir {
    ServiceBuilder::new().service(ServeDir::new(path))
}

pub async fn get_file(Path(path): Path<String>) -> impl IntoResponse {
    let path = format!("../{path}");
    trace!("Asking for file {path}");

    match File::open(&path).await {
        Ok(mut file) => {
            let mut buffer = Vec::new();
            if let Err(_) = file.read_to_end(&mut buffer).await { return StatusCode::INTERNAL_SERVER_ERROR.into_response()};
            let mime_type = mime_guess::from_path(&path).first_or_octet_stream();
            let mut headers = HeaderMap::new();
            headers.insert(header::CONTENT_TYPE, mime_type.as_ref().parse().unwrap());

            (headers, buffer).into_response()
        }
        Err(_) => StatusCode::NOT_FOUND.into_response(),
    }
}   

pub async fn get_latest_log() -> Result<impl IntoResponse, Response<String>> {
    let files = read_dir(ServerDirectory::Log)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to list available files: {e}")))?;

    let dates = files.iter().filter_map(|x| {
        NaiveDateTime::parse_from_str(x, FORMAT).inspect_err(|e| {
            error!("Failed to extract a date from a log file: {e}");
        }).ok().map(|x| Utc.from_utc_datetime(&x))
    }).collect::<Vec<DateTime<Utc>>>();

    if dates.is_empty() {
        return Err(Response::new(StatusCode::NOT_ACCEPTABLE, "No log file found !".to_string()))
    }

    let mut min = dates.first().unwrap();
    for i in 1..dates.len() {
        let d = dates.get(i).unwrap(); 
        if d > min {
            min = d;
        }
    }
    
    Ok(get_file(Path(format!("server/log/data/{}.log", min.format(FORMAT).to_string()))).await)
}