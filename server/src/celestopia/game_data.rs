use serde::{Deserialize, Serialize};

use crate::celestopia::player_data::{InputPlayerData, PlayerData};

#[derive(Deserialize)]
pub(crate) struct InputGameData {
    name: String,
    key: String,
    players: Vec<InputPlayerData>,
    pig: u16,
    #[serde(alias = "turnHolder")]
    turn_holder: u8,
} impl InputGameData {
    pub(crate) fn key(&self) -> &str {
        &self.key
    }
    pub(crate) fn name(&self) -> &str { &self.name }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct GameData {
    key: String,
    players: Vec<PlayerData>,
    pig: u16,
    turn_holder: u8
} impl GameData {
    pub(crate) fn analyze_input(input: InputGameData) -> (GameData, Vec<String>) {
        let data = Self { 
            key: input.key, 
            players: input.players.iter().map(|p| PlayerData::from(p)).collect(), 
            pig: input.pig,
            turn_holder: input.turn_holder
        };
        let mut errors: Vec<String> = Vec::new();
        data.players.iter().enumerate().zip(input.players).for_each(
            |((i, output), input)| {
                if !output.avatar_ok() { errors.push(format!("Invalid avatar for player {i}")) }
                if !output.color_ok() { errors.push(format!("Invalid color for player {i}")) }
                if output.aquisitions_count() < input.aquisitions_count() { 
                    let c = input.aquisitions_count() - output.aquisitions_count(); 
                    errors.push(format!("Player {i} had {c} invalid aquisitions"));   
                }
                if output.wonders_count() < input.wonders_count() { 
                    let c = input.wonders_count() - output.wonders_count(); 
                    errors.push(format!("Player {i} had {c} invalid wonders"));   
                }
                if output.items_count() < input.items_count() { 
                    let c = input.items_count() - output.items_count(); 
                    errors.push(format!("Player {i} had {c} invalid items"));   
                }
            }
        );

        (data, errors)
    }
    pub(crate) fn set_key(&mut self, key: &str) { self.key = key.to_string(); }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct OutputGameData {
    players: Vec<PlayerData>,
    pig: u16,
    turn_holder: u8
} impl From<GameData> for OutputGameData {
    fn from(value: GameData) -> Self {
        Self {
            players: value.players,
            pig: value.pig,
            turn_holder: value.turn_holder
        }
    }
}