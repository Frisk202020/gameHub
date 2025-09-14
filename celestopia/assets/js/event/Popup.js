import { BoardEvent } from "./BoardEvent.js";
export class Popup extends BoardEvent {
    constructor(text, title, tx) {
        const arr = [BoardEvent.generateTextBox(text)];
        if (title !== undefined) {
            const text = BoardEvent.generateTextBox(title);
            text.style.fontSize = "50px";
            arr.push(text);
            arr.reverse();
        }
        super(arr, tx === undefined ? BoardEvent.okSetup(true) : BoardEvent.okSetup(true, undefined, () => tx.send()), BoardEvent.denySetup(false));
    }
}
