pub mod api;
mod moves;
mod pieces;
mod types;
mod unit_tests;
mod utils;

/// Chess logic crate
pub mod data {
    use crate::chess::types::BoardState;
    use std::sync::Mutex;
    use tauri::{async_runtime::Receiver, Window}; // mutual exclusion wrapper

    // the payload type must implement `Serialize` and `Clone`.
    #[derive(Clone, serde::Serialize, Debug)]
    pub struct Payload {
        pub event: String,
        pub payload: String,
    }

    /// Handler event data from Rust -> Frontend
    pub fn queue_handler(window: &Window, rx: &mut Receiver<Payload>) {
        let payload = rx.blocking_recv().unwrap();
        if payload.event == "board" {
            let board: BoardState = serde_json::from_str(&payload.payload).unwrap();
            window.emit(&payload.event, board).unwrap();
        } else {
            println!("{}, {}", payload.event, payload.payload);
            window.emit(&payload.event, payload.payload).unwrap();
        }
    }

    /// game move history
    pub struct HistoryData(pub Mutex<super::types::Hist>);

    /// Game state 8x8 board, filled with empty space or Pieces
    pub struct PieceLocation(pub Mutex<super::types::BoardState>);

    /// Track which square has been selected in the UI
    pub struct SelectedSquare(pub Mutex<Option<super::types::Square>>);

    /// Game score stored relative to white
    pub struct GameMetaData(pub Mutex<super::types::GameMeta>);
    /// queue handler
    pub struct QueueHandler(pub Mutex<tauri::async_runtime::Sender<Payload>>);
}
