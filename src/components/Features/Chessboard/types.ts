import { CSSProperties } from 'react';
import { Square } from 'chess.js';

export type Orientation = 'white' | 'black';

export type FENpiece =
  | 'p'
  | 'r'
  | 'n'
  | 'b'
  | 'k'
  | 'q'
  | 'P'
  | 'R'
  | 'N'
  | 'B'
  | 'K'
  | 'Q';

export type Piece =
  | 'wP'
  | 'wN'
  | 'wB'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bN'
  | 'bB'
  | 'bR'
  | 'bQ'
  | 'bK';

export type Position = {
  [pos in Square]?: Piece;
};

export type CustomPieces = {
  [piece in Piece]?: (obj: {
    isDragging: boolean;
    squareWidth: number;
    droppedPiece: Piece;
    targetSquare: Square;
    sourceSquare: Square;
  }) => JSX.Element;
};

export interface Props {
  allowDrag?: (obj: { piece: Piece; sourceSquare: Square }) => boolean;
  boardStyle?: CSSProperties;
  calcWidth?: (obj: { screenWidth: number; screenHeight: number }) => number;
  darkSquareStyle?: CSSProperties;
  draggable?: boolean;
  dropOffBoard?: 'snapback' | 'trash';
  dropSquareStyle?: CSSProperties;
  getPosition?: (currentPosition: Position) => void;
  id?: string | number;
  lightSquareStyle?: CSSProperties;
  onDragOverSquare?: (square: Square) => void;
  onDrop?: (obj: {
    sourceSquare: Square;
    targetSquare: Square;
    piece: Piece;
  }) => void;
  onMouseOutSquare?: (square: Square) => void;
  onMouseOverSquare?: (square: Square) => void;
  onPieceClick?: (piece: Piece) => void;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  orientation?: 'white' | 'black';
  pieces?: CustomPieces;
  position?: string | Position;
  roughSquare?: (obj: {
    squareElement: SVGElement;
    squareWidth: number;
  }) => void;
  showNotation?: boolean;
  sparePieces?: boolean;
  squareStyles?: { [square in Square]?: CSSProperties };
  transitionDuration?: number;
  width?: number;
  undo?: boolean;
}
