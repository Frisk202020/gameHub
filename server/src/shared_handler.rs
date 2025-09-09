use axum::{extract::Path, http::{header, HeaderMap, StatusCode}, response::IntoResponse};
use tokio::{fs::File, io::AsyncReadExt};
use tower::ServiceBuilder;
use tower_http::services::ServeDir;
use tracing::trace;

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