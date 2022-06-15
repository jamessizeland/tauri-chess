pub mod pieces;

/// Logic for the chess board actions
pub mod board {
    use super::pieces::{Color, Piece};
    use std::sync::Mutex; // mutual exclusion wrapper

    pub type BoardState = [[Piece; 8]; 8];

    /// game move history, stored as FEN strings
    // pub struct History(Vec<i32>);
    /// game score stored relative to white
    pub struct Score(Mutex<i32>);

    /// game state 8x8 board
    pub struct PieceLocation(pub Mutex<BoardState>);

    #[tauri::command]
    /// Initialize a new game by sending a starting set of coords
    pub fn new_game(state: tauri::State<PieceLocation>) -> BoardState {
        // Lock the counter(Mutex) to get the current value
        let mut game = state.0.lock().expect("game state access error");
        game[0][0] = Piece::Rook(Color::White, true);
        game[1][0] = Piece::Bishop(Color::White);
        game[2][0] = Piece::Knight(Color::White);
        game[3][0] = Piece::Queen(Color::White);
        game[4][0] = Piece::King(Color::White, true, false, false);
        game[5][0] = Piece::Knight(Color::White);
        game[6][0] = Piece::Bishop(Color::White);
        game[7][0] = Piece::Rook(Color::White, true);
        game[0][1] = Piece::Pawn(Color::White, true);
        game[1][1] = Piece::Pawn(Color::White, true);
        game[2][1] = Piece::Pawn(Color::White, true);
        game[3][1] = Piece::Pawn(Color::White, true);
        game[4][1] = Piece::Pawn(Color::White, true);
        game[5][1] = Piece::Pawn(Color::White, true);
        game[6][1] = Piece::Pawn(Color::White, true);
        game[7][1] = Piece::Pawn(Color::White, true);
        // ---
        game[0][7] = Piece::Rook(Color::Black, true);
        game[1][7] = Piece::Bishop(Color::Black);
        game[2][7] = Piece::Knight(Color::Black);
        game[3][7] = Piece::Queen(Color::Black);
        game[4][7] = Piece::King(Color::Black, true, false, false);
        game[5][7] = Piece::Knight(Color::Black);
        game[6][7] = Piece::Bishop(Color::Black);
        game[7][7] = Piece::Rook(Color::Black, true);
        game[0][6] = Piece::Pawn(Color::Black, true);
        game[1][6] = Piece::Pawn(Color::Black, true);
        game[2][6] = Piece::Pawn(Color::Black, true);
        game[3][6] = Piece::Pawn(Color::Black, true);
        game[4][6] = Piece::Pawn(Color::Black, true);
        game[5][6] = Piece::Pawn(Color::Black, true);
        game[6][6] = Piece::Pawn(Color::Black, true);
        game[7][6] = Piece::Pawn(Color::Black, true);
        *game // return dereferenced game state to frontend
    }

    #[tauri::command]
    pub fn get_state(state: tauri::State<PieceLocation>) -> BoardState {
        let game = state.0.lock().expect("game state access error");
        *game
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
