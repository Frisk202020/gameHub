use serde::Deserialize;
use crate::celestopia::player_data::InputPlayerData;

#[derive(Deserialize)]
pub(crate) struct AddPlayerRequest {
    player_data: InputPlayerData,
    target_file: String,
    authentification: String,
} impl AddPlayerRequest {
    pub(crate) fn target(&self) -> &str { &self.target_file }
    pub(crate) fn player(&self) -> &InputPlayerData { &self.player_data }
    pub(crate) fn key(&self) -> &str { self.authentification.as_str() }
}