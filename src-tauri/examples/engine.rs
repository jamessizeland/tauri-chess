// use timecat::prelude::*;

// fn main() {
//     // Initialize a chess board with the default starting position.
//     let mut board = Board::default();

//     // Apply moves in standard algebraic notation.
//     board.push_san("e4").expect("Failed to make move: e4");
//     board.push_san("e5").expect("Failed to make move: e5");

//     // Evaluate the current board position using the inbuilt_nnue feature.
//     let evaluation = board.slow_evaluate();
//     println!("Current Evaluation: {}\n", evaluation);

//     // Initialize the engine with the current board state.
//     let mut engine = Engine::from_board(board);

//     // Configure the engine to search for the best move up to a depth of 10 plies.
//     let response = engine.search_depth_verbose(10);
//     let best_move = response.get_best_move().expect("No best move found");

//     // Output the best move found by the engine.
//     println!(
//         "\nBest Move: {}",
//         best_move
//             .san(engine.get_board())
//             .expect("Failed to generate SAN")
//     );
// }

use std::error::Error;
use timecat::prelude::*;

fn main() -> Result<(), Box<dyn Error>> {
    // Create the default engine initialized with the standard starting position.
    let mut runner: timecat::Timecat<timecat::CustomEngine<timecat::SearchController, Evaluator>> =
        timecat::TimecatBuilder::<Engine>::default().build();

    // List of UCI commands to be executed on the chess engine.
    let uci_commands = [
        // Checks if the engine is ready to receive commands.
        // UserCommand::IsReady,
        "isready",
        // Sets the move overhead option.
        // UserCommand::SetUCIOption {
        //     user_input: "name move overhead value 200".to_string(),
        // },
        "setoption name move overhead value 200",
        // Display the current state of the chess board.
        // UserCommand::DisplayBoard,
        "d",
        // Sets a new game position by applying the moves.
        // UserCommand::SetFen(STARTING_POSITION_FEN.to_string()),
        // UserCommand::PushMoves("e2e4 e7e5"),
        "position startpos moves e2e4 e7e5",
        // Instructs the engine to calculate the best move within 3000 milliseconds.
        // UserCommand::Go(SearchConfig::new_movetime(Duration::from_secs(3))),
        "go movetime 3000",
    ];

    // Process each UCI command and handle potential errors.
    for command in uci_commands {
        runner.run_uci_command(command)?;
    }

    Ok(())
}
