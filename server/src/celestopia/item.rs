use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub(crate) enum Item {
    Dice,
    TrickDice,
    Seller,
    AquisitionThief,
    MoneyThief,
    Pipe,
    None,
}
impl Item {
    pub(crate) fn is_none(&self) -> bool {
        if let Self::None = self { true } else { false }
    }
}
impl From<&str> for Item {
    fn from(value: &str) -> Self {
        match value {
            "Dice" => Self::Dice,
            "TrickDice" => Self::TrickDice,
            "Seller" => Self::Seller,
            "AquisitionThief" => Self::AquisitionThief,
            "MoneyThief" => Self::MoneyThief,
            "Pipe" => Self::Pipe,
            _ => Self::None
        }
    }
}