import { Player } from "../Player.js";
import { initChannel, Sender } from "../util/channel.js";
import { vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { players } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";

export class DuelEvent extends BoardEvent {
    #selectWinner?: Player;
    #selectButton?: HTMLDivElement;

    constructor(outerTx: Sender<void>) {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";

        for (const p of players) {
            const b = BoardEvent.generateButton(
                    p.name,
                    p.color,
                    true,
                    ()=> {
                        this.#selectWinner = p;
                        if (this.#selectButton === undefined) {
                            this.enableOk(() => {
                                (async () => {
                                    let pot = 1000;
                                    for (const p of players) {
                                        const {tx, rx} = initChannel<number>();
                                        const event = new Event(p, tx);
                                        new Listener(event);

                                        const bet_ammount = await rx.recv();
                                        pot += bet_ammount;
                                        if (p !== this.#selectWinner) { p.progressiveCoinChange(-bet_ammount); }
                                    }

                                    this.#selectWinner?.progressiveCoinChange(pot);
                                    outerTx.send();
                                })();
                            })
                        } else {
                            this.#selectButton.style.borderColor = "transparent";
                        }

                        this.#selectButton = b;
                        b.style.borderColor = "#ffd700";
                    },
                    "transparent"
                );

            box.appendChild(b) 
        }

        super(
            [BoardEvent.generateTextBox("Partcipez à un duel. Ensuite, selectionez le gagnant."), box],
            BoardEvent.okSetup(false),
            BoardEvent.denySetup(false)
        )
    }
}

class Listener extends KeyboardListener {
    #event: Event; 

    constructor(target: Event) {
        super(target.text);
        this.#event = target;
    }

    eventHandler(event: KeyboardEvent): void {
        if (event.key === "Backspace") {
            this.#event.promptText = this.#event.promptText.substring(0, this.#event.promptText.length - 1);
            if (this.#event.promptText.length === 0) {
                this.#event.disable();
            }
        } else if (event.key < "0" || event.key > "9") {
            return;
        } else if (this.#event.promptText.length > 6) {
            return;
        } else {
            if (!this.#event.enabled) {
                this.#event.enable();
            }
            this.#event.promptText = this.#event.promptText + event.key;
        }

        this.element.innerHTML = `Somme:&nbsp;${this.#event.promptText}`;
    }
}

class Event extends BoardEvent {
    #player: Player;
    #tx: Sender<number>;
    promptText: string;
    enabled: boolean;
    text: HTMLParagraphElement;

    constructor(p: Player, tx: Sender<number>) {
        const box = document.createElement("div");
        box.id = "prompt";
        box.style.fontSize = "5vh";
        box.style.height = "10vh";
        box.style.width = "80vw";
        box.style.border = `solid ${vwToPx(1)}px ${p.color}`;
        box.style.borderRadius = "2vh";
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";
        box.style.backgroundColor = "azure";

        const text = document.createElement("p");
        text.innerHTML = "Somme:&nbsp;";
        box.appendChild(text);

        super(
            [BoardEvent.generateTextBox(`Entrez la somme pariée par ${p.name}`),box],
            BoardEvent.okSetup(false),
            BoardEvent.denySetup(false)
        );
        this.#player = p;
        this.#tx = tx;
        this.promptText = "";
        this.enabled = false;
        this.text = text;
    }

    enable() {
        this.enableOk(()=>{
            let ammount = Number(this.promptText);
 
            this.#tx.send(ammount);
        });
        this.enabled = true;
    }

    disable() {
        this.disableOk();
        this.enabled = false;
    }
}