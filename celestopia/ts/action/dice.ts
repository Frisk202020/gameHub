import { Sender } from "../util/channel.js";
import { appendBlurryBackground, appendCross, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";

const FPS = 15;

function generateMenu(color: string) {
    const bg = appendBlurryBackground();
    bg.style.display = "flex";
    bg.style.justifyContent = "center";
    bg.style.alignItems = "center";
    
    const dice = document.createElement("div");
    dice.style.width = "30vw";
    dice.style.height = "30vw";
    dice.style.zIndex = "6";
    dice.style.backgroundColor = "azure";
    dice.style.borderRadius = "20%";
    dice.style.border = `solid ${vwToPx(3)}px ${color}`;
    dice.style.display = "grid";
    dice.style.alignItems = "center";
    dice.style.textAlign = "center";
    dice.style.fontSize = `${vwToPx(20)}px`;

    bg.appendChild(dice);
    appendCross(["menu"]);
    return dice;
}

export class DiceEvent extends KeyboardListener {
    tx: Sender<number>;
    diceNumber: 1 | 2 | 3;
    color: string;
    stop: boolean;

    constructor(tx: Sender<number>, dices: 1 | 2 | 3) {
        let color: string;
        switch(dices) {
            case 1: color = "#496dfe"; break;
            case 2: color = "#e01e1e"; break;
            case 3: color = "#ffd700"; break;
        }

        const element = generateMenu(color);
        super(element);
        this.tx = tx;
        this.diceNumber = dices;
        this.stop = false;
        this.color = color;
        this.#routine();
    }

    async #routine() {
        let n = 0;
        while (!this.stop) {
            switch(this.diceNumber) {
                case 1: n = 1 + Math.floor(Math.random() * 6); break;
                case 2: n = 2 + Math.floor(Math.random() * 11); break;
                case 3: n = 3 + Math.floor(Math.random() * 16); break;
            }

            this.element.textContent = n.toString();
            await new Promise(r => setTimeout(r, 1000/FPS));
        }

        let black = false;
        for (let i = 0; i < 10; i++) {
            this.element.style.color = black ? "#000000" : this.color;
            black = !black;
            await new Promise(r => setTimeout(r, 200));
        }
        
        this.tx.send(n);
        const cross = document.getElementById("cross");
        if (cross === null) {
            console.log("WARN: cross is already removed");
        } else {
            cross.click();
        }
    }

    eventHandler(event: KeyboardEvent): void {
        if (event.key === " ") {
            this.stop = true;
        } 
    }
}