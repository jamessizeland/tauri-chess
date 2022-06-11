//! Chess pieces logic

#[derive(Clone, Copy)]
pub enum Color {
    Black,
    White,
}

#[derive(Clone, Copy)]
pub enum Piece {
    None,
    Pawn(Color),
    King(Color),
    Queen(Color),
    Bishop(Color),
    Knight(Color),
    Rook(Color),
}

// #[derive(Debug)] // include this line right before your struct definition
// pub struct Piece {
//     square: (char, u8),
// }
