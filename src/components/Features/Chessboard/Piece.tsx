import React from 'react';
import type { Orientation, Piece } from './types';
import type { Square } from 'chess.js';
import pieceSVG from './svg/chesspieces/standard';
import wKSVG from './svg/whiteKing';
import clsx from 'clsx';

type PieceProps = {
  piece: Piece | undefined;
  square: Square;
  id: number | string;
  width: number;
  connectDragSource?: () => void;
  onPieceClick?: (piece: Piece) => void;
  isDragging?: boolean;
  orientation?: Orientation;
  className?: string;
};

export default function ChessPiece({
  piece,
  isDragging = false,
  width,
  onPieceClick,
  orientation = 'white',
  className = '',
}: PieceProps) {
  const rotate = orientation === 'black' ? 'rotate-180' : '';
  return (
    <div className={clsx('h-full', className)}>
      {piece && (
        <svg
          className="mx-auto h-full"
          viewBox={`1 1 43 43`}
          width={width / 11}
          height={width / 11}
          onClick={() => onPieceClick}
        >
          <g>{pieceSVG[piece]}</g>
        </svg>
      )}
    </div>
  );
}
