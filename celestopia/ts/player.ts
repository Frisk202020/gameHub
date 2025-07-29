import { Item } from "./item.js";
import { Position } from "./position.js";
import { createHelperBox, removeFromBodyOrWarn, vwToPx } from "./util.js";

type Avatar = "hat";
type Aquisition = "pool";
type Wonder = "astropy";
type PlayerId = 1 | 2 | 3 | 4;

const playerColor = {
    1: "#29b0ff",
    2: "#fa2714",
    3: "#4ac75e",
    4: "#ebdf3f"
}

export class Player {
    id: PlayerId;
    name: string;
    avatar: Avatar;
    coins: number;
    ribbons: number;
    stars: number;
    items: Array<Item>;
    aquisitions: Array<Aquisition>;
    wonders: Array<Wonder>;
    helperBox: HTMLParagraphElement | undefined;

    constructor(id: PlayerId, name: string, avatar: Avatar) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.coins = 0;
        this.ribbons = 0;
        this.stars = 0;
        this.items = Array();
        this.aquisitions = Array();
        this.wonders = Array();
        this.helperBox = undefined;

        this.#createHtml();
    }

    #createHtml() {
        const player = document.createElement("div");
        player.classList.add("player");
        player.id = this.name;

        const pStyle = player.style;
        pStyle.display = "flex";
        pStyle.flexDirection = "row";
        pStyle.position = "absolute";
        pStyle.left = "0px";
        pStyle.top = "0px";
        pStyle.padding = "10px";
        pStyle.backgroundColor = playerColor[this.id];
        pStyle.width = "10vw";
        pStyle.justifyContent = "space-between";

        const name = document.createElement("div");
        name.textContent = this.name;
        name.style.display = "grid";
        name.style.alignItems = "center";
        name.style.height = "5vh";
        name.style.marginRight = "5px";

        const icon = document.createElement("img");
        icon.src = `get_file/celestopia/assets/icons/${this.avatar}.png`;
        icon.style.height = "5vh";
        icon.style.marginLeft = "5px";

        player.appendChild(name);
        player.appendChild(icon);
        document.body.appendChild(player);
        player.addEventListener("mouseenter", () => {
            const box = createHelperBox("Cliquez pour voir les ressources du joueur.", new Position(vwToPx(10) + 25, 0), false); // + 20 is padding
            document.body.appendChild(box);
            this.helperBox = box;
        })
        player.addEventListener("mouseleave", () => {
            removeFromBodyOrWarn(this.helperBox);
        })
    }
}