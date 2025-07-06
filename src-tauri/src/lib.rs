// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod chess;

use crate::chess::data::AppContext;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppContext::default())
        .invoke_handler(tauri::generate_handler![
            chess::api::new_game,
            chess::api::get_state,
            chess::api::get_score,
            chess::api::hover_square,
            chess::api::unhover_square,
            chess::api::drop_square,
            chess::api::click_square,
            chess::api::promote,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
