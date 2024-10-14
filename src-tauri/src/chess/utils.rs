//! General utility functions for chess

use super::board::BoardState;
use super::moves::check_castling_moves;
use super::types::{Color, GameMeta, MoveList, MoveType, Piece, Square};
use anyhow::{anyhow, Result};

/// Convert letters a-h to a row index from a standard chessboard
pub fn letter_to_row(letter: char) -> Result<usize> {
    Ok(match letter {
        'a' => 0,
        'b' => 1,
        'c' => 2,
        'd' => 3,
        'e' => 4,
        'f' => 5,
        'g' => 6,
        'h' => 7,
        _ => return Err(anyhow!("invalid letter")),
    })
}

/// check if the piece we are looking is of the opposite colour to us
pub fn check_enemy(our_color: Color, considered_piece: &Piece) -> bool {
    (considered_piece.get_colour() == Some(Color::Black) && our_color == Color::White)
        || (considered_piece.get_colour() == Some(Color::White) && our_color == Color::Black)
}

/// convert a square string to a coordinate tuple i.e. b3 = (2,1)
/// col (letter) followed by row (number)
pub fn square_to_coord(square: &str) -> Result<(usize, usize)> {
    let sq_vec: Vec<char> = square.chars().collect();
    if sq_vec.len() != 2 {
        return Err(anyhow!("square string wasn't 2 characters"));
    };
    let Some(digit) = sq_vec[1].to_digit(10) else {
        return Err(anyhow!("couldn't convert digit to number"));
    };
    Ok((letter_to_row(sq_vec[0])?, (digit - 1) as usize))
}

/// Check if the square we clicked on is a valid move of the currently selected piece, and what type
pub fn valid_move(
    source: Square,
    target: Square,
    board: &BoardState,
    meta: &GameMeta,
    turn: Color,
) -> Option<MoveType> {
    let piece = board.get(source);
    let mut move_options = piece.get_moves(source, board);
    if piece.is_king(turn) {
        for castle_move in check_castling_moves(source, turn, board) {
            move_options.push(castle_move);
        }
    };
    if piece == Piece::Pawn(turn, false) {
        if let Some(en_passant_target) = meta.en_passant {
            for pawn_move in piece.get_en_passant_moves(source, en_passant_target) {
                move_options.push(pawn_move);
            }
        }
    }
    let filtered_moves = remove_invalid_moves(move_options, source, meta, board);
    filtered_moves
        .iter()
        .position(|(sq, _)| sq == &target)
        .map(|i| filtered_moves[i].1)
}

/// Check if this square is threatened, by exhaustive search
pub fn under_threat(square: Square, our_color: Color, board: &BoardState) -> bool {
    let mut threatened = false;
    // println!("checking threat");
    'outer: for col in 0..8 {
        for row in 0..8 {
            let potential_threat = board.get((col, row));
            if check_enemy(our_color, &potential_threat) {
                for m in potential_threat.get_moves((col, row), board) {
                    if m.0 == square {
                        threatened = true;
                        break 'outer;
                    }
                }
            }
        }
    }
    threatened
}

/// Check each move in this list to check it doesn't leave your king in check
pub fn remove_invalid_moves(
    moves: MoveList,
    my_square: Square,
    meta: &GameMeta,
    board: &BoardState,
) -> MoveList {
    // println!("removing invalid moves");
    let mut filtered_moves = MoveList::new();
    let my_piece = board.get(my_square);
    if my_piece != Piece::None {
        // only do this if we're looking at a non-empty square
        let our_color = my_piece.get_colour().expect("square has a color");
        let i_am_king = my_piece.is_king(our_color);
        if turn_into_colour(meta.turn) == our_color {
            // our turn
            let mut theory_board: BoardState = board.clone();
            let our_king = match our_color {
                Color::White => meta.white_king,
                Color::Black => meta.black_king,
            };
            // Is my king not in check or, am I infact the king and could potentially move?
            // Am I preventing check by being where I am?
            theory_board.set(my_square, Piece::None);
            // println!("{:?}", my_piece.is_king());
            if !under_threat(our_king.square, our_color, &theory_board) && !i_am_king {
                // println!("king isn't threatened if I'm not there");
                // doesn't become under threat, allow all moves
                filtered_moves = moves;
            } else {
                for (coord, move_type) in moves {
                    // check if any of the potential moves cause my king to go into check
                    theory_board = board.clone(); // reset the board
                    theory_board.set(my_square, Piece::None); // remove my piece
                    theory_board.set(coord, my_piece); // place it in a potential move spot
                    let king_square = match i_am_king {
                        true => coord,
                        false => our_king.square,
                    };
                    if !under_threat(king_square, our_color, &theory_board) {
                        filtered_moves.push((coord, move_type));
                    }
                }
            }
        }
    }
    filtered_moves
}

/// convert turn number into the corresponding color
///
/// assuming White always goes first
pub fn turn_into_colour(turn: usize) -> Color {
    if turn % 2 == 0 {
        Color::White
    } else {
        Color::Black
    }
}

#[allow(dead_code)]
/// Print to console the board state from White's perspective, in a neat form
fn pretty_print_board(board: &BoardState) {
    for (i, row) in board.iter().enumerate().rev() {
        for (j, _) in row.iter().enumerate() {
            if j < 7 {
                print!("|{}|", board.get((j, i)));
            } else {
                println!("|{}|", board.get((j, i)));
            }
        }
    }
    print!("\r\n");
}
