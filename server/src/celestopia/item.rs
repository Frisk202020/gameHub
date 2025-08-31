use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub(crate) enum Item {
    DiceItem,
    TrickItem,
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
            "DiceItem" => Self::DiceItem,
            "TrickItem" => Self::TrickItem,
            "Seller" => Self::Seller,
            "AquisitionThief" => Self::AquisitionThief,
            "MoneyThief" => Self::MoneyThief,
            "Pipe" => Self::Pipe,
            _ => Self::None
        }
    }
}