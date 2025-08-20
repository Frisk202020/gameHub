use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub(crate) enum Wonder {
    Statue,
    Astropy,
    Bank,
    Bridge,
    Dress,
    Comet,
    Teleporter,
    None,
}
impl Wonder {
    pub(crate) fn is_none(&self) -> bool {
        if let Self::None = self { true } else { false }
    }
}
impl From<&str> for Wonder {
    fn from(value: &str) -> Self {
        match value {
            "statue" => Self::Statue,
            "astropy" => Self::Astropy,
            "bank" => Self::Bank,
            "bridge" => Self::Bridge,
            "dress" => Self::Dress,
            "comet" => Self::Comet,
            "teleporter" => Self::Teleporter,
            _ => Self::None,
        }
    }
}