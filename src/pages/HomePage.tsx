import { useState, useEffect } from 'react';
import type {
  Position,
  Square,
  BoardStateArray,
  MoveList,
  PositionStyles,
  MetaGame,
} from 'types';
import { Button } from 'components/Elements';
import {
  coordToSquare,
  highlightSquares,
  parseBoardState,
  AskNewGame,
} from 'components/Features/chess';
import Chessboard from 'components/Features/Chessboard';
import { useToggle } from 'hooks';
import { cn } from 'utils';
import Promotions from 'components/Features/chess/promotions';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

const HomePage: React.FC = () => {
  const [newGameIsOpen, newGameToggle] = useToggle(true);
  const [promoterIsOpen, promoterToggle] = useToggle(false);
  const [position, setPosition] = useState<Position>({});
  const [gameMeta, setGameMeta] = useState<MetaGame>({
    score: 0,
    turn: 0,
    game_over: false,
    en_passant: null,
    promotable_pawn: null,
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
  // const [dragStyles, setDragStyles] = useState<{}>();
  const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
  const [hoveredSquare, setHoveredSquare] = useState<Square>();
  const [rotation, setRotation] = useState(false);

  useEffect(() => {
    // ask if we want to start a new game
    invoke<BoardStateArray>('get_state').then((board) =>
      setPosition(parseBoardState(board)),
    );
    invoke<MetaGame>('get_score').then((meta) => setGameMeta(meta));
    // listen for promotion requests
    const promRef = listen<string>('promotion', () => promoterToggle());
    // listen for unexpected board state updates
    const boardRef = listen<BoardStateArray>('board', (event) => {
      console.log('Rust requests a boardstate update');
      setPosition(parseBoardState(event.payload));
    });
    return () => {
      promRef.then((f) => f());
      boardRef.then((f) => f());
    };
  }, []);

  return (
    <div className="animate-backInRight">
      <div className="flex justify-around items-center flex-wrap pt-5">
        <AskNewGame
          setGameMeta={setGameMeta}
          setPosition={setPosition}
          isOpen={newGameIsOpen}
          toggle={newGameToggle}
        />
        <Promotions isOpen={promoterIsOpen} toggle={promoterToggle} />
        <Chessboard
          orientation={whiteTurn ? 'white' : 'black'}
          draggable={false}
          id="testBoard"
          width={400}
          showNotation
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
          dropSquareStyle={undefined}
          onSquareClick={(square) => {
            if (!gameMeta.game_over) {
              invoke<[MoveList, BoardStateArray, MetaGame]>('click_square', {
                square: square,
              }).then(([sq, board, gameMeta]) => {
                setSquareStyles(highlightSquares(sq, square));
                setPosition(parseBoardState(board));
                setGameMeta(gameMeta);
                if (rotation) {
                  gameMeta.turn % 2 == 0
                    ? setWhiteTurn(true)
                    : setWhiteTurn(false);
                }
                if (gameMeta.game_over) newGameToggle(); // ask if we want to start a new game
              });
            }
          }}
        />
      </div>
      {/* Game State Row */}
      <div className="pt-5 w-full flex justify-center">
        <p className="border border-black rounded-sm px-6 py-3 text-sm mr-2">
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
