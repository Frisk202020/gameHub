use axum::{extract::Path, http::StatusCode, Json};
use serde::Serialize;
use serde_json::Value;
use std::{fs::{File, OpenOptions}, io::{ErrorKind::AlreadyExists, Read, Write}};
use rand::{Rng, distr::Alphanumeric};

use crate::{celestopia::game_data::{GameData, InputGameData, OutputGameData}, response::Response, util::{correct_path, read_dir, FileDescriptior, ServerDirectory}};

mod aquisition;
mod wonder;
mod item;
mod avatar;
mod player_data;
mod game_data;
mod color;

pub async fn save(Json(data): Json<InputGameData>) -> Result<Response<SaveResponseBody>, Response<SaveResponseBody>> {
    let path = correct_path(
        std::env::current_exe().map_err(|e| 
            Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to get target directory path: {e}"))
        )?, 
        &ServerDirectory::Data,
        Some(FileDescriptior::new_json(data.name()))
    );

    let mut key = String::new();
    let rng = rand::rng();

    let mut file = match OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path) {
            Ok(file) => {
                key = rng.sample_iter(Alphanumeric).take(8).map(char::from).collect();
                Ok(file)
            },
            Err(e) if e.kind() == AlreadyExists => {
                    if let Some(path) = path.to_str() {
                            match check_authentification(path, data.key()) {
                            Ok(true) => File::create(&path).map_err(
                                |e| Response::new_save(
                                    StatusCode::BAD_REQUEST,
                                    format!("Failed to create save file: {e}")
                                )
                            ),
                            Ok(false) => Err(Response::new_save(
                                StatusCode::CONFLICT, 
                                "Provided authentification key is invalid".to_string()
                            )),
                            Err(e) => Err(e)
                        }
                    } else {
                        Err(Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, "Invalid file path".to_string()))
                    }
                },
            Err(e) => Err(Response::new_save(
                StatusCode::BAD_REQUEST, 
                format!("Failed to create save file: {e} {}", path.display())
            ))
        }?;

    let (mut data, errors) = GameData::analyze_input(data);
    if !key.is_empty() { data.set_key(&key); }
    let data = serde_json::to_string(&data)
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build save data: {e}")))?;

    file.write(data.as_bytes())
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to write data on save file: {e}")))?;
    
    let mut res = Response::new_save(StatusCode::OK, "Save complete !".to_string());
    if !key.is_empty() {
        res.set_authentification(key);
    }
    if !errors.is_empty() {
        res.set_errors(errors);
    }

    Ok(res)
}

pub async fn load(Path(name): Path<String>) -> Result<Response<OutputGameData>, Response<String>> {
    let path = correct_path(
        std::env::current_exe().map_err(|e| 
            Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build directory path: {e}"))
        )?, 
        &ServerDirectory::Data,
        Some(FileDescriptior::new_json(&name))
    );

    let mut file = File::open(path)
        .map_err(|e| Response::new(StatusCode::BAD_REQUEST, format!("Failed to open save file: {e}")))?;

    let mut buf = String::new();
    let _ = file
        .read_to_string(&mut buf)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read save file: {e}")))?;

    let data: GameData = serde_json::from_str(&buf)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to parse save file as json: {e}")))?;
    
    Ok(Response::new_load(data))   
}

pub async fn list() -> Result<Response<Vec<String>>, Response<String>> {
    Ok(Response::new(
        StatusCode::OK, 
        read_dir(ServerDirectory::Data)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read data directory: {e}")))?
    ))
}

fn check_authentification(path: &str, key: &str) -> Result<bool, Response<SaveResponseBody>> {
    let mut file = File::open(path)
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to open existing save file: {e}")))?;

    let mut buf = String::new();
    let _ = file.read_to_string(&mut buf)
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read exisiting save file: {e}")))?;

    let data: Value = serde_json::from_str(&buf)
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to parse json from existing save file: {e}")))?;

    data["key"]
        .as_str()
        .ok_or_else(|| Response::new_save(
            StatusCode::INTERNAL_SERVER_ERROR, 
            "Failed to parse authentifiaction key of this save file".to_string()
        ))
        .map(|s_key| s_key == key)
}

impl Response<SaveResponseBody> {
    fn new_save(status: StatusCode, message: String) -> Self {
        Self::new(status, SaveResponseBody { message, authentification: String::new(), errors: vec![] })
    }

    fn set_authentification(&mut self, key: String) { 
        self.body_mut().authentification = key;
    }

    fn set_errors(&mut self, errors: Vec<String>) {
        self.body_mut().errors = errors;
    }
} impl Response<OutputGameData> {
    fn new_load(data: GameData) -> Self {
        Self::new(StatusCode::OK, OutputGameData::from(data))
    }
}

#[derive(Serialize)]
pub(crate) struct SaveResponseBody {
    message: String,
    authentification: String,
    errors: Vec<String>
}