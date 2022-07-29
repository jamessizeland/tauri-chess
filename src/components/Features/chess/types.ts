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

type MoveList = [[number, number], boolean][];

type MetaGame = {
  score: number;
  turn: number;
  black_king: [[Color, FirstMove, Check, CheckMate], [number, number]];
  white_king: [[Color, FirstMove, Check, CheckMate], [number, number]];
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
