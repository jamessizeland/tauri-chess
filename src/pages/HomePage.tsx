import React, { useState, useEffect } from 'react';
import Chessboard, { Position } from 'chessboardjsx';
import { notify } from 'services/notifications';

// https://chessboardjsx.com/

const HomePage = (): JSX.Element => {
  const [position, setPosition] = useState<Position | 'start'>('start');

  useEffect(() => {
    // set a new board up when we go to this page
    notify('starting new game');
    setPosition('start');
  }, []);

  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Game</h1>
      <div className="flex justify-around items-center flex-wrap pt-5">
        <Chessboard
          id="testBoard"
          width={400}
          position={position}
          sparePieces
          // onDrop={}
          // onMouseOverSquare={}
          // onMouseOutSquare={}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: `0 5px 15px rgba(0,0,0,0.5)`,
          }}
          // squareStyles={}
          // dropSquareStyle={}
          // onDragOverSquare={}
          // onSquareClick={}
          // onSquareRightClick={}
        />
      </div>
    </div>
  );
};
export default HomePage;
