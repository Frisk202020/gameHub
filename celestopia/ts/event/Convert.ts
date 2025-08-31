import { Sender } from "../util/channel.js";
import { assets_link } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { BoardEvent } from "./BoardEvent.js";

export class Convert extends BoardEvent {
    constructor(tx: Sender<number>, money: "ribbon" | "star") {
        super(
            [BoardEvent.generateTextBox("Convertir des pièces en la monnaie locale de ce plateau ?")],
            BoardEvent.okSetup(true, "Oui", ()=>new ConvertEvent(tx, money)),
            BoardEvent.denySetup(true, "Non", ()=>tx.send(0))
        )
    }
}

class ConvertEvent extends BoardEvent {
    #tx: Sender<number>;
    p: HTMLParagraphElement;
    enabled: boolean;

    constructor(tx: Sender<number>, money: "ribbon" | "star") {
        const input = document.createElement("div");
        input.style.display = "flex";
        input.style.justifyContent = "center";
        input.style.alignItems = "center";

        const img = document.createElement("img");
        img.src = assets_link("icons/coin.png");
        img.style.width = "10vw";
        img.style.margin = "5vw";
        input.appendChild(img);

        const par = document.createElement("p");
        par.style.fontSize = "50px";
        par.style.textAlign = "center";
        par.style.width = "30vw";
        par.style.height = "60px";
        par.style.border = "10px solid";
        par.style.borderRadius = "10px";
        par.style.backgroundColor = "azure"
        input.appendChild(par);

        const output = document.createElement("div");
        output.style.display = "flex";
        output.style.justifyContent = "center";
        output.style.alignItems = "center";

        const text = document.createElement("p");
        text.textContent = "Converties en: ";
        text.style.fontSize = "30px";
        text.style.textAlign = "center";
        output.appendChild(text);

        const outVal = document.createElement("span");
        outVal.style.fontSize = "50px";
        text.appendChild(outVal);

        const rib = document.createElement("img");
        rib.src = assets_link(`icons/${money}.png`);
        rib.style.width = "10vw";
        rib.style.margin = "5vw";
        output.appendChild(rib);

        super(
            [BoardEvent.generateTextBox("Entrer la somme à convertir (max: 9999)"), input, output],
            BoardEvent.okSetup(false),
            BoardEvent.denySetup(true, "Annuler", ()=>tx.send(0))
        );
        this.#tx = tx;
        this.p = par;
        new ConvertListener(par, this, outVal);
        this.enabled = false;
    }

    handleOkButton() {
        if (this.p.textContent!.length === 0) { this.disableOk(); this.enabled = false; }
        else if (!this.enabled) { this.enableOk(()=>this.#tx.send(parseInt(this.p.textContent as string))); this.enabled = true; }
    }
}

class ConvertListener extends KeyboardListener {
    value: string;
    caller: ConvertEvent;
    #out: HTMLElement;

    constructor(elm: HTMLElement, caller: ConvertEvent, out: HTMLElement) {
        super(elm);
        this.value = "";
        this.caller = caller; 
        this.#out = out;
    }

    eventHandler(event: KeyboardEvent): void {
        if (event.key === "Backspace") { this.value = this.value.substring(0, this.value.length-1); }
        else if (event.key > "9" || event.key < "0") { return; }
        else if (this.element.textContent!.length < 4) { this.value = this.value + event.key;  }

        this.element.textContent = this.value;
        if (this.value.length > 0) { this.#out.textContent = Math.floor((parseInt(this.value) / 3)).toString(); }
        else { this.#out.textContent = ""; }
        this.caller.handleOkButton();
    }
}