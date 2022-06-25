pub mod board;
mod moves;
mod pieces;
mod types;
mod utils;

/// Chess logic crate
pub mod data {
    use std::sync::Mutex; // mutual exclusion wrapper

    /// game move history, stored as FEN strings
    // pub struct History(Vec<i32>);

    /// game score stored relative to white
    pub struct Score(pub Mutex<i32>);

    /// game state 8x8 board
    pub struct PieceLocation(pub Mutex<super::types::BoardState>);

    pub struct SelectedSquare(pub Mutex<Option<super::types::Square>>);
}
