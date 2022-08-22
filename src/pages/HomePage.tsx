import React, { useState, useEffect } from 'react';
import type { Position } from 'components/Features/Chessboard/types';
import { Square } from 'chess.js';
import { invoke } from '@tauri-apps/api/tauri';
// import { listen } from '@tauri-apps/api/event';
import { Button } from 'components/Elements';
import {
  coordToSquare,
  getGameState,
  highlightSquares,
  parseBoardState,
  AskNewGame,
} from 'components/Features/chess/index';
import type {
  BoardStateArray,
  MoveList,
  PositionStyles,
  MetaGame,
} from 'components/Features/chess/types';
import { checkEnv } from 'utils';
import Chessboard from 'components/Features/Chessboard';
import { useToggle } from 'hooks';
import clsx from 'clsx';

const HomePage = (): JSX.Element => {
  const [isOpen, toggle] = useToggle(false);
  const [position, setPosition] = useState<Position>({});
  const [newGame, setNewGame] = useState<boolean>(false);
  // const [square, setSquare] = useState(''); // currently clicked square
  // const [history, setHistory] = useState<string[]>([]);
  const [gameMeta, setGameMeta] = useState<MetaGame>({
    score: 0,
    turn: 0,
    game_over: false,
    en_passant: null,
    white_king: {
      piece: {
        King: ['White', true, false, false],
      },
      square: [4, 0],
    },
    black_king: {
      piece: {
        King: ['Black', true, false, false],
      },
      square: [4, 7],
    },
  });
  const [squareStyles, setSquareStyles] = useState<PositionStyles>();
  const [dragStyles, setDragStyles] = useState<{}>();
  const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
  const [hoveredSquare, setHoveredSquare] = useState<Square | undefined>(
    undefined,
  );
  const [notation, setNotation] = useState(true);
  const [rotation, setRotation] = useState(false);

  useEffect(() => {
    // ask if we want to start a new game
    invoke<BoardStateArray>('get_state').then((board) =>
      setPosition(parseBoardState(board)),
    );
    invoke<MetaGame>('get_score').then((meta) => setGameMeta(meta));
  }, []);

  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Game</h1>
      <div className="flex justify-around items-center flex-wrap pt-5">
        <AskNewGame
          setGameMeta={setGameMeta}
          setPosition={setPosition}
          isOpen={isOpen}
          toggle={toggle}
        />
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
            if (!gameMeta.game_over) {
              invoke<[MoveList, BoardStateArray, MetaGame]>('click_square', {
                square: square,
              }).then(([sq, board, gameMeta]) => {
                setSquareStyles(highlightSquares(sq, square));
                setPosition(parseBoardState(board));
                console.log(gameMeta);
                console.log(gameMeta.white_king.piece.King);
                console.log(gameMeta.black_king.piece.King);
                setGameMeta(gameMeta);
                if (rotation) {
                  gameMeta.turn % 2 == 0
                    ? setWhiteTurn(true)
                    : setWhiteTurn(false);
                }
                if (gameMeta.game_over) toggle(false); // ask if we want to start a new game
              });
            }
          }}
        />
      </div>
      {/* Game State Row */}
      <div className="pt-5 w-full flex">
        <p
          className={clsx(
            'inline border border-black rounded-sm px-6 py-3 text-sm mr-1',
            gameMeta.white_king.piece.King[2] ? 'bg-yellow-500' : '',
            gameMeta.white_king.piece.King[3] ? 'bg-red-800' : '',
          )}
        >
          white king:{' '}
          {coordToSquare(
            gameMeta.white_king.square[0],
            gameMeta.white_king.square[1],
          )}
        </p>
        <p
          className={clsx(
            'inline border border-black rounded-sm px-6 py-3 text-sm mr-1',
            gameMeta.black_king.piece.King[2] ? 'bg-yellow-500' : '',
            gameMeta.black_king.piece.King[3] ? 'bg-red-800' : '',
          )}
        >
          black king:{' '}
          {coordToSquare(
            gameMeta.black_king.square[0],
            gameMeta.black_king.square[1],
          )}
        </p>
        <p className="inline border border-black rounded-sm px-6 py-3 text-sm mr-2">
          score: {gameMeta.score}, turn: {gameMeta.turn} (
          {gameMeta.turn % 2 == 0 ? 'White' : 'Black'})
        </p>
        <Button
          className="mr-2"
          onClick={() => {
            if (rotation) {
              setWhiteTurn(true);
              console.log('rotation off');
            } else {
              gameMeta.turn % 2 == 0 ? setWhiteTurn(true) : setWhiteTurn(false);
              console.log(gameMeta.turn % 2);
            }
            setRotation(!rotation);
          }}
        >
          {rotation ? 'Rotation On' : 'Rotation Off'}
        </Button>
      </div>
    </div>
  );
};
export default HomePage;
