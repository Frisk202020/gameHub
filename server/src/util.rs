use std::path::{Component, PathBuf};
use anyhow::Result;
use tracing::error;

pub const FORMAT: &'static str = "%Y-%m-%d_%H-%M-%S";

pub enum ServerDirectory {
    Data,
    Log
} impl ToString for ServerDirectory {
    fn to_string(&self) -> String {
        match self {
            Self::Data => String::from("data"),
            Self::Log => String::from(r"log\data"),
        }
    }
} impl ServerDirectory {
    fn file_extention(&self) -> &str {
        match self {
            Self::Log => ".log",
            Self::Data => ".json"
        }
    }
}

pub fn read_dir(directory: ServerDirectory) -> Result<Vec<String>> {
    let path = correct_path(
        std::env::current_exe()?, 
        &directory,
        None
    );

    Ok(
        std::fs::read_dir(path)?
            .filter_map(|x| x.inspect_err(|e| error!("Failed to read a file: {e}")).ok())
            .filter_map(
                |x| x.file_name()
                    .to_str()
                    .and_then(|s| s.strip_suffix(directory.file_extention()).map(|s| s.to_string()))
            ).collect::<Vec<String>>()
    )
}

pub struct FileDescriptior {
    name: String,
    extention: String,
} impl FileDescriptior {
    pub fn new_json(name: &str) -> Self {
        Self {name: name.to_string(), extention: "json".to_string()}
    }
    pub fn new_log(name: &str) -> Self {
        Self {name: name.to_string(), extention: "log".to_string()}
    }
}

pub fn correct_path(path: PathBuf, directory: &ServerDirectory,  file: Option<FileDescriptior>) -> PathBuf {
    let mut path = path.components().take_while(|x|  *x != Component::Normal("gameHub".as_ref())).collect::<PathBuf>();
    path.push("gameHub");
    path.push("server");
    path.push(directory.to_string());
    if let Some(file) = file {
        path.push(file.name);
        path.set_extension(file.extention);
    }

    path
}