import react from 'React';
import { Position, Piece } from 'chessboardjsx';
import { Square } from 'chess.js';
import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/tauri';
import type {
  BoardStateArray,
  RustPiece,
  PieceType,
  PositionStyles,
  MoveList,
} from './types';

// https://chessboardjsx.com/

const parseBoardState = (boardArray: BoardStateArray) => {
  // get 8x8 array of strings
  console.log({ boardArray });
  const coordToSquare = (row: number, col: number) => {
    const colRef = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    // construct the square from the row/col coords
    return `${colRef[row]}${col + 1}` as Square;
  };
  const rustToPiece = (pieceObj: RustPiece) => {
    let color: 'w' | 'b' =
      Object.values(pieceObj)[0][0] === 'Black' ? 'b' : 'w';
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

const numToLetter = (num: number) => (num + 9).toString(36);

const coordToSquare = (row: number, col: number) => {
  return `${numToLetter(row + 1)}${col + 1}` as keyof PositionStyles;
};

const highlightSquares = (moveOptions: MoveList): PositionStyles => {
  // turn this array of squares into an object with cssProperties defined
  const props = moveOptions.reduce<PositionStyles>((result, move, index) => {
    const [isAttack, row, col] = [move[1], move[0][0], move[0][1]];

    result[coordToSquare(row, col)] = {
      backgroundColor: isAttack ? 'red' : 'yellow',
      borderRadius: '50%',
    };
    return result;
  }, {});
  console.log(props);
  return props;
};

const startNewGame = (setPosition: (positions: Position) => void) => {
  invoke<BoardStateArray>('new_game').then((board) => {
    notify('starting new game', 'new_game');
    setPosition(parseBoardState(board));
  });
};

export { parseBoardState, highlightSquares, startNewGame };
