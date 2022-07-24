//! General utility functions for chess

use super::pieces::GetState;
use super::types::{BoardState, Color, Piece};

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
// pub fn row_to_letter(row: usize) -> char {
//     match row {
//         0 => 'a',
//         1 => 'b',
//         2 => 'c',
//         3 => 'd',
//         4 => 'e',
//         5 => 'f',
//         6 => 'g',
//         7 => 'h',
//         _ => panic!(),
//     }
// }

/// check if the square we are looking at contains an enemy piece
pub fn check_enemy(color: &Color, piece: Piece) -> bool {
    (piece.get_colour() == Some(Color::Black) && *color == Color::White)
        || (piece.get_colour() == Some(Color::White) && *color == Color::Black)
}

/// convert a square string to a coordinate tuple i.e. b3 = (2,1)
/// col (letter) followed by row (number)
pub fn square_to_coord(square: &str) -> (usize, usize) {
    let sq_vec: Vec<char> = square.chars().collect();
    if sq_vec.len() != 2 {
        panic!("square string wasn't 2 characters");
    } else {
        (
            letter_to_row(sq_vec[0]),
            (sq_vec[1].to_digit(10).unwrap() - 1) as usize,
        )
    }
}

/// Check if the square we clicked on is a valid move of the currently selected piece
pub fn valid_move(source: (usize, usize), target: (usize, usize), board: BoardState) -> bool {
    println!("checking if valid");
    let move_options = board[source.0][source.1].get_moves(source, board);
    // dbg!(&source, &target);
    move_options.iter().any(|&ele| ele.0 == target)
}
