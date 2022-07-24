//! Logic for the chess board actions

use super::data::{GameMeta, PieceLocation, SelectedSquare};
use super::pieces::GetState;
use super::types::{BoardState, Color, MoveList, Piece, Square};
use super::utils::{square_to_coord, valid_move};

#[tauri::command]
/// Get the location of all pieces from global memory
pub fn get_state(state: tauri::State<PieceLocation>) -> BoardState {
    println!("sending game state");
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
    // dbg!(&coord, &square);
    // dbg!(game[coord.0][coord.1].get_moves(coord, *game));
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
/// Click on a square to select or deselect it.
///
/// If a square is selected, the hover command will be deactivated.
/// If a square is a valid move of the selected piece, move that piece.
pub fn click_square(
    square: &str,
    state: tauri::State<PieceLocation>,
    clicked: tauri::State<SelectedSquare>,
    meta: tauri::State<GameMeta>,
) -> (MoveList, BoardState) {
    let mut selected = *clicked.0.lock().unwrap();
    let mut game = state.0.lock().unwrap();
    let coord = square_to_coord(square);
    let mut move_list: MoveList = Vec::new();
    if selected == Option::None {
        //* 1.if we have nothing selected, select something!
        selected = Some(coord);
    } else if selected == Some(coord) {
        //* 2. if we have clicked on the same square again, unselect it
        selected = Option::None;
    } else if valid_move(selected.unwrap(), coord, *game) {
        //* 3. if we have clicked a valid move of selected, do move
        println!("valid move");
        let source = selected.unwrap();
        let attacker = game[source.0][source.1].clone();
        game[coord.0][coord.1] = Piece::None; // remove attacked piece
        game[source.0][source.1] = Piece::None; // take attacked out of its square
        game[coord.0][coord.1] = attacker; // place attacker in the new square
        dbg!(attacker);
    } else {
        //* 4. select the new square
        selected = Some(coord);
        move_list = game[coord.0][coord.1].get_moves(coord, *game)
    }
    *clicked.0.lock().unwrap() = selected;
    (move_list, *game)
}

#[tauri::command]
/// Initialize a new game by sending a starting set of coords
pub fn new_game(state: tauri::State<PieceLocation>, meta: tauri::State<GameMeta>) -> BoardState {
    // Lock the counter(Mutex) to get the current value
    let mut game = state.0.lock().unwrap();
    let mut game_meta = meta.0.lock().unwrap();
    // reset game meta data
    game_meta.score = 0;
    game_meta.turn = 0;
    // reset board to empty
    for col in 0..8 {
        for row in 0..8 {
            game[col][row] = Piece::None
        }
    }
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
    *game // return dereferenced game state to frontend
}
