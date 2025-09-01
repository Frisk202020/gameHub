import { Card } from "./Card.js";

export type WonderName = "statue" | "astropy" | "bank" | "bridge" | "dress" | "comet" | "teleporter";

export class Wonder extends Card {
    #coinPrice: number;
    #ribbonPrice: number;
    #starPrice: number;

    constructor(name: WonderName, coinPrice: number, ribbonPrice: number, starPrice: number) {
        super(name, "wonder");
        this.#coinPrice = coinPrice;
        this.#ribbonPrice = ribbonPrice;
        this.#starPrice = starPrice;
    }

    cardColor(): string {
        return "#ffd700";
    }
    protected dataLayout(): HTMLDivElement {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.justifyContent = "center";
        
        box.appendChild(Card.generateParagraph("Prix d'achat"));

        const values = Card.generateValueBoxes(this.#coinPrice, this.#ribbonPrice, this.#starPrice);
        values.forEach((x)=>{
            box.appendChild(x);
        });

        return box;
    }

    get coins() {
        return this.#coinPrice;
    } get ribbons() {
        return this.#ribbonPrice;
    } get stars() {
        return this.#starPrice;
    } get name() {
        return this._name as WonderName;
    }

    static #bank = new Map<WonderName, Wonder>([
        ["statue", new Wonder("statue", 25000, 0, 0)],
        ["astropy", new Wonder("astropy", 4000, 0, 20000)],
        ["bank", new Wonder("bank", 15000, 0, 15000)],
        ["bridge", new Wonder("bridge", 1200, 30000, 0)],
        ["dress", new Wonder("dress", 7500, 20000, 0)],
        ["comet", new Wonder("comet", 0, 0, 40000)],
        ["teleporter", new Wonder("teleporter", 10000, 10000, 0)]
    ]);


    static getWonder(name: WonderName, warn: boolean): Wonder | undefined {
        const x = this.#bank.get(name);
        if (x === undefined) {
            if (warn) { console.log(`WARN: ${name} not found`); }
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