var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ConvertEvent_tx, _ConvertListener_out;
import { assets_link } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { BoardEvent } from "./BoardEvent.js";
export class Convert extends BoardEvent {
    constructor(tx, money) {
        super([BoardEvent.generateTextBox("Convertir des pièces en la monnaie locale de ce plateau ?")], BoardEvent.okSetup(true, "Oui", () => new ConvertEvent(tx, money)), BoardEvent.denySetup(true, "Non", () => tx.send(0)));
    }
}
class ConvertEvent extends BoardEvent {
    constructor(tx, money) {
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
        par.style.backgroundColor = "azure";
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
        super([BoardEvent.generateTextBox("Entrer la somme à convertir (max: 9999)"), input, output], BoardEvent.okSetup(false), BoardEvent.denySetup(true, "Annuler", () => tx.send(0)));
        _ConvertEvent_tx.set(this, void 0);
        __classPrivateFieldSet(this, _ConvertEvent_tx, tx, "f");
        this.p = par;
        new ConvertListener(par, this, outVal);
        this.enabled = false;
    }
    handleOkButton() {
        if (this.p.textContent.length === 0) {
            this.disableOk();
            this.enabled = false;
        }
        else if (!this.enabled) {
            this.enableOk(() => __classPrivateFieldGet(this, _ConvertEvent_tx, "f").send(parseInt(this.p.textContent)));
            this.enabled = true;
        }
    }
}
_ConvertEvent_tx = new WeakMap();
class ConvertListener extends KeyboardListener {
    constructor(elm, caller, out) {
        super(elm);
        _ConvertListener_out.set(this, void 0);
        this.value = "";
        this.caller = caller;
        __classPrivateFieldSet(this, _ConvertListener_out, out, "f");
    }
    eventHandler(event) {
        if (event.key === "Backspace") {
            this.value = this.value.substring(0, this.value.length - 1);
        }
        else if (event.key > "9" || event.key < "0") {
            return;
        }
        else if (this.element.textContent.length < 4) {
            this.value = this.value + event.key;
        }
        this.element.textContent = this.value;
        if (this.value.length > 0) {
            __classPrivateFieldGet(this, _ConvertListener_out, "f").textContent = Math.floor((parseInt(this.value) / 3)).toString();
        }
        else {
            __classPrivateFieldGet(this, _ConvertListener_out, "f").textContent = "";
        }
        this.caller.handleOkButton();
    }
}
_ConvertListener_out = new WeakMap();
