import { CSSProperties } from 'react';

// prettier-ignore
export type Square = 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' 
                   | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' 
                   | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' 
                   | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' 
                   | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' 
                   | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' 
                   | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' 
                   | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1';

export type Orientation = 'white' | 'black';

// prettier-ignore
export type FENpiece = 'p' | 'r' | 'n' | 'b' | 'k' | 'q' | 'P' | 'R' | 'N' | 'B' | 'K' | 'Q';

// prettier-ignore
export type Piece = 'wP' | 'wN' | 'wB' | 'wR' | 'wQ' | 'wK' | 'bP' | 'bN' | 'bB' | 'bR' | 'bQ' | 'bK';

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

export interface ChessboardProps {
  /** classes to apply to the board */
  className?: string;
  /**
   * A function to call when a piece drag is initiated.  Returns true if the piece is draggable,
   * false if not.
   *
   * Signature: function( { piece: string, sourceSquare: string } ) => bool
   */
  allowDrag?: (obj: { piece: Piece; sourceSquare: Square }) => boolean;
  /**
   * The style object for the board.
   */
  boardStyle?: CSSProperties;
  /**
   * A function for responsive size control, returns the width of the board.
   *
   * Signature: function({ screenWidth: number, screenHeight: number }) => number
   */
  calcWidth?: (obj: { screenWidth: number; screenHeight: number }) => number;
  /**
   * The style object for the dark square.
   */
  darkSquareStyle?: CSSProperties;
  /**
   * If false, the pieces will not be draggable
   */
  draggable?: boolean;
  /**
   * The behavior of the piece when dropped off the board. 'snapback' brings the piece
   * back to it's original square and 'trash' deletes the piece from the board
   */
  dropOffBoard?: 'snapback' | 'trash';
  /**
   * The style object for the current drop square. { backgroundColor: 'sienna' }
   */
  dropSquareStyle?: CSSProperties;
  /**
   * A function that gives access to the current position object.
   * For example, getPosition = position => this.setState({ myPosition: position }).
   *
   * Signature: function(currentPosition: object) => void
   */
  getPosition?: (currentPosition: Position) => void;
  /**
   * The id prop is necessary if more than one board is mounted.
   * Drag and drop will not work as expected if not provided.
   */
  id?: string | number;
  /**
   * The style object for the light square.
   */
  lightSquareStyle?: CSSProperties;
  /**
   * A function to call when a piece is dragged over a specific square.
   *
   * Signature: function(square: string) => void
   */
  onDragOverSquare?: (square: Square) => void;
  /**
   * The logic to be performed on piece drop. See chessboardjsx.com/integrations for examples.
   *
   * Signature: function({ sourceSquare: string, targetSquare: string, piece: string }) => void
   */
  onDrop?: (obj: {
    sourceSquare: Square;
    targetSquare: Square;
    piece: Piece;
  }) => void;
  /**
   * A function to call when the mouse has left the square.
   * See chessboardjsx.com/integrations/move-validation for an example.
   *
   * Signature: function(square: string) => void
   */
  onMouseOutSquare?: (square: Square) => void;
  /**
   *  A function to call when the mouse is over a square.
   *  See chessboardjsx.com/integrations/move-validation for an example.
   *
   *  Signature: function(square: string) => void
   */
  onMouseOverSquare?: (square: Square) => void;
  /**
   * A function to call when a piece is clicked.
   *
   * Signature: function(piece: string) => void
   */
  onPieceClick?: (piece: Piece) => void;
  /**
   * A function to call when a square is clicked.
   *
   * Signature: function(square: string) => void
   */
  onSquareClick?: (square: Square) => void;
  /**
   * A function to call when a square is right clicked.
   *
   * Signature: function(square: string) => void
   */
  onSquareRightClick?: (square: Square) => void;
  /**
   * Orientation of the board.
   */
  orientation?: 'white' | 'black';
  /**
   * An object with functions returning jsx as values(render prop).
   * See https://www.chessboardjsx.com/custom
   * Signature: { wK:
   * function({ isDragging, squareWidth, droppedPiece, targetSquare, sourceSquare }) => jsx }
   */
  pieces?: CustomPieces;
  /**
   * The position to display on the board.
   */
  position: Position;
  /**
   * A function that gives access to the underlying square element.  It
   * allows for customizations with rough.js. See chessboardjsx.com/custom for an
   * example.
   *
   * Signature: function({ squareElement: node, squareWidth: number }) => void
   */
  roughSquare?: (obj: {
    squareElement: SVGElement;
    squareWidth: number;
  }) => void;
  /**
   * If false, notation will not be shown on the board.
   */
  showNotation?: boolean;
  /**
   * If true, spare pieces will appear above and below the board.
   */
  sparePieces?: boolean;
  /**
   * An object containing custom styles for squares.  For example {'e4': {backgroundColor: 'orange'},
   * 'd4': {backgroundColor: 'blue'}}.  See chessboardjsx.com/integrations/move-validation for an example
   */
  squareStyles?: { [square in Square]?: CSSProperties };
  /**
   * The time it takes for a piece to slide to the target square.  Only used
   * when the next position comes from the position prop. See chessboardjsx.com/integrations/random for an example
   */
  transitionDuration?: number;
  /**
   * The width in pixels.  For a responsive width, use calcWidth.
   */
  width?: number;
  /**
   * When set to true it undos previous move
   */
  undo?: boolean;
}
