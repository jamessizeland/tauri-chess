//! Chess pieces traits

use super::board::BoardState;
use super::moves::{bish_move, en_passant_move, king_move, knight_move, pawn_move, rook_move};
use super::types::{Color, GameMeta, MoveList, Piece, Square};
use super::utils::{remove_invalid_moves, under_threat};

/// Request state information from a selected piece
impl Piece {
    /// Return a list of all available moves for this piece
    pub fn get_moves(&self, sq: Square, board: &BoardState) -> MoveList {
        //* For each actual piece we need to work out what moves it could do on an empty board, then remove moves that are blocked by other pieces
        match self {
            // what type of piece am I?
            Piece::None => Vec::new(),
            Piece::Pawn(color, first_move) => pawn_move(sq, *color, *first_move, board),
            Piece::King(color, ..) => king_move(sq, *color, board),
            Piece::Queen(color, ..) => {
                //* move in any direction until either another piece or the edge of the board
                let mut moves = rook_move(sq, *color, board);
                let mut diag_moves = bish_move(sq, *color, board);
                moves.append(&mut diag_moves);
                moves
            }
            Piece::Bishop(color, ..) => bish_move(sq, *color, board),
            Piece::Knight(color, ..) => knight_move(sq, *color, board),
            Piece::Rook(color, ..) => rook_move(sq, *color, board),
        }
    }
    /// Return if there is an available en passant move for this pawn
    pub fn get_en_passant_moves(&self, square: Square, en_passant_target: Square) -> MoveList {
        if let Piece::Pawn(color, ..) = self {
            en_passant_move(square, *color, en_passant_target)
        } else {
            panic!("should only be targetting a pawn")
        }
    }
    /// Return this piece's color
    pub fn get_colour(&self) -> Option<Color> {
        match self {
            Piece::None => None,
            Piece::Pawn(color, ..) => Some(*color),
            Piece::King(color, ..) => Some(*color),
            Piece::Queen(color, ..) => Some(*color),
            Piece::Bishop(color, ..) => Some(*color),
            Piece::Knight(color, ..) => Some(*color),
            Piece::Rook(color, ..) => Some(*color),
        }
    }
    /// Check if this piece is a king of a certain color
    pub fn is_king(&self, color: Color) -> bool {
        match self {
            Piece::King(my_color, ..) => my_color == &color,
            _ => false,
        }
    }
    /// If this piece is a king, is it in checkmate?
    pub fn is_king_mate(&self) -> Option<bool> {
        if let Piece::King(.., mate) = self {
            Some(*mate)
        } else {
            None
        }
    }
    /// Return the relative weighting value of this piece based on its type
    ///
    /// https://en.wikipedia.org/wiki/Chess_piece_relative_value
    pub fn get_value(&self) -> Option<isize> {
        match &self {
            Piece::None => None,
            Piece::Pawn(..) => Some(100),
            Piece::King(..) => None,
            Piece::Queen(..) => Some(929),
            Piece::Bishop(..) => Some(320),
            Piece::Knight(..) => Some(280),
            Piece::Rook(..) => Some(479),
        }
    }
    /// Ask if this piece is a promotable pawn
    pub fn is_promotable_pawn(&self, square: Square) -> bool {
        if let Piece::Pawn(color, ..) = self {
            match color {
                // check if the pawn has reached the other side of the board
                Color::Black => square.1 == 0,
                Color::White => square.1 == 7,
            }
        } else {
            false
        }
    }
    /// This piece has been moved, so update its First Move status to false
    ///
    /// Return modified piece
    pub fn has_moved(&self) -> Self {
        match self {
            Piece::None => Self::None,
            Piece::Pawn(color, ..) => Self::Pawn(*color, false),
            Piece::King(color, _, check, mate) => Piece::King(*color, false, *check, *mate),
            Piece::Queen(color, ..) => Self::Queen(*color, false),
            Piece::Bishop(color, ..) => Self::Bishop(*color, false),
            Piece::Knight(color, ..) => Self::Knight(*color, false),
            Piece::Rook(color, ..) => Self::Rook(*color, false),
        }
    }
    /// If this piece is a king, update its check and checkmate states
    ///
    /// Modifies piece in place
    pub fn king_threat(&mut self, location: &Square, board: &BoardState, meta: GameMeta) {
        if let Piece::King(color, first_move, ..) = self {
            let check = under_threat(*location, *color, board);
            let mut team_moves: usize = 0;
            for col in 0..8 {
                for row in 0..8 {
                    let piece = board.get((col, row));
                    if piece.get_colour() == Some(*color) {
                        let no_moves = remove_invalid_moves(
                            piece.get_moves((col, row), board),
                            (col, row),
                            &meta,
                            board,
                        )
                        .len();
                        team_moves += no_moves;
                    }
                }
            }
            let mate = check && (team_moves == 0);
            *self = Piece::King(*color, *first_move, check, mate);
        }
    }
}
