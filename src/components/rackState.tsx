import { useState } from "react";

export function useRackState() {
    const [rackValues, setRackValues] = useState(Array<string>(7).fill(''));
    // an array of bools that whenever one is set to true the rackSquare will attempt to focus.
    const [rackFocusValues, setRackFocusValues] = useState(Array<boolean>(7).fill(false));

    function changeFocusToSquare(currSquare: number, dir: 'left' | 'right'): void {
        let nextSquare: number = 0;
        if (dir === 'right') {
            if (currSquare + 1 > rackFocusValues.length - 1) {
                return;
            }
            nextSquare = currSquare + 1;
        }
        else if (dir === 'left') {
            if (currSquare - 1 < 0) {
                return;
            }
            nextSquare = currSquare - 1;
        }
        const newFocusValues = Array<boolean>(7).fill(false);
        newFocusValues[nextSquare] = true;
        setRackFocusValues(newFocusValues);
        //console.log(`changing focus to square: ${nextSquare}`)
    }

    function handleRackChange(e: any, rackSquare: number): void {
        const inputType = e.nativeEvent.inputType;
        const newVal = e.nativeEvent.data;
        //console.log(`rackSquare[${rackSquare}] recieved input: ${inputType} val: ${newVal}`);
        if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
            const newRackValues = rackValues.slice();
            newRackValues[rackSquare] = '';
            setRackValues(newRackValues);
            changeFocusToSquare(rackSquare, 'left');
            return;
        }
        if (newVal == null) {
            return;
        }
        // regex checks if its any uppercase/lowercase letter from a-z
        if (!newVal.match(/[A-Za-z]/)) {
            return;
        }
        const newRackValues = rackValues.slice();
        newRackValues[rackSquare] = newVal.toUpperCase();
        changeFocusToSquare(rackSquare, 'right');
        setRackValues(newRackValues);
        return;
    }

    function clearRack() {
        setRackValues(Array<string>(7).fill(''));
    }

    function rackClearFocus() {
        const newFocusValues = Array<boolean>(7).fill(false)
        setRackFocusValues(newFocusValues)
    }

    function removeLettersFromRack(letters: Array<string>): Array<string> {
        const newRackValues = rackValues.slice();
        letters.forEach((letter) =>  {
            if (newRackValues.includes(letter)) {
                const i = newRackValues.indexOf(letter);
                newRackValues[i] = '';
            }
        })
        newRackValues.sort((a ,b) => {
            return b.length - a.length;
        });
        setRackValues(newRackValues);
        return newRackValues;
    }

    return {
        rackValues,
        handleRackChange,
        rackFocusValues,
        rackClearFocus,
        clearRack,
        removeLettersFromRack,
    }
}