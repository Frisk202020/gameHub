import { initChannel, Sender } from "../util/channel.js";
import { removeOldMenu } from "../util/functions.js";
import { players } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";
import { CreateEvent, CreateResponse, initLoadEvent } from "./FileEvent.js";
import { Message } from "./Message.js";
import { initPlayersLocal, initSinglePlayerLocal } from "./PlayerCreate.js";

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
                BoardEvent.generateButton("Jouer en multijoueur local", "#ffd700", ()=>{
                    this.remove();
                    new LocalMultiGameFileSelect(tx);
                }, "black"),
                BoardEvent.generateButton("Jouer en ligne", "#ffd700", undefined, "black")
            ],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(false)
        )
    }
}

class LocalMultiGameFileSelect extends BoardEvent {
    constructor(tx: Sender<void>) {
        super(
            [BoardEvent.generateTextBox("Créer une partie ou en charger une existente ?")],
            BoardEvent.okSetup(true, "Nouvelle partie", ()=>initSinglePlayerLocal(1).then((x)=>{
                players.push(x);
                
                removeOldMenu();
                const {tx: tx2, rx: rx2} = initChannel<CreateResponse|undefined>();
                new CreateEvent(tx2);

                rx2.recv().then((x)=>{
                    removeOldMenu();
                    if (x === undefined) {
                        const {tx: tx3, rx: rx3} = initChannel<void>();
                        new Message(["La création de partie a échouée"], tx3);
                        rx3.recv().then(()=>new Welcome(tx));
                    } else {
                        new Waiting(x, tx);
                    }
                });
            })),
            BoardEvent.denySetup(true, "Charger", ()=>{})
        )
    }
}

class Waiting extends BoardEvent {
    constructor(gameInfo: CreateResponse, tx: Sender<void>) {
        super(
            [
                BoardEvent.generateTextBox("La partie est ouverte à la connexion."),
                BoardEvent.generateTextBox(`Identifiant de partie: ${gameInfo.name}`),
                BoardEvent.generateTextBox("Une fois tous les joueurs connectés, lancez la partie !")
            ],
            BoardEvent.okSetup(false, "Commencer"),
            BoardEvent.denySetup(true, "Annuler", ()=>{
                players.length = 0;
                new Welcome(tx);
            })
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
        if (x.length === 0) {
            new Welcome(tx);
            return;
        }

        x.forEach((x)=>{
            players.push(x);
            document.body.appendChild(x.pawn);
        });
        players[0].enable();
        tx.send();
    });
}