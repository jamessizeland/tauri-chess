//! Chess pieces logic

use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum Color {
    Black,
    White,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum Piece {
    None,
    Pawn(Color),
    King(Color),
    Queen(Color),
    Bishop(Color),
    Knight(Color),
    Rook(Color),
}

// #[derive(Debug)] // include this line right before your struct definition
// pub struct Piece {
//     square: (char, u8),
// }
