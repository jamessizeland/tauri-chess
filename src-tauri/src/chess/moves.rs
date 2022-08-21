//! Logic for deciding where chess pieces can go, and moving th&em

use crate::chess::utils::under_threat;

use super::pieces::GetState;
use super::types::{BoardState, Color, MoveList, MoveType, Piece};
use super::utils::check_enemy;

pub fn pawn_move(
    sq: (usize, usize),
    color: &Color,
    first_move: &bool,
    board: &BoardState,
) -> MoveList {
    // fill an array of possible move vectors
    let mut moves: MoveList = Vec::new(); // start with empty movelist
    match color {
        Color::White => {
            // need to make sure that we don't request squares outside of the array bounds
            let col = sq.0;
            let mut row: i8 = sq.1 as i8 + 1;
            //* 1. move forward one if square is empty
            if row <= 7 && board[col][row as usize] == Piece::None {
                moves.push(((col, row as usize), MoveType::Move));
                row = sq.1 as i8 + 2;
                //* 2. move forward two if hasn't moved and squares are empty
                if row <= 7 && board[col][row as usize] == Piece::None && *first_move {
                    moves.push(((col, row as usize), MoveType::Move));
                }
            }
            //* 3. potential attacks if target square contains an enemy piece
            if sq.0 < 7 && sq.1 < 7 {
                let (col, row) = (sq.0 + 1, sq.1 + 1);
                if board[col][row].get_colour() == Some(Color::Black) {
                    moves.push(((col, row), MoveType::Capture))
                }
            }
            if sq.0 > 0 && sq.1 < 7 {
                let (col, row) = (sq.0 - 1, sq.1 + 1);
                if board[col][row].get_colour() == Some(Color::Black) {
                    moves.push(((col, row), MoveType::Capture))
                }
            }
        }
        Color::Black => {
            let col = sq.0;
            let mut row: i8 = sq.1 as i8 - 1;
            //* 1. move forward one if square is empty
            if row >= 0 && board[col][row as usize] == Piece::None {
                moves.push(((col, row as usize), MoveType::Move));
                row = sq.1 as i8 - 2;
                //* 2. move forward two if hasn't moved and squares are empty
                if row >= 0 && board[col][row as usize] == Piece::None && *first_move {
                    moves.push(((col, row as usize), MoveType::Move));
                }
            }
            //* 3. potential attacks if target square contains an enemy piece
            if sq.0 < 7 && sq.1 > 0 {
                let (col, row) = (sq.0 + 1, sq.1 - 1);
                if board[col][row].get_colour() == Some(Color::White) {
                    moves.push(((col, row), MoveType::Capture))
                }
            }
            if sq.0 > 0 && sq.1 > 0 {
                let (col, row) = (sq.0 - 1, sq.1 - 1);
                if board[col][row].get_colour() == Some(Color::White) {
                    moves.push(((col, row), MoveType::Capture))
                }
            }
        }
    }
    moves
}

pub fn rook_move(sq: (usize, usize), color: &Color, board: &BoardState) -> MoveList {
    let mut moves: MoveList = Vec::new(); // start with empty movelist
    for add in 1..8 {
        //* right
        let (col, row) = (sq.0 + add, sq.1);
        if col > 7 {
            break; // out of bounds, stop
        }
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break; // stop
        }
        moves.push(((col, row), MoveType::Move));
    }
    for sub in 1..8 {
        //* left
        let (col, row) = (sq.0 as i8 - sub, sq.1);
        if col < 0 {
            break; // out of bounds
        }
        let col = col as usize; // recast back to usize now we know it's >= 0
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break;
        }
        moves.push(((col, row), MoveType::Move));
    }
    for add in 1..8 {
        //* up
        let (col, row) = (sq.0, sq.1 + add);
        if row > 7 {
            break; // out of bounds, stop
        }
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break; // stop
        }
        moves.push(((col, row), MoveType::Move));
    }
    for sub in 1..8 {
        //* down
        let (col, row) = (sq.0, sq.1 as i8 - sub);
        if row < 0 {
            break; // out of bounds
        }
        let row = row as usize; // recast back to usize now we know it's >= 0
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break;
        }
        moves.push(((col, row), MoveType::Move));
    }
    moves
}

