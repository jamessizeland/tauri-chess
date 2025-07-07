use crate::chess::{
    board::BoardState,
    engine::EngineActor,
    types::{Color, GameMeta, Hist, Piece, Square},
    utils::coord_to_square,
};
use std::sync::Mutex;

pub struct AppContext {
    /// Game state 8x8 board, filled with empty space or Pieces.
    pub board: Mutex<BoardState>,
    /// Track which square has been selected in the UI.
    pub selected: Mutex<Option<Square>>,
    /// All persistent metadata for the game.
    pub meta_data: Mutex<GameMeta>,
    /// Game move history.
    pub history: Mutex<Hist>,
    /// Mailbox to send requests to the chess engine.
    pub engine: EngineActor,
}

impl AppContext {
    pub fn new(handle: tauri::AppHandle) -> Self {
        Self {
            board: Default::default(),
            selected: Default::default(),
            meta_data: Default::default(),
            history: Default::default(),
            engine: EngineActor::spawn(handle),
        }
    }
}

pub fn state_to_fen(board: &BoardState, meta_data: &GameMeta) -> String {
    let mut fen = board.to_fen_string();
    fen.push(' ');
    // Add who's turn it is
    fen.push(if meta_data.turn % 2 == 0 {
        'w' // white's turn
    } else {
        'b' // black's turn
    });
    fen.push(' ');
    // Add castling rights
    let wk = board.get((4, 0));
    if matches!(wk, Piece::King(Color::White, true, false, false)) {
        // king is valid
        let king_side = board.get((7, 0));
        if matches!(king_side, Piece::Rook(Color::White, true)) {
            fen.push('K');
        }
        let queen_side = board.get((0, 0));
        if matches!(queen_side, Piece::Rook(Color::White, true)) {
            fen.push('Q');
        }
    };
    let bk = board.get((4, 7));
    if matches!(bk, Piece::King(Color::Black, true, false, false)) {
        // king is valid
        let king_side = board.get((7, 7));
        if matches!(king_side, Piece::Rook(Color::Black, true)) {
            fen.push('k');
        }
        let queen_side = board.get((0, 7));
        if matches!(queen_side, Piece::Rook(Color::Black, true)) {
            fen.push('q');
        }
    };
    fen.push(' ');
    // Add en passant info
    if let Some(coord) = meta_data.en_passant {
        fen.push_str(&coord_to_square(coord).expect("only real coords"));
    } else {
        fen.push('-');
    };
    fen.push(' ');
    fen.push_str(&meta_data.half_move_count.to_string());
    fen.push(' ');
    fen.push_str(&(meta_data.turn + 1).to_string());
    fen
}

#[cfg(test)]
mod test {
    use crate::chess::{board::BoardState, data::state_to_fen, types::GameMeta};

    #[test]
    fn test_state_to_fen() {
        let board = BoardState::new();
        let mut meta_data = GameMeta::default();
        meta_data.new_game();
        let fen = state_to_fen(&board, &meta_data);
        assert_eq!(
            fen,
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        )
    }
}
