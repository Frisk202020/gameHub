import { BoardEvent } from "../event/BoardEvent.js";
import { Theft } from "../event/Theft.js";
import { Player } from "../Player.js";
import { initChannel, Sender } from "../util/channel.js";
import { Tuple } from "../util/tuple.js";
import { Money, players } from "../util/variables.js";
import { Item } from "./Item.js";

export class MoneyThief extends Item {
    constructor(p: Player) {
        const {tx, rx} = initChannel<Tuple<Player, Money>>();
        super(
            p, 
            "Voleur",
            "Volez la monnaie de votre choix au joueur de votre choix.",
            "money", 
            ()=>{ new Event(tx, p) }, 
            true
        );

        rx.recv().then((t) => {
            const {tx, rx} = initChannel<void>();
            new Theft(p, tx, t.first, t.second);
            rx.recv().then(()=>console.log("money thief ended"));
        });
    }
}

class Event extends BoardEvent {
    #tx: Sender<Tuple<Player, Money>>;
    #selectPlayer?: Player;
    #selectMoney?: Money;

    constructor(tx: Sender<Tuple<Player, Money>>, itemHolder: Player) {
        const buttonMap = new Map();
        const playersBox = document.createElement("div");
        playersBox.style.display = "flex";
        playersBox.style.justifyContent = "center";

        for (const p of players) {
            if (p === itemHolder) { continue; }
            const b = BoardEvent.generateButton(
                    p.name,
                    p.color.base,
                    true,
                    ()=> {
                        if (this.#selectPlayer !== undefined) {
                            buttonMap.get(this.#selectPlayer.name).style.borderColor = "transparent";
                        }
        
                        this.#selectPlayer = p;
                        if (this.#selectMoney !== undefined) {
                            this.#enableOk();
                        }
                        buttonMap.get(p.name).style.borderColor = "#ffd700";
                    },
                    "transparent"
                );
            buttonMap.set(p.name, b);
            playersBox.appendChild(b); 
        }
        
        const moneysBox = document.createElement("div");
        moneysBox.style.display = "flex";
        moneysBox.style.justifyContent = "center";
        for (const t of new Array<Tuple<Money, string>>(new Tuple("coin", "pièces"), new Tuple("ribbon", "rubans"), new Tuple("star", "étoiles"))) {
            const b = BoardEvent.generateButton(
                    t.second,
                    itemHolder.color.base,
                    true,
                    ()=> {
                        if (this.#selectMoney !== undefined) {
                            buttonMap.get(this.#selectMoney).style.borderColor = "transparent";
                        }
        
                        this.#selectMoney = t.first;
                        if (this.#selectPlayer !== undefined) {
                            this.#enableOk();
                        }
                        buttonMap.get(t.first).style.borderColor = "#ffd700";

                    },
                    "transparent"
                );
            buttonMap.set(t.first, b);
            moneysBox.appendChild(b); 
        }

        super(
            [
                BoardEvent.generateTextBox("Choisissez la personne et la monnaie à voler (remarque: le gain de pièces maximal est de 1000, contre 500 pour les rubans et les étoiles)."),
                playersBox,
                moneysBox
            ],
            BoardEvent.okSetup(false, "Voler", ()=>{}),
            BoardEvent.denySetup(true, "Annuler", ()=>itemHolder.addItem(new MoneyThief(itemHolder)))
        );
        this.#tx = tx;
    }

    #enableOk() {
        this.enableOk(()=>this.#tx.send(new Tuple(this.#selectPlayer as Player, this.#selectMoney as Money)));
    }
}