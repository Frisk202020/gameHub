import { removeFromArray } from "../util/functions.js";
import { type Money } from "../util/variables.js";
import { Card, cardHeight, cardWidth } from "./Card.js";

export type AquisitionName = "astropy" | "baloon" | "bd" | "beauty" | "camping" | "car" | "castle" | "chest" | "horse" | "magic" | "moto"
    | "necklace" | "picasso" | "pool" | "post" | "tractor" | "vase" | "wine" | "coins" | "dog" | "garden";

export class Aquisition extends Card {
    #price: number;
    #coinValue: number;
    #ribbonValue: number;
    #starValue: number;
    static menuText = "Utilisez les flèches du clavier pour naviguer entre vos aquisitions.";

    constructor(name: AquisitionName, title: string, price: number, coin: number, ribbon: number, star: number) {
        super(name, title, "aquisition", "#9cd552","#b3ec69", "#c7fa85", "jpg")
        this.#price = price;
        this.#coinValue = coin;
        this.#ribbonValue = ribbon;
        this.#starValue = star;
    }

    protected dataLayout(): HTMLDivElement {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.alignItems = "center";
        box.style.height = `${cardHeight - 2 - cardWidth/8}vw`; // card height shared between title and box
        box.style.paddingRight = "1vw";
        box.style.overflowY = "scroll";
        box.style.scrollbarColor = "#6b9535 transparent";
        [
            Card.generateParagraph("Prix d'achat"), 
            Card.generateValueBox("coin", this.#price), 
            Card.generateParagraph("Gains de vente")
        ].forEach((x)=>box.appendChild(x));

        const values = Card.generateValueBoxes(this.#coinValue, this.#ribbonValue, this.#starValue);
        values.forEach((x)=>box.appendChild(x));

        return box;
    }

    get name() {
        return this._name as AquisitionName;
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
        return new Aquisition(this.name, this.title, this.#price, this.#coinValue, this.#ribbonValue, this.#starValue);
    }

    getBoostedClone(boost: Money) {
        return new Aquisition(
            this.name,
            this.title,
            this.#price,
            boost === "coin" ? this.coins * 1.5 : this.coins,
            boost === "ribbon" ? this.ribbons * 1.5 : this.ribbons,
            boost === "star" ? this.stars * 1.5 : this.stars,
        )
    }

    static #bank = [
        new Aquisition("astropy", "Un voyage pour Astropy", 1050, 150, 0, 1800),
        new Aquisition("baloon", "Un ballon tout neuf", 2400, 150, 3600, 0),
        new Aquisition("bd", "Une collection de BD", 600, 50, 1650, 0),
        new Aquisition("beauty", "Un salon de beauté", 3300, 4050, 1100, 0),
        new Aquisition("camping", "Une caravane", 3300, 5100, 0, 0),
        new Aquisition("car", "Une voiture de course", 2850, 3600, 0, 300),
        new Aquisition("coins", "Des pièces de la cité voisine", 100, 1000, 0, 0),
        new Aquisition("castle", "Le chateau de Celestopia", 4500, 2000, 2000, 2000),
        new Aquisition("chest", "Un meuble en bois", 450, 1200, 0, 100),
        new Aquisition("dog", "Une peluche très réaliste", 1050, 0, 3000, 0),
        new Aquisition("horse", "Un cheval de course", 2100, 4200, 0, 200),
        new Aquisition("garden", "Une statue irlandaise", 0, 500, 0, 0),
        new Aquisition("magic", "Une baguette (vraiment) magique",3000, 5000, 5000, 5000),
        new Aquisition("moto", "Une moto", 2400, 3600, 0, 150),
        new Aquisition("necklace", "Un collier en poudre d'étoiles", 1000, 100, 0, 1800),
        new Aquisition("picasso", "Un authentique picasso", 2100, 3250, 1050, 200),
        new Aquisition("pool", "Une piscine", 3000, 7500, 300, 0),
        new Aquisition("post", "Une collection de timbres", 1050, 150, 1800, 0),
        new Aquisition("tractor", "Un tracteur agricole", 2850, 3600, 0, 300),
        new Aquisition("vase", "Un vase en poudre d'étoiles",3000, 300, 0, 7500),
        new Aquisition("wine", "Un vignoble qui rapporte",3000, 4500, 100, 0),
    ];

    static getByName(name: string) {
        for (let i = 0; i < this.#bank.length; i++) {
            const a = this.#bank[i];
            if (a.name === name) { return removeFromArray(this.#bank, i); }
        }

        console.log(`WARN: can't found ${name}`)
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