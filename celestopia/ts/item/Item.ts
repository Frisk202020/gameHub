import { Player } from "../Player.js";

export abstract class Item<T = void> {
    protected holder: Player
    #price: number;
    #img: HTMLImageElement;
    #imgEvent: ()=>void;
    #event: (param: T)=>void;

    constructor(p: Player, price: number, name: string, event: (param: T)=>void, padding: boolean) {
        this.holder = p;
        this.#price = price;
        this.#imgEvent = ()=>{console.log("wrong")};

        const img = document.createElement("img");
        img.src = `get_file/celestopia/assets/items/${name}.png`;
        img.style.width = "10vw";
        img.style.margin = "5vw";
        if (padding) { img.style.padding = "0.5vw"; }
        img.style.backgroundColor = `${p.color}96`; // 96(hex) = 150(dec)
        img.style.borderRadius = "15px";
        img.style.border = "solid 5px transparent";
        img.addEventListener("click", ()=>this.#imgEvent())

        this.#img = img;
        this.#event = event;
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
    //TODO
        // ressource thief
        // pipe
}