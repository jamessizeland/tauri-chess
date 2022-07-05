import { Square } from 'chess.js';
import React, { CSSProperties } from 'react'; // eslint-disable-line no-unused-vars

import { renderChessPiece } from './Piece';
import { Piece } from './types';

type Props = {
  width: number;
  phantomPieceValue: Piece;
  pieces: {};
  allowDrag: ({
    piece,
    sourceSquare,
  }: {
    piece: Piece;
    sourceSquare: Square;
  }) => string;
  piece: Piece;
};

function PhantomPiece({ width, pieces, phantomPieceValue, allowDrag }: Props) {
  return renderChessPiece({
    width,
    pieces,
    piece: phantomPieceValue,
    phantomPieceStyles: phantomPieceStyles(width),
    allowDrag,
  });
}

export default PhantomPiece;

const phantomPieceStyles = (width: number): CSSProperties => ({
  position: 'absolute',
  width: width / 8,
  height: width / 8,
  zIndex: 1,
});
