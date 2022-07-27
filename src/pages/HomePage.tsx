import React, { useState, useEffect } from 'react';
import type { Position } from 'components/Features/Chessboard/types';
import { Square } from 'chess.js';
import { invoke } from '@tauri-apps/api/tauri';
// import { listen } from '@tauri-apps/api/event';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'components/Elements';
import {
  coordToSquare,
  getGameState,
  highlightSquares,
  parseBoardState,
  startNewGame,
} from 'components/Features/chess';
import type {
  BoardStateArray,
  MoveList,
  PositionStyles,
  MetaGame,
} from 'components/Features/chess/types';
import { checkEnv } from 'utils';
import Chessboard from 'components/Features/Chessboard';
import { useToggle } from 'hooks';

const AskNewGame = ({
  setPosition,
  setGameMeta,
  isOpen,
  toggle,
}: {
  setPosition: (position: Position) => void;
  setGameMeta: (meta: MetaGame) => void;
  isOpen: boolean;
  toggle: (open?: boolean) => void;
}): JSX.Element => {
  return (
    <Modal toggle={toggle} isOpen={isOpen} animate position="extraLarge">
      <ModalHeader>Welcome to Tauri Chess</ModalHeader>
      <ModalBody>Do you want to start a new game?</ModalBody>
      <ModalFooter>
        <Button className="mr-2" onClick={() => toggle(true)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            startNewGame(setPosition);
            invoke<MetaGame>('get_score').then((meta) => setGameMeta(meta));
            toggle(true);
          }}
        >
          New
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const HomePage = (): JSX.Element => {
  const { isOpen, toggle } = useToggle();
  const [position, setPosition] = useState<Position>({});
  const [newGame, setNewGame] = useState<boolean>(false);
  // const [square, setSquare] = useState(''); // currently clicked square
  // const [history, setHistory] = useState<string[]>([]);
  const [gameMeta, setGameMeta] = useState<MetaGame>({
    score: 0,
    turn: 0,
    black_king: [4, 7],
    white_king: [4, 0],
  });
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
    toggle(false);
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
            invoke<[MoveList, BoardStateArray, any]>('click_square', {
              square: square,
            }).then(([sq, board, gameMeta]) => {
              setSquareStyles(highlightSquares(sq, square));
              setPosition(parseBoardState(board));
              console.log(gameMeta);
              setGameMeta(gameMeta);
            });
          }}
        />
      </div>
      {/* Game State Row */}
      <div className="pt-5 w-full flex">
        <p className="inline border border-black rounded-sm px-6 py-3 text-sm mr-1">
          white king:{' '}
          {coordToSquare(gameMeta.white_king[0], gameMeta.white_king[1])}
        </p>
        <p className="inline border border-black rounded-sm px-6 py-3 text-sm mr-1">
          black king:{' '}
          {coordToSquare(gameMeta.black_king[0], gameMeta.black_king[1])}
        </p>
        <p className="inline border border-black rounded-sm px-6 py-3 text-sm mr-2">
          score: {gameMeta.score}, turn: {gameMeta.turn} (
          {gameMeta.turn % 2 == 0 ? 'White' : 'Black'})
        </p>
        <Button className="mr-2" onClick={() => setNotation(!notation)}>
          Toggle Notation
        </Button>
        <Button className="mr-2" onClick={() => setWhiteTurn(!whiteTurn)}>
          {whiteTurn ? 'White' : 'Black'}
        </Button>
      </div>
    </div>
  );
};
export default HomePage;
