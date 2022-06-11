import React, { useState, useEffect } from 'react';
import Chessboard, { Position, Piece } from 'chessboardjsx';
import { Square } from 'chess.js';
import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/tauri';

// https://chessboardjsx.com/

const start: Position = {
  a1: 'wR',
  b1: 'wN',
  c1: 'wB',
  d1: 'wQ',
  e1: 'wK',
  f1: 'wB',
  g1: 'wN',
  h1: 'wR',
  a2: 'wP',
  b2: 'wP',
  c2: 'wP',
  d2: 'wP',
  e2: 'wP',
  f2: 'wP',
  g2: 'wP',
  h2: 'wP',
  // a3: undefined,
  // b3: undefined,
  // c3: undefined,
  // d3: undefined,
  // e3: undefined,
  // f3: undefined,
  // g3: undefined,
  // h3: undefined,
  // a4: undefined,
  // b4: undefined,
  // c4: undefined,
  // d4: undefined,
  // e4: undefined,
  // f4: undefined,
  // g4: undefined,
  // h4: undefined,
  // a5: undefined,
  // b5: undefined,
  // c5: undefined,
  // d5: undefined,
  // e5: undefined,
  // f5: undefined,
  // g5: undefined,
  // h5: undefined,
  // a6: undefined,
  // b6: undefined,
  // c6: undefined,
  // d6: undefined,
  // e6: undefined,
  // f6: undefined,
  // g6: undefined,
  // h6: undefined,
  a7: 'bP',
  b7: 'bP',
  c7: 'bP',
  d7: 'bP',
  e7: 'bP',
  f7: 'bP',
  g7: 'bP',
  h7: 'bP',
  a8: 'bR',
  b8: 'bN',
  c8: 'bB',
  d8: 'bQ',
  e8: 'bK',
  f8: 'bB',
  g8: 'bN',
  h8: 'bR',
};
type BoardStateArray = number[][];

const parseBoardState = (boardArray: BoardStateArray) => {
  return start;
};

const highlightSquares = (squares: Square[]) => {
  // turn this array of squares into an object with cssProperties defined
  const props = squares.reduce<any>((result, item, index) => {
    result[item] = { backgroundColor: 'yellow' };
    return result;
  }, {});
  console.log(props);
  return props;
};

const HomePage = (): JSX.Element => {
  const [position, setPosition] = useState<Position | 'start'>(start);
  const [square, setSquare] = useState(''); // currently clicked square
  const [history, setHistory] = useState<string[]>([]);
  const [squareStyles, setSquareStyles] = useState();
  let hoveredSquare: Square | undefined;

  useEffect(() => {
    // set a new board up when we go to this page
    notify('starting new game');
    // setPosition(start);
    invoke<BoardStateArray>('new_game').then((board) =>
      setPosition(parseBoardState(board)),
    );
  }, []);

  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Game</h1>
      <div className="flex justify-around items-center flex-wrap pt-5">
        <Chessboard
          id="testBoard"
          width={400}
          position={position}
          // sparePieces
          onDrop={(state) => invoke<Position>('drop_square', state)}
          onMouseOverSquare={(square) => {
            // stop unnecessary repeats of this function call
            if (square !== hoveredSquare) {
              invoke<Square[]>('hover_square', { square: square }).then(
                (sq) => {
                  console.log(sq);
                  setSquareStyles(highlightSquares(sq));
                },
              );
            }
            hoveredSquare = square;
          }}
          onMouseOutSquare={(square) =>
            invoke('unhover_square', { square: square })
          }
          boardStyle={{
            borderRadius: '5px',
            boxShadow: `0 5px 15px rgba(0,0,0,0.5)`,
          }}
          squareStyles={squareStyles}
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
