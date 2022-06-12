mod pieces;

/// Logic for the chess board actions
pub mod board {
    use super::pieces::{Color, Piece};

    type BoardState = [[Piece; 8]; 8];
    /// game state 8x8 board
    static mut GAME: BoardState = [[Piece::None; 8]; 8];

    /// game move history, stored as FEN strings
    static mut HISTORY: Vec<&str> = Vec::new();

    /// game score stored relative to white
    static mut SCORE: i32 = 0;

    #[tauri::command]
    /// Initialize a new game by sending a starting set of coords
    pub fn new_game() -> BoardState {
        unsafe {
            // mutating a static variable is unsafe
            GAME = [[Piece::None; 8]; 8];
            GAME[0][0] = Piece::Rook(Color::White);
            GAME[1][0] = Piece::Bishop(Color::White);
            GAME[2][0] = Piece::Knight(Color::White);
            GAME[3][0] = Piece::Queen(Color::White);
            GAME[4][0] = Piece::King(Color::White);
            GAME[5][0] = Piece::Knight(Color::White);
            GAME[6][0] = Piece::Bishop(Color::White);
            GAME[7][0] = Piece::Rook(Color::White);
            GAME[0][1] = Piece::Pawn(Color::White);
            GAME[1][1] = Piece::Pawn(Color::White);
            GAME[2][1] = Piece::Pawn(Color::White);
            GAME[3][1] = Piece::Pawn(Color::White);
            GAME[4][1] = Piece::Pawn(Color::White);
            GAME[5][1] = Piece::Pawn(Color::White);
            GAME[6][1] = Piece::Pawn(Color::White);
            GAME[7][1] = Piece::Pawn(Color::White);
            // ---
            GAME[0][7] = Piece::Rook(Color::Black);
            GAME[1][7] = Piece::Bishop(Color::Black);
            GAME[2][7] = Piece::Knight(Color::Black);
            GAME[3][7] = Piece::Queen(Color::Black);
            GAME[4][7] = Piece::King(Color::Black);
            GAME[5][7] = Piece::Knight(Color::Black);
            GAME[6][7] = Piece::Bishop(Color::Black);
            GAME[7][7] = Piece::Rook(Color::Black);
            GAME[0][6] = Piece::Pawn(Color::Black);
            GAME[1][6] = Piece::Pawn(Color::Black);
            GAME[2][6] = Piece::Pawn(Color::Black);
            GAME[3][6] = Piece::Pawn(Color::Black);
            GAME[4][6] = Piece::Pawn(Color::Black);
            GAME[5][6] = Piece::Pawn(Color::Black);
            GAME[6][6] = Piece::Pawn(Color::Black);
            GAME[7][6] = Piece::Pawn(Color::Black);
            GAME
        }
    }

    #[tauri::command]
    /// Highlight available moves for the piece occupying this square
    pub fn hover_square(square: &str) -> Vec<&str> {
        let sq_vec: Vec<char> = square.chars().collect();
        // dbg!(&square);
        dbg!(&sq_vec);
        let mut highlights = Vec::new();
        highlights.push(square);
        highlights
    }

    #[tauri::command]
    /// Remove any highlighting for square just left
    pub fn unhover_square(square: &str) {}

    #[tauri::command]
    /// Perform the boardstate change associated with a chess piece being moved
    pub fn drop_square(source_square: &str, target_square: &str, piece: &str) {
        dbg!(source_square, target_square, piece);
    }
}
