//! Specific Types useful for a chess game

use super::board::BoardState;
use serde::{Deserialize, Serialize};
use std::fmt::Display;

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct GameMeta {
    /// Game turn
    pub turn: usize,
    /// Game score as a relative sum of piece value
    pub score: isize,
    /// Register if a pawn that has done a double move in the last turn
    pub en_passant: Option<Square>,
    /// Register if a pawn is awaiting a promotion
    pub promotable_pawn: Option<Square>,
    /// Metadata relating to the black King
    pub black_king: KingMeta,
    /// Metadata relating to the white King
    pub white_king: KingMeta,
    /// Register if the game is active or ended
    pub game_over: bool,
    /// Half-move counter, used for the fifty-move rule
    /// This is incremented every turn, and reset to 0 when a pawn is moved
    /// or a piece is captured.
    /// This is used to determine if the game can be drawn by the fifty-move rule
    pub half_move_count: usize,
}

#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct Hist {
    pub score: Vec<isize>,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct KingMeta {
    /// Clone of the King's Piece Struct
    pub piece: Piece,
    /// Current location of the King
    pub square: Square,
}

impl GameMeta {
    /// Check if kings are under threat and update their status, return if checkmate occurred
    pub fn update_king_threat(&mut self, board: &mut BoardState) {
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
                board.set(self.white_king.square, self.white_king.piece);
                self.game_over = self.white_king.piece.is_king_mate().unwrap()
            }
            Color::Black => {
                // check black king status
                self.black_king
                    .piece
                    .king_threat(&self.black_king.square, board, *self);
                board.set(self.black_king.square, self.black_king.piece);
                self.game_over = self.black_king.piece.is_king_mate().unwrap()
            }
        }
    }
    /// Increment the turn to the next player, check state of both players and return if game end has occurred
    pub fn update_turn(&mut self) {
        self.turn += 1;
        self.half_move_count += 1;
        println!("turn {}", self.turn)
    }
    /// Set up new game
    pub fn new_game(&mut self) {
        self.score = 0;
        self.turn = 0;
        self.game_over = false;
        self.white_king.piece = Piece::King(Color::White, true, false, false);
        self.white_king.square = (4, 0);
        self.black_king.piece = Piece::King(Color::Black, true, false, false);
        self.black_king.square = (4, 7);
    }
    /// run all necessary board state cleanup to start a new turn
    pub fn new_turn(&mut self, board: &mut BoardState, history: &mut Hist) {
        self.update_king_threat(board); // evaluate at the end of turn
        self.update_turn(); // toggle who's turn it is to play
        self.update_king_threat(board); // evaluate again start of next turn
        self.calc_score(board); // calculate score
        history.score.push(self.score);
    }
    /// Update score based on value of pieces on the board
    pub fn calc_score(&mut self, board: &BoardState) {
        let (mut white, mut black) = (0, 0);
        for col in board.iter() {
            for piece in col {
                if let Some(color) = piece.get_colour() {
                    match color {
                        Color::Black => black += piece.get_value().unwrap_or(0),
                        Color::White => white += piece.get_value().unwrap_or(0),
                    }
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
            en_passant: None,
            promotable_pawn: None,
            game_over: false,
            white_king: KingMeta {
                piece: Piece::King(Color::White, true, false, false),
                square: (4, 0),
            },
            black_king: KingMeta {
                piece: Piece::King(Color::Black, true, false, false),
                square: (4, 7),
            },
            half_move_count: 0,
        }
    }
}

/// Square reference in column and row
pub type Square = (usize, usize);

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
#[repr(u8)]
/// Moves can take one of many special types
pub enum MoveType {
    Move,
    Capture,
    Castle,
    EnPassant,
    Double,
}

pub type MoveList = Vec<(Square, MoveType)>;

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum Color {
    Black,
    White,
}

/// Some pieces have special behaviour if they haven't moved yet
pub type FirstMove = bool;
/// Is the King in check, meaning we need to consider avaliable moves
pub type Check = bool;
/// Is the King in check with no means to get out of check
pub type CheckMate = bool;

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Default)]
#[repr(u8)]
pub enum Piece {
    #[default]
    None,
    Pawn(Color, FirstMove),
    King(Color, FirstMove, Check, CheckMate),
    Queen(Color, FirstMove),
    Bishop(Color, FirstMove),
    Knight(Color, FirstMove),
    Rook(Color, FirstMove),
}

impl Piece {
    pub fn to_fen_char(&self) -> Option<char> {
        match *self {
            Piece::None => None,
            Piece::Pawn(Color::White, _) => Some('P'),
            Piece::Pawn(Color::Black, _) => Some('p'),
            Piece::King(Color::White, _, _, _) => Some('K'),
            Piece::King(Color::Black, _, _, _) => Some('k'),
            Piece::Queen(Color::White, _) => Some('Q'),
            Piece::Queen(Color::Black, _) => Some('q'),
            Piece::Bishop(Color::White, _) => Some('B'),
            Piece::Bishop(Color::Black, _) => Some('b'),
            Piece::Knight(Color::White, _) => Some('N'),
            Piece::Knight(Color::Black, _) => Some('n'),
            Piece::Rook(Color::White, _) => Some('R'),
            Piece::Rook(Color::Black, _) => Some('r'),
        }
    }
}

impl Display for Piece {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let code = match *self {
            Piece::None => "__",
            Piece::Pawn(Color::White, ..) => "wP",
            Piece::Pawn(Color::Black, ..) => "bP",
            Piece::King(Color::White, ..) => "wK",
            Piece::King(Color::Black, ..) => "bK",
            Piece::Queen(Color::White, ..) => "wQ",
            Piece::Queen(Color::Black, ..) => "bQ",
            Piece::Bishop(Color::White, ..) => "wB",
            Piece::Bishop(Color::Black, ..) => "bB",
            Piece::Knight(Color::White, ..) => "wN",
            Piece::Knight(Color::Black, ..) => "bN",
            Piece::Rook(Color::White, ..) => "wR",
            Piece::Rook(Color::Black, ..) => "bR",
        };
        write!(f, "{}", code)
    }
}
