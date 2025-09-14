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
var _Magic_tx;
import { Tuple } from "../util/tuple.js";
import { BoardEvent } from "./BoardEvent.js";
export class Magic extends BoardEvent {
    constructor(tx) {
        super([BoardEvent.generateTextBox("Quelle récompence choisissez vous ?")], BoardEvent.unappendedOkSetup(), BoardEvent.denySetup(false));
        _Magic_tx.set(this, void 0);
        __classPrivateFieldSet(this, _Magic_tx, tx, "f");
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "center";
        this.box.appendChild(box);
        for (const x of [new Tuple("Pièces", "coin"), new Tuple("Rubans", "ribbon"), new Tuple("Etoiles", "star")]) {
            const button = BoardEvent.generateButton(x.first, "#ffd700", true, () => { document.body.removeChild(this.menu); __classPrivateFieldGet(this, _Magic_tx, "f").send(x.second); }, "#000000");
            button.style.margin = "5vw";
            box.appendChild(button);
        }
    }
}
_Magic_tx = new WeakMap();
