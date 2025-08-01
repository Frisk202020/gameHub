import { currentKeyboardEventListener, players, resizables } from "./variables.js";

export const debugTools = {
    currentKeyboardEventListener() { console.log(currentKeyboardEventListener); },
    resizables() { console.log(resizables); },
    diceNumber(id: 1 | 2 | 3 | 4, n: 1 | 2 | 3) { players[id - 1].diceNumber = n; },
};