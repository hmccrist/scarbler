import * as React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { ScrabbleSquare, ScrabbleSquareProps } from './scrabbleSquare';
import { ArrowType } from './scarbleState';

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #3884a7 30%, #56aad1 90%)',
        color: 'white',
        border: '1px solid black',
        display: 'block',
        flexDirection: 'column',
        //maxWidth: '100%',
        //height: '100%',
        //maxHeight: '100%',
    },
    row: {
        width: '100%',
        height: '100%',
		display: 'flex',
		flexDirection: 'row',
    }
});


const squareColours = {
    colour1: 'rgb(100, 100, 100)',
    colour2: 'rgb(105, 105, 105)',
    doubleLetterColor: 'rgb(59, 108, 122)',
    doubleWordColor: 'rgb(118, 67, 67)',
    tripleLetterColor: 'rgb(5, 68, 85)',
    tripleWordColor: 'rgb(73, 34, 34)',
}

const doubleLetterCoords = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221]
const doubleWordCoords = [16, 28, 32, 42, 48, 56, 64, 70, 112, 154, 160, 168, 176, 182, 192, 196, 208]
const tripleLetterCoords = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204]
const tripleWordCoords = [0, 7, 14, 105, 119, 210, 217, 224]

function getSquareColor(squareIndex: number): string {
    if (doubleLetterCoords.includes(squareIndex)) {
        return squareColours.doubleLetterColor;
    }
    else if (doubleWordCoords.includes(squareIndex)) {
        return squareColours.doubleWordColor;
    }
    else if (tripleLetterCoords.includes(squareIndex)) {
        return squareColours.tripleLetterColor;
    }
    else if (tripleWordCoords.includes(squareIndex)) {
        return squareColours.tripleWordColor;
    }

    if (squareIndex % 2 === 0) {
        return squareColours.colour1;
    }
    return squareColours.colour2;
}

export type ScrabbleBoardProps = {
    boardState: string[],
    onChange: (e: any, squareNumber: number) => void;
    focusValues: boolean[],
    onMouseEnter: (e: any, squareNumber: number) => void;
    displayArrows: ArrowType[],
    onClick: (squareNumber: number) => void;
    ghostBoardState: string[],
}

function ScrabbleBoard(props: ScrabbleBoardProps) {
    const styles = useStyles()

    function createProps(squareNumber: number): ScrabbleSquareProps {
        return {
            value: props.boardState[squareNumber],
            onChange: (e) => props.onChange(e, squareNumber),
            shouldFocus: props.focusValues[squareNumber],
            color: getSquareColor(squareNumber),
            coordinate: squareNumber.toString(),
            onMouseEnter: (e) => props.onMouseEnter(e, squareNumber),
            displayArrow: props.displayArrows[squareNumber],
            onClick: () => props.onClick(squareNumber),
            ghostValue: props.ghostBoardState[squareNumber],
        }
    }

    function createBoard() {
        let boardJSX = [];
        let squareCounter = 0;
        for (let i = 0; i < 15; i++) {
            let squaresJSX = []
            for (let j = 0; j < 15; j++) {
                squaresJSX.push(<ScrabbleSquare {...createProps(squareCounter)} key={squareCounter} />);
                squareCounter++;
            }
            boardJSX.push(<div className={styles.row} key={i}>{squaresJSX}</div>);
        }
        return boardJSX;
    }

    return (
        <div className={styles.root}>
            {createBoard()}
        </div>
    );
}

export default ScrabbleBoard;