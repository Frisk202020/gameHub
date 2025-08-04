import { currentKeyboardEventListener, pig, players, resizables } from "./variables.js";

export const debugTools = {
    keys: false,
    currentKeyboardEventListener() { console.log(currentKeyboardEventListener); },
    resizables() { console.log(resizables); },
    diceNumber(id: 1 | 2 | 3 | 4, n: 1 | 2 | 3) { players[id - 1].diceNumber = n; },
    showKeys() { this.keys = true },
    throwDice(id: 1 | 2 | 3 | 4, value: number) { 
        const p = players[id - 1];
        p.pendingCaseId = p.caseId + value;    
    },
    showPig() { console.log(pig); },
    setPigAmmount(ammount: number) { pig.content = ammount; }
};