import type { IntersectionConfig } from "../board/Case.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export class Intersection extends BoardEvent {
    constructor(p: Player, config: IntersectionConfig, tx?:  Sender<void>) {
        super(
            [
                BoardEvent.generateTextBox("Intersection !"),
                BoardEvent.generateTextBox("Choisissez le chemin à emprunter."),
                BoardEvent.generateTextBox(`Chemin restant à parcourir: ${p.pendingCaseId - p.caseId + 1} cases.`)
            ],
            BoardEvent.okSetup(true, "Gauche", ()=>{
                const delta = p.pendingCaseId - p.caseId;
                p.caseId = config.leftId;
                p.pendingCaseId = p.caseId;
                p.movePawn().then(() => {
                    p.pendingCaseId = p.caseId + delta;
                    if (tx !== undefined) { tx.send(); }
                });
            }),
            BoardEvent.denySetup(true, "Droite", ()=>{
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