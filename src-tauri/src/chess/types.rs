//! Specific Types useful for a chess game

use std::fmt::Display;

use serde::{Deserialize, Serialize};

use super::pieces::{GetState, ModState};

pub type BoardState = [[Piece; 8]; 8];

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct GameMeta {
    pub turn: usize,
    pub score: isize,
    pub black_king: KingMeta,
    pub white_king: KingMeta,
    pub game_over: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Hist {
    pub score: Vec<isize>,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct KingMeta {
    pub piece: Piece,
    pub square: Square,
}

pub trait ModMeta {
    /// run all necessary board state cleanup to start a new turn
    fn new_turn(&mut self, board: &mut BoardState, history: &mut Hist);
    /// Check if kings are under threat and update their status, return if checkmate occurred
    fn update_king_threat(&mut self, board: &mut BoardState);
    /// Increment the turn to the next player, check state of both players and return if game end has occurred
    fn update_turn(&mut self);
    /// Set up new game
    fn new_game(&mut self);
    /// Update score based on value of pieces on the board
    fn calc_score(&mut self, board: &BoardState);
}

impl ModMeta for GameMeta {
    fn update_king_threat(&mut self, board: &mut BoardState) {
        let turn: Color = if self.turn % 2 == 0 {
            Color::White
        } else {
            Color::Black
        };
        match turn {
            Color::White => {
                // check white king status
                self.white_king
                    .piece
                    .king_threat(&self.white_king.square, board, *self);
                board[self.white_king.square.0][self.white_king.square.1] = self.white_king.piece;
                self.game_over = self.white_king.piece.is_king_mate().unwrap()
            }
            Color::Black => {
                // check black king status
                self.black_king
                    .piece
                    .king_threat(&self.black_king.square, board, *self);
                board[self.black_king.square.0][self.black_king.square.1] = self.black_king.piece;
                self.game_over = self.black_king.piece.is_king_mate().unwrap()
            }
        }
    }
    fn update_turn(&mut self) {
        self.turn += 1;
        println!("turn {}", self.turn)
    }
    fn new_game(&mut self) {
        self.score = 0;
        self.turn = 0;
        self.game_over = false;
        self.white_king.piece = Piece::King(Color::White, true, false, false);
        self.white_king.square = (4, 0);
        self.black_king.piece = Piece::King(Color::Black, true, false, false);
        self.black_king.square = (4, 7);
    }
    fn new_turn(&mut self, board: &mut BoardState, history: &mut Hist) {
        self.update_king_threat(board); // evaluate at the end of turn
        self.update_turn(); // toggle who's turn it is to play
        self.update_king_threat(board); // evaluate again start of next turn
        self.calc_score(board); // calculate score
        history.score.push(self.score);
    }
    fn calc_score(&mut self, board: &BoardState) {
        let (mut white, mut black) = (0, 0);
        for col in board.iter() {
            for piece in col {
                match piece.get_colour() {
                    Some(color) => match color {
                        Color::Black => black += piece.get_value(),
                        Color::White => white += piece.get_value(),
                    },
                    None => (),
                }
            }
        }
        self.score = white - black;
    }
}

impl Default for GameMeta {
    fn default() -> Self {
        GameMeta {
            turn: 0,
            score: 0,
            game_over: false,
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

impl Default for Hist {
    fn default() -> Self {
        Self {
            score: Default::default(),
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

impl Display for Piece {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let code = match *self {
            Piece::None => "__",
            Piece::Pawn(color, _) => {
                if color == Color::White {
                    "wP"
                } else {
                    "bP"
                }
            }
            Piece::King(color, _, _, _) => {
                if color == Color::White {
                    "wK"
                } else {
                    "bK"
                }
            }
            Piece::Queen(color, _) => {
                if color == Color::White {
                    "wQ"
                } else {
                    "bQ"
                }
            }
            Piece::Bishop(color, _) => {
                if color == Color::White {
                    "wB"
                } else {
                    "bB"
                }
            }
            Piece::Knight(color, _) => {
                if color == Color::White {
                    "wN"
                } else {
                    "bN"
                }
            }
            Piece::Rook(color, _) => {
                if color == Color::White {
                    "wR"
                } else {
                    "bR"
                }
            }
        };
        write!(f, "{}", code)
    }
}
