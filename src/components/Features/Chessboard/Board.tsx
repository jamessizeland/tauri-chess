import type { CSSProperties, FC } from 'react';
import { useEffect, useState } from 'react';
import { BoardSquare } from './BoardSquare';
import Notation from './Notation';

/** Styling properties applied to the board element */
const boardStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
};
/** Styling properties applied to each square element */
const squareStyle: CSSProperties = { width: '12.5%', height: '12.5%' };

/** Render the board square appropriate for the coordinate given */
function renderSquare(row: number, col: number) {
  // const x = 8 - (i % 8);
  // const y = Math.floor(i / 8);
  return (
    <div key={`${row}${col}`} style={squareStyle}>
      <BoardSquare x={row} y={col}>
        <Notation
          col={col}
          row={row}
          width={560}
          key={`${row}${col}`}
          orientation={'black'}
        />
      </BoardSquare>
    </div>
  );
}

const Board = (): JSX.Element => {
  const squares = [];
  for (let row = 1; row <= 8; row++) {
    for (let col = 1; col <= 8; col++) {
      squares.push(renderSquare(8 - row, col));
    }
  }
  console.log(squares.length);
  console.log(squares);
  return <div style={boardStyle}>{squares}</div>;
};

export default Board;
