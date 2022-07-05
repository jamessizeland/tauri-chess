import React, { Component } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { CSSProperties } from 'react';
import { Square } from 'chess.js';

import { ItemTypes } from './helpers';
import { Piece } from './types';

type ChessPieceProps = {
  dropTarget?: Square;
  square?: Square;
  targetSquare?: Square;
  waitForTransition?: boolean;
  getSquareCoordinates?: (sourceSquare: Square, targetSquare: Square) => {};
  piece: Piece;
  width: number;
  pieces: Object;
  transitionDuration?: number;
  isDragging: boolean;
  sourceSquare: Square;
  onPieceClick?: () => void;
  allowDrag?: ({ piece, sourceSquare }: {piece: Piece; sourceSquare: Square; }) => string;
  customDragLayerStyles: CSSProperties;
  phantomPieceStyles?: CSSProperties;
}

export const renderChessPiece = ({
  dropTarget,
  square,
  targetSquare,
  waitForTransition,
  getSquareCoordinates,
  piece,
  width,
  pieces,
  transitionDuration,
  isDragging,
  sourceSquare,
  onPieceClick,
  allowDrag,
  customDragLayerStyles = {},
  phantomPieceStyles = {},
}: ChessPieceProps): JSX.Element => {

  const renderChessPieceArgs = {
    squareWidth: width / 8,
    isDragging,
    droppedPiece: dropTarget && dropTarget.piece,
    targetSquare: dropTarget && dropTarget.target,
    sourceSquare: dropTarget && dropTarget.source,
  };

  return (
    <div
      data-testid={`${piece}-${square}`}
      onClick={() => onPieceClick(piece)}
      style={{
        ...pieceStyles({
          isDragging,
          transitionDuration,
          waitForTransition,
          square,
          targetSquare,
          sourceSquare,
          getSquareCoordinates,
          getTranslation,
          piece,
          allowDrag,
        }),
        ...phantomPieceStyles,
        ...customDragLayerStyles,
      }}
    >
      {typeof pieces[piece] === 'function' ? (
        pieces[piece](renderChessPieceArgs)
      ) : (
        <svg viewBox={`1 1 43 43`} width={width / 8} height={width / 8}>
          <g>{pieces[piece]}</g>
        </svg>
      )}
    </div>
  );
};

type PieceProps = {
  piece: Piece;
  square: Square;
  id: number | string;
  width: number;
  connectDragSource: () => void;
  isDragging: boolean;
}

const Piece = ({piece, square, id, width, connectDragSource, isDragging}: PieceProps): JSX.Element => {
  static propTypes = {
    piece: PropTypes.string,
    square: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.number,
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    connectDragPreview: PropTypes.func,
    dropOffBoard: PropTypes.string,
    getSquareCoordinates: PropTypes.func,
    onDrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    transitionDuration: PropTypes.number,
    pieces: PropTypes.object,
    sourceSquare: PropTypes.string,
    targetSquare: PropTypes.string,
    waitForTransition: PropTypes.bool,
    setTouchState: PropTypes.func,
    onPieceClick: PropTypes.func,
    wasSquareClicked: PropTypes.func,
    allowDrag: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    const shouldPieceUpdate =
      nextProps.dropTarget !== null ||
      nextProps.isDragging ||
      this.props.isDragging ||
      // if the position comes from the position prop, check if it is a different position
      this.props.sourceSquare !== nextProps.sourceSquare ||
      this.props.waitForTransition !== nextProps.waitForTransition ||
      // if the screen size changes then update
      this.props.width !== nextProps.width;

    if (shouldPieceUpdate) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.addEventListener('touchstart', this.props.setTouchState);

    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('touchstart', this.props.setTouchState);
  }

    return connectDragSource(
      renderChessPiece({
        square,
        targetSquare,
        waitForTransition,
        getSquareCoordinates,
        piece,
        width,
        pieces,
        transitionDuration,
        isDragging,
        sourceSquare,
        dropTarget,
        onPieceClick,
        allowDrag,
      }),
    );
  }
}

