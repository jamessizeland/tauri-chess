import React, { Fragment, CSSProperties } from 'react';
import { Orientation } from './types';
import { COLUMNS } from './helpers';
import { Property } from 'csstype';

//-----------------------------//
type SquareProps = {
  row: number;
  col: number;
  width: number;
  orientation?: Orientation;
};
type NotationProps = SquareProps & {
  lightSquareStyle?: CSSProperties;
  darkSquareStyle?: CSSProperties;
};
type WhiteColor = { whiteColor: Property.BackgroundColor | undefined };
type BlackColor = { blackColor: Property.BackgroundColor | undefined };

//-----------------------------//
// helper functions

/** Get Row as a number */
const getRow = (orientation: Orientation, row: number) =>
  orientation === 'white' ? row + 1 : row + 1;

/** Get Column as a letter */
const getColumn = (orientation: Orientation, col: number) =>
  orientation === 'black' ? COLUMNS[7 - col] : COLUMNS[col];

const renderBottomLeft = ({
  orientation = 'white',
  row,
  width,
  col,
  whiteColor,
}: SquareProps & WhiteColor) => {
  return (
    <Fragment>
      <div
        data-testid={`bottom-left-${getRow(orientation, row)}`}
        style={{
          ...notationStyle,
          ...{ fontSize: width / 48, color: whiteColor },
          ...numericStyle(width),
        }}
      >
        {getRow(orientation, row)}
      </div>
      <div
        data-testid={`bottom-left-${getColumn(orientation, col)}`}
        style={{
          ...notationStyle,
          ...{ fontSize: width / 48, color: whiteColor },
          ...alphaStyle(width),
        }}
      >
        {getColumn(orientation, col)}
      </div>
    </Fragment>
  );
};

const renderLetters = ({
  orientation = 'white',
  width,
  col,
  whiteColor,
  blackColor,
}: Omit<SquareProps, 'row'> & WhiteColor & BlackColor) => {
  return (
    <div
      data-testid={`column-${getColumn(orientation, col)}`}
      style={{
        ...notationStyle,
        ...columnStyle({ col, width, blackColor, whiteColor }),
        ...alphaStyle(width),
      }}
    >
      {getColumn(orientation, col)}
    </div>
  );
};

const renderNumbers = ({
  orientation = 'white',
  row,
  width,
  whiteColor,
  blackColor,
  isRow,
  isBottomLeftSquare,
}: Omit<SquareProps, 'col'> &
  WhiteColor &
  BlackColor & { isRow: boolean; isBottomLeftSquare: boolean }) => {
  return (
    <div
      style={{
        ...notationStyle,
        ...rowStyle({
          row,
          width,
          blackColor,
          whiteColor,
          orientation,
          isBottomLeftSquare,
          isRow,
        }),
        ...numericStyle(width),
      }}
    >
      {getRow(orientation, row)}
    </div>
  );
};

const columnStyle = ({
  col,
  width,
  blackColor,
  whiteColor,
}: Omit<SquareProps, 'row'> & BlackColor & WhiteColor): CSSProperties => ({
  fontSize: width / 48,
  color: col % 2 !== 0 ? blackColor : whiteColor,
});

const rowStyle = ({
  row,
  width,
  blackColor,
  whiteColor,
  orientation,
  isBottomLeftSquare,
  isRow,
}: Omit<SquareProps, 'col'> &
  WhiteColor &
  BlackColor & {
    isRow: boolean;
    isBottomLeftSquare: boolean;
  }): CSSProperties => {
  return {
    fontSize: width / 48,
    color:
      orientation === 'black'
        ? isRow && !isBottomLeftSquare && row % 2 === 0
          ? blackColor
          : whiteColor
        : isRow && !isBottomLeftSquare && row % 2 !== 0
        ? blackColor
        : whiteColor,
  };
};

const alphaStyle = (width: number): CSSProperties => ({
  alignSelf: 'flex-end',
  paddingTop: width / 8 - width / 48 - 14,
  paddingLeft: width / 8 - width / 48 - 5,
});

const numericStyle = (width: number): CSSProperties => ({
  alignSelf: 'flex-start',
  paddingRight: width / 8 - width / 48,
});

const notationStyle: CSSProperties = {
  fontFamily: 'Helvetica Neue',
  zIndex: 3,
  position: 'absolute',
};

//-----------------------------//

/** Render the numbers and letters on the board squares */
const Notation = ({
  row,
  col,
  orientation = 'white',
  width,
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
}: NotationProps) => {
  const whiteColor = lightSquareStyle.backgroundColor;
  const blackColor = darkSquareStyle.backgroundColor;
  const isRow: boolean = col === 0;
  const isColumn: boolean =
    (orientation === 'white' && row === 0) ||
    (orientation === 'black' && row === 7);
  const isBottomLeftSquare: boolean = isRow && isColumn;

  if (isBottomLeftSquare) {
    return renderBottomLeft({ col, row, width, orientation, whiteColor });
  }

  if (isColumn) {
    return renderLetters({ col, width, orientation, whiteColor, blackColor });
  }

  if (isRow) {
    return renderNumbers({
      row,
      width,
      orientation,
      whiteColor,
      blackColor,
      isRow,
      isBottomLeftSquare,
    });
  }

  return null;
};

export default Notation;
