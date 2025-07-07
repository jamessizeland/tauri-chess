use std::{sync::mpsc, time::Duration};
use timecat::prelude::*;

pub struct EngineActor(mpsc::Sender<Message>);

pub enum Message {
    RequestMove { fen: String },
    SetMoveTime(Duration),
    PrintBoard,
}

impl EngineActor {
    /// Spawn an engine actor, which we can send requests to, and which will emit
    /// messages to the frontend.
    pub fn spawn(handle: tauri::AppHandle) -> Self {
        let (sender, receiver) = mpsc::channel::<Message>();

        std::thread::spawn(move || {
            let mut engine = Engine::from_fen(STARTING_POSITION_FEN).unwrap();
            engine.set_move_overhead(Duration::from_millis(200));
            let _ = engine.search_movetime(Duration::from_secs(3), false);
            let mut move_time = Duration::from_secs(3);
            while let Ok(event) = receiver.recv() {
                match event {
                    Message::SetMoveTime(duration) => move_time = duration,
                    Message::RequestMove { fen } => {
                        if let Err(err) = engine.set_fen(&fen) {
                            eprintln!("Failed to set FEN: {}", err);
                            continue;
                        }
                    }
                    Message::PrintBoard => todo!(),
                }
            }
        });
        Self(sender)
    }
}

fn get_best_move(engine: &mut Engine, fen: &str, time: Duration) -> Result<String, TimecatError> {
    engine.set_fen(fen)?;
    engine.set_move_overhead(Duration::from_millis(200));
    let info = engine.search_movetime(time, false);
    let response = engine.search_depth_quiet(10);
    // response
    //     .get_best_move()
    todo!()
}
