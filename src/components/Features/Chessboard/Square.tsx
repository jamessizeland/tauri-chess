import React, { ReactNode, useEffect, useState, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import {useDrop} from 'react-dnd';
import { Square } from 'chess.js';
// import type {} from './types'
import { ItemTypes } from './helpers';

const Square = (
  connectDropTarget: () => void,
  width: number,
  squareColor: 'white' | 'black',
  children: ReactNode,
  isOver: boolean,
  square: Square,
  setSquareCoordinates: () => void,
  lightSquareStyle: CSSProperties,
  darkSquareStyle: CSSProperties,
  roughSquare: () => void,
  onMouseOverSquare: () => void,
  onMouseOutSquare: () => void,
  dropSquareStyle: CSSProperties,
  screenWidth: number,
  screenHeight: number,
  squareStyles: CSSProperties,
  onDragOverSquare: () => void,
  onSquareClick: () => void,
  wasSquareClicked: () => void,
  onSquareRightClick: () => void,
) => {

  useEffect(() => {
    roughSquare({ squareElement: this.roughSquareSvg, squareWidth: width / 8 });
    const { x, y } = this[square].getBoundingClientRect();
    setSquareCoordinates(x, y, square);

    return () => {
    }
  }, [])

  componentDidUpdate(prevProps) {
    const {
      screenWidth,
      screenHeight,
      square,
      setSquareCoordinates
    } = this.props;

    const didScreenSizeChange =
      prevProps.screenWidth !== screenWidth ||
      prevProps.screenHeight !== screenHeight;

    if (didScreenSizeChange) {
      const { x, y } = this[square].getBoundingClientRect();
      setSquareCoordinates(x, y, square);
    }
  }

  onClick = () => {
    this.props.wasSquareClicked(true);
    this.props.onSquareClick(this.props.square);
  };

    return connectDropTarget(
      <div
        data-testid={`${squareColor}-square`}
        data-squareid={square}
        ref={ref => (this[square] = ref)}
        style={defaultSquareStyle(this.props)}
        onMouseOver={() => onMouseOverSquare(square)}
        onMouseOut={() => onMouseOutSquare(square)}
        onDragEnter={() => onDragOverSquare(square)}
        onClick={() => this.onClick()}
        onContextMenu={e => {
          e.preventDefault();
          onSquareRightClick(square);
        }}
      >
        <div
          style={{
            ...size(width),
            ...center,
            ...(squareStyles[square] && squareStyles[square])
          }}
        >
          {roughSquare.length ? (
            <div style={center}>
              {children}
              <svg
                style={{
                  ...size(width),
                  position: 'absolute',
                  display: 'block'
                }}
                ref={ref => (this.roughSquareSvg = ref)}
              />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }
}

const squareTarget = {
  drop(props, monitor) {
    return {
      target: props.square,
      board: props.id,
      piece: monitor.getItem().piece,
      source: monitor.getItem().source
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export default DropTarget(ItemTypes.PIECE, squareTarget, collect)(Square);

const defaultSquareStyle = (props: any) => {
  const {
    width,
    squareColor,
    isOver,
    darkSquareStyle,
    lightSquareStyle,
    dropSquareStyle
  } = props;

  return {
    ...{
      ...size(width),
      ...center,
      ...(squareColor === 'black' ? darkSquareStyle : lightSquareStyle),
      ...(isOver && dropSquareStyle)
    }
  };
};

const center: CSSProperties = {
  display: 'flex',
  justifyContent: 'center'
};

const size = (width: number): CSSProperties => ({
  width: width / 8,
  height: width / 8
});
