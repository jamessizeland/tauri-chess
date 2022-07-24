import { Square } from 'chess.js';
import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import React from 'react';
import { useDrop } from 'react-dnd';
import { coordToSquare } from '../chess';
import { ItemTypes } from './helpers';
import type { Orientation } from './types';

export interface BoardSquareProps {
  row: number;
  col: number;
  orientation?: Orientation;
  children?: ReactNode;
  lightSquareStyle?: CSSProperties;
  darkSquareStyle?: CSSProperties;
  customSquareStyle?: CSSProperties;
  onMouseOverSquare?: (square: Square) => void;
  onMouseOutSquare?: (square: Square) => void;
  onDragOverSquare?: (square: Square) => void;
  onDrop?: (square: Square) => void;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
}

const squareStyle = {
  width: '100%',
  height: '100%',
};

export const BoardSquare = ({
  row,
  col,
  orientation = 'white',
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
  customSquareStyle,
  onMouseOverSquare,
  onMouseOutSquare,
  onDragOverSquare,
  onDrop,
  onSquareClick,
  onSquareRightClick,
  children,
}: BoardSquareProps): JSX.Element => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      //   canDrop: () => game.canMoveKnight(x, y),
      //   drop: () => game.moveKnight(x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  );
  /** Handles right and left clicks on a board square */
  const handleClick = (event: React.MouseEvent) => {
    if (event.type === 'click') {
      console.log(`clicked on ${coordToSquare(row, col)} ${row},${col}`);
    } else if (event.type === 'contextmenu') {
      event.preventDefault();
      console.log(`right-clicked on ${coordToSquare(row, col)} ${row},${col}`);
    }
    // onSquareClick;
  };
  const black = !((row + col) % 2 === 1);
  const backgroundColor = black ? darkSquareStyle : lightSquareStyle;
  const color = black ? 'white' : 'black';
  return (
    <div
      className={clsx('tooltip')}
      data-tip={`row ${row} | col ${col} | ${coordToSquare(row, col)}`}
      onMouseEnter={() => onMouseOverSquare}
      onMouseLeave={() => onMouseOutSquare}
      onClick={handleClick}
      onContextMenu={handleClick}
      ref={drop}
      role="Space"
      data-testid={`(${row},${col})`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          ...squareStyle,
          ...backgroundColor,
          color,
          ...customSquareStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};
