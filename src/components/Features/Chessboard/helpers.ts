import { diff } from 'deep-diff';
import type { Square } from 'chess.js';
import type { FENpiece, Piece, Position } from './types';

export const ItemTypes = { PIECE: 'piece' };
export const COLUMNS = 'abcdefgh'.split('');

export const constructPositionAttributes = (
  currentPosition: string | Position,
  position: string | Position,
) => {
  const difference = diff(currentPosition, position);
  const squaresAffected = difference?.length || 0;
  const sourceSquare: Square =
    difference && difference[1] && difference && difference[1].kind === 'D'
      ? difference[1].path && difference[1].path[0]
      : difference[0].path && difference[0].path[0];
  const targetSquare: Square =
    difference && difference[1] && difference && difference[1].kind === 'D'
      ? difference[0] && difference[0].path[0]
      : difference[1] && difference[1].path[0];
  const sourcePiece: Piece =
    difference && difference[1] && difference && difference[1].kind === 'D'
      ? difference[1] && difference[1].lhs
      : difference[1] && difference[1].rhs;
  return { sourceSquare, targetSquare, sourcePiece, squaresAffected };
};

function isString(s: any): boolean {
  return typeof s === 'string';
}

// convert FEN string to a Position Object i.e. {'a1': 'wK',...}
export function fenToObj(fen: string): Position | false {
  if (!validFen(fen)) return false;
  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');
  let [rows, currentRow] = [fen.split('/'), 8];
  let position: Position = {};
  for (let i = 0; i < 8; i++) {
    let [row, colIdx] = [rows[i].split(''), 0];
    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        let numEmptySquares = parseInt(row[j], 10);
        colIdx += numEmptySquares;
      } else {
        // piece
        let square = (COLUMNS[colIdx] + currentRow) as Square;
        position[square] = fenToPieceCode(row[j] as FENpiece);
        colIdx += 1;
      }
    }

    currentRow = currentRow - 1;
  }

  return position;
}

// replace summed gaps between pieces with several '1' spacers
function expandFenEmptySquares(fen: string) {
  return fen
    .replace(/8/g, '11111111')
    .replace(/7/g, '1111111')
    .replace(/6/g, '111111')
    .replace(/5/g, '11111')
    .replace(/4/g, '1111')
    .replace(/3/g, '111')
    .replace(/2/g, '11');
}

// check if the input string is a valid FEN string
export function validFen(fen: string): boolean {
  if (!isString(fen)) return false;
  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');
  // expand the empty square numbers to just 1s
  fen = expandFenEmptySquares(fen);
  // FEN should be 8 sections separated by slashes
  let chunks = fen.split('/');
  if (chunks.length !== 8) return false;
  // check each section
  for (let i = 0; i < 8; i++) {
    if (chunks[i].length !== 8 || chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
      return false;
    }
  }
  return true;
}

// convert FEN piece code to bP, wK, etc
function fenToPieceCode(piece: FENpiece): Piece {
  // black piece
  if (piece.toLowerCase() === piece) {
    return ('b' + piece.toUpperCase()) as Piece;
  }
  // white piece
  return ('w' + piece.toUpperCase()) as Piece;
}

// check if the input square string conforms to the square syntax i.e. 'a1'
function validSquare(square: Square | string): boolean {
  return isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
}

// check if the input piece string conforms to the piece syntax i.e. 'bQ'
function validPieceCode(code: Piece | string): boolean {
  return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
}

// check if the input position object is valid
export function validPositionObject(pos: Position | string): boolean {
  if (pos === null || typeof pos !== 'object') return false;

  for (let square in Object.keys(pos)) {
    if (!pos.hasOwnProperty(square)) continue;
    if (
      !validSquare(square) ||
      !validPieceCode(pos[square as Square] as string)
    ) {
      // either the object key isn't a square or value isn't a piece
      return false;
    }
  }
  return true;
}

// replace placeholder '1' spacers with the sum of those spacers
function squeezeFenEmptySquares(fen: string) {
  return fen
    .replace(/11111111/g, '8')
    .replace(/1111111/g, '7')
    .replace(/111111/g, '6')
    .replace(/11111/g, '5')
    .replace(/1111/g, '4')
    .replace(/111/g, '3')
    .replace(/11/g, '2');
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece: Piece): FENpiece {
  let pieceCodeLetters = piece.split('');
  // white piece
  if (pieceCodeLetters[0] === 'w') {
    return pieceCodeLetters[1].toUpperCase() as FENpiece;
  }
  // black piece
  return pieceCodeLetters[1].toLowerCase() as FENpiece;
}

// position object to FEN string
// returns false if the obj is not a valid position object
export function objToFen(obj: Position): false | string {
  if (!validPositionObject(obj)) return false;
  let [fen, currentRow] = ['', 8];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = (COLUMNS[j] + currentRow) as Square;
      // if piece exists add it, otherwise add a '1' spacer
      fen += obj[square] ? pieceCodeToFen(obj[square] as Piece) : 1;
    }
    if (i !== 7) fen += '/';
    currentRow -= 1;
  }
  // squeeze the empty numbers together
  return squeezeFenEmptySquares(fen);
}
