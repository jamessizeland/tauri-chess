//! Chess pieces traits

use super::moves::{bish_move, king_move, knight_move, pawn_move, rook_move};
use super::types::{BoardState, Color, MoveList, Piece, Square};

/// Get a list of available moves for this piece
pub trait GetState {
    /// Return a list of all available moves for this piece
    fn get_moves(&self, square: Square, board: &BoardState) -> MoveList;
    /// Return this piece's color
    fn get_colour(&self) -> Option<Color>;
    /// If this piece is a king, return its color, otherwise return None
    fn is_king(&self) -> Option<Color>;
}

impl GetState for Piece {
    fn get_colour(&self) -> Option<Color> {
        match &self {
            Piece::None => None,
            Piece::Pawn(color, _) => Some(*color),
            Piece::King(color, _, _, _) => Some(*color),
            Piece::Queen(color, _) => Some(*color),
            Piece::Bishop(color, _) => Some(*color),
            Piece::Knight(color, _) => Some(*color),
            Piece::Rook(color, _) => Some(*color),
        }
    }
    fn is_king(&self) -> Option<Color> {
        match &self {
            Piece::King(color, _, _, _) => Some(*color),
            _ => None,
        }
    }
    fn get_moves(&self, sq: Square, board: &BoardState) -> MoveList {
        match &self {
            // what type of piece am I?
            Piece::None => Vec::new(),
            //* For each actual piece we need to work out what moves it could do on an empty board, then remove moves that are blocked by other pieces
            Piece::Pawn(color, first_move) => pawn_move(sq, color, first_move, &board),
            Piece::King(color, first_move, _check, _check_mate) => {
                king_move(sq, color, &board, *first_move)
            }
            Piece::Queen(color, _first_move) => {
                //* move in any direction until either another piece or the edge of the board
                let mut moves = rook_move(sq, color, &board);
                let mut diag_moves = bish_move(sq, color, &board);
                moves.append(&mut diag_moves);
                moves
            }
            Piece::Bishop(color, _first_move) => bish_move(sq, color, &board),
            Piece::Knight(color, _first_move) => knight_move(sq, color, &board),
            Piece::Rook(color, _first_move) => rook_move(sq, color, &board),
            // _ => Vec::new(),
        }
    }
}

impl Piece {
    pub fn has_moved(&mut self) -> Self {
        match &self {
            Piece::None => Piece::None,
            Piece::Pawn(color, _) => Piece::Pawn(*color, false),
            Piece::King(color, _, check, mate) => Piece::King(*color, false, *check, *mate),
            Piece::Queen(color, _) => Piece::Queen(*color, false),
            Piece::Bishop(color, _) => Piece::Bishop(*color, false),
            Piece::Knight(color, _) => Piece::Knight(*color, false),
            Piece::Rook(color, _) => Piece::Rook(*color, false),
        }
    }
}
