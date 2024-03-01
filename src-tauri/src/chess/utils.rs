//! General utility functions for chess

use super::moves::check_castling_moves;
use super::pieces::GetState;
use super::types::{BoardState, Color, GameMeta, MoveList, MoveType, Piece, Square};

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

/// check if the piece we are looking is of the opposite colour to us
pub fn check_enemy(our_color: &Color, considered_piece: &Piece) -> bool {
    (considered_piece.get_colour() == Some(Color::Black) && *our_color == Color::White)
        || (considered_piece.get_colour() == Some(Color::White) && *our_color == Color::Black)
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

/// Check if the square we clicked on is a valid move of the currently selected piece, and what type
pub fn valid_move(
    source: Square,
    target: Square,
    board: &BoardState,
    meta: &GameMeta,
    turn: &Color,
) -> Option<MoveType> {
    let piece = &board[source.0][source.1];
    let mut move_options = piece.get_moves(source, board);
    if piece.is_king() == Some(*turn) {
        for castle_move in check_castling_moves(source, turn, board) {
            move_options.push(castle_move);
        }
    };
    if piece == &Piece::Pawn(*turn, false) && meta.en_passant != None {
        for pawn_move in piece.get_en_passant_moves(source, meta.en_passant.unwrap()) {
            move_options.push(pawn_move);
        }
    }
    let filtered_moves = remove_invalid_moves(move_options, source, meta, board);
    filtered_moves
        .iter()
        .position(|&ele| ele.0 == target)
        .map(|i| filtered_moves[i].1)
}

/// Check if this square is threatened, by exhaustive search
pub fn under_threat(square: Square, our_color: &Color, board: &BoardState) -> bool {
    let mut threatened = false;
    // println!("checking threat");
    'outer: for col in 0..8 {
        for row in 0..8 {
            let potential_threat = board[col][row];
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
    let mut filtered_moves: MoveList = vec![];
    let my_piece = board[my_square.0][my_square.1];
    if my_piece != Piece::None {
        // only do this if we're looking at a non-empty square
        let our_color = my_piece.get_colour().expect("square has a color");
        let i_am_king: bool = my_piece.is_king() == Some(our_color);
        if (meta.turn % 2 == 0 && our_color == Color::White)
            || (meta.turn % 2 != 0 && our_color == Color::Black)
        {
            // our turn
            let mut theory_board: BoardState = *board;
            let our_king = if our_color == Color::White {
                meta.white_king
            } else {
                meta.black_king
            };
            // println!("{:?}, {:?}, {:?}", our_color, our_king, my_piece);
            //* Is my king not in check or, am I infact the king and could potentially move? */
            //* Am I preventing check by being where I am? */
            theory_board[my_square.0][my_square.1] = Piece::None;
            pretty_print_board(&theory_board);
            // println!("{:?}", my_piece.is_king());
            if !under_threat(our_king.square, &our_color, &theory_board) && !i_am_king {
                // println!("king isn't threatened if I'm not there");
                // doesn't become under threat, allow all moves
                filtered_moves = moves;
            } else {
                for m in moves {
                    // check if any of the potential moves cause my king to go into check
                    theory_board = *board; // reset the board
                    theory_board[my_square.0][my_square.1] = Piece::None; // remove my piece
                    theory_board[m.0 .0][m.0 .1] = my_piece; // place it in a potential move spot
                    let king_square = if i_am_king {
                        // println!("your majesty");
                        m.0
                    } else {
                        our_king.square
                    };
                    if under_threat(king_square, &our_color, &theory_board) {
                    } else {
                        filtered_moves.push(m);
                    }
                }
            }
            //* If in check, does moving to any of the spaces listed remove check?  */
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

/// Print to console the board state from White's perspective, in a neat form
fn pretty_print_board(board: &BoardState) {
    for (i, row) in board.iter().enumerate().rev() {
        for (j, _) in row.iter().enumerate() {
            if j < 7 {
                print!("|{}|", board[j][i]);
            } else {
                println!("|{}|", board[j][i]);
            }
        }
    }
    print!("\r\n");
}
