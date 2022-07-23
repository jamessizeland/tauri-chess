import React from 'react';
import type { Piece } from './types';
import type { Square } from 'chess.js';
import pieceSVG from './svg/chesspieces/standard';
import wKSVG from './svg/whiteKing';

type PieceProps = {
  piece: Piece | undefined;
  square: Square;
  id: number | string;
  width: number;
  connectDragSource?: () => void;
  isDragging?: boolean;
};

export default function ChessPiece({
  piece,
  isDragging = false,
  width,
}: PieceProps) {
  return (
    <div className="h-full">
      {piece && (
        //   <p className="inline">{piece}</p>
        <svg
          className="mx-auto h-full"
          viewBox={`1 1 43 43`}
          width={width / 11}
          height={width / 11}
        >
          <g>{pieceSVG[piece]}</g>
        </svg>
      )}
    </div>
  );
}
