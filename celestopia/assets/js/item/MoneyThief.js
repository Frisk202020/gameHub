var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Event_instances, _Event_tx, _Event_selectPlayer, _Event_selectMoney, _Event_enableOk;
import { BoardEvent } from "../event/BoardEvent.js";
import { Theft } from "../event/Theft.js";
import { initChannel } from "../util/channel.js";
import { Tuple } from "../util/tuple.js";
import { players } from "../util/variables.js";
import { Item } from "./Item.js";
export class MoneyThief extends Item {
    constructor(p) {
        const { tx, rx } = initChannel();
        super(p, "Voleur", "Volez la monnaie de votre choix au joueur de votre choix.", "money", () => { new Event(tx, p); }, true);
        rx.recv().then((t) => {
            const { tx, rx } = initChannel();
            new Theft(p, tx, t.first, t.second);
            rx.recv().then(() => console.log("money thief ended"));
        });
    }
}
class Event extends BoardEvent {
    constructor(tx, itemHolder) {
        const buttonMap = new Map();
        const playersBox = document.createElement("div");
        playersBox.style.display = "flex";
        playersBox.style.justifyContent = "center";
        for (const p of players) {
            if (p === itemHolder) {
                continue;
            }
            const b = BoardEvent.generateButton(p.name, p.color.base, true, () => {
                if (__classPrivateFieldGet(this, _Event_selectPlayer, "f") !== undefined) {
                    buttonMap.get(__classPrivateFieldGet(this, _Event_selectPlayer, "f").name).style.borderColor = "transparent";
                }
                __classPrivateFieldSet(this, _Event_selectPlayer, p, "f");
                if (__classPrivateFieldGet(this, _Event_selectMoney, "f") !== undefined) {
                    __classPrivateFieldGet(this, _Event_instances, "m", _Event_enableOk).call(this);
                }
                buttonMap.get(p.name).style.borderColor = "#ffd700";
            }, "transparent");
            buttonMap.set(p.name, b);
            playersBox.appendChild(b);
        }
        const moneysBox = document.createElement("div");
        moneysBox.style.display = "flex";
        moneysBox.style.justifyContent = "center";
        for (const t of new Array(new Tuple("coin", "pièces"), new Tuple("ribbon", "rubans"), new Tuple("star", "étoiles"))) {
            const b = BoardEvent.generateButton(t.second, itemHolder.color.base, true, () => {
                if (__classPrivateFieldGet(this, _Event_selectMoney, "f") !== undefined) {
                    buttonMap.get(__classPrivateFieldGet(this, _Event_selectMoney, "f")).style.borderColor = "transparent";
                }
                __classPrivateFieldSet(this, _Event_selectMoney, t.first, "f");
                if (__classPrivateFieldGet(this, _Event_selectPlayer, "f") !== undefined) {
                    __classPrivateFieldGet(this, _Event_instances, "m", _Event_enableOk).call(this);
                }
                buttonMap.get(t.first).style.borderColor = "#ffd700";
            }, "transparent");
            buttonMap.set(t.first, b);
            moneysBox.appendChild(b);
        }
        super([
            BoardEvent.generateTextBox("Choisissez la personne et la monnaie à voler (remarque: le gain de pièces maximal est de 1000, contre 500 pour les rubans et les étoiles)."),
            playersBox,
            moneysBox
        ], BoardEvent.okSetup(false, "Voler", () => { }), BoardEvent.denySetup(true, "Annuler", () => itemHolder.addItem(new MoneyThief(itemHolder))));
        _Event_instances.add(this);
        _Event_tx.set(this, void 0);
        _Event_selectPlayer.set(this, void 0);
        _Event_selectMoney.set(this, void 0);
        __classPrivateFieldSet(this, _Event_tx, tx, "f");
    }
}
_Event_tx = new WeakMap(), _Event_selectPlayer = new WeakMap(), _Event_selectMoney = new WeakMap(), _Event_instances = new WeakSet(), _Event_enableOk = function _Event_enableOk() {
    this.enableOk(() => __classPrivateFieldGet(this, _Event_tx, "f").send(new Tuple(__classPrivateFieldGet(this, _Event_selectPlayer, "f"), __classPrivateFieldGet(this, _Event_selectMoney, "f"))));
};
