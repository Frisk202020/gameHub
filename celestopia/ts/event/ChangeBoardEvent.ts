import { BoardId } from "../board/Board.js";
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
        } else if (boardId === 1) {
            left = 0;
            right = 2;
        }

        super(
            [BoardEvent.generateTextBox("Choisissez le plateau.")],
            BoardEvent.okSetup(true, (left+1).toString(), ()=>changeBoard(left as BoardId)),
            BoardEvent.denySetup(true, (right+1).toString(), ()=>changeBoard(right as BoardId))
        )

        appendCross(["menu"], this.menu);
        (document.getElementById("menuOk") as HTMLElement).style.width = "10vw";
        (document.getElementById("menuDeny") as HTMLElement).style.width = "10vw";
    }
}