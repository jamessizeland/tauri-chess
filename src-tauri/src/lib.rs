// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod chess;

use anyhow::Context;
use chess::data::{queue_handler, Message};
use std::thread;
use tauri::{async_runtime::channel, Manager, Result};

#[tauri::command]
fn event_tester(queue: tauri::State<chess::data::QueueHandler>) -> Result<()> {
    let rx = queue.lock().expect("failed to lock queue");
    rx.blocking_send(Message::new("test", &"hello from Rust")?)
        .context("failed to send event")?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let (sender, mut receiver) = channel::<Message>(5);
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app
                .get_webview_window("main")
                .ok_or_else(|| anyhow::anyhow!("Failed to get the window"))?;
            thread::spawn(move || {
                println!("spawning a new thread to handle unprompted events from Rust to the UI");
                loop {
                    if let Err(error) = queue_handler(&window, &mut receiver) {
                        eprintln!("error while handling queue: {:?}", error);
                        break;
                    }
                }
            });
            Ok(())
        })
        .manage(chess::data::PieceLocation::default())
        .manage(chess::data::GameMetaData::default())
        .manage(chess::data::SelectedSquare::default())
        .manage(chess::data::HistoryData::default())
        .manage(chess::data::QueueHandler::new(sender))
        .invoke_handler(tauri::generate_handler![
            chess::api::new_game,
            chess::api::get_state,
            chess::api::get_score,
            chess::api::hover_square,
            chess::api::unhover_square,
            chess::api::drop_square,
            chess::api::click_square,
            chess::api::promote,
            event_tester,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
