import { Square } from 'chess.js';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { coordToSquare } from '../chess';
import { BoardSquare } from './BoardSquare';
import Notation from './Notation';
import type { ChessboardProps, Position } from './types';
import ChessPiece from './Piece';

/** Styling properties applied to the board element */
const basicBoardStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
};

/** Styling properties applied to each square element */
const squareStyle: CSSProperties = { width: '12.5%', height: '12.5%' };

const Board = ({
  orientation,
  showNotation,
  position,
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
  boardStyle,
  onPieceClick,
  onDragOverSquare,
  onDrop,
  onMouseOutSquare,
  onMouseOverSquare,
  onSquareClick,
  onSquareRightClick,
}: ChessboardProps): JSX.Element => {
  const squares = [];

  const hasPiece = (currentPosition: Position, square: Square): boolean =>
    currentPosition &&
    Object.keys(currentPosition) &&
    Object.keys(currentPosition).includes(square);

  /** Render the board square appropriate for the coordinate given */
  function renderSquare(row: number, col: number) {
    const square = coordToSquare(row, col);
    return (
      <div key={`${row}${col}`} style={squareStyle}>
        <BoardSquare
          row={row}
          col={col}
          orientation={orientation}
          lightSquareStyle={lightSquareStyle}
          darkSquareStyle={darkSquareStyle}
          onDragOverSquare={onDragOverSquare}
          onSquareClick={onSquareClick}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={onMouseOutSquare}
        >
          {showNotation && (
            <Notation
              col={col}
              row={row}
              width={560}
              key={`${row}${col}`}
              orientation="white"
            />
          )}
          {hasPiece(position, square) && (
            <ChessPiece
              width={560}
              square={square}
              onPieceClick={onPieceClick}
              id={`${row}${col}${position[square]}`}
              piece={position[square]}
            />
          )}
        </BoardSquare>
      </div>
    );
  }
  for (let row = 0; row <= 7; row++) {
    for (let col = 0; col <= 7; col++) {
      squares.push(renderSquare(7 - row, col));
    }
  }
  console.log(squares.length);
  console.log(squares);
  const rotate = orientation === 'black' ? 'rotate-180' : '';
  return (
    <div
      style={{ ...boardStyle, ...basicBoardStyle }}
      className={clsx(rotate, 'transition-transform duration-1000')}
    >
      {squares}
    </div>
  );
};

export default Board;
