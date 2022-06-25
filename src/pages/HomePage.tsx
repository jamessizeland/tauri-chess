import React, { useState, useEffect } from 'react';
import Chessboard, { Position } from 'chessboardjsx';
import { Square } from 'chess.js';
// import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from 'components/Elements';
import { highlightSquares, startNewGame } from 'components/Features/chess';
import type {
  BoardStateArray,
  MoveList,
  PositionStyles,
} from 'components/Features/chess/types';
import { checkEnv } from 'utils';

const HomePage = (): JSX.Element => {
  const [position, setPosition] = useState<Position | 'start'>('start');
  const [square, setSquare] = useState(''); // currently clicked square
  const [history, setHistory] = useState<string[]>([]);
  const [squareStyles, setSquareStyles] = useState<PositionStyles>();
  const [dragStyles, setDragStyles] = useState<{}>();
  const [hoveredSquare, setHoveredSquare] = useState<Square | undefined>(
    undefined,
  );

  useEffect(() => {
    // ask if we want to start a new game
    startNewGame(setPosition);
  }, []);

  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Game</h1>
      <div className="flex justify-around items-center flex-wrap pt-5">
        <Chessboard
          draggable={false}
          id="testBoard"
          width={400}
          position={position}
          onDrop={(state) =>
            invoke<Position>('drop_square', state).then((pos) =>
              setPosition(pos),
            )
          }
          onMouseOverSquare={(square) => {
            // stop unnecessary repeats of this function call
            if (square !== hoveredSquare) {
              invoke<MoveList>('hover_square', { square: square }).then((sq) =>
                setSquareStyles(highlightSquares(sq, square)),
              );
            }
            setHoveredSquare(square);
          }}
          // onMouseOutSquare={(square) => {
          //   // this doesn't work as expected yet...
          //   if (square !== hoveredSquare) {
          //     invoke('unhover_square', { square: square }).then(() =>
          //       setSquareStyles(highlightSquares([])),
          //     );
          //     setHoveredSquare(undefined);
          //   }
          // }}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: `0 5px 15px rgba(0,0,0,0.5)`,
          }}
          squareStyles={squareStyles}
          dropSquareStyle={dragStyles}
          onDragOverSquare={(square) => {
            setDragStyles({ boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)' });
          }}
          onSquareClick={(square) => {
            invoke<MoveList>('click_square', { square: square }).then((sq) =>
              setSquareStyles(highlightSquares(sq, square)),
            );
          }}
          // onSquareRightClick={}
        />
      </div>
      {!checkEnv('production') ? (
        <Button
          onClick={() =>
            invoke<BoardStateArray>('get_state').then((gameState) =>
              console.log(gameState),
            )
          }
        >
          Get State
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};
export default HomePage;
