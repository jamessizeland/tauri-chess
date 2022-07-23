import React, { useState, useEffect, CSSProperties } from 'react';
import type { ChessboardProps } from './types';
import defaultPieces from './svg/chesspieces/standard';
import whiteKing from './svg/whiteKing';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './Board';
import CustomDragLayer from './CustomDragLayer';

const ChessBoard = ({
  id = 0,
  position = {},
  pieces = {},
  width = 560,
  orientation = 'white',
  showNotation = true,
  sparePieces = false,
  draggable = true,
  undo = false,
  dropOffBoard = 'snapback',
  transitionDuration = 300,
  boardStyle = {},
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
  dropSquareStyle = { boxShadow: 'inset 0 0 1px 4px yellow' },
  allowDrag = () => true,
  calcWidth,
  getPosition,
  onDragOverSquare,
  onDrop,
  onMouseOutSquare,
  onMouseOverSquare,
  onPieceClick,
  onSquareClick,
  onSquareRightClick,
  roughSquare,
  squareStyles,
}: ChessboardProps): JSX.Element => {
  const [screenWidth, setScreenWidth] = useState(width);
  const [screenHeight, setScreenHeight] = useState(width);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  const containerStyle: CSSProperties = {
    width: 500,
    height: 500,
    border: '1px solid gray',
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={containerStyle}>
        <Board />
        {/* <CustomDragLayer
        width={560}
        pieces={pieces}
        id={id}
        wasPieceTouched={wasPieceTouched}
        sourceSquare={targetSquare}
    /> */}
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
