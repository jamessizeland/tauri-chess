//! Specific Types useful for a chess game

use serde::{Deserialize, Serialize};

pub type BoardState = [[Piece; 8]; 8];

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct GameMeta {
    pub turn: usize,
    pub score: i32,
    pub black_king: (Piece, Square),
    pub white_king: (Piece, Square),
}

impl Default for GameMeta {
    fn default() -> Self {
        GameMeta {
            turn: 0,
            score: 0,
            white_king: (Piece::King(Color::White, true, false, false), (4, 0)),
            black_king: (Piece::King(Color::Black, true, false, false), (4, 7)),
        }
    }
}

/// Square reference in row and column
pub type Square = (usize, usize);
pub type IsAttack = bool;
pub type MoveList = Vec<(Square, IsAttack)>;

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum Color {
    Black,
    White,
}

pub type FirstMove = bool;
pub type Check = bool;
pub type CheckMate = bool;

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum Piece {
    None,
    Pawn(Color, FirstMove),
    King(Color, FirstMove, Check, CheckMate),
    Queen(Color, FirstMove),
    Bishop(Color, FirstMove),
    Knight(Color, FirstMove),
    Rook(Color, FirstMove),
}
impl Default for Piece {
    fn default() -> Self {
        Piece::None
    }
}
