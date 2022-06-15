#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use app::chess::board::*;

fn main() {
    tauri::Builder::default()
        .manage(PieceLocation(Default::default()))
        .invoke_handler(tauri::generate_handler![
            new_game,
            get_state,
            hover_square,
            unhover_square,
            drop_square,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
