import { useState } from "react";
import { anadict, TWL06Dict } from "../dict/anadict";

const letterScores = new Map([
    ["A", 1],
    ["B", 3],
    ["C", 3],
    ["D", 2],
    ["E", 1],
    ["F", 4],
    ["G", 2],
    ["H", 4],
    ["I", 1],
    ["J", 8],
    ["K", 5],
    ["L", 1],
    ["M", 3],
    ["N", 1],
    ["O", 1],
    ["P", 3],
    ["Q", 10],
    ["R", 1],
    ["S", 1],
    ["T", 1],
    ["U", 1],
    ["V", 4],
    ["W", 4],
    ["X", 8],
    ["Y", 4],
    ["Z", 10],
])

const doubleLetterCoords = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221]
const doubleWordCoords = [16, 28, 32, 42, 48, 56, 64, 70, 112, 154, 160, 168, 176, 182, 192, 196, 208]
const tripleLetterCoords = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204]
const tripleWordCoords = [0, 7, 14, 105, 119, 210, 217, 224]

const startingSquareIndex: number = 112;    // The only square you can put a word down onto with no connections.

export type ScrabbleWord = {
    word: string,
    index: number,
    dir: 'right' | 'down',
    score: number,
    rackLetters: Array<string>,
}

// yoinked online somewhere, returns an array of strings of every combination of a string.
// does not return any duplicates.
function substrings(str1: string): Array<string>
{
    var array1 = [];
    for (var x = 0, y=1; x < str1.length; x++,y++) 
    {
    array1[x]=str1.substring(x, y);
        }
    var combi = new Set<string>();
    var temp= "";
    var slent = Math.pow(2, array1.length);

    for (var i = 0; i < slent ; i++)
    {
        temp= "";
        for (var j=0;j<array1.length;j++) {
            if ((i & Math.pow(2,j))){ 
                temp += array1[j];
            }
        }
        if (temp !== "" && temp.length > 1)
        {
            combi.add(temp);
        }
    }
    return(Array.from(combi));
}

// Helper function for getting adjacent squares on the board using the string array.
function getAdjacentSquareIndex(currSquare: number, dir: 'left' | 'right' | 'down' | 'up'): number | null {
    const boardSize = 225;
    const rowLength = 15;   // how long the row on the board is
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
        return currSquare + rowLength > boardSize - 1 ? null : currSquare + rowLength;
    }
    return null;
}

