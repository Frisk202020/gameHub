import { appendCross } from "../util/functions.js";
import { boardId, changeBoard } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";
export class ChangeBoardEvent extends BoardEvent {
    constructor() {
        let left = 0;
        let right = 1;
        if (boardId === 0) {
            left = 1;
            right = 2;
        }
        else if (boardId === 1) {
            left = 0;
            right = 2;
        }
        super([BoardEvent.generateTextBox("Choisissez le plateau.")], BoardEvent.okSetup(true, (left + 1).toString(), () => changeBoard(left)), BoardEvent.denySetup(true, (right + 1).toString(), () => changeBoard(right)));
        appendCross(["menu"], this.menu);
        document.getElementById("menuOk").style.width = "10vw";
        document.getElementById("menuDeny").style.width = "10vw";
    }
}
