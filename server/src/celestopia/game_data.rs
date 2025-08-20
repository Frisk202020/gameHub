use serde::{Deserialize, Serialize};

use crate::celestopia::player_data::{self, InputPlayerData, PlayerData};

#[derive(Serialize, Deserialize)]
pub struct InputGameData {
    players: Vec<InputPlayerData>,
    turn_holder: u8,
}

pub struct GameData {
    players: Vec<PlayerData>,
    turn_holder: u8
} impl GameData {
    fn from_input(input: InputGameData) -> GameDataAnalysis {
        let data = Self { players: input.players.iter().map(|p| PlayerData::from(p)).collect(), turn_holder: input.turn_holder};
        let mut errors: Vec<String> = Vec::new();
        data.players.iter().enumerate().zip(input.players).for_each(
            |((i, output), input)| {
                if !output.avatar_ok() { errors.push(format!("Invalid avatar for player ${i}")) }
                if output.aquisitions_count() < input.aquisitions_count() { 
                    let c = input.aquisitions_count() - output.aquisitions_count(); 
                    errors.push(format!("Player ${i} had ${c} invalid aquisitions"));   
                }
                if output.wonders_count() < input.wonders_count() { 
                    let c = input.wonders_count() - output.wonders_count(); 
                    errors.push(format!("Player ${i} had ${c} invalid wonders"));   
                }
                if output.items_count() < input.items_count() { 
                    let c = input.items_count() - output.items_count(); 
                    errors.push(format!("Player ${i} had ${c} invalid items"));   
                }
            }
        );

        GameDataAnalysis { data, errors }
    }
}


pub struct GameDataAnalysis {
    data: GameData,
    errors: Vec<String>,
}