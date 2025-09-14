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
var _StarSell_target, _StarSell_coins, _StarSell_stars;
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";
export class StarSell extends Happening {
    constructor(player, tx) {
        const stars = [50, 110, 170, 300, 500];
        const coins = [75, 150, 200, 400, 650];
        const index = Math.floor(Math.random() * 5);
        super("Acheteur d'étoiles !", "Un astrophysicien vous achète des étoiles à un bon prix !", player.stars < stars[index], true, tx, BoardEvent.generateTextBox(`Vendre ${stars[index]} étoiles pour ${coins[index]} pièces ?`));
        _StarSell_target.set(this, void 0);
        _StarSell_coins.set(this, void 0);
        _StarSell_stars.set(this, void 0);
        __classPrivateFieldSet(this, _StarSell_target, player, "f");
        __classPrivateFieldSet(this, _StarSell_coins, coins[index], "f");
        __classPrivateFieldSet(this, _StarSell_stars, stars[index], "f");
    }
    event() {
        const promises = Array();
        promises.push(__classPrivateFieldGet(this, _StarSell_target, "f").progressiveCoinChange(__classPrivateFieldGet(this, _StarSell_coins, "f")));
        promises.push(__classPrivateFieldGet(this, _StarSell_target, "f").progressiveStarChange(-__classPrivateFieldGet(this, _StarSell_stars, "f")));
        Promise.all(promises).then(() => this.tx.send());
    }
}
_StarSell_target = new WeakMap(), _StarSell_coins = new WeakMap(), _StarSell_stars = new WeakMap();
