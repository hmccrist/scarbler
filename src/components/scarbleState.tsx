import { useState } from 'react';
import FileSaver from 'file-saver';
import { ScrabbleWord } from './wordFinder';


// hook

type Direction = 'up' | 'right' | 'down' | 'left';
export type ArrowType = 'right' | 'down' | null;

const numToLetter = new Map([
    [1, "A"],
    [2, "B"],
    [3, "C"],
    [4, "D"],
    [5, "E"],
    [6, "F"],
    [7, "G"],
    [8, "H"],
    [9, "I"],
    [10, "J"],
    [11, "K"],
    [12, "L"],
    [13, "M"],
    [14, "N"],
    [15, "O"],
])

export function getISCCoord(index: number): string {
    let division = Math.floor(index / 15);
    let remainder = index % 15;
    let letter = numToLetter.get(division + 1)
    return `${letter}${remainder + 1}`
}

export function useScarbleState() {
    const maxScrabbleSquares = 225;
    const [boardState, setBoardState] = useState(Array<string>(maxScrabbleSquares).fill(''));
    const [focusValues, setFocusValues] = useState(Array<boolean>(maxScrabbleSquares).fill(false));
    const [hoveredCoord, setHoveredCoord] = useState('');
    const [ISCCoord, setISCCoord] = useState('')
    const [displayArrows, setDisplayArrows] = useState(Array<ArrowType>(maxScrabbleSquares).fill(null));
    const [ghostBoardState, setGhostBoardState] = useState(Array<string>(maxScrabbleSquares).fill(''));

    // Get the index of a square in a cardinal direction on the board. Doesn't wrap around/over/under board.
    // Returns null if there is no square in that direction!
    function getSquareIndex(currSquare: number, dir: Direction): number | null {
        const rowLength = 15;
        if (dir === "right") {
            return currSquare % rowLength === rowLength - 1 ? null : currSquare + 1;
        }
        else if (dir === "left") {
            return currSquare % rowLength === 0 ? null : currSquare - 1;
        }
        else if (dir === "up") {
            return currSquare - rowLength < 0 ? null : currSquare - rowLength;
        }
        else if (dir === "down") {
            return currSquare + rowLength > boardState.length ? null : currSquare + rowLength;
        }
        return null;
    }

    function changeFocus(currSquare: number, dir: Direction): void {
        const nextSquare = getSquareIndex(currSquare, dir);
        if (nextSquare === null) {
            return;
        }
        const newFocusValues = Array<boolean>(maxScrabbleSquares).fill(false);
        newFocusValues[nextSquare] = true;
        setFocusValues(newFocusValues);
        //console.log(`changing focus to square: ${nextSquare}`);
    }

    function moveArrow(currSquare: number, dir: Direction): void {
        const nextSquare = getSquareIndex(currSquare, dir);
        const currArrowDir = displayArrows[currSquare];
        if (nextSquare === null) {
            return;
        }
        const newDisplayArrows = Array<ArrowType>(maxScrabbleSquares).fill(null);
        newDisplayArrows[nextSquare] = currArrowDir;
        setDisplayArrows(newDisplayArrows);
    }

    function clearFocus(): void {
        const newFocusValues = Array<boolean>(maxScrabbleSquares).fill(false);
        setFocusValues(newFocusValues);
    }

    function clearBoard(): void {
        const emptyBoardState = Array<string>(maxScrabbleSquares).fill('');
        setBoardState(emptyBoardState);
    }

    function clearDisplayArrows(): void {
        const emptyDisplayArrows = Array<ArrowType>(maxScrabbleSquares).fill(null);
        setDisplayArrows(emptyDisplayArrows);
    }

    function handleChange(e: any, scrabbleSquare: number): void {
        const inputType = e.nativeEvent.inputType;
        const newVal = e.nativeEvent.data;
        const arrowDir = displayArrows[scrabbleSquare];
        // arrowDir is null when the mouse exits the board and a square is still focused (and input is given)
        if (arrowDir === null) {
            return;
        }
        clearDisplayArrows()
        
        //console.log(`scrabbleSquare[${scrabbleSquare}] recieved input: ${inputType} val: ${newVal}`)
        if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
            const newBoardValues = boardState.slice();
            newBoardValues[scrabbleSquare] = '';
            setBoardState(newBoardValues);
            changeFocus(scrabbleSquare, arrowDir === 'right' ? 'left' : 'up');
            moveArrow(scrabbleSquare, arrowDir === 'right' ? 'left' : 'up');
            return;
        }
        if (newVal == null) {
            return;
        }
        // regex checks if its any uppercase/lowercase letter from a-z
        if (!newVal.match(/[A-Za-z]/)) {
            return;
        }
        const newBoardValues = boardState.slice();
        newBoardValues[scrabbleSquare] = newVal.toUpperCase();
        changeFocus(scrabbleSquare, arrowDir);
        moveArrow(scrabbleSquare, arrowDir);
        setBoardState(newBoardValues);
        return;
    }

    function handleMouseEnter(e: any, scrabbleSquare: number): void {
        setHoveredCoord(scrabbleSquare.toString());
        setISCCoord(getISCCoord(scrabbleSquare))
        clearFocus();       // this might be inefficient? not sure, if performance issues change this func.
    }

    function handleClick(scrabbleSquare: number): void {
        const currArrow = displayArrows[scrabbleSquare];
        let nextArrow: ArrowType = null;
        // cycle arrow from null -> right -> down
        if (currArrow === null) {
            nextArrow = 'right';
        }
        else if (currArrow === 'right') {
            nextArrow = 'down';
        }
        else if (currArrow === 'down') {
            nextArrow = 'right'
        }
        const newDisplayArrows = Array<ArrowType>(maxScrabbleSquares).fill(null);
        newDisplayArrows[scrabbleSquare] = nextArrow;
        setDisplayArrows(newDisplayArrows)
    }

    function handleMouseExitBoard(): void {
        clearDisplayArrows();
        clearFocus();
        setHoveredCoord('');
        setISCCoord('');
    }

    function exportBoardState(): void {
        const json = JSON.stringify(boardState);
        const blob = new Blob([json], {type: "application/json"})
        FileSaver.saveAs(blob, "scrabbleboard.json");
    }

    function importBoardState(files: FileList | null): void {
        if (files === null) { return; }
        const file = files[0];
        (async () => {
            const fileContent = await file.text();
            console.log(JSON.parse(fileContent));
            const importedBoard: Array<string> = JSON.parse(fileContent);
            // very simple check for a legit json file
            let validContent = true;
            try {
                importedBoard.forEach((letter) => {
                    if (letter.length > 1) { validContent = false; }
                })
            }
            catch(err) {
                validContent = false;
                console.error('Invalid JSON file!')
            }
            if (validContent) { setBoardState(importedBoard) }
            else { console.error("Invalid JSON file!")}
        })()
        
    }

    function placeWordOnBoard(word: string, index: number, dir: 'right' | 'down', board: Array<string>): Array<string> {
        const newBoard = board.slice();
        const wordArr = word.split('');
        let currSquare = index;
        wordArr.forEach((letter) => {
            newBoard[currSquare] = letter;
            const nextSquare = getSquareIndex(currSquare, dir);
            if (nextSquare !== null) { currSquare = nextSquare; }
        })
        return newBoard;
    }

    function handleHoverOnResultRow(scrabbleWord: ScrabbleWord): void {
        const emptyGhostBoardState = Array<string>(maxScrabbleSquares).fill('');
        const newGhostBoardState = placeWordOnBoard(scrabbleWord.word, scrabbleWord.index, scrabbleWord.dir, emptyGhostBoardState);
        setGhostBoardState(newGhostBoardState);
    }

    function handleHoverLeaveOnResultRow(): void {
        const emptyGhostBoardState = Array<string>(maxScrabbleSquares).fill('');
        setGhostBoardState(emptyGhostBoardState);
    }

    function handleClickOnResultRow(scrabbleWord: ScrabbleWord): Array<string> {
        const copyOfBoardState = boardState.slice();
        const newBoardState = placeWordOnBoard(scrabbleWord.word, scrabbleWord.index, scrabbleWord.dir, copyOfBoardState);
        setBoardState(newBoardState);
        return newBoardState;
    }
    

    return {
        boardState,
        handleChange,
        focusValues,
        handleMouseEnter,
        hoveredCoord,
        ISCCoord,
        clearBoard,
        displayArrows,
        handleClick,
        handleMouseExitBoard,
        exportBoardState,
        importBoardState,
        ghostBoardState,
        handleHoverOnResultRow,
        handleHoverLeaveOnResultRow,
        handleClickOnResultRow,
    }
}