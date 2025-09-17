import { Sender } from "../util/channel.js";
import { players } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";
import { initLoadEvent } from "./FileEvent.js";
import { initPlayersLocal } from "./PlayerCreate.js";

export class Welcome extends BoardEvent {
    constructor(tx: Sender<void>) {
        super(
            [
                BoardEvent.generateTextBox("Bienvenue à Celestopia !"),
                BoardEvent.generateTextBox("Choisissez votre mode de jeu."),
                BoardEvent.generateButton("Jouer sur un seul ordinateur", "#ffd700", ()=>{
                    this.remove();
                    new LocalGameFileSelect(tx);
                }, "black"),
                BoardEvent.generateButton("Jouer en multijoueur local", "#ffd700", undefined, "black"),
                BoardEvent.generateButton("Jouer en ligne", "#ffd700", undefined, "black")
            ],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(false)
        )
    }
}

class LocalGameFileSelect extends BoardEvent {
    constructor(tx: Sender<void>) {
        super(
            [BoardEvent.generateTextBox("Créer une partie ou en charger une existente ?")],
            BoardEvent.okSetup(true, "Nouvelle partie", ()=>initPlayers(tx)),
            BoardEvent.denySetup(true, "Charger", ()=>{
                const rx = initLoadEvent();
                rx.recv().then((x)=>{
                    if (x) {
                        for (const p of players) {
                            document.body.appendChild(p.pawn);
                        }
                        tx.send();
                    }
                    else {
                        new Welcome(tx);
                    }
                })
            })
        )
    }
}

function initPlayers(tx: Sender<void>) {
    initPlayersLocal().then((x)=>{
        x.forEach((x)=>{
            players.push(x);
            document.body.appendChild(x.pawn);
        });
        players[0].enable();
        tx.send();
    });
}