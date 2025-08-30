use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) enum Color {
    Red,
    Yellow,
    Orange,
    Green,
    Cyan,
    Blue,
    Purple,
    Pink,
    None
}
impl Color {
    pub(crate) fn is_none(&self) -> bool {
        if let Self::None = self { true } else { false }
    }
}
impl From<&str> for Color {
    fn from(value: &str) -> Self {
        match value {
            "red" => Self::Red,
            "yellow" => Self::Yellow,
            "orange" => Self::Orange,
            "green" => Self::Green,
            "cyan" => Self::Cyan,
            "blue" => Self::Blue,
            "purple" => Self::Purple,
            "pink" => Self::Pink,
            _ => Self::None
        }
    }
}