//! Logic for the chess board actions

use serde_json::json;

use super::data::{
    GameMetaData, HistoryData, Payload, PieceLocation, QueueHandler, SelectedSquare,
};
use super::moves::check_castling_moves;
use super::pieces::{GetState, ModState};
use super::types::{BoardState, Color, GameMeta, ModMeta, MoveList, Piece, Square};
use super::utils::{
    check_enemy, remove_invalid_moves, square_to_coord, turn_into_colour, valid_move,
};

#[tauri::command]
/// Get the location of all pieces from global memory
pub fn get_state(state: tauri::State<PieceLocation>) -> BoardState {
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
    history_data: tauri::State<HistoryData>,
) -> BoardState {
    // Lock the counter(Mutex) to get the current value
    let mut board = state.0.lock().unwrap();
    let mut game_meta = meta.0.lock().unwrap();
    let mut history = history_data.0.lock().unwrap();
    *history = Default::default();
    // reset game meta data
    game_meta.new_game();
    // reset board to empty
    for col in 0..8 {
        for row in 0..8 {
            board[col][row] = Piece::None
        }
    }
    // DEBUG PIECES
    // board[3][0] = Piece::Queen(Color::White, true);
    // board[4][0] = Piece::King(Color::White, true, false, false);
    // board[3][1] = Piece::Pawn(Color::White, true);
    // board[4][1] = Piece::Pawn(Color::White, true);
    // board[5][1] = Piece::Pawn(Color::White, true);
    // board[3][7] = Piece::Queen(Color::Black, true);
    // board[4][7] = Piece::King(Color::Black, true, false, false);
    // board[3][6] = Piece::Pawn(Color::Black, true);
    // board[4][6] = Piece::Pawn(Color::Black, true);
    // board[5][6] = Piece::Pawn(Color::Black, true);
    // set up white pieces
    board[0][0] = Piece::Rook(Color::White, true);
    board[1][0] = Piece::Bishop(Color::White, true);
    board[2][0] = Piece::Knight(Color::White, true);
    board[3][0] = Piece::Queen(Color::White, true);
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
    let turn = turn_into_colour(game_meta.turn);
    if selected != Option::None {
        coord = selected.unwrap();
    }
    let piece = board[coord.0][coord.1];
    let mut move_options = piece.get_moves(coord, &board);
    if piece.is_king() == Some(turn) {
        for castle_move in check_castling_moves(coord, &turn, &board) {
            move_options.push(castle_move);
        }
    } else if piece == Piece::Pawn(turn, false) && game_meta.en_passant != None {
        // does this piece have a valid en passant target?
        for pawn_move in piece.get_en_passant_moves(coord, game_meta.en_passant.unwrap()) {
            move_options.push(pawn_move);
        }
    }
    remove_invalid_moves(move_options, coord, &game_meta, &board)
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
    history_data: tauri::State<HistoryData>,
    queue: tauri::State<QueueHandler>,
) -> (MoveList, BoardState, GameMeta) {
    // acquire control of global data
    let mut selected = *clicked.0.lock().unwrap();
    let mut board = state.0.lock().unwrap();
    let mut game_meta = meta.0.lock().unwrap();
    let rx = queue.0.lock().unwrap();

    let coord = square_to_coord(square);
    let mut move_list: MoveList = Vec::new();
    let turn = turn_into_colour(game_meta.turn);

    if !game_meta.game_over {
        // only do this if we haven't ended the game already
        let contains_enemy = check_enemy(&turn, &board[coord.0][coord.1]);
        if selected == Option::None {
            // 1.if we have nothing selected and the new coordinate doesn't contain an enemy piece, select it!
            if !contains_enemy {
                move_list = board[coord.0][coord.1].get_moves(coord, &board);
                if board[coord.0][coord.1].is_king() == Some(turn) {
                    for castle_move in check_castling_moves(coord, &turn, &board) {
                        move_list.push(castle_move);
                    }
                };
                move_list = remove_invalid_moves(move_list.clone(), coord, &game_meta, &board);
                if move_list.is_empty() {
                    selected = Option::None;
                } else {
                    selected = Some(coord);
                }
            }
        } else if selected == Some(coord) {
            // 2. if we have clicked on the same square again, unselect it
            selected = Option::None;
        } else {
            println!("possible valid move, check");
            match valid_move(selected.unwrap(), coord, &board, &game_meta, &turn) {
                Some(move_type) => {
                    // 4. if we have clicked a valid move of selected, do move
                    println!("valid move");
                    let source = selected.unwrap();
                    let mover = board[source.0][source.1].clone().has_moved();
                    board[coord.0][coord.1] = Piece::None; // empty the destination square
                    board[source.0][source.1] = Piece::None; // take moving out of its square
                    board[coord.0][coord.1] = mover; // place moving in the new square
                    game_meta.en_passant = None; // clear any previous en passant target
                    match move_type {
                        crate::chess::types::MoveType::Castle => {
                            println!("need to move rook too");
                            let start_col = if coord.0 > 4 { 7 } else { 0 };
                            let dest_col = if coord.0 > 4 { 5 } else { 3 };
                            let row = coord.1;
                            let mover = board[start_col][row].clone().has_moved();
                            board[start_col][row] = Piece::None; // take castling rook out of its square
                            board[dest_col][row] = mover; // place castling rook in the new square
                        }
                        crate::chess::types::MoveType::EnPassant => {
                            println!("need to remove pawn too");
                            board[coord.0][source.1] = Piece::None;
                        }
                        crate::chess::types::MoveType::Double => {
                            println!("register an en passant target");
                            game_meta.en_passant = Some(coord);
                        }
                        _ => {
                            // normal move or capture
                            if mover.is_promotable_pawn(coord) {
                                game_meta.promotable_pawn = Some(coord);
                                rx.blocking_send(Payload {
                                    event: "promotion".to_owned(),
                                    payload: json!(coord).to_string(),
                                })
                                .unwrap();
                            }
                        }
                    }
                    if mover.is_king() == Some(turn) {
                        match turn {
                            Color::Black => {
                                game_meta.black_king.piece = mover;
                                game_meta.black_king.square = coord;
                            }
                            Color::White => {
                                game_meta.white_king.piece = mover;
                                game_meta.white_king.square = coord;
                            }
                        }
                    }
                    selected = Option::None;
                    // 5. update the meta only if something has changed
                    let mut history = history_data.0.lock().unwrap();
                    game_meta.new_turn(&mut board, &mut history);
                    println!("score history: {:?}", history.score);
                }
                None => {
                    // 6. select the new square as this isn't a valid move
                    selected = Some(coord);
                    move_list = board[coord.0][coord.1].get_moves(coord, &board);
                    move_list = remove_invalid_moves(move_list.clone(), coord, &game_meta, &board);
                    if move_list.is_empty() {
                        selected = Option::None;
                    }
                }
            }
        }
        *clicked.0.lock().unwrap() = selected;
    }
    (move_list, *board, *game_meta)
}

