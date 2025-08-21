use axum::{http::StatusCode, Json};
use serde_json::Value;
use std::{fs::{File, OpenOptions}, io::{ErrorKind::AlreadyExists, Read, Write}};
use rand::{Rng, distr::Alphanumeric};

use crate::celestopia::game_data::{GameData, InputGameData};

mod aquisition;
mod wonder;
mod item;
mod avatar;
mod player_data;
mod game_data;

type Response = (StatusCode, String);


pub async fn save(Json(data): Json<InputGameData>) -> Result<Response, Response> {
    let path = format!("data/celestopia/{}.json", data.name());
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
            Err(e) 
                if e.kind() == AlreadyExists => {
                    match check_authentification(&path, data.key()) {
                        Ok(true) => File::create(&path).map_err(|e| (StatusCode::BAD_REQUEST, format!("Failed to create save file: {e}"))),
                        Ok(false) => Err((StatusCode::CONFLICT, "Provided authentification key is invalid".to_string())),
                        Err(e) => Err(e)
                    }
                },
            Err(e) => Err((StatusCode::BAD_REQUEST, format!("Failed to create save file: {e}")))
        }?;

    let (mut data, errors) = GameData::analyze_input(data);
    if !key.is_empty() { data.set_key(&key); }
    let data = serde_json::to_string(&data)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build save data: {e}")))?;

    file.write(data.as_bytes())
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to write data on save file: {e}")))?;
    
    let mut res = "Save complete".to_string();
    if !key.is_empty() {
        res.push_str(format!("\nNew authentification key: {key}").as_str());
    }
    if !errors.is_empty() {
        res.push_str(format!("\nSome errors occured : \n{errors:?}").as_str());
    }

    Ok((StatusCode::OK, res))
}

fn check_authentification(path: &str, key: &str) -> Result<bool, Response> {
    let mut file = File::open(path)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to open existing save file: {e}")))?;

    let mut buf = String::new();
    let _ = file.read_to_string(&mut buf)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read exisiting save file: {e}")))?;

    let data: Value = serde_json::from_str(&buf)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to parse json from existing save file: {e}")))?;

    data["key"]
        .as_str()
        .ok_or_else(|| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to parse authentifiaction key of this save file".to_string()))
        .map(|s_key| s_key == key)
}