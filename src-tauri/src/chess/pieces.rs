//! Chess pieces logic

use serde::{Deserialize, Serialize};

use super::board::BoardState;

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum Color {
    Black,
    White,
}

pub type FirstMove = bool;
pub type Check = bool;
pub type CheckMate = bool;

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum Piece {
    None,
    Pawn(Color, FirstMove),
    King(Color, FirstMove, Check, CheckMate),
    Queen(Color),
    Bishop(Color),
    Knight(Color),
    Rook(Color, FirstMove),
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
type IsAttack = bool;
type MoveList = Vec<(Square, IsAttack)>;

/// Get a list of available moves for this piece
pub trait GetMoves {
    fn get_moves(&self, square: Square, board_state: BoardState) -> MoveList;
}

// fn move_vectors (piece: Piece) -> Vec<(u8, u8)> {

// }

impl GetMoves for Piece {
    fn get_moves(&self, square: Square, board_state: BoardState) -> MoveList {
        // what type of piece am I?
        match &self {
            Piece::None => {
                let mut moves: MoveList = Vec::new();
                moves.push((square, false));
                moves
            }
            // for each actual piece we need to work out what moves it could do on an empty board
            // then remove moves that are blocked by other pieces
            Piece::Pawn(color, first_move) => {
                let mut move_array: Vec<(i8, i8)> = Vec::new();
                move_array.push((0, 1));
                if *first_move {
                    move_array.push((0, 2));
                };
                match color {
                    Color::Black => todo!(),
                    Color::White => todo!(),
                }
            }
            Piece::King(color, first_move, check, check_mate) => todo!(),
            Piece::Queen(color) => todo!(),
            Piece::Bishop(color) => todo!(),
            Piece::Knight(color) => todo!(),
            Piece::Rook(color, first_move) => todo!(),
        }
    }
}
