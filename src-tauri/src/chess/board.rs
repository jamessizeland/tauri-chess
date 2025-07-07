//! Contains the board state

use super::types::{Color, Piece, Square};
use serde::{Deserialize, Serialize};

/// 8x8 array containing either pieces or nothing
#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct BoardState([[Piece; 8]; 8]);

impl BoardState {
    /// Create a new board with the default starting position
    pub fn new() -> Self {
        let (white, black) = (Color::White, Color::Black);

        let mut board = [[Piece::None; 8]; 8];
        // set up white pieces
        board[0][0] = Piece::Rook(white, true);
        board[1][0] = Piece::Knight(white, true);
        board[2][0] = Piece::Bishop(white, true);
        board[3][0] = Piece::Queen(white, true);
        board[4][0] = Piece::King(white, true, false, false);
        board[5][0] = Piece::Bishop(white, true);
        board[6][0] = Piece::Knight(white, true);
        board[7][0] = Piece::Rook(white, true);
        // set up black pieces
        board[0][7] = Piece::Rook(black, true);
        board[1][7] = Piece::Knight(black, true);
        board[2][7] = Piece::Bishop(black, true);
        board[3][7] = Piece::Queen(black, true);
        board[4][7] = Piece::King(black, true, false, false);
        board[5][7] = Piece::Bishop(black, true);
        board[6][7] = Piece::Knight(black, true);
        board[7][7] = Piece::Rook(black, true);
        // set up pawns
        for col in board.iter_mut() {
            col[1] = Piece::Pawn(white, true);
            col[6] = Piece::Pawn(black, true);
        }
        BoardState(board)
    }
    /// Set a piece on the board
    pub fn set(&mut self, square: Square, piece: Piece) {
        self.0[square.0][square.1] = piece;
    }
    /// Get a piece from the board
    pub fn get(&self, square: Square) -> Piece {
        self.0[square.0][square.1]
    }
    pub fn iter(&self) -> std::slice::Iter<[Piece; 8]> {
        self.0.iter()
    }
    /// Construct the board section of a fen string
    pub fn to_fen_string(&self) -> String {
        let mut fen = String::new();
        let mut empty_count = 0;
        for row in (0..8).rev() {
            for col in 0..8 {
                let piece = self.0[col][row];
                if let Some(piece) = piece.to_fen_char() {
                    if empty_count > 0 {
                        fen.push_str(&empty_count.to_string());
                        empty_count = 0;
                    }
                    fen.push(piece);
                } else {
                    empty_count += 1;
                }
            }
            if empty_count > 0 {
                fen.push_str(&empty_count.to_string());
                empty_count = 0;
            }
            fen.push('/');
        }
        fen.pop();
        fen
    }
}

impl Default for BoardState {
    fn default() -> Self {
        BoardState([[Piece::None; 8]; 8])
    }
}

#[cfg(test)]
mod test {
    use crate::chess::board::BoardState;

    #[test]
    fn test_generate_fen() {
        let board = BoardState::new();
        let fen = board.to_fen_string();
        assert_eq!(fen, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    }
}
