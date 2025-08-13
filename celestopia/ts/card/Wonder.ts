import { resizables } from "../util/variables.js";
import { Card } from "./Card.js";

export type WonderName = "statue" | "astropy" | "bank" | "bridge" | "dress" | "comet" | "teleporter";

export class Wonder extends Card {
    #coinPrice: number;
    #ribbonPrice: number;
    #starPrice: number;

    constructor(name: WonderName, coinPrice: number, ribbonPrice: number, starPrice: number) {
        super(name, "wonders");
        this.#coinPrice = coinPrice;
        this.#ribbonPrice = ribbonPrice;
        this.#starPrice = starPrice;

        resizables.push(this);
    }

    get coins() {
        return this.#coinPrice;
    } get ribbons() {
        return this.#ribbonPrice;
    } get stars() {
        return this.#starPrice;
    }

    static #bank = new Map<WonderName, Wonder>([
        ["statue", new Wonder("statue", 25000, 0, 0)],
        ["astropy", new Wonder("astropy", 4000, 0, 20000)],
        ["bank", new Wonder("bank", 15000, 0, 15000)],
        ["bridge", new Wonder("bridge", 1200, 30000, 0)],
        ["dress", new Wonder("dress", 7500, 20000, 0)],
        ["comet", new Wonder("comet", 0, 0, 99999)],
        ["teleporter", new Wonder("teleporter", 10000, 10000, 0)]
    ]);


    static getWonder(name: WonderName): Wonder | undefined {
        const x = this.#bank.get(name);
        if (x === undefined) {
            return undefined;
        } else {
            this.#bank.delete(name);
            return x;
        }
    }

    static returnWonder(wonder: Wonder) {
        this.#bank.set(wonder.name as WonderName, wonder);
    }
}