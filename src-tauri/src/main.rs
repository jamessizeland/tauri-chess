#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod chess;

use chess::data::{queue_handler, Payload};
use std::{sync::Mutex, thread};
use tauri::{async_runtime::channel, Manager};

fn main() -> Result<(), anyhow::Error> {
    let (tx, mut rx) = channel::<Payload>(5);
    tauri::Builder::default()
        .setup(|app| {
            let window = app
                .get_window("main")
                .ok_or_else(|| anyhow::anyhow!("Failed to get the window"))?;
            thread::spawn(move || {
                println!("spawning a new thread to handle unprompted events from Rust to the UI");
                loop {
                    if let Err(error) = queue_handler(&window, &mut rx) {
                        break eprintln!("error while handling queue: {:?}", error);
                    }
                }
            });
            Ok(())
        })
        .manage(chess::data::PieceLocation(Default::default()))
        .manage(chess::data::GameMetaData(Default::default()))
        .manage(chess::data::SelectedSquare(Default::default()))
        .manage(chess::data::HistoryData(Default::default()))
        .manage(chess::data::QueueHandler(Mutex::new(tx)))
        .invoke_handler(tauri::generate_handler![
            chess::api::new_game,
            chess::api::get_state,
            chess::api::get_score,
            chess::api::hover_square,
            chess::api::unhover_square,
            chess::api::drop_square,
            chess::api::click_square,
            chess::api::promote,
            chess::api::event_tester,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
