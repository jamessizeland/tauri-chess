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
  const [hover, setHover] = useState(false);
  return (
    <div
      className="tooltip"
      data-tip={`x${coord.x} y${coord.y}`}
      style={{
        ...squareStyle,
        color,
        backgroundColor,
      }}
    >
      {children}
      {/* {hover && (
        <ReactTooltip
          id={JSON.stringify(coord)}
          place="top"
          effect="solid"
          backgroundColor={black ? 'black' : 'white'}
          textColor={black ? 'white' : 'black'}
        >
          x{coord.x} y{coord.y}
        </ReactTooltip>
      )} */}
      {/* <p className="inline">
        x{coord.x} y{coord.y}
      </p> */}
    </div>
  );
};
