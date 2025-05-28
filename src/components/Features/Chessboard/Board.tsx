import { cn } from 'utils';
import type { CSSProperties } from 'react';
import { coordToSquare } from '../chess';
import { BoardSquare } from './BoardSquare';
import Notation from './Notation';
import type { ChessboardProps, Position, Square } from 'types';
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

const Board: React.FC<ChessboardProps> = ({
  orientation,
  showNotation,
  position,
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
  boardStyle,
  onPieceClick,
  onDragOverSquare,
  // onDrop,
  // onSquareRightClick,
  // width,
  onMouseOutSquare,
  onMouseOverSquare,
  onSquareClick,
  squareStyles,
}) => {
  const squares = [];

  const hasPiece = (currentPosition: Position, square: Square): boolean =>
    currentPosition &&
    Object.keys(currentPosition) &&
    Object.keys(currentPosition).includes(square);

  /** Render the board square appropriate for the coordinate given */
  function renderSquare(col: number, row: number) {
    const square = coordToSquare(col, row);
    return (
      <div key={`${col}${row}`} style={squareStyle}>
        <BoardSquare
          col={col}
          row={row}
          orientation={orientation}
          lightSquareStyle={lightSquareStyle}
          darkSquareStyle={darkSquareStyle}
          onDragOverSquare={onDragOverSquare}
          onSquareClick={onSquareClick}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={onMouseOutSquare}
          customSquareStyle={squareStyles && squareStyles[square]}
        >
          {showNotation && (
            <Notation
              col={col}
              row={row}
              width={560}
              key={`${col}${row}`}
              orientation={orientation}
            />
          )}
          {hasPiece(position, square) && (
            <ChessPiece
              orientation={orientation}
              width={560}
              square={square}
              onPieceClick={onPieceClick}
              id={`${col}${row}${position[square]}`}
              piece={position[square]}
            />
          )}
        </BoardSquare>
      </div>
    );
  }
  for (let row = 0; row <= 7; row++) {
    for (let col = 0; col <= 7; col++) {
      squares.push(renderSquare(col, 7 - row));
    }
  }
  const rotate = orientation === 'black' ? 'rotate-180' : '';
  return (
    <div style={{ ...boardStyle, ...basicBoardStyle }} className={cn(rotate)}>
      {squares}
    </div>
  );
};

export default Board;
