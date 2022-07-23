import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { BoardSquare } from './BoardSquare';
import Notation from './Notation';
import type { ChessboardProps } from './types';

/** Styling properties applied to the board element */
const boardStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
};

/** Styling properties applied to each square element */
const squareStyle: CSSProperties = { width: '12.5%', height: '12.5%' };

const Board = ({ orientation, showNotation }: ChessboardProps): JSX.Element => {
  const squares = [];
  /** Render the board square appropriate for the coordinate given */
  function renderSquare(row: number, col: number) {
    // const x = 8 - (i % 8);
    // const y = Math.floor(i / 8);
    return (
      <div key={`${row}${col}`} style={squareStyle}>
        <BoardSquare x={row} y={col} orientation={orientation}>
          {showNotation && (
            <Notation
              col={col}
              row={row}
              width={560}
              key={`${row}${col}`}
              orientation="white"
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
      style={boardStyle}
      className={clsx(rotate, 'transition-transform duration-1000')}
    >
      {squares}
    </div>
  );
};

export default Board;
