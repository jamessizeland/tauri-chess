pub mod board;
mod moves;
mod pieces;
mod types;
mod unit_tests;
mod utils;

/// Chess logic crate
pub mod data {
    use std::sync::Mutex; // mutual exclusion wrapper

    /// game move history, stored as FEN strings
    // pub struct History(Vec<i32>);

    /// Game state 8x8 board, filled with empty space or Pieces
    pub struct PieceLocation(pub Mutex<super::types::BoardState>);

    /// Track which square has been selected in the UI
    pub struct SelectedSquare(pub Mutex<Option<super::types::Square>>);

    /// Game score stored relative to white
    pub struct GameMetaData(pub Mutex<super::types::GameMeta>);
}
