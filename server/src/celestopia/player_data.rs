use serde::{Deserialize, Serialize};

use crate::celestopia::{aquisition::Aquisition, avatar::Avatar, item::Item, wonder::Wonder};

#[derive(Serialize, Deserialize)]
pub struct PlayerData {
    name: String,
    icon: Avatar,
    coins: i64,
    ribbons: u64,
    stars: u64,
    aquisitions: Vec<Aquisition>,
    wonders: Vec<Wonder>,
    items:  Vec<Item>,
    case_id: u64,   
}
impl From<&InputPlayerData> for PlayerData {
    fn from(value: &InputPlayerData) -> Self {
        Self {
            name: value.name.clone(),
            icon: Avatar::from(value.icon.as_str()),
            coins: value.coins,
            ribbons: value.ribbons,
            stars: value.stars,
            aquisitions: value.aquisitions.iter().map(|aq| Aquisition::from(aq.as_str())).filter(|aq| !aq.is_none()).collect(),
            wonders: value.wonders.iter().map(|aq| Wonder::from(aq.as_str())).filter(|aq| !aq.is_none()).collect(),
            items: value.items.iter().map(|aq| Item::from(aq.as_str())).filter(|aq| !aq.is_none()).collect(),
            case_id: value.case_id,
        }
    }
} impl PlayerData {
    pub(crate) fn avatar_ok(&self) -> bool { !self.icon.is_none() }
    pub(crate) fn aquisitions_count(&self) -> usize { self.aquisitions.len() }
    pub(crate) fn wonders_count(&self) -> usize { self.wonders.len() }
    pub(crate) fn items_count(&self) -> usize { self.items.len() }
}

#[derive(Serialize, Deserialize)]
pub struct InputPlayerData {
    name: String,
    icon: String,
    coins: i64,
    ribbons: u64,
    stars: u64,
    aquisitions: Vec<String>,
    wonders: Vec<String>,
    items:  Vec<String>,
    case_id: u64, 
}
impl InputPlayerData {
    pub(crate) fn aquisitions_count(&self) -> usize { self.aquisitions.len() }
    pub(crate) fn wonders_count(&self) -> usize { self.wonders.len() }
    pub(crate) fn items_count(&self) -> usize { self.items.len() }
}