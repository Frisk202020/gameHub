import { Sender } from "../util/channel.js";
import { appendBlurryBackground, appendCross, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";

const FPS = 2;

function generateMenu(double: boolean, color: string) {
    const bg = appendBlurryBackground();
    bg.style.display = "flex";
    bg.style.justifyContent = "center";
    bg.style.alignItems = "center";
    bg.style.flexDirection = "column";

    const p = document.createElement("p");
    p.style.fontSize = "5vh";
    p.style.textAlign = "center";
    p.textContent = "Payez vos courriers.";
    bg.appendChild(p);

    const box = document.createElement("div");
    box.id = "prompt";
    box.style.fontSize = "5vh";
    box.style.height = "10vh";
    box.style.width = "80vw";
    box.style.border = `solid ${vwToPx(1)}px ${color}`;
    box.style.borderRadius = "2vh";
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.alignItems = "center";
    box.style.backgroundColor = "azure";

    if (double) {
        const text = document.createElement("p");
        text.innerText = "Entrez la somme que vous devez. Le double vous sera retiré.";
        text.style.fontSize = "5vh";
        text.style.textAlign = "center";
        bg.appendChild(text);
    }

    const text = document.createElement("p");
    text.innerHTML = "Somme à payer:&nbsp;";
    box.appendChild(text);

    const cursor = document.createElement("div");
    cursor.style.width = "2px";
    cursor.style.height = "5vh";
    cursor.style.backgroundColor = "black";
    cursor.style.opacity = "0";
    document.body.appendChild(cursor);
    box.appendChild(cursor);

    bg.appendChild(box);
    appendCross(["menu"]);
    return {box, text, cursor};
}

export class MailEvent extends KeyboardListener {
    #double: boolean;
    #p: HTMLParagraphElement;
    #cursor: HTMLDivElement;
    #tx: Sender<number>;
    #promptText: string;
    #exit: boolean;
    #showCursor: boolean;

    constructor(double: boolean, tx: Sender<number>, color: string) {
        const {box, text, cursor} = generateMenu(double, color);
        super(box);
        this.#double = double;
        this.#p = text;
        this.#tx = tx;
        this.#cursor = cursor;
        this.#promptText = "";
        this.#exit = false;
        this.#showCursor = false;

        this.#routine();
    }

    eventHandler(event: KeyboardEvent): void {
        if (event.key === "Backspace") {
            this.#promptText = this.#promptText.substring(0, this.#promptText.length - 1);
        } else if (event.key === "Enter" && this.#promptText.length > 0) {
            this.#exit = true;
        }else if (event.key < "0" || event.key > "9") {
            return;
        } else if (this.#promptText.length > 6) {
            return;
        } else {
            this.#promptText = this.#promptText + event.key;
        }

        this.#p.innerHTML = `Somme à payer:&nbsp;${this.#promptText}`;
    }

    async #routine() {
        while(!this.#exit) {
            if (this.#promptText.length < 7) {
                this.#cursor.style.opacity = this.#showCursor ? "1" : "0";
                this.#showCursor = !this.#showCursor;
            } else {
                this.#cursor.style.opacity = "0";
                this.#showCursor = false;
            }
            await new Promise((r) => setTimeout(r, 1000/FPS));
        }

        if (this.#promptText.length > 0) {
            const n = Number(this.#promptText);
            if (this.#double) {
                this.#tx.send(2 * n);
            } else {
                this.#tx.send(n);
            }
        } else {
            this.#tx.send(0);
        }
        const cross = document.getElementById("cross");
        if (cross === null) {
            console.log("WARN: cross is already removed");
        } else {
            cross.click();
        }
    }
}