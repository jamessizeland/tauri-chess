import React, {useEffect, useState, useContext, createContext} from 'react';
import Board from './Board';
import type { Position } from './types';
import isEqual from 'lodash.isequal';
import { DndProvider } from 'react-dnd';
	import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChessboardProps } from './types';
import SparePieces from './SparePieces';
import {
  fenToObj,
  validFen,
  validPositionObject,
  constructPositionAttributes,
} from './helpers';
import CustomDragLayer from './CustomDragLayer';
import defaultPieces from './svg/chesspieces/standard';
import ErrorBoundary from './ErrorBoundary';
import whiteKing from './svg/whiteKing';

const ChessboardContext = createContext<>();

const getPositionObject = (position: string | Position): Position => {
  if (position === 'start')
    return fenToObj('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  if (validFen(position as string)) return fenToObj(position as string);
  if (validPositionObject(position)) return position as Position;

  return {};
};

export const Chessboard = ({
  id = 0,
  position = {},
  pieces = {},
  width = 560,
  orientation = 'white',
  showNotation = true,
  sparePieces = false,
  draggable = true,
  undo = false,
  dropOffBoard = 'snapback',
  transitionDuration = 300,
  boardStyle = {},
  lightSquareStyle = { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle = { backgroundColor: 'rgb(181, 136, 99)' },
  dropSquareStyle = { boxShadow: 'inset 0 0 1px 4px yellow' },
  allowDrag = () => true,
  calcWidth,
  getPosition,
  onDragOverSquare,
  onDrop,
  onMouseOutSquare,
  onMouseOverSquare,
  onPieceClick,
  onSquareClick,
  onSquareRightClick,
  roughSquare,
  squareStyles,
}: ChessboardProps): JSX.Element => {

  const [screenWidth, setScreenWidth] = useState(width);
  const [screenHeight, setScreenHeight] = useState(width);
  
  useEffect(() => {
    const updateWindowDimensions = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    }
  }, [])
  




  // static Consumer = ChessboardContext.Consumer;

  // state = {
  //   previousPositionFromProps: getPositionObject(this.props.position),
  //   currentPosition: getPositionObject(this.props.position),
  //   sourceSquare: '',
  //   targetSquare: '',
  //   sourcePiece: '',
  //   waitForTransition: false,
  //   phantomPiece: null,
  //   wasPieceTouched: false,
  //   manualDrop: false,
  //   squareClicked: false,
  //   firstMove: false,
  //   pieces: { ...defaultPieces, ...this.props.pieces },
  //   undoMove: this.props.undo,
  // };

  

  // componentDidUpdate(prevProps) {
  //   const { position, transitionDuration, getPosition } = this.props;
  //   const { waitForTransition, undoMove } = this.state;
  //   const positionFromProps = getPositionObject(position);
  //   const previousPositionFromProps = getPositionObject(prevProps.position);

  //   // Check if there is a new position coming from props or undo is called
  //   if (!isEqual(positionFromProps, previousPositionFromProps) || undoMove) {
  //     this.setState({
  //       previousPositionFromProps: previousPositionFromProps,
  //       undoMove: false,
  //     });

  //     // get board position for user
  //     getPosition(positionFromProps);

  //     // Give piece time to transition.
  //     if (waitForTransition) {
  //       return new Promise((resolve) => {
  //         this.setState({ currentPosition: positionFromProps }, () =>
  //           setTimeout(() => {
  //             this.setState({ waitForTransition: false });
  //             resolve();
  //           }, transitionDuration),
  //         );
  //       }).then(() =>
  //         setTimeout(
  //           () => this.setState({ phantomPiece: null }),
  //           transitionDuration,
  //         ),
  //       );
  //     }
  //   }
  // }

  static getDerivedStateFromProps(props, state) {
    const { position, undo } = props;
    const { currentPosition, manualDrop, squareClicked } = state;
    let positionFromProps = getPositionObject(position);

    // If positionFromProps is a new position then execute, else return null
    if (!isEqual(positionFromProps, currentPosition)) {
      // Position attributes from the diff between currentPosition and positionFromProps
      const { sourceSquare, targetSquare, sourcePiece, squaresAffected } =
        constructPositionAttributes(currentPosition, positionFromProps);

      if (manualDrop) {
        return {
          sourceSquare,
          targetSquare,
          sourcePiece,
          currentPosition: positionFromProps,
          waitForTransition: false,
          manualDrop: false,
        };
      }

      /* If the new position involves many pieces, then disregard the transition effect.
        Possible to add functionality for transitioning of multiple pieces later */
      if (squaresAffected && squaresAffected !== 2) {
        return {
          currentPosition: positionFromProps,
          waitForTransition: false,
          manualDrop: false,
          sourceSquare,
          targetSquare,
          sourcePiece,
        };
      }

      // Check if currentPosition has a piece occupying the target square
      if (currentPosition[targetSquare]) {
        // Temporarily delete the target square from the new position
        delete positionFromProps[targetSquare];

        return {
          sourceSquare,
          targetSquare,
          sourcePiece,
          // Set the current position to the new position minus the targetSquare
          currentPosition: positionFromProps,
          waitForTransition: squareClicked ? false : true,
          phantomPiece: squareClicked
            ? null
            : { [targetSquare]: currentPosition[targetSquare] },
          manualDrop: false,
          squareClicked: false,
        };
      }

      // allows for taking back a move
      if (undo) {
        return {
          sourceSquare,
          targetSquare,
          sourcePiece,
          currentPosition: positionFromProps,
          waitForTransition: true,
          manualDrop: false,
          squareClicked: false,
          undoMove: true,
        };
      }

      return {
        sourceSquare,
        targetSquare,
        sourcePiece,
        currentPosition: positionFromProps,
        waitForTransition: squareClicked ? false : true,
        manualDrop: false,
        squareClicked: false,
      };
    }

    // default case
    return null;
  }

  const wasManuallyDropped = (bool) => this.setState({ manualDrop: bool });
  const wasSquareClicked = (bool) => this.setState({ squareClicked: bool });

  /* Called on drop if there is no onDrop prop.  This is what executes when a position does not
   change through the position prop, i.e., simple drag and drop operations on the pieces.*/
  const setPosition = ({ sourceSquare, targetSquare, piece }) => {
    const { currentPosition } = this.state;
    const { getPosition, dropOffBoard } = this.props;

    if (sourceSquare === targetSquare) return;

    if (dropOffBoard === 'trash' && !targetSquare) {
      let newPosition = currentPosition;
      delete newPosition[sourceSquare];
      this.setState({ currentPosition: newPosition, manualDrop: true });
      // get board position for user
      return getPosition(currentPosition);
    }

    let newPosition = currentPosition;
    sourceSquare !== 'spare' && delete newPosition[sourceSquare];
    newPosition[targetSquare] = piece;

    this.setState({ currentPosition: newPosition, manualDrop: true });
    // get board position for user
    getPosition(currentPosition);
  };

  // Allows for touch drag and drop
  const setTouchState = (e) => this.setState({ wasPieceTouched: e.isTrusted });

  const getWidth = () => {
    const { calcWidth, width } = this.props;
    const { screenWidth, screenHeight } = this.state;
    return calcWidth({ screenWidth, screenHeight })
      ? calcWidth({ screenWidth, screenHeight })
      : width;
  };

    const getScreenDimensions = screenWidth && screenHeight;

    return (
      <ErrorBoundary>
        <DndProvider backend={HTML5Backend}>

        <ChessboardContext.Provider
          value={{
            ...this.props,
            pieces,
            orientation: orientation.toLowerCase(),
            dropOffBoard: dropOffBoard.toLowerCase(),
            ...{
              width: this.getWidth(),
              sourceSquare,
              targetSquare,
              sourcePiece,
              waitForTransition,
              phantomPiece,
              setPosition: this.setPosition,
              manualDrop,
              setTouchState: this.setTouchState,
              currentPosition,
              screenWidth,
              screenHeight,
              wasManuallyDropped: this.wasManuallyDropped,
              wasSquareClicked: this.wasSquareClicked,
            },
          }}
        >
          <div>
            {getScreenDimensions && sparePieces && <SparePieces.Top />}
            {getScreenDimensions && <Board />}
            {getScreenDimensions && sparePieces && <SparePieces.Bottom />}
          </div>
          <CustomDragLayer
            width={this.getWidth()}
            pieces={pieces}
            id={id}
            wasPieceTouched={wasPieceTouched}
            sourceSquare={targetSquare}
            />
        </ChessboardContext.Provider>
            </DndProvider>
      </ErrorBoundary>
    );
}

export default Chessboard;
