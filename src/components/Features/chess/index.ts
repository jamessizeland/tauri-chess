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

const parseBoardState = (boardArray: BoardStateArray) => {
  // get 8x8 array of strings
  const coordToSquare = (row: number, col: number) => {
    const colRef = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    // construct the square from the row/col coords
    let square: Square = `${colRef[row]}${col + 1}` as Square;
    // console.log({ square });
    return square;
  };

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
  let state = boardArray.reduce<Position>((result, row, rowi) => {
    row.forEach((sq, coli) => {
      let piece = rustToPiece(sq as unknown as RustPiece);
      if (piece) result[coordToSquare(rowi, coli)] = piece;
    });
    return result;
  }, {});
  console.log({ state });
  // alert(JSON.stringify(state));
  return state;
};

const numToLetter = (num: number) => (num + 9).toString(36);

const coordToSquare = (row: number, col: number) => {
  return `${numToLetter(row + 1)}${col + 1}` as keyof PositionStyles;
};

const highlightSquares = (
  moveOptions: MoveList,
  square?: Square,
): PositionStyles => {
  // turn this array of squares into an object with cssProperties defined
  const props = moveOptions.reduce<PositionStyles>((result, move, index) => {
    const [isAttack, row, col] = [move[1], move[0][0], move[0][1]];

    result[coordToSquare(row, col)] = {
      backgroundColor: isAttack ? 'red' : 'yellow',
      borderRadius: '50%',
    };
    return result;
  }, {});
  if (square) {
    props[square] = { boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)' };
  }
  return props;
};

const startNewGame = (setPosition: (positions: Position) => void) => {
  invoke<BoardStateArray>('new_game').then((board) => {
    notify('starting new game', 'new_game');
    setPosition(parseBoardState(board));
  });
};

const getGameState = (setPosition: (positions: Position) => void) => {
  invoke<BoardStateArray>('get_state').then((board) => {
    setPosition(parseBoardState(board));
  });
};

export { parseBoardState, highlightSquares, startNewGame, getGameState };
