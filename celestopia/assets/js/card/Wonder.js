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
var _a, _Wonder_coinPrice, _Wonder_ribbonPrice, _Wonder_starPrice, _Wonder_bank;
import { Card } from "./Card.js";
export class Wonder extends Card {
    constructor(name, title, coinPrice, ribbonPrice, starPrice) {
        super(name, title, "wonder", "#ffd700", "#ffe138", "#f1de72");
        _Wonder_coinPrice.set(this, void 0);
        _Wonder_ribbonPrice.set(this, void 0);
        _Wonder_starPrice.set(this, void 0);
        __classPrivateFieldSet(this, _Wonder_coinPrice, coinPrice, "f");
        __classPrivateFieldSet(this, _Wonder_ribbonPrice, ribbonPrice, "f");
        __classPrivateFieldSet(this, _Wonder_starPrice, starPrice, "f");
    }
    dataLayout() {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.justifyContent = "center";
        box.appendChild(Card.generateParagraph("Prix d'achat"));
        const values = Card.generateValueBoxes(__classPrivateFieldGet(this, _Wonder_coinPrice, "f"), __classPrivateFieldGet(this, _Wonder_ribbonPrice, "f"), __classPrivateFieldGet(this, _Wonder_starPrice, "f"));
        values.forEach((x) => {
            box.appendChild(x);
        });
        return box;
    }
    get coins() {
        return __classPrivateFieldGet(this, _Wonder_coinPrice, "f");
    }
    get ribbons() {
        return __classPrivateFieldGet(this, _Wonder_ribbonPrice, "f");
    }
    get stars() {
        return __classPrivateFieldGet(this, _Wonder_starPrice, "f");
    }
    get name() {
        return this._name;
    }
    static getWonder(name, warn) {
        const x = __classPrivateFieldGet(this, _a, "f", _Wonder_bank).get(name);
        if (x === undefined) {
            if (warn) {
                console.log(`WARN: ${name} not found`);
            }
            return undefined;
        }
        else {
            __classPrivateFieldGet(this, _a, "f", _Wonder_bank).delete(name);
            return x;
        }
    }
    static returnWonder(wonder) {
        __classPrivateFieldGet(this, _a, "f", _Wonder_bank).set(wonder.name, wonder);
    }
}
_a = Wonder, _Wonder_coinPrice = new WeakMap(), _Wonder_ribbonPrice = new WeakMap(), _Wonder_starPrice = new WeakMap();
_Wonder_bank = { value: new Map([
        ["statue", new _a("statue", "La statue de la Mairesse", 25000, 0, 0)],
        ["astropy", new _a("astropy", "Astropy", 4000, 0, 20000)],
        ["bank", new _a("bank", "La banque municipale", 15000, 0, 15000)],
        ["bridge", new _a("bridge", "Le pont de tissu", 1200, 30000, 0)],
        ["dress", new _a("dress", "La robe dorée", 7500, 20000, 0)],
        ["comet", new _a("comet", "La comète mère", 0, 0, 40000)],
        ["teleporter", new _a("teleporter", "Le téléporteur de tissu", 10000, 10000, 0)]
    ]) };
