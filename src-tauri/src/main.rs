#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chess::data::queue_handler;
use chess::data::Payload;
use tauri::{async_runtime::channel, Manager};

use std::{sync::Mutex, thread}; // mutual exclusion wrapper

mod chess;

fn main() {
    let (tx, mut rx) = channel::<Payload>(5);
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let _handle = thread::spawn(move || {
                println!("spawning a new thread to handle unprompted events from Rust to the UI");
                loop {
                    queue_handler(&window, &mut rx);
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
            chess::board::new_game,
            chess::board::get_state,
            chess::board::get_score,
            chess::board::hover_square,
            chess::board::unhover_square,
            chess::board::drop_square,
            chess::board::click_square,
            chess::board::promote,
            chess::board::event_tester,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
