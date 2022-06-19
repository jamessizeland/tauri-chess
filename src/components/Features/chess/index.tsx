import react from 'React';
import Chessboard, { Position, Piece } from 'chessboardjsx';
import { Square } from 'chess.js';
import { notify } from 'services/notifications';
import { invoke } from '@tauri-apps/api/tauri';
import type {
  BoardStateArray,
  RustPiece,
  PieceType,
  PositionStyles,
} from './types';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
} from 'components/Elements/';

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

const highlightSquares = (squares: Square[]): PositionStyles => {
  // turn this array of squares into an object with cssProperties defined
  const props = squares.reduce<PositionStyles>((result, item, index) => {
    result[item] = { backgroundColor: 'yellow', borderRadius: '50%' };
    return result;
  }, {});
  console.log(props);
  return props;
};

const startNewGame = (setPosition: (positions: Position) => void) => {
  invoke<BoardStateArray>('new_game').then((board) => {
    notify('starting new game');
    setPosition(parseBoardState(board));
  });
};

//? need to figure out how to do a new context for this
// const NewGamePopup = (): JSX.Element => {
//   const { open, toggle } = useToggle();
//   return (
//     <div className="mb-8">
//       <h2 className="mb-3 mt-12 text-gray-600 text-lg font-bold md:text-2xl">
//         With animation
//       </h2>
//       <Button onClick={toggle} color="primary">
//         Click to open me
//       </Button>
//       <Modal
//         isOpen={open}
//         toggle={toggle}
//         animate={true}
//         closeOnClickOutside={false}
//       >
//         <ModalHeader>Chess</ModalHeader>
//         <ModalBody>Start New Game?</ModalBody>
//         <ModalFooter>
//           <Button onClick={toggle} color="danger" className="mr-1">
//             Close
//           </Button>
//           <Button onClick={toggle} color="primary">
//             Confirm
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// };

export { parseBoardState, highlightSquares, startNewGame };
