import { BoardEvent } from "../event/BoardEvent.js";
import { Player } from "../Player.js";
import { initChannel, Sender } from "../util/channel.js";
import { changeBoard, players } from "../util/variables.js";
import { Item } from "./Item.js";

export class Pipe extends Item {
    constructor(p: Player) {
        const {tx, rx} = initChannel<Player>();
        super(
            p, 
            "Tuyau de téléportation",
            "Echangez de place avec le joueur de votre choix (l'effet de votre case de destination se sera pas appliqué).",
            "pipe", 
            ()=>{ new Event(tx, p) }, 
            true
        );
        this.imgStyle.paddingBottom = "0px";

        rx.recv().then((victim) => {
            const pCase = p.caseId;
            const bId = p.boardId;

            (p as any).ignoreTurnSystem = true;
            (victim as any).ignoreTurnSystem = true;
            p.boardId = victim.boardId;
            victim.boardId = bId;
            p.teleport = true;
            p.pendingCaseId = victim.caseId;
            victim.teleport = true;
            victim.pendingCaseId = pCase;
            changeBoard(p.boardId);
        });
    }
}

class Event extends BoardEvent {
    constructor(tx: Sender<Player>, itemHolder: Player) {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        for (const p of players) {
            if (p === itemHolder) { continue; }

            box.appendChild(
                BoardEvent.generateButton(
                    p.name,
                    p.color.base,
                    true,
                    ()=> {
                        document.body.removeChild(this.menu);
                        tx.send(p);
                    }
                )
            ) 
        }

        super(
            [BoardEvent.generateTextBox("Choisissez le joueur avec lequel vous allez échanger de place."), box],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(true, "Annuler", ()=>itemHolder.addItem(new Pipe(itemHolder)))
        )
    }
}