use super::types;
use crate::chess::types::BoardState;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{async_runtime::Receiver, Emitter as _, WebviewWindow}; // mutual exclusion wrapper

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Message {
    pub event: &'static str,
    pub payload: String,
}
impl Message {
    pub fn new<T: Serialize>(event: &'static str, payload: &T) -> Result<Self> {
        Ok(Self {
            event,
            payload: serde_json::to_string(payload)?,
        })
    }
}

/// Handler event data from Rust -> Frontend
pub fn queue_handler(window: &WebviewWindow, rx: &mut Receiver<Message>) -> Result<()> {
    if let Some(res) = rx.blocking_recv() {
        match res.event {
            "board" => {
                let board: BoardState = serde_json::from_str(&res.payload)?;
                window.emit("board", board)?;
            }
            other => {
                println!("{}, {}", other, res.payload);
                window.emit(other, res.payload)?;
            }
        }
    }
    Ok(())
}

/// game move history
pub type HistoryData = Mutex<types::Hist>;

/// Game state 8x8 board, filled with empty space or Pieces
pub type PieceLocation = Mutex<types::BoardState>;

/// Track which square has been selected in the UI
pub type SelectedSquare = Mutex<Option<types::Square>>;

/// Game score stored relative to white
pub type GameMetaData = Mutex<types::GameMeta>;
/// queue handler
pub type QueueHandler = Mutex<tauri::async_runtime::Sender<Message>>;
