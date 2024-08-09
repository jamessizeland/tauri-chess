import type { Orientation, Piece, Square } from 'types';
import pieceSVG from './svg/chesspieces/standard';
import { cn } from 'utils';

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
  // isDragging = false,
  width,
  onPieceClick,
  className = '',
}: PieceProps) {
  return (
    <div className={cn('h-full', className)}>
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
