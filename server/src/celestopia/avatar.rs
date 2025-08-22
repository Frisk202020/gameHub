use serde::Serialize;

#[derive(Serialize)]
pub(crate) enum Avatar {
    Hat,
    Strawberry,
    Crown,
    Dice,
    Heart,
    None,
}
impl Avatar {
    pub(crate) fn is_none(&self) -> bool {
        if let Self::None = self { true } else { false }
    }
}
impl From<&str> for Avatar {
    fn from(value: &str) -> Self {
        match value {
            "hat" => Self::Hat,
            "strawberry" => Self::Strawberry,
            "crown" => Self::Crown,
            "dice" => Self::Dice,
            "heart" => Self::Heart,
            _ => Self::None,
        }
    }
}