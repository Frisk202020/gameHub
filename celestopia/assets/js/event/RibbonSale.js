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
var _RibbonSale_target, _RibbonSale_coins, _RibbonSale_ribbons;
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";
export class RibbonSale extends Happening {
    constructor(player, tx) {
        const coins = [100, 150, 225, 325, 450];
        const ribbons = [200, 300, 500, 700, 1000];
        const index = Math.floor(Math.random() * 5);
        super("Vente de rubans !", "Un artisan en herbe vous vend des rubans à prix coutant !", false, true, tx, BoardEvent.generateTextBox(`Acheter ${ribbons[index]} rubans pour ${coins[index]} pièces ?`));
        _RibbonSale_target.set(this, void 0);
        _RibbonSale_coins.set(this, void 0);
        _RibbonSale_ribbons.set(this, void 0);
        __classPrivateFieldSet(this, _RibbonSale_target, player, "f");
        __classPrivateFieldSet(this, _RibbonSale_coins, coins[index], "f");
        __classPrivateFieldSet(this, _RibbonSale_ribbons, ribbons[index], "f");
    }
    event() {
        const promises = Array();
        promises.push(__classPrivateFieldGet(this, _RibbonSale_target, "f").progressiveCoinChange(-__classPrivateFieldGet(this, _RibbonSale_coins, "f")));
        promises.push(__classPrivateFieldGet(this, _RibbonSale_target, "f").progressiveRibbonChange(__classPrivateFieldGet(this, _RibbonSale_ribbons, "f")));
        Promise.all(promises).then(() => this.tx.send());
    }
}
_RibbonSale_target = new WeakMap(), _RibbonSale_coins = new WeakMap(), _RibbonSale_ribbons = new WeakMap();
