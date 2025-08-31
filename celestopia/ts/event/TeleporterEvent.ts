import type { BoardId } from "../board/Board.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { boardNames } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";

export class TeleporterEvent extends BoardEvent {
    constructor(p: Player, tx: Sender<boolean>) {
        const pending = p.pendingCaseId - p.caseId;
        const nextId = ((p.boardId + 1) % 3) as BoardId; 
        super(
            [
                BoardEvent.generateTextBox(`Emprunter le téléporter pour accéder à la prochaine zone : ${boardNames[nextId]} ?`),
                BoardEvent.generateTextBox(`Chemin restant à parcourir: ${pending} cases.`)
            ],
            BoardEvent.okSetup(true, "Oui", ()=>{p.boardId = nextId; tx.send(true)}),
            BoardEvent.denySetup(true, "Non", ()=>tx.send(false))
        )
    }
}