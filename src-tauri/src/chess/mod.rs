pub mod board;
mod moves;
mod pieces;
mod types;
mod unit_tests;
mod utils;

/// Chess logic crate
pub mod data {
    use std::sync::Mutex; // mutual exclusion wrapper

    // the payload type must implement `Serialize` and `Clone`.
    #[derive(Clone, serde::Serialize, Debug)]
    pub struct Payload {
        pub event: String,
        pub payload: String,
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
