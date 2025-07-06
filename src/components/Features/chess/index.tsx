import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/core';
import {
  BoardStateArray,
  RustPiece,
  PieceType,
  PositionStyles,
  MoveList,
  MetaGame,
  MoveType,
  Square,
  Position,
  Piece,
} from 'types';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'components/Elements';

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
  const props = moveOptions.reduce<PositionStyles>((result, move) => {
    const [moveType, col, row] = [move[1], move[0][0], move[0][1]];
    const highlightColour = (moveType: MoveType) => {
      console.log(moveType);
      switch (moveType) {
        case 'Move':
          return '0 0 8px #a5eed9, inset 0 0 1px 4px #a5eed9';
        case 'Capture':
          return '0 0 8px #ea4c89, inset 0 0 1px 4px #ea4c89';
        case 'Castle':
          return '0 0 8px #11dd71, inset 0 0 1px 4px #11dd71';
        case 'Double':
          return '0 0 8px #11dd71, inset 0 0 1px 4px #11dd71';
        case 'EnPassant':
          return '0 0 8px #004d71, inset 0 0 1px 4px #004d71';
        default:
          return '0 0 8px black, inset 0 1px 4px black';
      }
    };

    result[coordToSquare(col, row)] = {
      boxShadow: highlightColour(moveType),
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

const AskNewGame: React.FC<{
  setPosition: (position: Position) => void;
  setGameMeta: (meta: MetaGame) => void;
  isOpen: boolean;
  toggle: () => void;
}> = ({ setPosition, setGameMeta, isOpen, toggle }) => {
  return (
    <Modal toggle={toggle} isOpen={isOpen} animate position="extraLarge">
      <ModalHeader>Welcome to Tauri Chess</ModalHeader>
      <ModalBody>Do you want to start a new game?</ModalBody>
      <ModalFooter>
        <Button className="mr-2" onClick={() => toggle()}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            invoke<BoardStateArray>('new_game').then((board) => {
              setPosition(parseBoardState(board));
              console.log(board);
            });
            invoke<MetaGame>('get_score').then((meta) => setGameMeta(meta));
            toggle();
          }}
        >
          New
        </Button>
      </ModalFooter>
    </Modal>
  );
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
  AskNewGame,
  getGameState,
  coordToSquare,
};