pub fn bish_move(sq: (usize, usize), color: &Color, board: &BoardState) -> MoveList {
    let mut moves: MoveList = Vec::new(); // start with empty movelist
    for add in 1..8 {
        //* right up
        let (col, row) = (sq.0 + add, sq.1 + add);
        if col > 7 || row > 7 {
            break; // out of bounds, stop
        }
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break; // stop
        }
        moves.push(((col, row), MoveType::Move));
    }
    for sub in 1..8 {
        //* left down
        let (col, row) = (sq.0 as i8 - sub, sq.1 as i8 - sub);
        if col < 0 || row < 0 {
            break; // out of bounds
        }
        let (col, row) = (col as usize, row as usize); // recast back to usize
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break;
        }
        moves.push(((col, row), MoveType::Move));
    }
    for add in 1..8 {
        //* left up
        let (col, row) = (sq.0 as i8 - add, sq.1 as i8 + add);
        if col < 0 || row > 7 {
            break; // out of bounds, stop
        }
        let (col, row) = (col as usize, row as usize); // recast back to usize
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break; // stop
        }
        moves.push(((col, row), MoveType::Move));
    }
    for sub in 1..8 {
        //* right down
        let (col, row) = (sq.0 as i8 + sub, sq.1 as i8 - sub);
        if col > 7 || row < 0 {
            break; // out of bounds
        }
        let (col, row) = (col as usize, row as usize); // recast back to usize
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
            break;
        }
        moves.push(((col, row), MoveType::Move));
    }

    moves
}

pub fn knight_move(sq: (usize, usize), color: &Color, board: &BoardState) -> MoveList {
    let mut moves: MoveList = Vec::new(); // start with empty movelist
                                          //* list all possible vectors for a knight to move
    const VECTORS: [(i8, i8); 8] = [
        (2, 1),
        (2, -1),
        (1, 2),
        (1, -2),
        (-2, 1),
        (-2, -1),
        (-1, 2),
        (-1, -2),
    ];
    for vector in VECTORS {
        let col = sq.0 as i8 + vector.0;
        let row = sq.1 as i8 + vector.1;
        if (0..8).contains(&col) && (0..8).contains(&row) {
            // valid square
            let (col, row) = (col as usize, row as usize);
            // let target_colour = board[col][row].get_colour();
            if board[col][row] == Piece::None {
                moves.push(((col, row), MoveType::Move));
            } else if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), MoveType::Capture));
            }
        }
    }

    moves
}

pub fn king_move(
    sq: (usize, usize),
    color: &Color,
    board: &BoardState,
    first_move: bool,
) -> MoveList {
    let mut moves: MoveList = Vec::new(); // start with empty movelist
    const VECTORS: [(i8, i8); 8] = [
        (1, 1),
        (1, -1),
        (-1, 1),
        (-1, -1),
        (0, 1),
        (1, 0),
        (-1, 0),
        (0, -1),
    ];
    for vector in VECTORS {
        let col = sq.0 as i8 + vector.0;
        let row = sq.1 as i8 + vector.1;
        if (0..8).contains(&col) && (0..8).contains(&row) {
            // valid square
            let (col, row) = (col as usize, row as usize);
            let potential_move = board[col][row];
            if potential_move == Piece::None {
                moves.push(((col, row), MoveType::Move));
            } else if check_enemy(color, &potential_move) {
                moves.push(((col, row), MoveType::Capture));
            }
        }
    }
    moves
}

pub fn check_castling_moves(sq: (usize, usize), color: &Color, board: &BoardState) -> MoveList {
    if board[sq.0][sq.1].is_king() != Some(*color) {
        panic!("Wrong piece found when checking for king");
    }
    let mut moves: MoveList = Vec::new();
    let first_move = board[sq.0][sq.1] == Piece::King(*color, true, false, false);
    // start with empty movelist
    // check if castling available
    // 1. king hasn't moved && rook hasn't moved
    // 2. squares between both are clear
    // 3. none of the squares the king needs to travel through are threatened
    dbg!(&sq);
    if first_move {
        let (mut ooo, mut oo) = (false, false);
        for (col, distance) in (0..sq.0).enumerate().rev() {
            let eval = &board[col][sq.1];
            // println!("{:?} col{} dist{}", eval, col, sq.0 - distance);
            if col == 0 && eval != &Piece::Rook(*color, true) {
                // no good
                println!("didn't find rook");
                break;
            } else if col != 0 && eval != &Piece::None {
                // no good
                println!("{} piece in the way", &eval);
                break;
            } else if distance <= 3 && under_threat((sq.0 - distance, sq.1), color, board) {
                // no good
                println!("{} threatened", distance);
                break;
            }
            ooo = true;
            moves.push(((1, sq.1), MoveType::Move));
        }

        for (col, distance) in (sq.0 + 1..8).enumerate() {
            let eval = &board[col][sq.1];
            // println!("{:?} col{} dist{}", eval, col, distance - sq.0);
            if col == 7 && eval != &Piece::Rook(*color, true) {
                // no good
                println!("didn't find rook");
                break;
            } else if col != 7 && eval != &Piece::None {
                // no good
                println!("{} piece in the way", &eval);
                break;
            } else if distance <= 2 && under_threat((distance - sq.0, sq.1), color, board) {
                // no good
                println!("{} threatened", distance);
                break;
            }
            oo = true;
        }
        dbg!(ooo, oo);
    }
    moves
}
