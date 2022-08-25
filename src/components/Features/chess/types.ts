import { CSSProperties } from 'react';
import { Square } from 'chess.js';

type PositionStyles = {
  [pos in Square]?: CSSProperties | undefined;
};
type BoardStateArray = string[][];
type Color = 'White' | 'Black';
type PieceType = 'Queen' | 'King' | 'Bishop' | 'Knight' | 'Rook' | 'Pawn';
type FirstMove = boolean;
type Check = boolean;
type CheckMate = boolean;
type RustPiece =
  | { Queen: [Color, FirstMove] }
  | { King: [Color, FirstMove, Check, CheckMate] }
  | { Bishop: [Color, FirstMove] }
  | { Knight: [Color, FirstMove] }
  | { Rook: [Color, FirstMove] }
  | { Pawn: [Color, FirstMove] };

export type MoveType = 'Move' | 'Capture' | 'Castle' | 'EnPassant' | 'Double';

type MoveList = [[number, number], MoveType][];

type MetaGame = {
  score: number;
  turn: number;
  game_over: boolean;
  en_passant: [number, number] | null;
  promotable_pawn: [number, number] | null;
  black_king: {
    piece: { King: [Color, FirstMove, Check, CheckMate] };
    square: [number, number];
  };
  white_king: {
    piece: { King: [Color, FirstMove, Check, CheckMate] };
    square: [number, number];
  };
};

export type {
  BoardStateArray,
  Color,
  PieceType,
  PositionStyles,
  RustPiece,
  MoveList,
  MetaGame,
};
