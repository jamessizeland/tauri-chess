#[tauri::command]
/// Get the version of the Cargo package
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
