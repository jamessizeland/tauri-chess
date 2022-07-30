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
    // println!("checking threat");
    'outer: for col in 0..7 {
        for row in 0..7 {
            let potential_threat = board[col][row];
            if check_enemy(our_color, &potential_threat) {
                // println!("found enemy here");
                dbg!(potential_threat);
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
    let mut theory_board = board.clone();
    let mut filtered_moves: MoveList = vec![];
    //* Is my king in check? (there should only ever be one king in check, so if a king is in check then assume it is mine) */
    if meta.black_king.piece.is_king_checked() == Some(false) {
        //* Not currently in check, am I preventing check by being where I am? */
        println!("Black is not in check");
        theory_board[my_square.0][my_square.1] = Piece::None;
        if !under_threat(meta.black_king.square, &Color::Black, &theory_board) {
            // doesn't become under threat, allow all moves
            filtered_moves = moves
        }
    } else if meta.white_king.piece.is_king_checked() == Some(false) {
        //* Not currently in check, am I preventing check by being where I am? */
        theory_board[my_square.0][my_square.1] = Piece::None;
        if !under_threat(meta.white_king.square, &Color::White, &theory_board) {
            // doesn't become under threat, allow all moves
            filtered_moves = moves
        }
    }
    //* If in check, does moving to any of the spaces listed remove check?  */
    filtered_moves
}
