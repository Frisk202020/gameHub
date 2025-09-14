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
var _RibbonSell_target, _RibbonSell_coins, _RibbonSell_ribbons;
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";
export class RibbonSell extends Happening {
    constructor(player, tx) {
        const ribbons = [50, 110, 170, 300, 500];
        const coins = [75, 150, 200, 400, 650];
        const index = Math.floor(Math.random() * 5);
        super("Acheteur de rubans !", "Un artisan peu prévoyant vous achète des rubans à bon prix !", player.ribbons < ribbons[index], true, tx, BoardEvent.generateTextBox(`Vendre ${ribbons[index]} rubans pour ${coins[index]} pièces ?`));
        _RibbonSell_target.set(this, void 0);
        _RibbonSell_coins.set(this, void 0);
        _RibbonSell_ribbons.set(this, void 0);
        __classPrivateFieldSet(this, _RibbonSell_target, player, "f");
        __classPrivateFieldSet(this, _RibbonSell_coins, coins[index], "f");
        __classPrivateFieldSet(this, _RibbonSell_ribbons, ribbons[index], "f");
    }
    event() {
        const promises = Array();
        promises.push(__classPrivateFieldGet(this, _RibbonSell_target, "f").progressiveCoinChange(__classPrivateFieldGet(this, _RibbonSell_coins, "f")));
        promises.push(__classPrivateFieldGet(this, _RibbonSell_target, "f").progressiveRibbonChange(-__classPrivateFieldGet(this, _RibbonSell_ribbons, "f")));
        Promise.all(promises).then(() => this.tx.send());
    }
}
_RibbonSell_target = new WeakMap(), _RibbonSell_coins = new WeakMap(), _RibbonSell_ribbons = new WeakMap();
