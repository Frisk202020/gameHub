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
var _Theft_instances, _Theft_target, _Theft_victim, _Theft_ammount, _Theft_event, _Theft_currency, _Theft_coinEvent, _Theft_ribbonEvent, _Theft_starEvent;
import { players } from "../util/variables.js";
import { Happening } from "./Happening.js";
export class Theft extends Happening {
    constructor(player, tx, victim, m) {
        if (victim === undefined) {
            const playerIndex = players.indexOf(player);
            let index = Math.floor(Math.random() * (players.length - 1));
            if (index === playerIndex) {
                index++;
            }
            victim = players[index];
        }
        let text;
        switch (m) {
            case "ribbon":
                text = `Volez entre 1 et 500 rubans à ${victim.name}`;
                break;
            case "star":
                text = `Volez entre 1 et 500 étoiles à ${victim.name}`;
                break;
            default: text = `Volez entre 1 et 1000 pièces à ${victim.name}`;
        }
        super("Extorsion de fonds !", text, false, false, tx);
        _Theft_instances.add(this);
        _Theft_target.set(this, void 0);
        _Theft_victim.set(this, void 0);
        _Theft_ammount.set(this, void 0);
        _Theft_event.set(this, void 0);
        _Theft_currency.set(this, void 0);
        __classPrivateFieldSet(this, _Theft_target, player, "f");
        __classPrivateFieldSet(this, _Theft_victim, victim, "f");
        __classPrivateFieldSet(this, _Theft_currency, m === undefined ? "coin" : m, "f");
        switch (__classPrivateFieldGet(this, _Theft_currency, "f")) {
            // can't steal more than what the victim has
            case "coin":
                __classPrivateFieldSet(this, _Theft_ammount, Math.min(1 + Math.floor(Math.random() * 1000), victim.coins), "f");
                __classPrivateFieldSet(this, _Theft_event, () => __classPrivateFieldGet(this, _Theft_instances, "m", _Theft_coinEvent).call(this), "f");
                break;
            case "ribbon":
                __classPrivateFieldSet(this, _Theft_ammount, Math.min(1 + Math.floor(Math.random() * 500), victim.ribbons), "f");
                __classPrivateFieldSet(this, _Theft_event, () => __classPrivateFieldGet(this, _Theft_instances, "m", _Theft_ribbonEvent).call(this), "f");
                break;
            case "star":
                __classPrivateFieldSet(this, _Theft_ammount, Math.min(1 + Math.floor(Math.random() * 500), victim.stars), "f");
                __classPrivateFieldSet(this, _Theft_event, () => __classPrivateFieldGet(this, _Theft_instances, "m", _Theft_starEvent).call(this), "f");
        }
    }
    event() {
        __classPrivateFieldGet(this, _Theft_event, "f").call(this).then(() => this.tx.send());
    }
}
_Theft_target = new WeakMap(), _Theft_victim = new WeakMap(), _Theft_ammount = new WeakMap(), _Theft_event = new WeakMap(), _Theft_currency = new WeakMap(), _Theft_instances = new WeakSet(), _Theft_coinEvent = async function _Theft_coinEvent() {
    await Promise.all([
        __classPrivateFieldGet(this, _Theft_target, "f").progressiveCoinChange(__classPrivateFieldGet(this, _Theft_target, "f").coins + __classPrivateFieldGet(this, _Theft_ammount, "f")),
        __classPrivateFieldGet(this, _Theft_victim, "f").progressiveCoinChange(__classPrivateFieldGet(this, _Theft_victim, "f").coins - __classPrivateFieldGet(this, _Theft_ammount, "f"))
    ]);
}, _Theft_ribbonEvent = async function _Theft_ribbonEvent() {
    await Promise.all([
        __classPrivateFieldGet(this, _Theft_target, "f").progressiveRibbonChange(__classPrivateFieldGet(this, _Theft_target, "f").ribbons + __classPrivateFieldGet(this, _Theft_ammount, "f")),
        __classPrivateFieldGet(this, _Theft_victim, "f").progressiveRibbonChange(__classPrivateFieldGet(this, _Theft_victim, "f").ribbons - __classPrivateFieldGet(this, _Theft_ammount, "f"))
    ]);
}, _Theft_starEvent = async function _Theft_starEvent() {
    await Promise.all([
        __classPrivateFieldGet(this, _Theft_target, "f").progressiveStarChange(__classPrivateFieldGet(this, _Theft_target, "f").stars + __classPrivateFieldGet(this, _Theft_ammount, "f")),
        __classPrivateFieldGet(this, _Theft_victim, "f").progressiveStarChange(__classPrivateFieldGet(this, _Theft_victim, "f").stars - __classPrivateFieldGet(this, _Theft_ammount, "f"))
    ]);
};
