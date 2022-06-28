import React, { Component, useState } from 'react';
import type { Orientation } from './types';
import { Square } from 'chess.js';

import { COLUMNS } from './helpers';

type Props = {
  square: React.ReactNode;
  squareColor: Orientation;
  col: number;
  row: number;
  alpha: string[];
};

const Row = (
  width: number,
  orientation: string,
  boardStyle: {},
  children: ({
    square,
    squareColor,
    col,
    row,
    alpha,
  }: Props) => React.ReactNode,
  boardId: string | Number,
): JSX.Element => {
  let alpha = COLUMNS;
  let row = 8;
  let squareColor: Orientation = 'white';

  if (orientation === 'black') row = 1;

  return (
    <div
      style={{ ...boardStyles(width), ...boardStyle }}
      data-boardid={boardId}
    >
      {[...Array(8)].map((_, r) => {
        row = orientation === 'black' ? row + 1 : row - 1;

        return (
          <div key={r.toString()} style={rowStyles(width)}>
            {[...Array(8)].map((_, col) => {
              let square =
                orientation === 'black'
                  ? alpha[7 - col] + (row - 1)
                  : alpha[col] + (row + 1);

              if (col !== 0) {
                squareColor = squareColor === 'black' ? 'white' : 'black';
              }
              return children({ square, squareColor, col, row, alpha });
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Row;

const boardStyles = (width: number): React.CSSProperties => {
  return {
    width,
    height: width,
    cursor: 'default',
  };
};

const rowStyles = (width: number): React.CSSProperties => {
  return {
    display: 'flex',
    flexWrap: 'nowrap',
    width,
  };
};
