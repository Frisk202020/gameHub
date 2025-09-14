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
var _GiftEvent_target;
import { Happening } from "./Happening.js";
export class GiftEvent extends Happening {
    constructor(player, tx) {
        super("Un petit cadeau !", "Des citoyens croisent votre chemin et espère vous voir gagner. Ils vous donnent une partie de leur économies !", false, false, tx);
        _GiftEvent_target.set(this, void 0);
        __classPrivateFieldSet(this, _GiftEvent_target, player, "f");
    }
    event() {
        const choices = [700, 1500, 2500, 4000];
        const chosen = choices[Math.floor(Math.random() * 4)];
        __classPrivateFieldGet(this, _GiftEvent_target, "f").progressiveCoinChange(chosen).then(() => this.tx.send());
    }
}
_GiftEvent_target = new WeakMap();
