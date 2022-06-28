import React, { CSSProperties } from 'react'; // eslint-disable-line no-unused-vars

import { renderChessPiece } from './Piece';

type Props = {
  width: number;
  phantomPieceValue: string;
  pieces: {};
  allowDrag: () => void;
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
