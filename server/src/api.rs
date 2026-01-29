use anyhow::Result;
use axum::{Router, extract::{Path, State}, http::StatusCode, routing};
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone)]
struct InternalState {
    golden_path_key: String,
    golden_path: String
}

pub(crate) async fn internal_api(golden_path_key: String, golden_path: String) -> Result<Router> {
    let state = InternalState { golden_path_key, golden_path };
    let router = Router::new()
        .route("/get-golden-key", routing::get(handler))
        .route("/vrfy-path/{path}", routing::get(vrfy))
        .with_state(state.clone())
        .layer(
            CorsLayer::new().allow_origin(Any)
        );

    let router = router.with_state(state);
    Ok(router)
}

async fn handler(State(state): State<InternalState>) -> String {
    state.golden_path_key
}

async fn vrfy(State(state): State<InternalState>, Path(sequence): Path<String>) -> StatusCode {
    if sequence.len() != state.golden_path.len() || sequence.chars().zip(state.golden_path.chars()).any(|(a, b)| a != b) {
        StatusCode::CONFLICT
    } else {
        StatusCode::OK
    }
}