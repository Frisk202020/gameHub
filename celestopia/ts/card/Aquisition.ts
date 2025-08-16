import { removeFromArray } from "../util/functions.js";
import { Money, resizables } from "../util/variables.js";
import { Card } from "./Card.js";

export class Aquisition extends Card {
    #price: number;
    #coinValue: number;
    #ribbonValue: number;
    #starValue: number;
    static menuText = "Utilisez les flèches du clavier pour naviguer entre vos aquisitions.";

    constructor(name: string, price: number, coin: number, ribbon: number, star: number) {
        super(name, "aquisitions")
        this.#price = price;
        this.#coinValue = coin;
        this.#ribbonValue = ribbon;
        this.#starValue = star;

        resizables.push(this);
    }

    get price() {
        return this.#price;
    } get coins() {
        return this.#coinValue;
    } get ribbons() {
        return this.#ribbonValue;
    } get stars() {
        return this.#starValue;
    }

    clone() {
        return new Aquisition(this.name, this.#price, this.#coinValue, this.#ribbonValue, this.#starValue);
    }

    getBoostedClone(boost: Money) {
        return new Aquisition(
            this.name,
            this.#price,
            boost === "coin" ? this.coins * 1.5 : this.coins,
            boost === "ribbon" ? this.ribbons * 1.5 : this.ribbons,
            boost === "star" ? this.stars * 1.5 : this.stars,
        )
    }

    static #bank = [
        new Aquisition("astropy", 1050, 150, 0, 1800),
        new Aquisition("baloon", 2400, 150, 3600, 0),
        new Aquisition("bd", 600, 50, 1650, 0),
        new Aquisition("beauty", 3300, 4050, 1100, 0),
        new Aquisition("camping", 3300, 5100, 0, 0),
        new Aquisition("car", 2850, 3600, 0, 300),
        new Aquisition("castle", 4500, 2000, 2000, 2000),
        new Aquisition("chest", 450, 1200, 0, 100),
        new Aquisition("horse", 2100, 4200, 0, 200),
        new Aquisition("magic", 3000, 5000, 5000, 5000),
        new Aquisition("moto", 2400, 3600, 0, 150),
        new Aquisition("necklace", 1000, 100, 0, 1800),
        new Aquisition("picasso", 2100, 3250, 1050, 200),
        new Aquisition("pool", 3000, 7500, 300, 0),
        new Aquisition("post", 1050, 150, 1800, 0),
        new Aquisition("tractor", 2850, 3600, 0, 300),
        new Aquisition("vase", 3000, 300, 0, 7500),
        new Aquisition("wine", 3000, 4500, 100, 0),
    ];

    static DEBUG_get_aquisition(name: string) {
        for (let i = 0; i < this.#bank.length; i++) {
            const a = this.#bank[i];
            if (a.name === name) { return removeFromArray(this.#bank, i); }
        }

        return undefined;
    }

    static getRandomAquisition() {
        const i = Math.floor(Math.random() * Aquisition.#bank.length);
        return removeFromArray(Aquisition.#bank, i);
    }

    static returnToBank(aquisition: Aquisition) {
        Aquisition.#bank.push(aquisition);
    }
}