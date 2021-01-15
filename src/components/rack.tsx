import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import { RackSquare, RackSquareProps } from './rackSquare';

const useStyles = makeStyles({
    root: {
        //background: 'linear-gradient(45deg, #9ed4ec 30%, #81c4e0 90%)',
        //outline: '2px solid purple',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        columnGap: '0.125em',
        paddingBottom: '1%',
    },
});

type RackProps = {
    rackValues: string[],
    onChange: (e: any, squareNumber: number) => void;
    focusValues: boolean[],
    clearFocus: () => void;
}

function Rack(props: RackProps) {
    const classes = useStyles();

    const createProps = (squareNumber: number): RackSquareProps => {
        return {
            val: props.rackValues[squareNumber],
            onChange: (e) => props.onChange(e, squareNumber),
            shouldFocus: props.focusValues[squareNumber],
            clearFocus: () => props.clearFocus()
        }

    }

    return (
        <div className={classes.root}>
            <RackSquare {...createProps(0)}/>
            <RackSquare {...createProps(1)}/>
            <RackSquare {...createProps(2)}/>
            <RackSquare {...createProps(3)}/>
            <RackSquare {...createProps(4)}/>
            <RackSquare {...createProps(5)}/>
            <RackSquare {...createProps(6)}/>
        </div>
    );
}

export default Rack;