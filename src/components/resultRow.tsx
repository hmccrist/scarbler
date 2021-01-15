import { makeStyles } from '@material-ui/core';
import React from 'react';
import { getISCCoord } from './scarbleState';

const useStyles = makeStyles ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        border: '1px solid white',
        //fontFamily: 'Verdana',
        // fontSize: 18,
        fontSize: 'min(2vw, 18px)',
        '&:hover': {
            border: '1px solid #9ecaed',
            outline: 'none',
        },
    },
    section: {
        width: '30%',
    }
})

type ResultRowProps = {
    word: string,
    score: number,
    index: number,
    dir: string,
    bgColor: string,
    onHover: () => void;
    onHoverLeave: () => void;
    onMouseClick: () => void;
}

export function ResultRow(props: ResultRowProps) {
    const styles = useStyles();

    return (
        <div 
        className={styles.root} 
        style={{backgroundColor: props.bgColor}} 
        onMouseEnter={() => props.onHover()}
        onMouseLeave={() => props.onHoverLeave()}
        onMouseDown={() => props.onMouseClick()}
        >
            <div className={styles.section}> <p style={{fontFamily: 'Verdana'}}>{props.word}</p> </div>
            <div className={styles.section}> <p >{props.score}</p> </div>
            <div className={styles.section}> <p>{`${props.index}/${getISCCoord(props.index)} ${props.dir === 'right' ? '→' : '↓'}`}</p> </div>
        </div>
    )
}