import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './helpers';
import { Square } from './Square';
import type { Orientation } from './types';

export interface BoardSquareProps {
  x: number;
  y: number;
  orientation?: Orientation;
  children?: ReactNode;
  lightSquareStyle: CSSProperties;
  darkSquareStyle: CSSProperties;
}

const squareStyle = {
  width: '100%',
  height: '100%',
};

export const BoardSquare = ({
  x,
  y,
  orientation = 'white',
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
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
  const black = !((x + y) % 2 === 1);
  const backgroundColor = black ? darkSquareStyle : lightSquareStyle;
  const color = black ? 'white' : 'black';
  return (
    <div
      className={clsx('tooltip')}
      data-tip={`row ${x} | col ${y}`}
      ref={drop}
      role="Space"
      data-testid={`(${x},${y})`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          ...squareStyle,
          color,
          ...backgroundColor,
        }}
      >
        {children}
        {/* <p className="inline">
        r{coord.x}|c{coord.y}
      </p> */}
      </div>
    </div>
  );
};
