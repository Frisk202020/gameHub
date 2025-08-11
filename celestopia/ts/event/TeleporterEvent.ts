import { BoardId } from "../board/Board.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { boardNames } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";

export class TeleporterEvent extends BoardEvent {
    constructor(p: Player, nextId: BoardId, tx: Sender<boolean>) {
        super(
            [BoardEvent.generateTextBox(`Emprunter le téléporter pour accéder à la prochaine zone : ${boardNames[nextId]} ?`)],
            BoardEvent.okSetup(true, "Oui", ()=>{
                document.body.removeChild(this.menu);
                tx.send(true)
            }),
            BoardEvent.denySetup(true, "Non", ()=>{
                document.body.removeChild(this.menu);
                tx.send(false)
            })
        )
    }
}