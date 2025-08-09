import { BoardEvent } from "./BoardEvent.js";

export class Popup extends BoardEvent {
    constructor(text: string, title?: string) {
        const arr = [BoardEvent.generateTextBox(text)];
        if (title !== undefined) {
            const text = BoardEvent.generateTextBox(title);
            text.style.fontSize = "50px";
            arr.push(text);
            arr.reverse();
        }

        super(arr, BoardEvent.okSetup(true), BoardEvent.denySetup(false));
    }
}