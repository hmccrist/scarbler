import { Button, IconButton, makeStyles } from '@material-ui/core';
import * as React from 'react';
import Rack from './rack';
import { useScarbleState } from './scarbleState';
import ScrabbleBoard from './scrabbleBoard';
import DeleteIcon from '@material-ui/icons/Delete'
import { useRackState } from './rackState';
import ResultsTabs from './resultsTabs';
import { useWordFinder } from './wordFinder';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles(() => ({
    root: {
		width: '100vw',//width: '100em',
		height: '100vh', //height: '70em',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'lightgray',
        margin: '0 auto',
        // border: '1px solid purple', // debug
    },
	topRow: {
        width: '100%',
        height: '80%',
		display: 'flex',
        flexDirection: 'row',
        //margin: '5px',
        //outline: '2px solid green',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //columnGap: '1em'
    },
    bottomRow: {
        width: '100%',
		display: 'flex',
		flexDirection: 'row',
        columnGap: '1em',
        //outline: '2px solid green'
    },
    column: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    firstColumn: {
        display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
        width: '65%',
        height: '100%',
        // outline: '1px solid blue',
    },
    secondColumn: {
        display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
        alignItems: 'center',
        width: '20%',
        height: '100%',
        // outline: '1px solid red',
    },
    coordinates: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        columnGap: '20%',
        //outline: '1px solid black'
    },
}));

function Scarbler() {
    const classes = useStyles()
    const {
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
    } = useScarbleState();

    const {
        rackValues,
        handleRackChange,
        rackFocusValues,
        rackClearFocus,
        clearRack,
        removeLettersFromRack,
    } = useRackState();

    const {
        highestScoring,
        longestWords,
        analyseBoard,
        clearScores,
    } = useWordFinder();

    return (
        <div className={classes.root}>
            <div className={classes.topRow}>
                {/**  First Column: Rack / Board */}
                <div className={classes.firstColumn}>
                    <div className={classes.coordinates}>
                        <p>index: {hoveredCoord}</p>
                        <p>Coord: {ISCCoord}</p>
                    </div>
                    <Rack 
                            rackValues={rackValues}
                            onChange={(e, squareNumber) => handleRackChange(e, squareNumber)}
                            focusValues={rackFocusValues}
                            clearFocus={() => rackClearFocus()}
                    />
                    <div onMouseLeave={() => handleMouseExitBoard()}>
                    <ScrabbleBoard 
                            boardState={boardState} 
                            onChange={(e, squareNumber) => handleChange(e, squareNumber)} 
                            focusValues={focusValues}
                            onMouseEnter={(e, squareNumber) => handleMouseEnter(e, squareNumber)}
                            displayArrows={displayArrows}
                            onClick={(squareNumber) => handleClick(squareNumber)}
                            ghostBoardState={ghostBoardState}
                    />
                    </div>
                </div>
                {/**  Second Column: Buttons / Analysis Results */}
                <div className={classes.secondColumn}>
                    <div className={classes.row}>
                        <Button variant="contained" color="primary" onClick={() => {analyseBoard(boardState, rackValues)}}>Analyse Board</Button>
                        <IconButton aria-label="delete" onClick={() => {clearBoard(); clearRack(); clearScores(); }}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => exportBoardState()}>
                            <GetAppIcon />
                        </IconButton>
                        <IconButton component="label">   
                            <PublishIcon/>
                            <input type="file" hidden accept=".json" onChange={(e) => {importBoardState(e.target.files); e.target.value=""}}/>
                        </IconButton>
                    </div>
                    <div className={classes.row}>
                        <ResultsTabs 
                            highestScoringList={highestScoring} 
                            longestScoringList={longestWords} 
                            onHover={(item) => handleHoverOnResultRow(item)}
                            onHoverLeave={() => handleHoverLeaveOnResultRow()}
                            onMouseClick={(item) => {
                                const newBoardState = handleClickOnResultRow(item); 
                                handleHoverLeaveOnResultRow(); 
                                const reducedRack = removeLettersFromRack(item.rackLetters); 
                                analyseBoard(newBoardState, reducedRack);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scarbler