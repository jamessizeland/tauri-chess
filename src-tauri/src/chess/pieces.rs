//! Chess pieces logic

use serde::{Deserialize, Serialize};

use super::board::BoardState;

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
impl Default for Piece {
    fn default() -> Self {
        Piece::None
    }
}
#[repr(u8)]
pub enum Row {
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
}

/// Square reference in row and column
type Square = (Row, u8);

/// Get a list of available moves for this piece
pub trait GetMoves {
    fn get_moves(&self, square: Square, board_state: BoardState) -> Vec<Square>;
}

impl GetMoves for Piece {
    fn get_moves(&self, square: Square, board_state: BoardState) -> Vec<Square> {
        // what type of piece am I?
        match &self {
            Piece::None => {
                let mut moves: Vec<Square> = Vec::new();
                moves.push(square);
                moves
            }
            // for each actual piece we need to work out what moves it could do on an empty board
            // then remove moves that are blocked by other pieces
            Piece::Pawn(color) => todo!(),
            Piece::King(color) => todo!(),
            Piece::Queen(color) => todo!(),
            Piece::Bishop(color) => todo!(),
            Piece::Knight(color) => todo!(),
            Piece::Rook(color) => todo!(),
        }
    }
}
