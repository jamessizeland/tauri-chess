#[cfg(test)]
mod tests {
    use crate::chess::{
        pieces::GetState,
        types::{BoardState, Color, Piece},
    };

    #[test]
    /// put all piece types in all squares and see if get moves doesn't panic
    fn all_pieces_happy_in_all_squares() {
        let board: BoardState = Default::default();
        // dbg!(&board);
        let piece_list = [
            Piece::None,
            Piece::Pawn(Color::Black, true),
            Piece::Rook(Color::Black, true),
            Piece::Bishop(Color::Black, true),
            Piece::Knight(Color::Black, true),
            Piece::King(Color::Black, true, false, false),
            Piece::Queen(Color::Black, true),
            Piece::Pawn(Color::White, true),
            Piece::Rook(Color::White, true),
            Piece::Bishop(Color::White, true),
            Piece::Knight(Color::White, true),
            Piece::King(Color::White, true, false, false),
            Piece::Queen(Color::White, true),
        ];
        for piece in piece_list {
            for col in 0..7 {
                for row in 0..7 {
                    piece.get_moves((col, row), &board);
                }
            }
        }
        assert!(true);
    }
}
