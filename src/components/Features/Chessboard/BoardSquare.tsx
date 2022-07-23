import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './helpers';
import { Square } from './Square';
import type { Orientation } from './types';

export interface BoardSquareProps {
  x: number;
  y: number;
  orientation?: Orientation;
  children?: ReactNode;
}

export const BoardSquare = ({
  x,
  y,
  orientation = 'white',
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
      <Square black={black} coord={{ x, y }}>
        {children}
      </Square>
    </div>
  );
};
