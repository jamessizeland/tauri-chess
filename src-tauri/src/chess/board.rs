#[tauri::command]
/// Highlight available moves for the piece occupying this square
pub fn hover_square(square: &str) -> &str {
    let sq_vec: Vec<char> = square.chars().collect();
    // dbg!(&square);
    dbg!(&sq_vec);
    square
}

#[tauri::command]
/// Remove any highlighting for square just left
pub fn unhover_square(square: &str) {}

#[tauri::command]
/// Perform the boardstate change associated with a chess piece being moved
pub fn drop_square(source_square: &str, target_square: &str, piece: &str) {
    dbg!(source_square, target_square, piece);
}
