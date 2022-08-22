//! Chess pieces traits

use super::moves::{bish_move, en_passant_move, king_move, knight_move, pawn_move, rook_move};
use super::types::{BoardState, Color, GameMeta, MoveList, Piece, Square};
use super::utils::{remove_invalid_moves, under_threat};

/// Request state information from a selected piece
pub trait GetState {
    /// Return a list of all available moves for this piece
    fn get_moves(&self, square: Square, board: &BoardState) -> MoveList;
    /// Return if there is an available en passant move for this pawn
    fn get_en_passant_moves(&self, square: Square, en_passant_target: Square) -> MoveList;
    /// Return this piece's color
    fn get_colour(&self) -> Option<Color>;
    /// If this piece is a king, return its color, otherwise return None
    fn is_king(&self) -> Option<Color>;
    /// If this piece is a king, is it in check?
    fn is_king_checked(&self) -> Option<bool>;
    /// If this piece is a king, is it in checkmate?
    fn is_king_mate(&self) -> Option<bool>;
    /// Return the relative weighting value of this piece based on its type
    ///
    /// https://en.wikipedia.org/wiki/Chess_piece_relative_value
    fn get_value(&self) -> isize;
    // /// Ask if a piece is of a requested type
    // fn is_piece_type(&self, piece: Piece) -> bool;
}

/// Modify state information on a selected piece
pub trait ModState {
    /// This piece has been moved, so update its First Move status to false
    ///
    /// Return modified piece
    fn has_moved(&self) -> Self;
    /// If this piece is a king, update its check and checkmate states
    ///
    /// Modifies piece in place
    fn king_threat(&mut self, location: &Square, board: &BoardState, meta: GameMeta);
}

impl GetState for Piece {
    fn get_moves(&self, sq: Square, board: &BoardState) -> MoveList {
        //* For each actual piece we need to work out what moves it could do on an empty board, then remove moves that are blocked by other pieces
        match &self {
            // what type of piece am I?
            Piece::None => Vec::new(),
            Piece::Pawn(color, first_move) => pawn_move(sq, color, first_move, board),
            Piece::King(color, _first_move, _check, _check_mate) => king_move(sq, color, board),
            Piece::Queen(color, _first_move) => {
                //* move in any direction until either another piece or the edge of the board
                let mut moves = rook_move(sq, color, board);
                let mut diag_moves = bish_move(sq, color, board);
                moves.append(&mut diag_moves);
                moves
            }
            Piece::Bishop(color, _first_move) => bish_move(sq, color, board),
            Piece::Knight(color, _first_move) => knight_move(sq, color, board),
            Piece::Rook(color, _first_move) => rook_move(sq, color, board),
        }
    }

    fn get_en_passant_moves(&self, square: Square, en_passant_target: Square) -> MoveList {
        match &self {
            Piece::Pawn(color, _first_move) => en_passant_move(square, color, en_passant_target),
            _ => panic!("should only be targetting a pawn"),
        }
    }
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
    fn is_king_checked(&self) -> Option<bool> {
        match &self {
            Piece::King(_, _, check, _) => Some(*check),
            _ => None,
        }
    }
    fn is_king_mate(&self) -> Option<bool> {
        match &self {
            Piece::King(_, _, _, mate) => Some(*mate),
            _ => None,
        }
    }

    fn get_value(&self) -> isize {
        match &self {
            Piece::None => 0,
            Piece::Pawn(_, _) => 1,
            Piece::King(_, _, _, _) => 0,
            Piece::Queen(_, _) => 9,
            Piece::Bishop(_, _) => 3,
            Piece::Knight(_, _) => 3,
            Piece::Rook(_, _) => 5,
        }
    }
}

impl ModState for Piece {
    fn has_moved(&self) -> Self {
        match &self {
            Piece::None => Self::None,
            Piece::Pawn(color, _) => Self::Pawn(*color, false),
            Piece::King(color, _, check, mate) => Piece::King(*color, false, *check, *mate),
            Piece::Queen(color, _) => Self::Queen(*color, false),
            Piece::Bishop(color, _) => Self::Bishop(*color, false),
            Piece::Knight(color, _) => Self::Knight(*color, false),
            Piece::Rook(color, _) => Self::Rook(*color, false),
        }
    }
    fn king_threat(&mut self, location: &Square, board: &BoardState, meta: GameMeta) {
        *self = match *self {
            Piece::King(color, first_move, _, _) => {
                let check = under_threat(*location, &color, board);
                let mut team_moves: usize = 0;
                for col in 0..8 {
                    for row in 0..8 {
                        let piece = board[col][row];
                        if piece.get_colour() == Some(color) {
                            let no_moves = remove_invalid_moves(
                                piece.get_moves((col, row), board),
                                (col, row),
                                &meta,
                                board,
                            )
                            .len();
                            team_moves += no_moves;
                            // println!(
                            //     "friendly piece {:?} at ({},{} - {} moves)",
                            //     piece, col, row, no_moves
                            // );
                        }
                    }
                }
                let mate = check && (team_moves == 0);
                Self::King(color, first_move, check, mate)
            }
            _ => *self,
        }
    }
}
