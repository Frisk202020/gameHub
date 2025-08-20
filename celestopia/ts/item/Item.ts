import { Popup } from "../event/Popup.js";
import { Player } from "../Player.js";
import { assets_link, vwToPx } from "../util/functions.js";

export type ItemName = "Dice" | "TrickDice" | "Seller" | "AquisitionThief" | "MoneyThief" | "Pipe"

export abstract class Item<T = void> {
    protected holder: Player;
    #name: string;
    #description: string;
    #img: HTMLImageElement;
    #imgEvent: ()=>void;
    #event: (param: T)=>void;

    constructor(p: Player, name: string, description: string,  imgId: string, event: (param: T)=>void, padding: boolean) {
        this.holder = p;
        this.#imgEvent = ()=>{};
        this.#name = name;
        this.#description = description;

        const img = document.createElement("img");
        img.src = assets_link(`items/${imgId}.png`);
        img.style.width = padding ? "10vw" :"11vw";
        img.style.margin = "5vw";
        if (padding) { img.style.padding = "0.5vw"; }
        img.style.backgroundColor = `${p.color}96`; // 96(hex) = 150(dec)
        img.style.borderRadius = "15px";
        img.style.border = "solid 5px transparent";
        img.addEventListener("click", ()=>this.#imgEvent());

        this.#img = img;
        this.#event = event;
    }

    get name() {
        return this.#name;
    } get imgStyle() {
        return this.#img.style;
    }

    getImg(event?: ()=>void) {
        this.removeBorder();
        if (event === undefined) {
            this.#imgEvent = ()=>{};
        } else {
            this.#imgEvent = event;
        }
        this.#img.className = "pointerHover";

        return this.#img;
    }

    setBorder() {
        this.#img.style.borderColor = "#ffd700";
    }
    removeBorder() {
        this.#img.style.borderColor = "transparent";
    }

    event(param: T) {
        this.#event(param);
        this.holder.removeItem(this);
    }

    // Expected to be called after appending the img to the menu
    addHelpButton(parent: HTMLDivElement) {
        const rect = this.#img.getBoundingClientRect();
        const button = document.createElement("img");
        button.src = assets_link("icons/help.png");
        button.className = "pointerHover";
        button.style.width = "5vw";
        button.style.position = "absolute";
        button.style.left = `${rect.right - vwToPx(2.5)}px`;
        button.style.top = `${rect.top - vwToPx(2.5)}px`;
        button.addEventListener("click", ()=>new Popup(this.#description, this.#name))

        parent.appendChild(button);
    }

    static async getRandomItem(holder: Player): Promise<Item<any>> {
        const pick = Math.floor(Math.random() * 130);

        if (pick < 5) {
            const { AquisitionThief } = await import("./AquisitionThief.js");
            return new AquisitionThief(holder);
        }
        else if (pick < 20) {
            const { MoneyThief } = await import("./MoneyThief.js");
            return new MoneyThief(holder);
        }
        else if (pick < 35) {
            const { Pipe } = await import("./Pipe.js");
            return new Pipe(holder);
        }
        else if (pick < 50) {
            const { TrickItem } = await import("./TrickItem.js");
            return new TrickItem(holder);
        }
        else if (pick < 65) {
            const { Seller } = await import("./Seller.js");
            return new Seller(holder);
        }
        else {
            const { DiceItem } = await import("./DiceItem.js");
            return new DiceItem(holder);
        }
    }
}
