import { cn } from 'utils';
import type { CSSProperties, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { coordToSquare } from '../chess';
import { ItemTypes } from './helpers';
import type { Orientation, Square } from 'types';

export interface BoardSquareProps {
  col: number;
  row: number;
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
  col,
  row,
  orientation = 'white',
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
  customSquareStyle,
  onMouseOverSquare = () => null,
  onMouseOutSquare = () => null,
  onSquareClick = () => null,
  // onDragOverSquare = () => null,
  // onDrop = () => null,
  // onSquareRightClick = () => null,
  children,
}: BoardSquareProps): JSX.Element => {
  const square = coordToSquare(col, row);
  const [, drop] = useDrop(
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
    const square = coordToSquare(col, row);
    if (event.type === 'click') {
      console.log(`clicked on ${coordToSquare(col, row)} ${col},${row}`);
      onSquareClick(square);
    } else if (event.type === 'contextmenu') {
      event.preventDefault();
      console.log(`right-clicked on ${coordToSquare(col, row)} ${col},${row}`);
    }
  };
  const black = !((col + row) % 2 === 1);
  const backgroundColor = black ? darkSquareStyle : lightSquareStyle;
  const color = black ? 'white' : 'black';
  const rotate = orientation === 'black' ? 'rotate-180' : '';
  return (
    <div
      className={cn('tooltip', rotate)}
      data-tip={`(col ${col}, row ${row}) = ${coordToSquare(col, row)}`}
      onMouseEnter={() => onMouseOverSquare(square)}
      onMouseLeave={() => onMouseOutSquare(square)}
      onClick={handleClick}
      onContextMenu={handleClick}
      ref={drop}
      role="Space"
      data-testid={`(${col},${row})`}
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