export function useWordFinder() {
    const [highestScoring, setHighestScoring] = useState(Array<ScrabbleWord>());
    const [longestWords, setLongestWords] = useState(Array<ScrabbleWord>());
    //const [customWords, setCustomWords] = useState(Array<string>(MAX_ARRAY_SIZE).fill(''));

    function findAllPossibleWords(letterArr: Array<string>): Array<string> {
        const letters: string = letterArr.slice().sort().join('');          // slice copys it into a NEW array, sort alphabetically than flatten into string with join('')
        //console.log(`Searching for all possible words with letters: ${letters}`)        //
        let possibleWords: Array<string> = [];
        const combinations = substrings(letters);
        combinations.forEach((combination) => {
            if (anadict.has(combination)) {
                const words: string[] | undefined = anadict.get(combination);
                if (words !== undefined) {
                    words.forEach((word) => { possibleWords.push(word) })
                }
            }
        })
        
        // console.log(`Found ${possibleWords.length} words: \n${possibleWords}`)          //
        return possibleWords;

    }

    function analyseBoard(board: Array<string>, rackArr: Array<string>): void {
        console.log("starting board analysis...")
        console.time('anaylseBoard runtime: ')
        const rackWords = findAllPossibleWords(rackArr);
        let allWords: Array<string> = [];
        let allScrabbleWords: Array<ScrabbleWord> = [];
        //console.log(`ALL RACK WORDS: ${rackWords}`);

        for (let i = 0; i < board.length; i++) {
            // console.log(`# # # Checking square ${i} # # #`);
            let rightSquares = getAdjacentSquareIndexs(i, 6, 'right');
            let downSquares = getAdjacentSquareIndexs(i, 6, 'down');
            let rightLetters: Array<string> = [];
            let downLetters: Array<string> = [];
            let rightHasSpace = false;
            let downHasSpace = false;
            let spacesToRightLetter = 99;
            let spacesToDownLetter = 99;
            let rightHasAdjacent = false;
            let spacesToRightAdjacent = 99;
            let spacesToDownAdjacent = 99;
            let downHasAdjacent = false;
            let canPlaceWordRight = true;
            let canPlaceWordDown = true;
            let possibleRightWords: Array<string> = [];
            let possibleDownWords: Array<string> = [];

            // Possible downSquares and rightSquares shouldn't stop until an empty space is found.
            for (let i = 0; i < 15; i++) {
                if (board[rightSquares[rightSquares.length-1]] !== '') {
                    const next = (getAdjacentSquareIndex(rightSquares[rightSquares.length-1], 'right',));
                    if (next === null) { break; }
                    rightSquares.push(next);
                }
            }

            for (let i = 0; i < 15; i++) {
                if (board[downSquares[downSquares.length-1]] !== '') {
                    const next = (getAdjacentSquareIndex(downSquares[downSquares.length-1], 'down',));
                    if (next === null) { break; }
                    downSquares.push(next);
                }
            }
            
            // Give rightLetters and downLetters there values, also checking if there are any adjacent squares.
            rightSquares.forEach((val, index) => {
                const letter = board[val];
                if (letter === '') {
                    rightHasSpace = true;
                }
                else {
                    rightLetters.push(letter)
                    if (spacesToRightLetter === 99) { spacesToRightLetter = index + 1; }
                }
                // check if it has adjacents
                if (rightHasAdjacent === false && squareHasAdjacentLetters(board, val, 'vertical')) {
                    rightHasAdjacent = true;
                    spacesToRightAdjacent = index + 1;
                }
            })

            downSquares.forEach((val, index) => {
                const letter = board[val];
                if (letter === '') {
                    downHasSpace = true;
                }
                else {
                    downLetters.push(letter);
                    if (spacesToDownLetter === 99) { spacesToDownLetter = index + 1; }
                }
                // check if it has adjacents
                if (downHasAdjacent === false && squareHasAdjacentLetters(board, val, 'horizontal')) {
                    downHasAdjacent = true;
                    spacesToDownAdjacent = index + 1;
                }
            })

            // console.log(`hasRightAdjacents: ${rightHasAdjacent}`);
            // console.log(`Spaces to rightAdjacentSquare = ${spacesToRightAdjacent}`)
            // console.log(`rightLetters: ${rightLetters}`);

            // console.log(`downSquares: ${downSquares}`)
            // console.log(`hasDownAdjacents: ${downHasAdjacent}`);
            // console.log(`Spaces to downAdjacentSquare = ${spacesToDownAdjacent}`)
            // console.log(`downLetters: ${downLetters}`);

            // If there are no spaces to place word OR all spaces are empty with no adjacents, then it is not possible to place a word.
            // This doesn't matter if we're considering the center square.
            if (!rightHasSpace || (rightLetters.length === 0 && !rightHasAdjacent)) {
                canPlaceWordRight = false;
            }
            if (!downHasSpace || (downLetters.length === 0 && !downHasAdjacent)) {
                canPlaceWordDown = false;
            }

            // Unique case for if the center square is involved.
            if (rightSquares.includes(startingSquareIndex)) {
                canPlaceWordRight = true;
                spacesToRightLetter = rightSquares.indexOf(startingSquareIndex) + 1;
            }
            if (downSquares.includes(startingSquareIndex)) {
                canPlaceWordDown = true;
                spacesToDownLetter = downSquares.indexOf(startingSquareIndex) + 1;
            }

            if (!canPlaceWordRight && !canPlaceWordDown) {
                continue;       // continue skips the rest of this particular loop, but doesn't break the entire for loop.
            }


            let validRightWords: Array<string> = [];
            let validDownWords: Array<string> = [];

            // If there are no new letters from the board we don't need to generate new words.
            if (canPlaceWordRight) {
                if (rightLetters.length === 0) {
                    possibleRightWords = rackWords.slice();
                    // console.log(`USING RACK WORDS BECAUSE THERE ARE NO BOARD LETTERS TO USE.`)
                }
                else {
                    // Generate new possible words using rack letters + board letters.
                    const allLetters: Array<string> = rackArr.concat(rightLetters);
                    // console.log("all letters:")
                    // console.log(allLetters)
                    possibleRightWords = findAllPossibleWords(allLetters);
                    // console.log("all possible right words(not validated): ")
                    // console.log(possibleRightWords);
                }
                validRightWords = attemptPlaceWords(board, possibleRightWords, 'right', i, Math.min(spacesToRightAdjacent, spacesToRightLetter), rackArr);
            }
                
            if (canPlaceWordDown) {
                if (downLetters.length === 0) {
                    possibleDownWords = rackWords.slice()
                }
                else {
                    const allLetters: Array<string> = rackArr.concat(downLetters);
                    possibleDownWords = findAllPossibleWords(allLetters);
                }
                validDownWords = attemptPlaceWords(board, possibleDownWords, 'down', i, Math.min(spacesToDownAdjacent, spacesToDownLetter), rackArr);
            }

            // Transform the words into ScrabbleWord types
            validRightWords.forEach((w) => {
                const rl = getRackLettersNeeded(board, w, i, 'right');
                const s = getNewWordScore(board, w, i, 'right');
                const newScrabbleWord: ScrabbleWord = {
                    word: w,
                    index: i,
                    dir: 'right',
                    score: s, //getWordScore(w),
                    rackLetters: rl
                }
                allScrabbleWords.push(newScrabbleWord);
            })

            validDownWords.forEach((w) => {
                const rl = getRackLettersNeeded(board, w, i, 'down');
                const s = getNewWordScore(board, w, i, 'down');
                const newScrabbleWord: ScrabbleWord = {
                    word: w,
                    index: i,
                    dir: 'down',
                    score: s, //getWordScore(w),
                    rackLetters: rl
                }
                allScrabbleWords.push(newScrabbleWord);
            })

            const allValidWords = validRightWords.concat(validDownWords);
            allWords = allWords.concat(allValidWords);

            //console.log(`ALL VALID WORDS:\n${allValidWords}`);
            // if(validRightWords.length > 0 ) { console.log(`ALL VALID RIGHT WORDS AT INDEX ${i}:\n${validRightWords}`) }
            // if (validDownWords.length > 0 ) { console.log(`\nALL VALID DOWN WORDS AT INDEX ${i}:\n${validDownWords}`) }

            // console.log("\n")
            


        }
        console.timeEnd('anaylseBoard runtime: ')
        console.log(`words found: ${allWords.length}`)
        //allScrabbleWords.sort((a, b) => b.score - a.score);
        // console.log(allScrabbleWords);
        const highScoreScrabbleWords = allScrabbleWords.slice().sort((a, b) => b.score - a.score);
        const longestScrabbleWords = highScoreScrabbleWords.slice().sort((a,b) => b.rackLetters.length - a.rackLetters.length);
        
        setHighestScoring(highScoreScrabbleWords);
        setLongestWords(longestScrabbleWords);

    }

    // new func for getting wordScores, takes the board into account now. (hopefully)
    function getNewWordScore(board: Array<string>, word: string, index: number, dir: 'right' | 'down') {
        const tempBoard = board.slice();
        let totalScore = 0;
        let totalNewWordScore = 0;  // This score doesn't get triple/double word bonuses.
        let doubleMultipliers = 0;
        let tripleMultipliers = 0;
        let newLettersUsed = 0;
        let fullRackBonus = false;
        let currSquare = index;
        const wordArr = word.split('');
        wordArr.forEach((letter) => {
            const boardLetter = tempBoard[currSquare];
            let newLetter = boardLetter === '' ? true : false;
            tempBoard[currSquare] = letter;
            let letterScore = letterScores.get(letter);
            if (letterScore === undefined) { console.error("letterScore is undefined for some reason"); letterScore = 0;}
            if (newLetter) {
                newLettersUsed++;
                let specialSquare: 'none' | 'doubleLetter' | 'doubleWord' | 'tripleLetter' | 'tripleWord' = 'none';
                 if (doubleLetterCoords.includes(currSquare))       { letterScore *= 2; specialSquare = 'doubleLetter'; }
                 else if (doubleWordCoords.includes(currSquare))    { doubleMultipliers++; specialSquare = 'doubleWord'; }
                 else if (tripleLetterCoords.includes(currSquare))  { letterScore *= 3; specialSquare = 'tripleLetter'; }
                 else if (tripleWordCoords.includes(currSquare))    { tripleMultipliers++; specialSquare = 'tripleWord'; }
                 // Check if it created a new word (has adjacents on opposite axis)
                 const createdNewWord = squareHasAdjacentLetters(tempBoard, currSquare, dir === 'right' ? 'vertical' : 'horizontal');
                if (createdNewWord) {
                    const createdNewWordScore = getCreatedWordScore(tempBoard, currSquare, dir === 'right' ? 'down' : 'right', specialSquare);
                    totalNewWordScore += createdNewWordScore;
                }
            }
            totalScore += letterScore;
            let nextSquare = getAdjacentSquareIndex(currSquare, dir);
            if (nextSquare !== null) { currSquare = nextSquare; }
        })
        if (newLettersUsed === 7) { fullRackBonus = true; }
        for (let i = 0; i < doubleMultipliers; i++) {
            totalScore *= 2;
        }
        for (let i = 0; i < tripleMultipliers; i++) {
            totalScore *= 3;
        }
        if (fullRackBonus) { totalScore += 50; }
        totalScore += totalNewWordScore;
        return totalScore;
    }

    // for use in getNewWordScore. This is used when placing down a word, a new word is created adjacent to it, this calculates that new words score.
    function getCreatedWordScore(board: Array<string>, index: number, dir: 'right' | 'down', specialSquare: 'none' | 'doubleLetter' | 'doubleWord' | 'tripleLetter' | 'tripleWord'): number {
        // Go to start of word
        // Read through each letter and add to totalScore, specialSquare only matters on initial index
        let totalScore = 0;
        let doubleMultipliers = 0;
        let tripleMultipliers = 0;
        if (board[index] === '') {
            console.error("Tried to get word where this is no word! In getCreatedWordScore.");
            return 0;
        }

        let wordStartIndex = 0;
        let currSquare = index;
        let moveDir: 'left' | 'up' = dir === 'right' ? 'left' : 'up';
        // find start of word
        for (let i = 0; i < 15; i++) {
            wordStartIndex = currSquare;
            const nextSquare = getAdjacentSquareIndex(currSquare, moveDir);
            if (nextSquare === null) { break; }
            const nextSquareLetter = board[nextSquare];
            if (nextSquareLetter === '') { break; }
            currSquare = nextSquare;
        }

        // Go through and add up letter scores, only special square that matters is the one on index.
        currSquare = wordStartIndex;
        for (let i = 0; i < 15; i++) {
            const letter = board[currSquare];
            if (letter === null) { break; }
            let letterScore = letterScores.get(letter);
            if (letterScore === undefined) { console.error("letterScore is undefined"); break;}
            if (currSquare === index && specialSquare !== 'none') {
                switch(specialSquare) {
                    case 'doubleLetter':
                        letterScore *= 2;
                        break;
                    case 'doubleWord':
                        doubleMultipliers++;
                        break;
                    case 'tripleLetter':
                        letterScore *= 3;
                        break;
                    case 'tripleWord':
                        tripleMultipliers++;
                        break;
                }
            }
            totalScore += letterScore;
            const nextSquare = getAdjacentSquareIndex(currSquare, dir);
            if (nextSquare === null) { break; }
            if (board[nextSquare] === '') { break; }
            currSquare = nextSquare;
        }
        // Add multipliers and return
        for (let i = 0; i < doubleMultipliers; i++) {
            totalScore *= 2;
        }
        for (let i = 0; i < tripleMultipliers; i++) {
            totalScore *= 3;
        }
        return totalScore;
    }

    function getRackLettersNeeded(board: Array<string>, word: string, index: number, dir: 'right' | 'down'): Array<string> {
        const wordArr = word.split('');
        let rackLettersUsed: Array<string> = [];
        let currSquare = index;
        wordArr.forEach((letter, i) => {
            const boardLetter = board[currSquare];
            if (boardLetter === '') {
                rackLettersUsed.push(letter);
            }
            const nextSquare = getAdjacentSquareIndex(currSquare, dir);
            if (nextSquare !== null) { currSquare = nextSquare};
            if (nextSquare === null && i !== wordArr.length-1) { console.error("nextSquare should not be null in getRackLettersNeeded!"); }
        });
        return rackLettersUsed;
    }

    // Attempts to place an array of possible words at a square location in a certain direction
    // Returns any words that can be placed here legally.
    function attemptPlaceWords(board: Array<string>, words: Array<string>, dir: 'right' | 'down', squareIndex: number, minLength: number, rackLetters: Array<string>): Array<string> {
        let validWords: Array<string> = [];
        words.forEach((word) =>  {
            if (word.length >= minLength) {
                const valid = validateWordPlacement(board, word, dir, squareIndex, rackLetters);
                if (valid) { validWords.push(word) }
            }
        })
        return validWords;
    }

    // Returns true/false if placing a word on the board at a certain location would be valid.
    function validateWordPlacement(board: Array<string>, word: string, dir: 'right' | 'down', squareIndex: number, rackLetters: Array<string>): boolean {
        // place each letter down on board, if there is not an empty space OR the space is occupied with a different letter return false
        const tempBoard = board.slice();
        const tempRackLetters = rackLetters.slice();
        let currSquare = squareIndex;
        let wordEncountered = false;
        let placedLetter = false;       // if we didn't place a single letter, then we can not place a new word here.
        for (let i = 0; i < word.length; i++) {
            let boardLetter = tempBoard[currSquare];
            if (boardLetter !== '' && boardLetter !== word[i]) {
                return false;
            }
            // if we encounter a word on the board where we are placing, it HAS to be a substring of the word we want to place!
            if (!wordEncountered && boardLetter !== '') {
                const boardWord = getWordOnBoard(tempBoard, dir, currSquare);
                wordEncountered = true;
                if (!word.includes(boardWord)) { return false; }
            }
            else if (boardLetter === '') {
                wordEncountered = false;
                placedLetter = true;
            }
            // If we're placing a letter down on an empty space, take the letter from rackLetters. If the letter isn't in rackLetters, the word is invalid.
            if (boardLetter === '') {
                const letterIndex = tempRackLetters.indexOf(word[i]);
                if (letterIndex < 0 ) {
                    return false;
                }
                else {
                    tempRackLetters.splice(letterIndex, 1);
                }
            }
            tempBoard[currSquare] = word[i];
            // See if there's any adjacent letters
            if (squareHasAdjacentLetters(tempBoard, currSquare, dir === 'right' ? 'vertical' : 'horizontal')) {
                const valid = validateWordOnBoard(tempBoard, dir === 'right' ? 'down' : 'right', currSquare);
                if (!valid) { return false; }
            }
            const nextSquare = getAdjacentSquareIndex(currSquare, dir);
            if (nextSquare === null && i !== word.length - 1) { return false; }
            if (nextSquare !== null) { currSquare = nextSquare; }
        }
        // Placed down entire word, just validate it then finish.
        if (!placedLetter) { return false; }
        const valid = validateWordOnBoard(tempBoard, dir, squareIndex);
        return valid;
    }

    // If a word exists at this location on the board, then it will return true/false if it's scrabble valid for it to be here. (valid word with valid connections)
    function validateWordOnBoard(board: Array<string>, dir: 'right' | 'down', squareIndex: number): boolean {
        // check there's a letter at this location
        if (board[squareIndex] === '') {
            return false;
        }
        const word = getWordOnBoard(board, dir, squareIndex);
        return TWL06Dict.has(word);
    }

    // Returns a word on the board in a certain direction.
    // Does NOT check if the word is a real word or not. (use validateWordOnBoard for that)
    function getWordOnBoard(board: Array<string>, dir: 'right' | 'down', squareIndex: number): string {
        if (board[squareIndex] === '') {
            console.error("Tried to get word where this is no word!");
            return '';
        }

        let wordStartIndex = 0;
        let currSquare = squareIndex;
        let moveDir: 'left' | 'up' = dir === 'right' ? 'left' : 'up';
        // find start of word
        for (let i = 0; i < 15; i++) {
            wordStartIndex = currSquare;
            const nextSquare = getAdjacentSquareIndex(currSquare, moveDir);
            if (nextSquare === null) { break };
            const nextSquareLetter = board[nextSquare];
            if (nextSquareLetter === '') { break };
            currSquare = nextSquare;
        }

        // read in the word
        let word: Array<string> = [];
        currSquare = wordStartIndex;
        for (let i = 0; i < 15; i++) {
            word.push(board[currSquare]);
            const nextSquare = getAdjacentSquareIndex(currSquare, dir);
            if (nextSquare === null) { break };
            const nextSquareLetter = board[nextSquare];
            if (nextSquareLetter === '') { break };
            currSquare = nextSquare;
        }
        return (word.join(''));
    }

    // Includes the index that is passed in!
    function getAdjacentSquareIndexs(index: number, amount: number, dir: 'left' | 'right' | 'down' | 'up'): Array<number> {
        let indexs: Array<number> = [index];
        let nextIndex = 0;
        for (let i = 0; i < amount; i++) {
            let rs = getAdjacentSquareIndex(index + nextIndex, dir);
            if (rs === null) {
                break;
            }
            indexs.push(rs);
            switch (dir) {
                case 'right': nextIndex += 1; break;
                case 'left': nextIndex -= 1; break;
                case 'up': nextIndex -= 15; break;
                case 'down': nextIndex += 15; break;
            }
        }
        return indexs;
    }

    function squareHasAdjacentLetters(board: Array<string>, index: number, dir: 'vertical' | 'horizontal'): boolean {
        let adjacentLetter1: string = '';
        let adjacentLetter2: string = '';
        if (dir === 'vertical') {
            const up = getAdjacentSquareIndex(index, 'up');
            const down = getAdjacentSquareIndex(index, 'down')
            if (up !== null) { adjacentLetter1 = board[up];}
            if (down !== null) { adjacentLetter2 = board[down];}
        }
        else if (dir === 'horizontal') {
            const right = getAdjacentSquareIndex(index, 'right');
            const left = getAdjacentSquareIndex(index, 'left')
            if (right !== null) { adjacentLetter1 = board[right];}
            if (left !== null) { adjacentLetter2 = board[left];}
        }
        if (adjacentLetter1 !== '' || adjacentLetter2 !== '') {
            return true;
        }
        return false;
    }

    function clearScores(): void {
        setHighestScoring(Array<ScrabbleWord>());
        setLongestWords(Array<ScrabbleWord>());
    }

    return {
        highestScoring,
        longestWords,
        analyseBoard,
        clearScores,
    }

}

