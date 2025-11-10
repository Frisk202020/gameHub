use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;

use crate::celestopia::SaveResponseBody;

pub(crate) struct Response<T> {
    status: StatusCode,
    body: T
} impl<T: Serialize> IntoResponse for Response<T> {
    fn into_response(self) -> axum::response::Response {
        let status = self.status;
        (status, Json(self.body)).into_response()
    }
} impl<T> Response<T> {
    pub fn new(status: StatusCode, body: T) -> Self {
        Self {status, body}
    }
    pub fn body_mut(&mut self) -> &mut T { &mut self.body } 
} impl From<Response<String>> for Response<SaveResponseBody> {
    fn from(value: Response<String>) -> Self {
        Response::new_save(value.status, value.body)
    }
} 