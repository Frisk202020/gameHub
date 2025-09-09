use std::{env, fs::File, io::Read};

use axum::{http::StatusCode, Json};
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use serde::{Deserialize, Serialize};
use tracing::error;

use crate::{response::Response, util::{correct_path, read_dir, FileDescriptior, ServerDirectory, FORMAT}};
type LogResult = Result<Json<LogResponse>, Response<String>>;

pub async fn get_latest_log() -> LogResult {
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
    
    get_log(min.format(FORMAT).to_string())
}

fn get_log(name: String) -> LogResult {
    let path = correct_path(
    env::current_exe().map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to find log file: {e}")))?, 
    &ServerDirectory::Log, 
    Some(FileDescriptior::new_log(&name))
    );
    let mut file = File::open(path)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to open log file: {e}")))?;
    
    let mut buffer = String::new();
    file.read_to_string(&mut buffer)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read log file: {e}")))?;
    
    Ok(
        Json(LogResponse {
            file_name: name,
            content: buffer.split("\n")
                .filter(|x| !x.is_empty())
                .map(|x| serde_json::from_str::<Format>(x)
                    .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to parse log data: {e}")))
                ).collect::<Result<Vec<Format>, Response<String>>>()?
        })
    )
}

#[derive(Serialize, Deserialize)]
pub struct LogResponse {
    file_name: String,
    content: Vec<Format>
}

#[derive(Serialize, Deserialize)]
struct Format {
    timestamp: String,
    level: String,
    fields: Fields,
    target: String,
}

#[derive(Serialize, Deserialize)]
struct Fields {
    message: String,
}