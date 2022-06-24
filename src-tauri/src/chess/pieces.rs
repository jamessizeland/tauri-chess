//! Chess pieces logic

use super::moves::{knight_move, rook_move};
use super::{board::BoardState, moves::pawn_move};
use serde::{Deserialize, Serialize};

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
// #[repr(usize)]
// pub enum Row {
//     A,
//     B,
//     C,
//     D,
//     E,
//     F,
//     G,
//     H,
// }

/// Square reference in row and column
pub type Square = (usize, usize);
pub type IsAttack = bool;
pub type MoveList = Vec<(Square, IsAttack)>;
/// Get a list of available moves for this piece
pub trait GetState {
    fn get_moves(&self, square: Square, board_state: BoardState) -> MoveList;
    fn get_colour(&self) -> Option<Color>;
}

impl GetState for Piece {
    fn get_colour(&self) -> Option<Color> {
        match &self {
            Piece::None => None,
            Piece::Pawn(color, _) => Some(*color),
            Piece::King(color, _, _, _) => Some(*color),
            Piece::Queen(color, _) => Some(*color),
            Piece::Bishop(color, _) => Some(*color),
            Piece::Knight(color, _) => Some(*color),
            Piece::Rook(color, _) => Some(*color),
        }
    }
    fn get_moves(&self, sq: Square, board: BoardState) -> MoveList {
        match &self {
            // what type of piece am I?
            Piece::None => Vec::new(),
            //* For each actual piece we need to work out what moves it could do on an empty board, then remove moves that are blocked by other pieces
            Piece::Pawn(color, first_move) => pawn_move(sq, color, first_move, &board),
            // Piece::King(color, first_move, check, check_mate) => todo!(),
            Piece::Queen(color, _first_move) => {
                //* move in any direction until either another piece or the edge of the board
                rook_move(sq, color, &board)
            }
            // Piece::Bishop(color, first_move) => todo!(),
            Piece::Knight(color, _first_move) => knight_move(sq, color, &board),
            Piece::Rook(color, _first_move) => rook_move(sq, color, &board),
            _ => Vec::new(),
        }
    }
}
