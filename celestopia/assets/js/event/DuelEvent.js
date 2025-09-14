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
var _DuelEvent_selectWinner, _DuelEvent_selectButton, _Listener_event, _Event_tx;
import { initChannel } from "../util/channel.js";
import { vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { players } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";
export class DuelEvent extends BoardEvent {
    constructor(outerTx) {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        for (const p of players) {
            const b = BoardEvent.generateButton(p.name, p.color.base, true, () => {
                __classPrivateFieldSet(this, _DuelEvent_selectWinner, p, "f");
                if (__classPrivateFieldGet(this, _DuelEvent_selectButton, "f") === undefined) {
                    this.enableOk(() => {
                        (async () => {
                            let pot = 1000;
                            for (const p of players) {
                                const { tx, rx } = initChannel();
                                const event = new Event(p, tx);
                                new Listener(event);
                                const bet_ammount = await rx.recv();
                                pot += bet_ammount;
                                if (p !== __classPrivateFieldGet(this, _DuelEvent_selectWinner, "f")) {
                                    p.progressiveCoinChange(-bet_ammount);
                                }
                            }
                            __classPrivateFieldGet(this, _DuelEvent_selectWinner, "f")?.progressiveCoinChange(pot);
                            outerTx.send();
                        })();
                    });
                }
                else {
                    __classPrivateFieldGet(this, _DuelEvent_selectButton, "f").style.borderColor = "transparent";
                }
                __classPrivateFieldSet(this, _DuelEvent_selectButton, b, "f");
                b.style.borderColor = "#ffd700";
            }, "transparent");
            box.appendChild(b);
        }
        super([BoardEvent.generateTextBox("Partcipez à un duel. Ensuite, selectionez le gagnant."), box], BoardEvent.okSetup(false), BoardEvent.denySetup(false));
        _DuelEvent_selectWinner.set(this, void 0);
        _DuelEvent_selectButton.set(this, void 0);
    }
}
_DuelEvent_selectWinner = new WeakMap(), _DuelEvent_selectButton = new WeakMap();
class Listener extends KeyboardListener {
    constructor(target) {
        super(target.text);
        _Listener_event.set(this, void 0);
        __classPrivateFieldSet(this, _Listener_event, target, "f");
    }
    eventHandler(event) {
        if (event.key === "Backspace") {
            __classPrivateFieldGet(this, _Listener_event, "f").promptText = __classPrivateFieldGet(this, _Listener_event, "f").promptText.substring(0, __classPrivateFieldGet(this, _Listener_event, "f").promptText.length - 1);
            if (__classPrivateFieldGet(this, _Listener_event, "f").promptText.length === 0) {
                __classPrivateFieldGet(this, _Listener_event, "f").disable();
            }
        }
        else if (event.key < "0" || event.key > "9") {
            return;
        }
        else if (__classPrivateFieldGet(this, _Listener_event, "f").promptText.length > 6) {
            return;
        }
        else {
            if (!__classPrivateFieldGet(this, _Listener_event, "f").enabled) {
                __classPrivateFieldGet(this, _Listener_event, "f").enable();
            }
            __classPrivateFieldGet(this, _Listener_event, "f").promptText = __classPrivateFieldGet(this, _Listener_event, "f").promptText + event.key;
        }
        this.element.innerHTML = `Somme:&nbsp;${__classPrivateFieldGet(this, _Listener_event, "f").promptText}`;
    }
}
_Listener_event = new WeakMap();
class Event extends BoardEvent {
    constructor(p, tx) {
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
        super([BoardEvent.generateTextBox(`Entrez la somme pariée par ${p.name}`), box], BoardEvent.okSetup(false), BoardEvent.denySetup(false));
        _Event_tx.set(this, void 0);
        __classPrivateFieldSet(this, _Event_tx, tx, "f");
        this.promptText = "";
        this.enabled = false;
        this.text = text;
    }
    enable() {
        this.enableOk(() => {
            let ammount = Number(this.promptText);
            __classPrivateFieldGet(this, _Event_tx, "f").send(ammount);
        });
        this.enabled = true;
    }
    disable() {
        this.disableOk();
        this.enabled = false;
    }
}
_Event_tx = new WeakMap();
