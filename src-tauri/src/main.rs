#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tauri::Manager;
// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

mod chess;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // listen to the `event-name` (emitted on any window)
            let id = app.listen_global("event-name", |event| {
                println!("got event-name with payload {:?}", event.payload());
            });
            // unlisten to the event using the `id` returned on the `listen_global` function
            // an `once_global` API is also exposed on the `App` struct
            app.unlisten(id);

            // emit the `event-name` event to all webview windows on the frontend
            app.emit_all(
                "event-name",
                Payload {
                    message: "Tauri is awesome!".into(),
                },
            )
            .unwrap();
            Ok(())
        })
        .manage(chess::data::PieceLocation(Default::default()))
        .manage(chess::data::GameMetaData(Default::default()))
        .manage(chess::data::SelectedSquare(Default::default()))
        .manage(chess::data::HistoryData(Default::default()))
        .invoke_handler(tauri::generate_handler![
            chess::board::new_game,
            chess::board::get_state,
            chess::board::get_score,
            chess::board::hover_square,
            chess::board::unhover_square,
            chess::board::drop_square,
            chess::board::click_square,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
