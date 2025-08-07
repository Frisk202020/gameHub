import { DynamicPlacement } from "../util/DynamicPlacement.js";
import { vwToPx } from "../util/functions.js";
import { boxId, cardId, navId } from "./menu.js";

export abstract class Card implements DynamicPlacement {
    #name: string;
    #src: string;
    static #cardWidth = 30;

    static get cardWidth(): number {
        return this.#cardWidth;
    }

    constructor(name: string, folder: "aquisitions" | "wonders") {
        this.#name = name;
        this.#src = `get_file/celestopia/assets/${folder}/${name}.png`
    }

    get name() {
        return this.#name;
    } get src() {
        return this.#src;
    }

    move(windowWidth: number, windowHeight: number): void {
        const img = document.getElementById(cardId);
        const px = vwToPx(Card.#cardWidth);
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