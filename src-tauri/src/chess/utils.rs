//! General utility functions for chess

use super::pieces::GetState;
use super::types::{Color, Piece};

/// Convert letters a-h to a row index from a standard chessboard
pub fn letter_to_row(letter: char) -> usize {
    match letter {
        'a' => 0,
        'b' => 1,
        'c' => 2,
        'd' => 3,
        'e' => 4,
        'f' => 5,
        'g' => 6,
        'h' => 7,
        _ => panic!(),
    }
}

/// Convert letters row index to a-h from a standard chessboard
pub fn row_to_letter(row: usize) -> char {
    match row {
        0 => 'a',
        1 => 'b',
        2 => 'c',
        3 => 'd',
        4 => 'e',
        5 => 'f',
        6 => 'g',
        7 => 'h',
        _ => panic!(),
    }
}

/// check if the square we are looking at contains an enemy piece
pub fn check_enemy(color: &Color, piece: Piece) -> bool {
    (piece.get_colour() == Some(Color::Black) && *color == Color::White)
        || (piece.get_colour() == Some(Color::White) && *color == Color::Black)
}
