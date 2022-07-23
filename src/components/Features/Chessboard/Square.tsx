import { ReactNode, useState } from 'react';

export interface SquareProps {
  black: boolean;
  children?: ReactNode;
  coord: { x: number; y: number };
}

const squareStyle = {
  width: '100%',
  height: '100%',
};

export const Square = ({ black, coord, children }: SquareProps) => {
  const backgroundColor = black ? 'black' : 'white';
  const color = black ? 'white' : 'black';
  return (
    <div
      className="tooltip"
      data-tip={`row ${coord.x} | col ${coord.y}`}
      style={{
        ...squareStyle,
        color,
        backgroundColor,
      }}
    >
      {children}
      {/* <p className="inline">
        r{coord.x}|c{coord.y}
      </p> */}
    </div>
  );
};
