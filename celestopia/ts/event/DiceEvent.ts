import { Sender } from "../util/channel.js";
import { appendBlurryBackground, appendCross, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";

function generateMenu(color: string, tricked: boolean) {
    const bg = appendBlurryBackground();
    bg.style.display = "flex";
    bg.style.justifyContent = "center";
    bg.style.alignItems = "center";
    
    const dice = document.createElement("div");
    dice.style.width = "30vw";
    dice.style.height = "30vw";
    dice.style.zIndex = "6";
    dice.style.backgroundColor = tricked ? "#ffd700" : "azure";
    dice.style.borderRadius = "20%";
    dice.style.border = `solid ${vwToPx(3)}px ${color}`;
    dice.style.display = "grid";
    dice.style.alignItems = "center";
    dice.style.textAlign = "center";
    dice.style.fontSize = `${vwToPx(20)}px`;

    bg.appendChild(dice);
    if (!tricked) { appendCross(["menu"], bg); };
    return {bg, dice};
}

export class DiceEvent extends KeyboardListener {
    #bg: HTMLDivElement;
    #tx: Sender<number>;
    #diceNumber: 1 | 2 | 3;
    #n: number;
    #color: string;
    #stop: boolean;
    #FPS: number;

    constructor(tx: Sender<number>, dices: 1 | 2 | 3, tricked: boolean) {
        let color: string;
        switch(dices) {
            case 1: color = "#496dfe"; break;
            case 2: color = "#e01e1e"; break;
            case 3: color = "#ffd700"; break;
        }

        const {bg, dice} = generateMenu(color, tricked);
        super(dice);
        this.#bg = bg;
        this.#tx = tx;
        this.#diceNumber = tricked ? 1 : dices;
        this.#n = this.#diceNumber;
        this.#stop = false;
        this.#color = color;
        this.#FPS = tricked  ? 1 : 15;
        this.#routine(tricked ? ()=>this.#linearGenerator() : ()=>this.#randomGenerator());
    }

    async #routine(generator: ()=>void) {
        while (!this.#stop) {
            generator();

            this.element.textContent = this.#n.toString();
            await new Promise(r => setTimeout(r, 1000/this.#FPS));
        }
    }

    async #selectAnimation() {
        let black = false;
        for (let i = 0; i < 10; i++) {
            this.element.style.color = black ? "#000000" : this.#color;
            black = !black;
            await new Promise(r => setTimeout(r, 200));
        }
    }

    #randomGenerator() {
        switch(this.#diceNumber) {
            case 1: this.#n = 1 + Math.floor(Math.random() * 6); break;
            case 2: this.#n = 2 + Math.floor(Math.random() * 11); break;
            case 3: this.#n = 3 + Math.floor(Math.random() * 16); break;
        }
    }

    #linearGenerator() {
        if (this.#n === 6) {
            this.#n = 1;
        } else {
            this.#n++;
        }
    }

    eventHandler(event: KeyboardEvent): void {
        if (event.key === " ") {
            this.#stop = true;

            this.#selectAnimation().then(() => {
                this.#tx.send(this.#n);
                document.body.removeChild(this.#bg);
            });
        } 
    }
}