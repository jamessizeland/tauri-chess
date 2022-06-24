mod moves;
mod pieces;

/// Logic for the chess board actions
pub mod board {
    use super::pieces::{Color, GetState, MoveList, Piece, Square};
    use std::sync::Mutex; // mutual exclusion wrapper

    pub type BoardState = [[Piece; 8]; 8];

    /// game move history, stored as FEN strings
    // pub struct History(Vec<i32>);
    /// game score stored relative to white
    pub struct Score(pub Mutex<i32>);

    /// game state 8x8 board
    pub struct PieceLocation(pub Mutex<BoardState>);

    /// Convert letters a-h to a row index from a standard chessboard
    fn letter_to_row(letter: char) -> usize {
        match letter {
            'a' => 0,
            'b' => 1,
            'c' => 2,
            'd' => 3,
            'e' => 4,
            'f' => 5,
            'g' => 6,
            'h' => 7,
            _ => panic!(),
        }
    }

    // fn row_to_letter(row: usize) -> char {
    //     match row {
    //         0 => 'a',
    //         1 => 'b',
    //         2 => 'c',
    //         3 => 'd',
    //         4 => 'e',
    //         5 => 'f',
    //         6 => 'g',
    //         7 => 'h',
    //         _ => panic!(),
    //     }
    // }

    #[tauri::command]
    /// Initialize a new game by sending a starting set of coords
    pub fn new_game(state: tauri::State<PieceLocation>) -> BoardState {
        // Lock the counter(Mutex) to get the current value
        let mut game = state.0.lock().expect("state access error");
        // set up white pieces
        game[0][0] = Piece::Rook(Color::White, true);
        game[1][0] = Piece::Bishop(Color::White, true);
        game[2][0] = Piece::Knight(Color::White, true);
        game[3][0] = Piece::Queen(Color::White, true);
        game[4][0] = Piece::King(Color::White, true, false, false);
        game[5][0] = Piece::Knight(Color::White, true);
        game[6][0] = Piece::Bishop(Color::White, true);
        game[7][0] = Piece::Rook(Color::White, true);
        game[0][1] = Piece::Pawn(Color::White, true);
        game[1][1] = Piece::Pawn(Color::White, true);
        game[2][1] = Piece::Pawn(Color::White, true);
        game[3][1] = Piece::Pawn(Color::White, true);
        game[4][1] = Piece::Pawn(Color::White, true);
        game[5][1] = Piece::Pawn(Color::White, true);
        game[6][1] = Piece::Pawn(Color::White, true);
        game[7][1] = Piece::Pawn(Color::White, true);
        // set up black pieces
        game[0][7] = Piece::Rook(Color::Black, true);
        game[1][7] = Piece::Bishop(Color::Black, true);
        game[2][7] = Piece::Knight(Color::Black, true);
        game[3][7] = Piece::Queen(Color::Black, true);
        game[4][7] = Piece::King(Color::Black, true, false, false);
        game[5][7] = Piece::Knight(Color::Black, true);
        game[6][7] = Piece::Bishop(Color::Black, true);
        game[7][7] = Piece::Rook(Color::Black, true);
        game[0][6] = Piece::Pawn(Color::Black, true);
        game[1][6] = Piece::Pawn(Color::Black, true);
        game[2][6] = Piece::Pawn(Color::Black, true);
        game[3][6] = Piece::Pawn(Color::Black, true);
        game[4][6] = Piece::Pawn(Color::Black, true);
        game[5][6] = Piece::Pawn(Color::Black, true);
        game[6][6] = Piece::Pawn(Color::Black, true);
        game[7][6] = Piece::Pawn(Color::Black, true);
        // debug
        game[1][2] = Piece::Pawn(Color::Black, true);
        game[3][2] = Piece::Pawn(Color::Black, true);
        game[1][5] = Piece::Pawn(Color::White, true);
        game[3][5] = Piece::Pawn(Color::White, true);
        *game // return dereferenced game state to frontend
    }

    #[tauri::command]
    pub fn get_state(state: tauri::State<PieceLocation>) -> BoardState {
        let game = state.0.lock().expect("game state access");
        *game
    }
    #[tauri::command]
    pub fn get_score(state: tauri::State<Score>) -> i32 {
        let score = state.0.lock().expect("score state access");
        *score
    }

    #[tauri::command]
    /// Highlight available moves for the piece occupying this square
    pub fn hover_square<'a>(square: &'a str, state: tauri::State<PieceLocation>) -> MoveList {
        let game = state.0.lock().expect("game state access");
        let sq_vec: Vec<char> = square.chars().collect();
        let coord: Square = (
            letter_to_row(sq_vec[0]),
            (sq_vec[1].to_digit(10).unwrap() - 1) as usize,
        );
        dbg!(&coord, &square);
        game[coord.0][coord.1].get_moves(coord, *game)
        // let mut highlights = Vec::new();
        // highlights.push(square);
        // highlights
    }

    #[tauri::command]
    /// Remove any highlighting for square just left
    pub fn unhover_square(_square: &str) -> bool {
        true
    }

    #[tauri::command]
    /// Perform the boardstate change associated with a chess piece being moved
    pub fn drop_square(source_square: &str, target_square: &str, piece: &str) {
        dbg!(source_square, target_square, piece);
    }
}
