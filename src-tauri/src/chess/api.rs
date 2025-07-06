//! Logic for the chess board actions

use super::{
    board::BoardState,
    data::AppContext,
    moves::check_castling_moves,
    types::{Color, GameMeta, MoveList, MoveType, Piece, Square},
    utils::{check_enemy, remove_invalid_moves, square_to_coord, turn_into_colour, valid_move},
};
use anyhow::anyhow;
use tauri::{Emitter, Result};

#[tauri::command]
/// Get the location of all pieces from global memory
pub fn get_state(state: tauri::State<AppContext>) -> BoardState {
    let board = state.board.lock().expect("board state access");
    board.clone()
}

#[tauri::command]
/// Get the game score from global memory
pub fn get_score(state: tauri::State<AppContext>) -> GameMeta {
    let meta_game = state.meta_data.lock().expect("game state access");
    *meta_game
}

#[tauri::command]
/// Initialize a new game by sending a starting set of coords
pub fn new_game(state: tauri::State<AppContext>) -> BoardState {
    // Lock the counter(Mutex) to get the current value
    let mut board = state.board.lock().expect("board state access");
    let mut game_meta = state.meta_data.lock().expect("game state access");
    let mut history = state.history.lock().expect("game history access");
    *history = Default::default();
    // reset game meta data
    game_meta.new_game();
    // reset board to empty
    *board = BoardState::new();

    board.clone() // return dereferenced board state to frontend
}

#[tauri::command]
/// Highlight available moves for the piece occupying this square
pub fn hover_square(square: &str, state: tauri::State<AppContext>) -> Result<MoveList> {
    let board = state.board.lock().expect("board state access");
    let game_meta = state.meta_data.lock().expect("game state access");
    let selected = *state.selected.lock().expect("selected square access");
    let mut coord: Square = square_to_coord(square)?;
    println!("hovering over square {:?}", coord);
    let turn = turn_into_colour(game_meta.turn);
    if let Some(square) = selected {
        coord = square;
    }
    let piece = board.get(coord);
    let mut move_options = piece.get_moves(coord, &board);
    if piece.is_king(turn) {
        for castle_move in check_castling_moves(coord, turn, &board) {
            move_options.push(castle_move);
        }
    } else if piece == Piece::Pawn(turn, false) {
        if let Some(en_passant) = game_meta.en_passant {
            // does this piece have a valid en passant target?
            for pawn_move in piece.get_en_passant_moves(coord, en_passant) {
                move_options.push(pawn_move);
            }
        }
    }
    move_options = remove_invalid_moves(move_options, coord, &game_meta, &board);
    Ok(move_options)
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
    state: tauri::State<AppContext>,
    app: tauri::AppHandle,
) -> Result<(MoveList, BoardState, GameMeta)> {
    // acquire control of global data
    let mut board = state.board.lock().expect("board state access");
    let mut game_meta = state.meta_data.lock().expect("game state access");
    let mut selected = *state.selected.lock().expect("selected square access");

    let mut move_list = MoveList::new();
    if game_meta.game_over {
        // game over, do nothing
        return Ok((move_list, board.clone(), *game_meta));
    }
    let coord = square_to_coord(square)?;
    let turn = turn_into_colour(game_meta.turn);
    let piece = board.get(coord);
    let contains_enemy = check_enemy(turn, &piece);
    if selected.is_none() {
        // 1.if we have nothing selected and the new coordinate doesn't contain an enemy piece, select it!
        if !contains_enemy {
            move_list = piece.get_moves(coord, &board);
            if piece.is_king(turn) {
                for castle_move in check_castling_moves(coord, turn, &board) {
                    move_list.push(castle_move);
                }
            } else if piece == Piece::Pawn(turn, false) {
                if let Some(en_passant) = game_meta.en_passant {
                    // does this piece have a valid en passant target?
                    for pawn_move in piece.get_en_passant_moves(coord, en_passant) {
                        move_list.push(pawn_move);
                    }
                }
            };
            move_list = remove_invalid_moves(move_list, coord, &game_meta, &board);
            selected = if move_list.is_empty() {
                None
            } else {
                Some(coord)
            }
        }
    } else if selected == Some(coord) {
        // 2. if we have clicked on the same square again, unselect it
        selected = None;
    } else {
        println!("possible valid move, check");
        match valid_move(selected.unwrap(), coord, &board, &game_meta, turn) {
            Some(move_type) => {
                // 4. if we have clicked a valid move of selected, do move
                println!("valid move");
                let source = selected.unwrap();
                let mover = board.get(source).has_moved();
                board.set(coord, Piece::None); // empty the destination square
                board.set(source, Piece::None); // take moving out of its square
                board.set(coord, mover); // place moving in the new square
                game_meta.en_passant = None; // clear any previous en passant target
                match move_type {
                    MoveType::Castle => {
                        println!("need to move rook too");
                        let start_col = if coord.0 > 4 { 7 } else { 0 };
                        let dest_col = if coord.0 > 4 { 5 } else { 3 };
                        let row = coord.1;
                        let mover = board.get((start_col, row)).has_moved();
                        board.set((start_col, row), Piece::None); // take castling rook out of its square
                        board.set((dest_col, row), mover); // place castling rook in the new square
                    }
                    MoveType::EnPassant => {
                        println!("need to remove pawn too");
                        board.set((coord.0, source.1), Piece::None);
                    }
                    MoveType::Double => {
                        println!("register an en passant target");
                        game_meta.en_passant = Some(coord);
                    }
                    _ => {
                        // normal move or capture
                        if mover.is_promotable_pawn(coord) {
                            game_meta.promotable_pawn = Some(coord);
                            app.emit("promotion", &coord)?;
                        }
                    }
                }
                if mover.is_king(turn) {
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
                selected = None;
                // 5. update the meta only if something has changed
                let mut history = state.history.lock().expect("game history access");
                game_meta.new_turn(&mut board, &mut history);
                println!("score history: {:?}", history.score);
            }
            None => {
                // 6. select the new square as this isn't a valid move
                selected = Some(coord);
                move_list = board.get(coord).get_moves(coord, &board);
                move_list = remove_invalid_moves(move_list, coord, &game_meta, &board);
                if move_list.is_empty() {
                    selected = None;
                }
            }
        }
    }
    *state.selected.lock().expect("clicked square access") = selected;
    Ok((move_list, board.to_owned(), game_meta.to_owned()))
}

#[tauri::command]
/// User has selected a piece type for the promotion of a valid pawn
pub fn promote(choice: char, state: tauri::State<AppContext>, app: tauri::AppHandle) -> Result<()> {
    let mut game_meta = state.meta_data.lock().expect("game state access");
    let colour = turn_into_colour(game_meta.turn + 1);
    if let Some(coord) = game_meta.promotable_pawn {
        let mut board = state.board.lock().expect("board state access");
        game_meta.promotable_pawn = None;
        let promotion = match choice {
            'Q' => Piece::Queen(colour, false),
            'K' => Piece::Knight(colour, false),
            'R' => Piece::Rook(colour, false),
            'B' => Piece::Bishop(colour, false),
            _ => return Err(anyhow!("invalid promotion choice"))?,
        };
        board.set(coord, promotion);
        app.emit("board", &*board)?;
    };
    Ok(())
}
