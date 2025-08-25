use axum::{extract::Path, http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;
use serde_json::Value;
use std::{fs::{File, OpenOptions}, io::{ErrorKind::AlreadyExists, Read, Write}, path::{Component, PathBuf}};
use rand::{Rng, distr::Alphanumeric};

use crate::celestopia::game_data::{GameData, InputGameData, OutputGameData};

mod aquisition;
mod wonder;
mod item;
mod avatar;
mod player_data;
mod game_data;

pub async fn save(Json(data): Json<InputGameData>) -> Result<Response<SaveResponseBody>, Response<SaveResponseBody>> {
    let path = correct_path(
        std::env::current_exe().map_err(|e| 
            Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to get target directory path: {e}"))
        )?, 
        data.name()
    );

    let mut key = String::new();
    let rng = rand::rng();
    println!("{}", path.display());

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
                                |e| Response::new(
                                    StatusCode::BAD_REQUEST,
                                    format!("Failed to create save file: {e}")
                                )
                            ),
                            Ok(false) => Err(Response::new(
                                StatusCode::CONFLICT, 
                                "Provided authentification key is invalid".to_string()
                            )),
                            Err(e) => Err(e)
                        }
                    } else {
                        Err(Response::new(StatusCode::INTERNAL_SERVER_ERROR, "Invalid file path".to_string()))
                    }
                },
            Err(e) => Err(Response::new(
                StatusCode::BAD_REQUEST, 
                format!("Failed to create save file: {e} {}", path.display())
            ))
        }?;

    let (mut data, errors) = GameData::analyze_input(data);
    if !key.is_empty() { data.set_key(&key); }
    let data = serde_json::to_string(&data)
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build save data: {e}")))?;

    file.write(data.as_bytes())
        .map_err(|e| Response::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to write data on save file: {e}")))?;
    
    let mut res = Response::new(StatusCode::OK, "Save complete !".to_string());
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
            Response::new_load_error(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to build directory path: {e}"))
        )?, 
        &name
    );

    let mut file = File::open(path)
        .map_err(|e| Response::new_load_error(StatusCode::BAD_REQUEST, format!("Failed to open save file: {e}")))?;

    let mut buf = String::new();
    let _ = file
        .read_to_string(&mut buf)
        .map_err(|e| Response::new_load_error(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read save file: {e}")))?;

    let data: GameData = serde_json::from_str(&buf)
        .map_err(|e| Response::new_load_error(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to parse save file as json: {e}")))?;
    
    Ok(Response::new_load(data))   
}

fn correct_path(path: PathBuf, filename: &str) -> PathBuf {
    let mut path = path.components().take_while(|x|  *x != Component::Normal("gameHub".as_ref())).collect::<PathBuf>();
    path.push("gameHub");
    path.push("server");
    path.push("data");
    path.push(filename);
    path.set_extension("json");

    path
}

fn check_authentification(path: &str, key: &str) -> Result<bool, Response<SaveResponseBody>> {
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

pub(crate) struct Response<T> {
    status: StatusCode,
    body: T
} impl Response<SaveResponseBody> {
    fn new(status: StatusCode, message: String) -> Self {
        Self { status, body: SaveResponseBody { message, authentification: String::new(), errors: vec![] }}
    }

    fn set_authentification(&mut self, key: String) { 
        self.body.authentification = key;
    }

    fn set_errors(&mut self, errors: Vec<String>) {
        self.body.errors = errors;
    }
} impl Response<String> {
    fn new_load_error(status: StatusCode, message: String) -> Self {
        Self { status, body: message }
    }
} impl Response<OutputGameData> {
    fn new_load(data: GameData) -> Self {
        Self { status: StatusCode::OK, body: OutputGameData::from(data) }
    }
}
impl<T: Serialize> IntoResponse for Response<T> {
    fn into_response(self) -> axum::response::Response {
        let status = self.status;
        (status, Json(self.body)).into_response()
    }
}

#[derive(Serialize)]
pub(crate) struct SaveResponseBody {
    message: String,
    authentification: String,
    errors: Vec<String>
}