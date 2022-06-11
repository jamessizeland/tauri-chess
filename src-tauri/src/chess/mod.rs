mod pieces;

/// Logic for the chess board actions
pub mod board {
    #[tauri::command]
    /// Initialize a new game by sending a starting set of coords
    pub fn new_game() {
        println!("new game!");
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
