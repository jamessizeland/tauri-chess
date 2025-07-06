use super::types;
use crate::chess::board::BoardState;
use std::sync::Mutex;

#[derive(Default)]
pub struct AppContext {
    /// Game state 8x8 board, filled with empty space or Pieces
    pub board: Mutex<BoardState>,
    /// Track which square has been selected in the UI
    pub selected: Mutex<Option<types::Square>>,
    /// All persistent metadata for the game.
    pub meta_data: Mutex<types::GameMeta>,
    /// game move history
    pub history: Mutex<types::Hist>,
}
