//! Specific Types useful for a chess game

use serde::{Deserialize, Serialize};

use super::pieces::ModState;

pub type BoardState = [[Piece; 8]; 8];

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct GameMeta {
    pub turn: usize,
    pub score: i32,
    pub black_king: KingMeta,
    pub white_king: KingMeta,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct KingMeta {
    pub piece: Piece,
    pub square: Square,
}

pub trait ModMeta {
    /// Check if kings are under threat and update their status
    fn update_king_threat(&mut self, board: &mut BoardState) -> ();
    /// Increment the turn to the next player
    fn update_turn(&mut self) -> ();
    /// Set up new game
    fn new_game(&mut self) -> ();
}

impl ModMeta for GameMeta {
    fn update_king_threat(&mut self, board: &mut BoardState) -> () {
        // check white king status
        self.white_king
            .piece
            .king_threat(&self.white_king.square, board);
        // check black king status
        self.black_king
            .piece
            .king_threat(&self.black_king.square, board);
        // update kings on the board with the new statuses
        board[self.white_king.square.0][self.white_king.square.1] = self.white_king.piece;
        board[self.black_king.square.0][self.black_king.square.1] = self.black_king.piece;
    }
    fn update_turn(&mut self) -> () {
        self.turn += 1;
        println!("turn {}", self.turn)
    }
    fn new_game(&mut self) -> () {
        self.score = 0;
        self.turn = 0;
        self.white_king.piece = Piece::King(Color::White, true, false, false);
        self.white_king.square = (4, 0);
        self.black_king.piece = Piece::King(Color::Black, true, false, false);
        self.black_king.square = (4, 7);
    }
}

impl Default for GameMeta {
    fn default() -> Self {
        GameMeta {
            turn: 0,
            score: 0,
            white_king: KingMeta {
                piece: Piece::King(Color::White, true, false, false),
                square: (4, 0),
            },
            black_king: KingMeta {
                piece: Piece::King(Color::Black, true, false, false),
                square: (4, 7),
            },
        }
    }
}

/// Square reference in row and column
pub type Square = (usize, usize);
pub type IsAttack = bool;
pub type MoveList = Vec<(Square, IsAttack)>;

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
