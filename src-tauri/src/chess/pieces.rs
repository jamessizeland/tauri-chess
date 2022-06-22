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
type Square = (usize, usize);
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
        let mut moves: MoveList = Vec::new(); // start with empty movelist
        match &self {
            // what type of piece am I?
            Piece::None => {
                // moves.push((square, false));
                moves
            }
            // for each actual piece we need to work out what moves it could do on an empty board, then remove moves that are blocked by other pieces
            Piece::Pawn(color, first_move) => {
                // fill an array of possible move vectors
                // move_array.push(vec![(0, 1)]);
                // if *first_move {

                //     move_array[0].push((0, 2));
                // };
                //* 3. potential attacks
                match color {
                    Color::White => {
                        //* 1. move forward one
                        if board_state[square.0][square.1 + 1] == Piece::None {
                            moves.push(((square.0, square.1 + 1), false));
                            //* 2. move forward two if first move
                            if board_state[square.0][square.1 + 2] == Piece::None && *first_move {
                                moves.push(((square.0, square.1 + 2), false));
                            }
                        }
                    }
                    Color::Black => todo!(),
                }
                moves
            }
            Piece::King(color, first_move, check, check_mate) => todo!(),
            Piece::Queen(color, first_move) => todo!(),
            Piece::Bishop(color, first_move) => todo!(),
            Piece::Knight(color, first_move) => todo!(),
            Piece::Rook(color, first_move) => todo!(),
        }
    }
}
/// Check if a potential move square for my piece is occupied by a friend or foe
fn check_square_occupant(square: &Square, my_piece: &Piece) {}
