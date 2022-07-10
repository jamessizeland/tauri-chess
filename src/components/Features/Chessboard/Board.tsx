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

const Board = (): JSX.Element => {
  function renderSquare(i: number) {
    const x = i % 8;
    const y = Math.floor(i / 8);
    return (
      <div key={i} style={squareStyle}>
        <BoardSquare x={x} y={y}></BoardSquare>
        <Notation col={x} row={y} width={560} key={i} />
      </div>
    );
  }
  const squares = [];
  for (let i = 0; i < 64; i += 1) {
    squares.push(renderSquare(i));
  }
  return <div style={boardStyle}>{squares}</div>;
};

export default Board;
