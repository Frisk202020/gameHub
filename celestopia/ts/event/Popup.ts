import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export class Popup extends BoardEvent {
    constructor(text: string, title?: string, tx?: Sender<void>) {
        const arr = [BoardEvent.generateTextBox(text)];
        if (title !== undefined) {
            const text = BoardEvent.generateTextBox(title);
            text.style.fontSize = "50px";
            arr.push(text);
            arr.reverse();
        }

        super(
            arr, 
            tx === undefined ? BoardEvent.okSetup(true) : BoardEvent.okSetup(true, undefined, ()=>{
                document.body.removeChild(this.menu);
                tx.send();
            }), 
            BoardEvent.denySetup(false)
        );
    }
}