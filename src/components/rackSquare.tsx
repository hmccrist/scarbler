import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles ({
    root: {
        width: '3vw',
        height: '3vw',
        maxWidth: '1.25em',
        maxHeight: '1.25em',
        // fontSize: 48,
        fontSize: 'min(2.5vw, 48px)', //38,
        textAlign: 'center',
        backgroundColor: 'lightyellow',
        fontFamily: 'Verdana',
        // outline: '1px solid gray',
        border: '1px solid black',
        boxShadow: 'inset 0 0 5px darkgray',
    }
}) 

export type RackSquareProps = {
    val: string,
    onChange: (e: any) => void;
    shouldFocus: boolean,
    clearFocus: () => void;
}

export function RackSquare(props: RackSquareProps) {
    const styles = useStyles();
    const myRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (props.shouldFocus && myRef.current !== null) {
            myRef.current.focus();  // might need to keep on an eye on this, if there's any side effects im not aware of.
            props.clearFocus()
        }
    })

    return (
        <input
            type="text"
            className={styles.root}
            value={props.val}
            onChange={(e) => props.onChange(e)}
            ref={myRef}
        />
    )
}