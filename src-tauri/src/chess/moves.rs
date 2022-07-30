//! Logic for deciding where chess pieces can go, and moving them

use crate::chess::utils::under_threat;

use super::pieces::GetState;
use super::types::{BoardState, Color, MoveList, Piece};
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
                moves.push(((col, row as usize), false));
                row = sq.1 as i8 + 2;
                //* 2. move forward two if hasn't moved and squares are empty
                if row <= 7 && board[col][row as usize] == Piece::None && *first_move {
                    moves.push(((col, row as usize), false));
                }
            }
            //* 3. potential attacks if target square contains an enemy piece
            if sq.0 < 7 && sq.1 < 7 {
                let (col, row) = (sq.0 + 1, sq.1 + 1);
                if board[col][row].get_colour() == Some(Color::Black) {
                    moves.push(((col, row), true))
                }
            }
            if sq.0 > 0 && sq.1 < 7 {
                let (col, row) = (sq.0 - 1, sq.1 + 1);
                if board[col][row].get_colour() == Some(Color::Black) {
                    moves.push(((col, row), true))
                }
            }
        }
        Color::Black => {
            let col = sq.0;
            let mut row: i8 = sq.1 as i8 - 1;
            //* 1. move forward one if square is empty
            if row >= 0 && board[col][row as usize] == Piece::None {
                moves.push(((col, row as usize), false));
                row = sq.1 as i8 - 2;
                //* 2. move forward two if hasn't moved and squares are empty
                if row >= 0 && board[col][row as usize] == Piece::None && *first_move {
                    moves.push(((col, row as usize), false));
                }
            }
            //* 3. potential attacks if target square contains an enemy piece
            if sq.0 < 7 && sq.1 > 0 {
                let (col, row) = (sq.0 + 1, sq.1 - 1);
                if board[col][row].get_colour() == Some(Color::White) {
                    moves.push(((col, row), true))
                }
            }
            if sq.0 > 0 && sq.1 > 0 {
                let (col, row) = (sq.0 - 1, sq.1 - 1);
                if board[col][row].get_colour() == Some(Color::White) {
                    moves.push(((col, row), true))
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
                moves.push(((col, row), true));
            }
            break; // stop
        }
        moves.push(((col, row), false));
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
                moves.push(((col, row), true));
            }
            break;
        }
        moves.push(((col, row), false));
    }
    for add in 1..8 {
        //* up
        let (col, row) = (sq.0, sq.1 + add);
        if row > 7 {
            break; // out of bounds, stop
        }
        if board[col][row] != Piece::None {
            if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), true));
            }
            break; // stop
        }
        moves.push(((col, row), false));
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
                moves.push(((col, row), true));
            }
            break;
        }
        moves.push(((col, row), false));
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
                moves.push(((col, row), true));
            }
            break; // stop
        }
        moves.push(((col, row), false));
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
                moves.push(((col, row), true));
            }
            break;
        }
        moves.push(((col, row), false));
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
                moves.push(((col, row), true));
            }
            break; // stop
        }
        moves.push(((col, row), false));
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
                moves.push(((col, row), true));
            }
            break;
        }
        moves.push(((col, row), false));
    }

    moves
}

pub fn king_move(
    sq: (usize, usize),
    color: &Color,
    board: &BoardState,
    _first_move: bool,
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
        if col >= 0 && col <= 7 && row >= 0 && row <= 7 {
            // valid square
            let (col, row) = (col as usize, row as usize);
            let potential_move = board[col][row];
            if !under_threat((col, row), color, board) {
                if potential_move == Piece::None {
                    moves.push(((col, row), false));
                } else if check_enemy(color, &potential_move) {
                    moves.push(((col, row), true));
                }
            }
        }
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
        if col >= 0 && col <= 7 && row >= 0 && row <= 7 {
            // valid square
            let (col, row) = (col as usize, row as usize);
            // let target_colour = board[col][row].get_colour();
            if board[col][row] == Piece::None {
                moves.push(((col, row), false));
            } else if check_enemy(color, &board[col][row]) {
                moves.push(((col, row), true));
            }
        }
    }

    moves
}
