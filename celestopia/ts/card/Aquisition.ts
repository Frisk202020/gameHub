import { DynamicPlacement } from "../util/DynamicPlacement.js";
import { vwToPx } from "../util/functions.js";
import { resizables } from "../util/variables.js";
import { Card } from "./Card.js";
import { boxId, cardId, navId } from "./menu.js";

export class Aquisition extends Card implements DynamicPlacement {
    price: number;
    coinValue: number;
    ribbonValue: number;
    starValue: number;

    constructor(name: string, price: number, coin: number, ribbon: number, star: number) {
        super(name)
        this.price = price;
        this.coinValue = coin;
        this.ribbonValue = ribbon;
        this.starValue = star;

        resizables.push(this);
    }

    static bank = [
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

    static getRandomAquisition() {
        const i = Math.floor(Math.random() * Aquisition.bank.length);
        const value = Aquisition.bank[i];
        Aquisition.bank[i] = Aquisition.bank[Aquisition.bank.length - 1];
        Aquisition.bank.pop();

        return value;
    }

    static returnAquisitionToBank(aquisition: Aquisition) {
        Aquisition.bank.push(aquisition);
    }

    move(windowWidth: number, windowHeight: number): void {
        const img = document.getElementById(cardId);
        const px = vwToPx(40);
        if (img != undefined) {
            img.style.left = `${(windowWidth - px)/2}px`;
            img.style.top = `${(windowHeight - px)/2}px`;

            const helpBox = document.getElementById(boxId);
            if (helpBox != undefined) {
                const rect = helpBox.getBoundingClientRect();
                const width = rect.right - rect.left;
                helpBox.style.left = `${(windowWidth - width)/2}px`;
                helpBox.style.top = `${img.getBoundingClientRect().bottom}px`;
            } else {
                console.log("WARN: aquisition card is loaded, but not the helper box");
            }

            const nav = document.getElementById(navId);
            if (nav != undefined) {
                const rect = nav.getBoundingClientRect();
                const width = rect.right - rect.left;
                nav.style.left = `${(windowWidth - width)/2}px`;
                nav.style.top = `${img.getBoundingClientRect().bottom - 50}px`;
            } else {
                console.log("WARN: aquisition card is loaded, but not the nav bar");
            }
        }
    }
}