use serde::Serialize;

#[derive(Serialize)]
pub(crate) enum Aquisition {
    Astropy,
    Baloon,
    Bd,
    Beauty,
    Camping,
    Car,
    Castle,
    Chest,
    Horse,
    Magic,
    Moto,
    Necklace,
    Picasso,
    Pool,
    Post,
    Tractor,
    Vase,
    Wine,
    None
}
impl Aquisition {
    pub(crate) fn is_none(&self) -> bool {
        if let Self::None = self { true } else { false }
    }
}
impl From<&str> for Aquisition {
    fn from(value: &str) -> Self {
        match value {
            "astropy" => Self::Astropy,
            "baloon" => Self::Baloon,
            "bd" => Self::Bd,
            "beauty" => Self::Beauty,
            "camping" => Self::Camping,
            "car" => Self::Car,
            "castle" => Self::Castle,
            "chest" => Self::Chest,
            "horse" => Self::Horse,
            "magic" => Self::Magic,
            "moto" => Self::Moto,
            "necklace" => Self::Necklace,
            "picasso" => Self::Picasso,
            "pool" => Self::Pool,
            "post" => Self::Post,
            "tractor" => Self::Tractor,
            "vase" => Self::Vase,
            "wine" => Self::Wine,
            _ => Self::None,
        }
    }
}
