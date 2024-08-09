import { CSSProperties } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import type { CustomPieces, Square } from 'types';

type Props = {
  width: number;
  pieces: CustomPieces;
  wasPieceTouched: boolean;
  sourceSquare: Square;
  id?: string | number;
};

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 10,
  left: 0,
  top: 0,
};

const getItemStyle = (
  currentOffset: XYCoord | null,
  wasPieceTouched: boolean,
): CSSProperties => {
  if (!currentOffset) return { display: 'none' };

  let { x, y } = currentOffset;
  const transform = wasPieceTouched
    ? `translate(${x}px, ${y + -25}px) scale(2)`
    : `translate(${x}px, ${y}px)`;
  return { transform };
};

const CustomDragLayer = ({
  // id,
  // pieces,
  // sourceSquare,
  // width,
  wasPieceTouched,
}: Props) => {
  const { isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    // initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  return isDragging ? (
    <div style={layerStyles}>
      <div style={getItemStyle(currentOffset, wasPieceTouched)}>
        <p>P</p>
        {/* {renderChessPiece({
          width,
          pieces,
          piece: item.piece,
          isDragging,
          customDragLayerStyles: { opacity: 1 },
          sourceSquare,
        })} */}
      </div>
    </div>
  ) : null;
};

export default CustomDragLayer;
