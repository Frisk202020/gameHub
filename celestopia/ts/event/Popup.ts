import { BoardEvent } from "./BoardEvent.js";

export class Popup extends BoardEvent {
    constructor(text: string) {
        super([BoardEvent.generateTextBox(text)], BoardEvent.okSetup(true), BoardEvent.denySetup(false));
    }
}