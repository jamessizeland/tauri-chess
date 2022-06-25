//! Logic for the chess board actions

use super::data::{GameMeta, PieceLocation, SelectedSquare};
use super::pieces::GetState;
use super::types::{BoardState, Color, MoveList, Piece, Square};
use super::utils::square_to_coord;

#[tauri::command]
/// Get the location of all pieces from global memory
pub fn get_state(state: tauri::State<PieceLocation>) -> BoardState {
    let game = state.0.lock().expect("board state access");
    *game
}

#[tauri::command]
/// Get the game score from global memory
pub fn get_score(state: tauri::State<GameMeta>) -> i32 {
    let score = state.0.lock().expect("game state access").score;
    score
}

#[tauri::command]
/// Highlight available moves for the piece occupying this square
pub fn hover_square(
    square: &str,
    state: tauri::State<PieceLocation>,
    clicked: tauri::State<SelectedSquare>,
) -> MoveList {
    let game = state.0.lock().expect("game state access");

    let selected = *clicked.0.lock().unwrap();
    let mut coord: Square = square_to_coord(square);

    if selected != Option::None {
        coord = selected.unwrap();
    }
    dbg!(&coord, &square);
    game[coord.0][coord.1].get_moves(coord, *game)
}

#[tauri::command]
/// Remove any highlighting for square just left
pub fn unhover_square(_square: &str) -> bool {
    true
}

#[tauri::command]
/// Perform the boardstate change associated with a chess piece being moved
pub fn drop_square(source_square: &str, target_square: &str, piece: &str) {
    dbg!(source_square, target_square, piece);
}

#[tauri::command]
/// Click on a square to select or deselect it
/// If a square is selected, the hover command will be deactivated
pub fn click_square(
    square: &str,
    state: tauri::State<PieceLocation>,
    clicked: tauri::State<SelectedSquare>,
) -> MoveList {
    let selected = *clicked.0.lock().unwrap();
    let coord = square_to_coord(square);
    if selected == Some(coord) || state.0.lock().unwrap()[coord.0][coord.1] == Piece::None {
        // if we have clicked on the same square again, unselect it
        *clicked.0.lock().unwrap() = Option::None;
    } else {
        *clicked.0.lock().unwrap() = Some(coord);
    }
    hover_square(square, state, clicked)
}

#[tauri::command]
/// Initialize a new game by sending a starting set of coords
pub fn new_game(state: tauri::State<PieceLocation>) -> BoardState {
    // Lock the counter(Mutex) to get the current value
    let mut game = state.0.lock().expect("state access error");
    // set up white pieces
    game[0][0] = Piece::Rook(Color::White, true);
    game[1][0] = Piece::Bishop(Color::White, true);
    game[2][0] = Piece::Knight(Color::White, true);
    game[3][0] = Piece::Queen(Color::White, true);
    game[4][0] = Piece::King(Color::White, true, false, false);
    game[5][0] = Piece::Knight(Color::White, true);
    game[6][0] = Piece::Bishop(Color::White, true);
    game[7][0] = Piece::Rook(Color::White, true);
    game[0][1] = Piece::Pawn(Color::White, true);
    game[1][1] = Piece::Pawn(Color::White, true);
    game[2][1] = Piece::Pawn(Color::White, true);
    game[3][1] = Piece::Pawn(Color::White, true);
    game[4][1] = Piece::Pawn(Color::White, true);
    game[5][1] = Piece::Pawn(Color::White, true);
    game[6][1] = Piece::Pawn(Color::White, true);
    game[7][1] = Piece::Pawn(Color::White, true);
    // set up black pieces
    game[0][7] = Piece::Rook(Color::Black, true);
    game[1][7] = Piece::Knight(Color::Black, true);
    game[2][7] = Piece::Bishop(Color::Black, true);
    game[3][7] = Piece::Queen(Color::Black, true);
    game[4][7] = Piece::King(Color::Black, true, false, false);
    game[5][7] = Piece::Bishop(Color::Black, true);
    game[6][7] = Piece::Knight(Color::Black, true);
    game[7][7] = Piece::Rook(Color::Black, true);
    game[0][6] = Piece::Pawn(Color::Black, true);
    game[1][6] = Piece::Pawn(Color::Black, true);
    game[2][6] = Piece::Pawn(Color::Black, true);
    game[3][6] = Piece::Pawn(Color::Black, true);
    game[4][6] = Piece::Pawn(Color::Black, true);
    game[5][6] = Piece::Pawn(Color::Black, true);
    game[6][6] = Piece::Pawn(Color::Black, true);
    game[7][6] = Piece::Pawn(Color::Black, true);
    // debug
    game[1][2] = Piece::Pawn(Color::Black, true);
    game[3][2] = Piece::Pawn(Color::Black, true);
    game[1][5] = Piece::Pawn(Color::White, true);
    game[3][5] = Piece::Pawn(Color::White, true);
    game[5][3] = Piece::Rook(Color::Black, true);
    game[7][3] = Piece::Pawn(Color::White, true);
    game[1][3] = Piece::Pawn(Color::White, true);
    game[4][4] = Piece::Bishop(Color::White, true);
    game[5][5] = Piece::Queen(Color::Black, true);
    game[2][4] = Piece::King(Color::Black, true, false, false);
    *game // return dereferenced game state to frontend
}
