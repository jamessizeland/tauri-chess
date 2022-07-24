import React, { useState, useEffect } from 'react';
import type { Position } from 'components/Features/Chessboard/types';
import ChessBoard from 'components/Features/Chessboard';
import { Square } from 'chess.js';
// import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/tauri';
// import { listen } from '@tauri-apps/api/event';
import { Button } from 'components/Elements';
import {
  getGameState,
  highlightSquares,
  parseBoardState,
  startNewGame,
} from 'components/Features/chess';
import type {
  BoardStateArray,
  MoveList,
  PositionStyles,
} from 'components/Features/chess/types';
import { checkEnv } from 'utils';
import Chessboard from 'components/Features/Chessboard';

const HomePage = (): JSX.Element => {
  const [position, setPosition] = useState<Position>({});
  const [square, setSquare] = useState(''); // currently clicked square
  const [history, setHistory] = useState<string[]>([]);
  const [squareStyles, setSquareStyles] = useState<PositionStyles>();
  const [dragStyles, setDragStyles] = useState<{}>();
  const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
  const [hoveredSquare, setHoveredSquare] = useState<Square | undefined>(
    undefined,
  );
  const [notation, setNotation] = useState(true);
  // listen<Position>('update_position', (event) => {
  //   console.log('update position');
  //   setPosition(event.payload);
  // });

  useEffect(() => {
    // ask if we want to start a new game
    startNewGame(setPosition);
  }, []);

  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Game</h1>
      <div className="flex justify-around items-center flex-wrap pt-5">
        <Chessboard
          orientation={whiteTurn ? 'white' : 'black'}
          draggable={false}
          id="testBoard"
          width={400}
          showNotation={notation}
          position={position}
          onMouseOverSquare={(square) => {
            // stop unnecessary repeats of this function call
            if (square !== hoveredSquare) {
              invoke<MoveList>('hover_square', { square: square }).then((sq) =>
                setSquareStyles(highlightSquares(sq, square)),
              );
            }
            setHoveredSquare(square);
          }}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: `0 5px 15px rgba(0,0,0,0.5)`,
          }}
          squareStyles={squareStyles}
          dropSquareStyle={dragStyles}
          onSquareClick={(square) => {
            invoke<[MoveList, BoardStateArray]>('click_square', {
              square: square,
            }).then(([sq, board]) => {
              setSquareStyles(highlightSquares(sq, square));
              setPosition(parseBoardState(board));
            });
          }}
        />
      </div>
      {!checkEnv('production') && (
        <div className="pt-5">
          <Button className="mr-2" onClick={() => setNotation(!notation)}>
            Toggle Notation
          </Button>
          <Button className="mr-2" onClick={() => setWhiteTurn(!whiteTurn)}>
            {whiteTurn ? 'White' : 'Black'}
          </Button>
          <Button
            onClick={() =>
              invoke<BoardStateArray>('get_state').then((gameState) =>
                console.log(gameState),
              )
            }
          >
            Get State
          </Button>
        </div>
      )}
    </div>
  );
};
export default HomePage;
