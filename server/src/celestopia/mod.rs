use anyhow::Result;
use axum::{extract::{rejection::JsonRejection, Path}, http::StatusCode, Json};
use serde::Serialize;
use serde_json::Value;
use std::{fs::{File, OpenOptions}, io::{ErrorKind::AlreadyExists, Read, Write}};
use rand::{Rng, distr::Alphanumeric};

use crate::{
    celestopia::{
        add_player::AddPlayerRequest, 
        game_data::{GameData, InputGameData, OutputGameData}, 
        player_data::PlayerData
    }, response::Response, util::{FileDescriptior, ServerDirectory, correct_path, read_dir}
};

mod aquisition;
mod wonder;
mod item;
mod avatar;
mod player_data;
mod game_data;
mod color;
mod add_player;

pub async fn save(payload: Result<Json<InputGameData>, JsonRejection>) -> Result<Response<SaveResponseBody>, Response<SaveResponseBody>> {
    let Json(ipt_data) = payload.map_err(
        |e| Response::new_save(StatusCode::BAD_REQUEST, format!("Invalid request body: {e}"))
    )?;
    let path = correct_path(
        ServerDirectory::Data, 
        Some(FileDescriptior::new_json(ipt_data.name()))
    ).map_err(
        |e| Response::new_save(
            StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to get target directory path: {e}")
        )
    )?;
    let path = path.to_str();

    let path = 
        if let Some(path) = path { path } 
        else { return Err(Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, "Invalid file path".to_string())) };
    let rng = rand::rng();
    let key = ipt_data.key().to_string();
    let (mut data, errors) = GameData::analyze_input(ipt_data);
    let mut res = Response::new_save(StatusCode::OK, "Save complete !".to_string());

    let file_res = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path);

    let mut file = match file_res {
        Ok(file) => {
            let key: String = rng.sample_iter(Alphanumeric).take(8).map(char::from).collect();
            data.set_key(key.as_str());
            res.set_authentification(key.to_string());
            Ok(file)
        },
        Err(e) => {
            if e.kind() == AlreadyExists {
                match check_authentification(path, key.as_str()) {
                    Ok(true) => OpenOptions::new().write(true).truncate(true).open(path).map_err(
                        |e| Response::new_save(
                            StatusCode::BAD_REQUEST,
                            format!("Failed to create save file: {e}")
                        )),
                    Ok(false) => Err(Response::new_save(
                        StatusCode::CONFLICT, 
                        "Provided authentification key is invalid".to_string()
                    )),
                    Err(e) => Err(Response::from(e))
                }
            } else {
                Err(Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, "Invalid file path".to_string()))
            }
        }
    }?;

    let data = serde_json::to_string(&data)
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build save data: {e}")))?;

    file.write(data.as_bytes())
        .map_err(|e| Response::new_save(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to write data on save file: {e}")))?;

    if !errors.is_empty() {
        res.set_errors(errors);
    }

    Ok(res)
}

pub async fn load(Path(name): Path<String>) -> Result<Response<OutputGameData>, Response<String>> {
    let path = correct_path(
        ServerDirectory::Data,
        Some(FileDescriptior::new_json(&name))
    ).map_err(|e| 
        Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build directory path: {e}"))
    )?;

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

// need to write appended player to file
pub async fn add_player(payload: Result<Json<AddPlayerRequest>, JsonRejection>) -> Result<(), Response<String>> {
    let Json(data) = payload.map_err(|e| Response::new(
        StatusCode::BAD_REQUEST,
        format!("Invalid payload : {e}")
    ))?;
    match check_authentification(data.target(), data.key()) {
        Ok(false) => return Err(Response::new(StatusCode::CONFLICT, "Authentification failed".to_string())),
        Err(e) => return Err(Response::from(e)),
        _ => {}
    }

    let path = correct_path(
        ServerDirectory::Data, 
        Some(FileDescriptior::new_json(data.target()))
    ).map_err(|e| Response::new(
        StatusCode::BAD_REQUEST,
        format!("Failed to find file path: {e}")
    ))?;
    let mut file = File::open(&path).map_err(|e| Response::new(
        StatusCode::INTERNAL_SERVER_ERROR,
        format!("Failed to open file : {e}")
    ))?;
    let mut buf = String::new();
    file.read_to_string(&mut buf).map_err(|e| Response::new(
        StatusCode::INTERNAL_SERVER_ERROR,
        format!("Failed to read file : {e}")
    ))?;
    
    let mut file_data: GameData = serde_json::from_str(&buf).map_err(|e| Response::new(
        StatusCode::INTERNAL_SERVER_ERROR,
        format!("Corrupted file : {e}")
    ))?;

    let new_player = PlayerData::from(data.player());

    if file_data.add_player(new_player) {
        let file_data_formatted = serde_json::to_string(&file_data).map_err(
            |e| Response::new(
                StatusCode::INTERNAL_SERVER_ERROR, 
                format!("Failed to format new save data : {e}"))
        )?;

        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(path)
            .map_err(|e| Response::new(
                StatusCode::INTERNAL_SERVER_ERROR, 
                format!("Failed to open save file for editing : {e}")
            ))?;

        if file.write(file_data_formatted.as_bytes()).is_err() { 
            return Err(Response::new(StatusCode::INTERNAL_SERVER_ERROR, "Failed to write new save data".to_string()));
        }

        Ok(())
    } else {
        Err(Response::new(StatusCode::CONFLICT, "This game already has 4 players".to_string()))
    }
}

fn check_authentification(path: &str, key: &str) -> Result<bool, Response<String>> {
    let mut file = File::open(path)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to open existing save file: {e}")))?;

    let mut buf = String::new();
    let _ = file.read_to_string(&mut buf)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read exisiting save file: {e}")))?;

    let data: Value = serde_json::from_str(&buf)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to parse json from existing save file: {e}")))?;

    data["key"]
        .as_str()
        .ok_or_else(|| Response::new(
            StatusCode::INTERNAL_SERVER_ERROR, 
            "Failed to parse authentifiaction key of this save file".to_string()
        ))
        .map(|s_key| s_key == key)
}

impl Response<SaveResponseBody> {
    pub(crate) fn new_save(status: StatusCode, message: String) -> Self {
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