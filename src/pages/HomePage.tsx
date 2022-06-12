import React, { useState, useEffect } from 'react';
import Chessboard, { Position, Piece } from 'chessboardjsx';
import { Square } from 'chess.js';
import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/tauri';
import { match } from 'assert';

// https://chessboardjsx.com/

type BoardStateArray = string[][];
type Color = 'White' | 'Black';
type PieceType = 'Queen' | 'King' | 'Bishop' | 'Knight' | 'Rook' | 'Pawn';
type RustPiece =
  | { [key in 'Queen']: Color }
  | { [key in 'King']: Color }
  | { [key in 'Bishop']: Color }
  | { [key in 'Knight']: Color }
  | { [key in 'Rook']: Color }
  | { [key in 'Pawn']: Color };

const parseBoardState = (boardArray: BoardStateArray) => {
  // get 8x8 array of strings
  console.log({ boardArray });
  const coordToSquare = (row: number, col: number) => {
    const colRef = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    // construct the square from the row/col coords
    return `${colRef[row]}${col + 1}` as Square;
  };
  const rustToPiece = (pieceObj: RustPiece) => {
    const color = Object.values(pieceObj)[0] === 'Black' ? 'b' : 'w';
    switch (Object.keys(pieceObj)[0] as PieceType) {
      case 'Queen':
        return `${color}Q` as Piece;
      case 'King':
        return `${color}K` as Piece;
      case 'Bishop':
        return `${color}B` as Piece;
      case 'Knight':
        return `${color}N` as Piece;
      case 'Rook':
        return `${color}R` as Piece;
      case 'Pawn':
        return `${color}P` as Piece;
    }
  };

  let state: Position = boardArray.reduce<Position>((result, row, i) => {
    row.forEach((col, j) => {
      if (col !== 'None') {
        console.log(col);
        result[coordToSquare(i, j)] = rustToPiece(col as unknown as RustPiece);
      }
    });
    return result;
  }, {});
  return state;
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
  const [position, setPosition] = useState<Position | 'start'>('start');
  const [square, setSquare] = useState(''); // currently clicked square
  const [history, setHistory] = useState<string[]>([]);
  const [squareStyles, setSquareStyles] = useState();
  let hoveredSquare: Square | undefined;

  useEffect(() => {
    // set a new board up when we go to this page
    notify('starting new game');
    // setPosition(start);
    invoke<BoardStateArray>('new_game').then((board) => {
      setPosition(parseBoardState(board));
    });
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
