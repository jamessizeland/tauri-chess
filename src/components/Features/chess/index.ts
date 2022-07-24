import react from 'React';
import { Position, Piece } from '../Chessboard/types';
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

//!NOTE coordinates are column then row

/** Convert a number to its corresponding alphabetical character */
const numToLetter = (num: number) => (num + 9).toString(36);

/** Convert a row, col coordinate into a chessboard square i.e. (2,1) = b3 */
const coordToSquare = (col: number, row: number) => {
  return `${numToLetter(col + 1)}${row + 1}` as Square;
};

const parseBoardState = (boardArray: BoardStateArray) => {
  // get 8x8 array of strings

  const rustToPiece = (pieceObj: RustPiece) => {
    let color: 'w' | 'b' =
      Object.values(pieceObj)[0][0] === 'Black' ? 'b' : 'w';
    let type = Object.keys(pieceObj)[0] as PieceType;
    switch (type) {
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
      default:
        return undefined;
    }
  };
  let state = boardArray.reduce<Position>((result, col, coli) => {
    col.forEach((sq, rowi) => {
      let piece = rustToPiece(sq as unknown as RustPiece);
      if (piece) result[coordToSquare(coli, rowi)] = piece;
    });
    return result;
  }, {});
  // alert(JSON.stringify(state));
  return state;
};

const highlightSquares = (
  moveOptions: MoveList,
  square?: Square,
): PositionStyles => {
  // turn this array of squares into an object with cssProperties defined
  const props = moveOptions.reduce<PositionStyles>((result, move, index) => {
    const [isAttack, col, row] = [move[1], move[0][0], move[0][1]];

    result[coordToSquare(col, row)] = {
      boxShadow: isAttack
        ? '0 0 8px #ea4c89, inset 0 0 8px #ea4c89'
        : '0 0 8px rgb(255, 255, 0), inset 0 0 1px 4px rgb(255, 255, 0)',
      width: '100%',
      height: '100%',
    };
    return result;
  }, {});
  if (square) {
    props[square] = {
      boxShadow: '0 0 8px black, inset 0 1px 4px black',
      width: '100%',
      height: '100%',
    };
    // { boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)' };
  }
  return props;
};

const startNewGame = (setPosition: (positions: Position) => void) => {
  invoke<BoardStateArray>('new_game').then((board) => {
    notify('starting new game', 'new_game');
    setPosition(parseBoardState(board));
    console.log(board);
  });
};

const getGameState = (setPosition: (positions: Position) => void) => {
  invoke<BoardStateArray>('get_state').then((board) => {
    console.log(board);
    setPosition(parseBoardState(board));
  });
};

export {
  parseBoardState,
  highlightSquares,
  startNewGame,
  getGameState,
  coordToSquare,
};
