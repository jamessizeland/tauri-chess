//! General utility functions for chess

// use super::data::GameMetaData;
use super::pieces::GetState;
use super::types::{BoardState, Color, GameMeta, MoveList, Piece, Square};

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

/// Check if the square we clicked on is a valid move of the currently selected piece
pub fn valid_move(source: Square, target: Square, board: &BoardState, meta: &GameMeta) -> bool {
    // println!("checking if valid");
    let move_options = board[source.0][source.1].get_moves(source, board);

    let filtered_moves = remove_invalid_moves(move_options, source, meta, board);

    // dbg!(&source, &target);
    filtered_moves.iter().any(|&ele| ele.0 == target)
}

/// Check if this square is threatened, by exhaustive search
pub fn under_threat(square: Square, our_color: &Color, board: &BoardState) -> bool {
    let mut threatened = false;
    println!("checking threat");
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
    let mut filtered_moves: MoveList = vec![];
    let my_piece = board[my_square.0][my_square.1];
    if my_piece != Piece::None {
        // only do this if we're looking at a non-empty square
        let our_color = my_piece.get_colour().expect("square has a color");
        if (meta.turn % 2 == 0 && our_color == Color::White)
            || (meta.turn % 2 != 0 && our_color == Color::Black)
        {
            // our turn
            let mut theory_board: BoardState = board.clone();
            let our_king = if our_color == Color::White {
                meta.white_king
            } else {
                meta.black_king
            };
            println!("{:?}, {:?}, {:?}", our_color, our_king, my_piece);
            //* Is my king in check? (there should only ever be one king in check, so if a king is in check then assume it is mine) */
            if our_king.piece.is_king_checked() == Some(false) {
                //* Not currently in check, am I preventing check by being where I am? */
                theory_board[my_square.0][my_square.1] = Piece::None;
                pretty_print_board(&theory_board);
                if !under_threat(our_king.square, &our_color, &theory_board) {
                    println!("king isn't threatened if I'm not there");
                    // doesn't become under threat, allow all moves
                    filtered_moves = moves;
                } else {
                    for m in moves {
                        // check if any of the potential moves cause my king to go into check
                        theory_board = board.clone(); // reset the board
                        theory_board[my_square.0][my_square.1] = Piece::None; // remove my piece
                        theory_board[m.0 .0][m.0 .1] = my_piece; // place it in a potential move spot
                        if under_threat(our_king.square, &our_color, &theory_board) {
                            println!(
                                "This move to ({},{}) causes check and was filtered out",
                                m.0 .0, m.0 .1
                            );
                        } else {
                            println!("This move to ({},{}) is fine", m.0 .0, m.0 .1);
                            filtered_moves.push(m);
                        }
                    }
                }
            }
            //* If in check, does moving to any of the spaces listed remove check?  */
        }
    }
    filtered_moves
}

fn pretty_print_board(board: &BoardState) {
    for row in 0..8 {
        for col in 0..8 {
            if col < 7 {
                print!("|{}|", board[col][7 - row]);
            } else {
                println!("|{}|", board[col][7 - row]);
            }
        }
    }
}
