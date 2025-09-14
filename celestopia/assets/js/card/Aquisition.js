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
var _a, _Aquisition_price, _Aquisition_coinValue, _Aquisition_ribbonValue, _Aquisition_starValue, _Aquisition_boostedValue, _Aquisition_bank;
import { removeFromArray } from "../util/functions.js";
import { Card, cardHeight, cardWidth } from "./Card.js";
export class Aquisition extends Card {
    constructor(name, title, price, coin, ribbon, star, boostedValue) {
        super(name, title, "aquisition", "#9cd552", "#b3ec69", "#c7fa85", "jpg");
        _Aquisition_price.set(this, void 0);
        _Aquisition_coinValue.set(this, void 0);
        _Aquisition_ribbonValue.set(this, void 0);
        _Aquisition_starValue.set(this, void 0);
        _Aquisition_boostedValue.set(this, void 0);
        __classPrivateFieldSet(this, _Aquisition_price, price, "f");
        __classPrivateFieldSet(this, _Aquisition_coinValue, coin, "f");
        __classPrivateFieldSet(this, _Aquisition_ribbonValue, ribbon, "f");
        __classPrivateFieldSet(this, _Aquisition_starValue, star, "f");
        __classPrivateFieldSet(this, _Aquisition_boostedValue, boostedValue, "f");
    }
    dataLayout() {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.alignItems = "center";
        box.style.height = `${cardHeight - 2 - cardWidth / 8}vw`; // card height shared between title and box
        box.style.paddingRight = "1vw";
        box.style.overflowY = "scroll";
        box.style.scrollbarColor = "#6b9535 transparent";
        [
            Card.generateParagraph("Prix d'achat"),
            Card.generateValueBox("coin", __classPrivateFieldGet(this, _Aquisition_price, "f"), false),
            Card.generateParagraph("Gains de vente")
        ].forEach((x) => box.appendChild(x));
        const values = Card.generateValueBoxes(__classPrivateFieldGet(this, _Aquisition_coinValue, "f"), __classPrivateFieldGet(this, _Aquisition_ribbonValue, "f"), __classPrivateFieldGet(this, _Aquisition_starValue, "f"), __classPrivateFieldGet(this, _Aquisition_boostedValue, "f"));
        values.forEach((x) => box.appendChild(x));
        return box;
    }
    get name() {
        return this._name;
    }
    get price() {
        return __classPrivateFieldGet(this, _Aquisition_price, "f");
    }
    get coins() {
        return __classPrivateFieldGet(this, _Aquisition_coinValue, "f");
    }
    get ribbons() {
        return __classPrivateFieldGet(this, _Aquisition_ribbonValue, "f");
    }
    get stars() {
        return __classPrivateFieldGet(this, _Aquisition_starValue, "f");
    }
    clone() {
        return new _a(this.name, this.title, __classPrivateFieldGet(this, _Aquisition_price, "f"), __classPrivateFieldGet(this, _Aquisition_coinValue, "f"), __classPrivateFieldGet(this, _Aquisition_ribbonValue, "f"), __classPrivateFieldGet(this, _Aquisition_starValue, "f"));
    }
    getBoostedClone(boost) {
        return new _a(this.name, this.title, __classPrivateFieldGet(this, _Aquisition_price, "f"), boost === "coin" ? this.coins * 1.5 : this.coins, boost === "ribbon" ? this.ribbons * 1.5 : this.ribbons, boost === "star" ? this.stars * 1.5 : this.stars, boost);
    }
    static getByName(name) {
        for (let i = 0; i < __classPrivateFieldGet(this, _a, "f", _Aquisition_bank).length; i++) {
            const a = __classPrivateFieldGet(this, _a, "f", _Aquisition_bank)[i];
            if (a.name === name) {
                return removeFromArray(__classPrivateFieldGet(this, _a, "f", _Aquisition_bank), i);
            }
        }
        console.log(`WARN: can't found ${name}`);
        return undefined;
    }
    static getRandomAquisition() {
        const i = Math.floor(Math.random() * __classPrivateFieldGet(_a, _a, "f", _Aquisition_bank).length);
        return removeFromArray(__classPrivateFieldGet(_a, _a, "f", _Aquisition_bank), i);
    }
    static returnToBank(aquisition) {
        __classPrivateFieldGet(_a, _a, "f", _Aquisition_bank).push(aquisition);
    }
}
_a = Aquisition, _Aquisition_price = new WeakMap(), _Aquisition_coinValue = new WeakMap(), _Aquisition_ribbonValue = new WeakMap(), _Aquisition_starValue = new WeakMap(), _Aquisition_boostedValue = new WeakMap();
Aquisition.menuText = "Utilisez les flèches du clavier pour naviguer entre vos aquisitions.";
_Aquisition_bank = { value: [
        new _a("astropy", "Un voyage pour Astropy", 1050, 150, 0, 1800),
        new _a("baloon", "Un ballon tout neuf", 2400, 150, 3600, 0),
        new _a("bd", "Une collection de BD", 600, 50, 1650, 0),
        new _a("beauty", "Un salon de beauté", 3300, 4050, 1100, 0),
        new _a("camping", "Une caravane", 3300, 5100, 0, 0),
        new _a("car", "Une voiture de course", 2850, 3600, 0, 300),
        new _a("coins", "Des pièces de la cité voisine", 100, 1000, 0, 0),
        new _a("castle", "Le chateau de Celestopia", 4500, 2000, 2000, 2000),
        new _a("chest", "Un meuble en bois", 450, 1200, 0, 100),
        new _a("dog", "Une peluche très réaliste", 1050, 0, 3000, 0),
        new _a("horse", "Un cheval de course", 2100, 4200, 0, 200),
        new _a("garden", "Une statue irlandaise", 0, 500, 0, 0),
        new _a("magic", "Une baguette (vraiment) magique", 3000, 5000, 5000, 5000),
        new _a("moto", "Une moto", 2400, 3600, 0, 150),
        new _a("necklace", "Un collier en poudre d'étoiles", 1000, 100, 0, 1800),
        new _a("picasso", "Un authentique picasso", 2100, 3250, 1050, 200),
        new _a("pool", "Une piscine", 3000, 7500, 300, 0),
        new _a("post", "Une collection de timbres", 1050, 150, 1800, 0),
        new _a("tractor", "Un tracteur agricole", 2850, 3600, 0, 300),
        new _a("vase", "Un vase en poudre d'étoiles", 3000, 300, 0, 7500),
        new _a("wine", "Un vignoble qui rapporte", 3000, 4500, 100, 0),
    ] };
