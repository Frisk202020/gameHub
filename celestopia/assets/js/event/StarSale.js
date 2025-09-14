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
var _StarSale_target, _StarSale_coins, _StarSale_stars;
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";
export class StarSale extends Happening {
    constructor(player, tx) {
        const coins = [100, 150, 225, 325, 450];
        const stars = [200, 300, 500, 700, 1000];
        const index = Math.floor(Math.random() * 5);
        super("Vente d'étoiles !", "Un doyen astrophysicien vous vend des étoiles à prix coutant !", false, true, tx, BoardEvent.generateTextBox(`Acheter ${stars[index]} étoiles pour ${coins[index]} pièces ?`));
        _StarSale_target.set(this, void 0);
        _StarSale_coins.set(this, void 0);
        _StarSale_stars.set(this, void 0);
        __classPrivateFieldSet(this, _StarSale_target, player, "f");
        __classPrivateFieldSet(this, _StarSale_coins, coins[index], "f");
        __classPrivateFieldSet(this, _StarSale_stars, stars[index], "f");
    }
    event() {
        const promises = Array();
        promises.push(__classPrivateFieldGet(this, _StarSale_target, "f").progressiveCoinChange(-__classPrivateFieldGet(this, _StarSale_coins, "f")));
        promises.push(__classPrivateFieldGet(this, _StarSale_target, "f").progressiveStarChange(__classPrivateFieldGet(this, _StarSale_stars, "f")));
        Promise.all(promises).then(() => this.tx.send());
    }
}
_StarSale_target = new WeakMap(), _StarSale_coins = new WeakMap(), _StarSale_stars = new WeakMap();
