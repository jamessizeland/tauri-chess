# Tauri Chess App

Experiment with tauri passing data from rust to javascript, by creating a chess app where all of the logic is done in Rust and just the frontend is done in TypeScript React.

## Getting Started

Check prerequisites:

- <https://v2.tauri.app/start/prerequisites/>
- <https://bun.sh/docs/installation>

1. `git clone https://github.com/jamessizeland/tauri-chess.git`
2. `cd tauri-chess`
3. `bun install`
4. `bun run tauri dev`

## UI Basics

![Chess UI](./img/move_logic2.gif)

## Moves

![Chess Moves](./img/take_logic.gif)

## Turns

![Chess Turns](./img/turns_logic.gif)

## Checking

![Check and Mate](./img/check_mate_logic.gif)

## Special Moves

### Enpassant, Promoting & Castling

![Enpassand Promoting and Castling](./img/enpassant-promote-castle.gif)

---

## Mobile Support

Set up to run on Android too.

`bun run tauri android dev`

![android](./img/tauri-chess-android.gif)