#[tauri::command]
/// User has selected a piece type for the promotion of a valid pawn
pub fn promote(
    choice: char,
    state: tauri::State<PieceLocation>,
    meta: tauri::State<GameMetaData>,
    queue: tauri::State<QueueHandler>,
) {
    let mut board = state.0.lock().unwrap();
    let mut game_meta = meta.0.lock().unwrap();
    let rx = queue.0.lock().unwrap();
    let colour = turn_into_colour(game_meta.turn + 1);
    let coord = game_meta.promotable_pawn.unwrap();
    game_meta.promotable_pawn = None;
    match choice {
        'Q' => board[coord.0][coord.1] = Piece::Queen(colour, false),
        'K' => board[coord.0][coord.1] = Piece::Knight(colour, false),
        'R' => board[coord.0][coord.1] = Piece::Rook(colour, false),
        'B' => board[coord.0][coord.1] = Piece::Bishop(colour, false),
        _ => panic!("unexpected piece type requested"),
    }
    rx.blocking_send(Payload {
        event: "board".to_owned(),
        payload: json!(*board).to_string(),
    })
    .unwrap()
}

#[tauri::command]
pub fn event_tester(queue: tauri::State<QueueHandler>) {
    let rx = queue.0.lock().unwrap();
    rx.blocking_send(Payload {
        event: "test".to_owned(),
        payload: "hello from Rust".to_owned(),
    })
    .unwrap();
}