const pieceSource = {
  canDrag(props) {
    return (
      props.draggable &&
      props.allowDrag({ piece: props.piece, sourceSquare: props.square })
    );
  },
  beginDrag(props) {
    return {
      piece: props.piece,
      source: props.square,
      board: props.id,
    };
  },
  endDrag(props, monitor) {
    const {
      setPosition,
      dropOffBoard,
      piece,
      square,
      onDrop,
      wasManuallyDropped,
      wasSquareClicked,
    } = props;
    const dropResults = monitor.getDropResult();
    const didDrop = monitor.didDrop();

    // trash piece when dropped off board
    if (!didDrop && dropOffBoard === 'trash') {
      return setPosition({ sourceSquare: square, piece });
    }

    const board = monitor.getItem().board;
    const dropBoard = dropResults && dropResults.board;

    // check if target board is source board
    if (board === dropBoard && didDrop) {
      if (onDrop.length) {
        wasManuallyDropped(true);
        if (square !== 'spare') {
          wasSquareClicked(false);
        }

        // execute user's logic
        return onDrop({
          sourceSquare: square,
          targetSquare: dropResults.target,
          piece,
        });
      }
      // set new position
      setPosition({
        sourceSquare: square,
        targetSquare: dropResults.target,
        piece,
      });
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    dropTarget: monitor.getDropResult(),
  };
}

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);

const isActivePiece = (square: Square, targetSquare: Square) =>
  targetSquare && targetSquare === square;

type TransitionProps = {
  getSquareCoordinates: (sourceSq: Square, targetSq: Square) => {sourceSquare: {x: number; y: number}, targetSquare: {x: number; y: number}};
  sourceSq: Square;
  targetSq: Square;
}

const getTransitionCoordinates = ({
  getSquareCoordinates,
  sourceSq,
  targetSq,
}: TransitionProps) => {
  const transitionCoordinates = getSquareCoordinates(sourceSq, targetSq);
  const { sourceSquare, targetSquare } = transitionCoordinates;

  return `translate(${sourceSquare.x - targetSquare.x}px, ${
    sourceSquare.y - targetSquare.y
  }px)`;
};

type TranslationProps = {
  waitForTransition: boolean;
  square: Square;
  targetSquare: Square;
  sourceSquare: Square;
  getSquareCoordinates: (sourceSq: Square, targetSq: Square) => {sourceSquare: {x: number; y: number}, targetSquare: {x: number; y: number}};
}

const getTranslation = ({
  waitForTransition,
  square,
  targetSquare,
  sourceSquare,
  getSquareCoordinates,
}: TranslationProps) => {
  return (
    isActivePiece(square, targetSquare) &&
    waitForTransition &&
    getTransitionCoordinates({
      getSquareCoordinates,
      sourceSq: sourceSquare,
      targetSq: targetSquare,
    })
  );
};


type PieceStylesProps = {
  isDragging: boolean;
  transitionDuration: number;
  getTranslation: ({
    waitForTransition, 
    square, 
    targetSquare, 
    sourceSquare, 
    getSquareCoordinates,
  }:TranslationProps) => void;
  piece: Piece;
  allowDrag: ({piece, sourceSquare}: {piece: Piece; sourceSquare: Square}) => string;
}

const pieceStyles = ({
  isDragging,
  transitionDuration,
  waitForTransition,
  square,
  targetSquare,
  sourceSquare,
  getSquareCoordinates,
  getTranslation,
  piece,
  allowDrag,
}: PieceStylesProps & TranslationProps) => ({
  opacity: isDragging ? 0 : 1,
  transform: getTranslation({
    waitForTransition,
    square,
    targetSquare,
    sourceSquare,
    getSquareCoordinates,
  }),
  transition: `transform ${transitionDuration}ms`,
  zIndex: 5,
  cursor: isDragging
    ? '-webkit-grabbing'
    : allowDrag({ piece, sourceSquare: square })
    ? '-webkit-grab'
    : 'not-allowed',
});
