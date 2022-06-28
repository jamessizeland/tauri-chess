import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';

import Piece from './Piece';
import Chessboard from './index';
import { Orientation } from './types';

function SparePiecesTop(): JSX.Element {
  return <SparePieces top />;
}

function SparePiecesBottom(): JSX.Element {
  return <SparePieces />;
}

class SparePieces extends Component {
  static propTypes = { top: PropTypes.bool };

  static Top = SparePiecesTop;
  static Bottom = SparePiecesBottom;

  getOrientation = (orientation: Orientation) => {
    const { top } = this.props;
    if (top) {
      return orientation === 'black' ? 'white' : 'black';
    }
    return orientation === 'black' ? 'black' : 'white';
  };

  render() {
    return (
      <Chessboard.Consumer>
        {(context) => {
          const spares =
            this.getOrientation(context.orientation) === 'black'
              ? ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP']
              : ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];

          return (
            <div style={spareStyles(context.width)}>
              {spares.map((p) => (
                <div data-testid={`spare-${p}`} key={p}>
                  <Piece
                    piece={p}
                    width={context.width}
                    setPosition={context.setPosition}
                    square={'spare'}
                    dropOffBoard={context.dropOffBoard}
                    draggable={true}
                    onDrop={context.onDrop}
                    sourceSquare={context.sourceSquare}
                    targetSquare={context.targetSquare}
                    sourcePiece={context.sourcePiece}
                    orientation={context.orientation}
                    manualDrop={context.manualDrop}
                    id={context.id}
                    pieces={context.pieces}
                    wasManuallyDropped={context.wasManuallyDropped}
                    onPieceClick={context.onPieceClick}
                    allowDrag={context.allowDrag}
                  />
                </div>
              ))}
            </div>
          );
        }}
      </Chessboard.Consumer>
    );
  }
}

export default SparePieces;

const spareStyles = (width: number): CSSProperties => ({
  display: 'flex',
  justifyContent: 'center',
  width,
});
