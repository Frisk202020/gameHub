import { IntersectionConfig } from "../board/Case.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export class Intersection extends BoardEvent {
    constructor(p: Player, config: IntersectionConfig, tx?:  Sender<void>) {
        super(
            [
                BoardEvent.generateTextBox("Intersection !"),
                BoardEvent.generateTextBox("Choisissez le chemin à emprunter.")
            ],
            BoardEvent.okSetup(true, "Gauche", ()=>{
                document.body.removeChild(this.menu);
                const delta = p.pendingCaseId - p.caseId;
                p.caseId = config.leftId;
                p.pendingCaseId = p.caseId;
                p.movePawn().then(() => {
                    p.pendingCaseId = p.caseId + delta;
                    if (tx !== undefined) { tx.send(); }
                });
            }),
            BoardEvent.denySetup(true, "Droite", ()=>{
                document.body.removeChild(this.menu);
                const delta = p.pendingCaseId - p.caseId;
                p.caseId = config.rightId;
                p.movePawn().then(() => {
                    p.pendingCaseId = p.caseId + delta;
                    if (tx !== undefined) { tx.send(); }
                });
            }),
        )   
    }
}