import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import KeyboardArrowRightSharpIcon from '@material-ui/icons/KeyboardArrowRightSharp';
import KeyboardArrowDownSharpIcon from '@material-ui/icons/KeyboardArrowDownSharp';
import { ArrowType } from './scarbleState';

const useStyles = makeStyles ({
    root: {
        position: 'relative',
    },
    input: {
        //width: '1.5em', //'50px',
        //height: '1.5em', //'50px',
        width: '3vw', //'2.5vw',
        height: '3vw', //'2.5vw',
        maxWidth: '60px',
        maxHeight: '60px',
        display: 'block',   // this is important for resizing
        fontSize: 'min(2.5vw, 38px)', //38,
        textAlign: 'center',
        backgroundColor: 'lightgreen',
        fontFamily: 'Verdana',
        border: '1px solid black',
        color: 'transparent',
        textShadow: '0 0 0 black',  // font color
        outline: 'none',
        flex: 1,
        '&:hover': {
            borderColor: '#9ecaed',
            outline: 'none',
            // boxShadow: '0 0 5px darkgray',
        },
        '&:focus': {
            borderColor: 'none',
            outline: 'none',
        }
    },
    ghostInput: {
        width: '3vw',
        height: '3vw',
        maxWidth: '60px',
        maxHeight: '60px',
        display: 'block',   // this is important for resizing
        fontSize: 'min(2.5vw, 38px)',
        textAlign: 'center',
        backgroundColor: 'lightgreen',
        fontFamily: 'Verdana',
        border: '1px solid #9ecaed',
        color: 'transparent',
        textShadow: '0 0 0 #ffffff',  // font color
        outline: 'none',
        flex: 1,
    },
    arrows: {
        position: 'absolute',
        left: '25%',
        top: '25%',
        color: 'lightgreen',
        pointerEvents: 'none',
        transform: 'scale(1.5)',
    }
}) 

export type ScrabbleSquareProps = {
    value: string,
    onChange: (e: any) => void;
    shouldFocus: boolean,
    color: string,
    coordinate: string,
    onMouseEnter: (e: any) => void,
    displayArrow: ArrowType,
    onClick: () => void,
    ghostValue: string,
}


export function ScrabbleSquare(props: ScrabbleSquareProps) {
    const styles = useStyles()
    const myRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (props.shouldFocus && myRef.current !== null) {
            myRef.current.focus();  // might need to keep on an eye on this, if there's any side effects im not aware of.
        }
        // This sets cursor position always to the end of the input field.
        if (myRef.current !== null) {
            myRef.current.selectionStart = myRef.current.value.length;
            myRef.current.selectionEnd = myRef.current.value.length;
        }
    })

    return (
        <div className={styles.root}>
            <input
                type="text"
                className={props.ghostValue === '' ? styles.input : styles.ghostInput}
                style={{ backgroundColor: props.color}}
                value={props.ghostValue === '' ? props.value : props.ghostValue}
                onChange={(e) => props.onChange(e)}     // todo QOL: make this different so it captures backspaces on empty squares.
                onMouseEnter={(e) => props.onMouseEnter(e)}
                // onClick={() => props.onClick()}
                onMouseDown={() => props.onClick()}     // This works better than onClick.
                tabIndex={-1}
                ref={myRef}
            />
            <KeyboardArrowDownSharpIcon className={styles.arrows} visibility={props.displayArrow === 'down' ? 'visible' : 'hidden'}/>
            <KeyboardArrowRightSharpIcon className={styles.arrows} visibility={props.displayArrow === 'right' ? 'visible' : 'hidden'}/>
        </div>

    )
}