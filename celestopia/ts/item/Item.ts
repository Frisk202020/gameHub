import { Player } from "../Player.js";

export abstract class Item {
    #holder: Player
    #price: number;
    #img: HTMLImageElement;
    #imgEvent: ()=>void;
    #event: ()=>void;

    constructor(p: Player, price: number, name: string, event: ()=>void) {
        this.#holder = p;
        this.#price = price;
        this.#imgEvent = ()=>{console.log("wrong")};

        const img = document.createElement("img");
        img.src = `get_file/celestopia/assets/items/${name}.png`;
        img.style.width = "10vw";
        img.style.margin = "5vw";
        img.style.padding = "0.5vw";
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

    event() {
        this.#event();
        this.#holder.removeItem(this);
    }
    //TODO
    // dice
    // tricked dice
    // ressource thief
    // aq tief
    // pocket seller
    // pipe
}