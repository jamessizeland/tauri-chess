//! Logic for the chess board actions
use super::data::{GameMetaData, PieceLocation, SelectedSquare};
use super::pieces::{GetState, ModState};
use super::types::{BoardState, Color, GameMeta, ModMeta, MoveList, Piece, Square};
use super::utils::{check_enemy, remove_invalid_moves, square_to_coord, valid_move};

#[tauri::command]
/// Get the location of all pieces from global memory
pub fn get_state(state: tauri::State<PieceLocation>) -> BoardState {
    println!("sending game state");
    let board = state.0.lock().expect("board state access");
    *board
}

#[tauri::command]
/// Get the game score from global memory
pub fn get_score(state: tauri::State<GameMetaData>) -> super::types::GameMeta {
    let meta_game = state.0.lock().expect("game state access");
    *meta_game
}

#[tauri::command]
/// Initialize a new game by sending a starting set of coords
pub fn new_game(
    state: tauri::State<PieceLocation>,
    meta: tauri::State<GameMetaData>,
) -> BoardState {
    // Lock the counter(Mutex) to get the current value
    let mut board = state.0.lock().unwrap();
    let mut game_meta = meta.0.lock().unwrap();
    // reset game meta data
    game_meta.new_game();
    // reset board to empty
    for col in 0..8 {
        for row in 0..8 {
            board[col][row] = Piece::None
        }
    }
    // set up white pieces
    board[0][0] = Piece::Rook(Color::White, true);
    board[1][0] = Piece::Bishop(Color::White, true);
    board[2][0] = Piece::Knight(Color::White, true);
    board[3][0] = Piece::Queen(Color::White, true);
    // board[4][1] = Piece::Queen(Color::White, true);
    board[4][0] = Piece::King(Color::White, true, false, false);
    board[5][0] = Piece::Knight(Color::White, true);
    board[6][0] = Piece::Bishop(Color::White, true);
    board[7][0] = Piece::Rook(Color::White, true);
    for col in 0..8 {
        board[col][1] = Piece::Pawn(Color::White, true);
    }
    // set up black pieces
    board[0][7] = Piece::Rook(Color::Black, true);
    board[1][7] = Piece::Knight(Color::Black, true);
    board[2][7] = Piece::Bishop(Color::Black, true);
    board[3][7] = Piece::Queen(Color::Black, true);
    // board[4][6] = Piece::Queen(Color::Black, true);
    board[4][7] = Piece::King(Color::Black, true, false, false);
    board[5][7] = Piece::Bishop(Color::Black, true);
    board[6][7] = Piece::Knight(Color::Black, true);
    board[7][7] = Piece::Rook(Color::Black, true);
    for col in 0..8 {
        board[col][6] = Piece::Pawn(Color::Black, true);
    }
    *board // return dereferenced board state to frontend
}

#[tauri::command]
/// Highlight available moves for the piece occupying this square
pub fn hover_square(
    square: &str,
    state: tauri::State<PieceLocation>,
    clicked: tauri::State<SelectedSquare>,
    meta: tauri::State<GameMetaData>,
) -> MoveList {
    let board = state.0.lock().expect("game state access");
    let game_meta = meta.0.lock().unwrap();
    let selected = *clicked.0.lock().unwrap();
    let mut coord: Square = square_to_coord(square);
    dbg!(selected);

    if selected != Option::None {
        coord = selected.unwrap();
    }
    // dbg!(&coord, &square);
    // dbg!(board[coord.0][coord.1].get_moves(coord, *board));
    let move_options = board[coord.0][coord.1].get_moves(coord, &board);
    let filtered_options = remove_invalid_moves(move_options, coord, &game_meta, &board);
    // dbg!(&filtered_options);
    filtered_options
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
    meta: tauri::State<GameMetaData>,
) -> (MoveList, BoardState, GameMeta) {
    let mut selected = *clicked.0.lock().unwrap();
    let mut board = state.0.lock().unwrap();
    let mut game_meta = meta.0.lock().unwrap();
    let coord = square_to_coord(square);
    let mut move_list: MoveList = Vec::new();
    let turn: Color = if game_meta.turn % 2 == 0 {
        Color::White
    } else {
        Color::Black
    };
    let contains_enemy = check_enemy(&turn, &board[coord.0][coord.1]);
    if selected == Option::None {
        //* 1.if we have nothing selected and the new coordinate doesn't contain an enemy piece, select it!
        if !contains_enemy {
            selected = Some(coord);
        }
    } else if selected == Some(coord) {
        //* 2. if we have clicked on the same square again, unselect it
        selected = Option::None;
    } else if valid_move(selected.unwrap(), coord, &board, &game_meta) {
        //* 3. if we have clicked a valid move of selected, do move
        println!("valid move");
        let source = selected.unwrap();
        let attacker = board[source.0][source.1].clone().has_moved();
        board[coord.0][coord.1] = Piece::None; // remove attacked piece
        board[source.0][source.1] = Piece::None; // take attacked out of its square
        board[coord.0][coord.1] = attacker; // place attacker in the new square
        if attacker.is_king() == Some(turn) {
            match turn {
                Color::Black => {
                    game_meta.black_king.piece = attacker;
                    game_meta.black_king.square = coord;
                }
                Color::White => {
                    game_meta.white_king.piece = attacker;
                    game_meta.white_king.square = coord;
                }
            }
        }
        selected = Option::None;
        //* 4. update the meta only if something has changed
        game_meta.update_king_threat(&mut board);
        game_meta.update_turn();
    } else if board[coord.0][coord.1] == Piece::None || contains_enemy {
        //* 4. Selected an empty or enemy square which isn't a valid move, unselect
        selected = Option::None;
    } else {
        //* 5. select the new square
        selected = Some(coord);
        move_list = board[coord.0][coord.1].get_moves(coord, &board)
    }
    *clicked.0.lock().unwrap() = selected;
    // dbg!(game_meta.white_king.piece);
    // dbg!(game_meta.black_king.piece);
    (move_list, *board, *game_meta)
}
