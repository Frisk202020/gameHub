import { BoardEvent } from "./BoardEvent.js";

export class Popup extends BoardEvent {
    constructor(text: string) {
        super([BoardEvent.generateTextBox(text)], false, false);
    }
}