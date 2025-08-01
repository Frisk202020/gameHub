import { Item } from "./board/Item.js";
import { Aquisition } from "./card/Aquisition.js";
import { Card } from "./card/Card.js";
import { Wonder } from "./card/Wonder.js";
import { generateMenu, ImgFolder } from "./card/menu.js";
import { Position } from "./util/Position.js";
import { DiceEvent } from "./util/dice.js";
import { createHelperBox, removeFromBodyOrWarn } from "./util/functions.js";

type Avatar = "hat";
type gameIcon = "coin" | "ribbon" | "star" | "wonder" | "chest";
type PlayerId = 1 | 2 | 3 | 4;

const playerBox: HTMLDivElement = document.getElementById("players") as HTMLDivElement;
const activeInfoHelp = "Cliquez pour replier.";
const inactiveInfoHelp = "Cliquez pour voir les ressources du joueur.";

const playerColor = {
    1: "#29b0ff",
    2: "#fa2714",
    3: "#4ac75e",
    4: "#ebdf3f"
}

const infoColor ={
    1: "#29b1ff3d",
    2: "#fa271448",
    3: "#4ac75f3a",
    4: "#ebe03f3a"
}

export class Player {
    id: PlayerId;
    name: string;
    avatar: Avatar;
    diceNumber: 1 | 2 | 3;
    coins: number;
    ribbons: number;
    stars: number;
    items: Array<Item>;
    aquisitions: Array<Aquisition>;
    wonders: Array<Wonder>;
    helperBox: HTMLParagraphElement | undefined;
    infoBox: HTMLDivElement;
    infoActive: boolean;

    constructor(id: PlayerId, name: string, avatar: Avatar) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.diceNumber = 1;
        this.coins = 0;
        this.ribbons = 0;
        this.stars = 0;
        this.items = Array();
        this.aquisitions = Array();
        this.wonders = Array();
        this.helperBox = undefined;
        this.infoBox = this.#createInfoBox();
        this.infoActive = false;

        this.#createHtml();
    }

    addAquisition(aq: Aquisition) {
        this.aquisitions.push(aq);
    }

    addWonder(w: Wonder) {
        this.wonders.push(w);
    }

    #createHtml() {
        const player = document.createElement("div");
        player.classList.add("player");
        player.id = this.name;
        player.appendChild(this.#createBanner());
        player.appendChild(this.infoBox);
        player.style.display = "flex";
        player.style.flexDirection = "column";
        playerBox.appendChild(player);
        player.addEventListener("mouseenter", () => {
            const box = createHelperBox(
                this.infoActive ? activeInfoHelp : inactiveInfoHelp, 
                false,
                new Position(player.getBoundingClientRect().right + 10, 0), 
            );
            document.body.appendChild(box);
            this.helperBox = box;
        })
        player.addEventListener("mouseleave", () => {
            removeFromBodyOrWarn(this.helperBox);
        })
        player.addEventListener("click", () => {
            if (this.infoActive) {
                this.infoBox.classList.remove("visible");
            } else {
                this.infoBox.classList.add("visible");
            }

            if (this.infoActive) {
                this.infoBox.classList.remove("visible");
                if (this.helperBox !== undefined) {
                    this.helperBox.textContent = inactiveInfoHelp;
                    this.infoBox.style.pointerEvents = "none";
                }
            } else {
                if (this.helperBox !== undefined) {
                    this.helperBox.textContent = activeInfoHelp;
                    this.infoBox.style.pointerEvents = "auto";
                }
                this.infoBox.classList.add("visible");
            }
            this.infoActive = !this.infoActive;
        })
    }

    #createBanner() {
        const banner = document.createElement("div");
        const style = banner.style;
        style.display = "flex";
        style.flexDirection = "row";
        style.padding = "0.5vw";
        style.backgroundColor = playerColor[this.id];
        style.width = "10vw";
        style.justifyContent = "space-between";
        style.borderRadius = "10px";
        style.pointerEvents = "auto";

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

        banner.appendChild(name);
        banner.appendChild(icon);
        return banner;
    }

    #createInfoBox() {
        const info = document.createElement("div");
        const infoStyle = info.style;
        infoStyle.width = "10vw";
        infoStyle.background = `linear-gradient(to bottom, ${playerColor[this.id]}, ${infoColor[this.id]})`;
        infoStyle.padding = "0.5vw";
        infoStyle.borderRadius = "10px";
        infoStyle.pointerEvents = "none";

        info.className = "reveal-vertical";
        info.appendChild(this.#createSubInfoBox("coin", this.coins));
        info.appendChild(this.#createSubInfoBox("ribbon", this.ribbons));
        info.appendChild(this.#createSubInfoBox("star", this.stars));

        const aq = this.#createSubInfoBox("chest", this.aquisitions.length);
        this.#addCardEventListeners(
            aq, 
            "aquisitions",
            "Cliquez pour afficher votre collection d'aquisitions.", 
            "Utilisez les flèches du clavier pour naviguer entre vos aquisitions."
        );
        info.appendChild(aq);

        const w = this.#createSubInfoBox("wonder", this.wonders.length);
        this.#addCardEventListeners(
            w,
            "wonders",
            "Cliquez pour afficher votre collection de merveilles.",
            "Utilisez les flèches du clavier pour naviguer entre vos merveilles."
        )
        info.appendChild(w);

        info.appendChild(this.#createActionBox());

        return info;
    }

    #createSubInfoBox(imgName: gameIcon, counterValue: number) {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "space-between";
        box.style.alignItems = "center";

        const img = document.createElement("img");
        img.src = `get_file/celestopia/assets/icons/${imgName}.png`;
        img.style.width  = "2vw";
        img.style.marginLeft = "0.5vw";

        const counter = document.createElement("p");
        counter.id = `${this.id}.${imgName}`;
        counter.textContent = counterValue.toString();
        counter.style.marginRight = "0.5vw";

        box.appendChild(img);
        box.appendChild(counter);
        return box;
    }

    #createActionBox() {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";

        const diceAction = document.createElement("img");
        diceAction.src = `get_file/celestopia/assets/icons/dice.png`;
        diceAction.style.width = "30%";
        diceAction.style.borderRadius = "100%";
        diceAction.style.backgroundColor = "#0063aedb"
        this.#addActionEventListeners(
            diceAction,
            "Lancez le dé quand c'est votre tour.",
            () => {
                new DiceEvent(this.diceNumber);
            }
        )
        diceAction.onload = () => diceAction.style.border = `solid ${diceAction.offsetHeight * 0.1}px #ffd700`;

        box.appendChild(diceAction);
        return box;
    }

    #addCardEventListeners(element: HTMLElement, imgFolder: ImgFolder, hoverMsg: string, clickMsg: string) {
        element.addEventListener("mouseenter", () => {
            if (this.helperBox !== undefined) {
                this.helperBox.textContent = hoverMsg;
            } else {
                console.log("WARN: helper box is undefined");
            }
        });
        element.addEventListener("mouseleave", () => {
            if (this.helperBox !== undefined) {
                this.helperBox.textContent = activeInfoHelp;
            }
        });

        let folder: Card[];
        switch(imgFolder) {
            case "aquisitions" : folder = this.aquisitions; break;
            case "wonders": folder = this.wonders; break;
            default: console.log("unhandled img folder");
        }

        element.addEventListener("click", () => {
            generateMenu(folder, imgFolder, clickMsg);
        });
    }

    #addActionEventListeners(element: HTMLElement, hoverMsg: string, clickEvent: ()=>void) {
        element.addEventListener("mouseenter", () => {
            if (this.helperBox !== undefined) {
                this.helperBox.textContent = hoverMsg;
            } else {
                console.log("WARN: helper box is undefined");
            }
        });
        element.addEventListener("mouseleave", () => {
            if (this.helperBox !== undefined) {
                this.helperBox.textContent = activeInfoHelp;
            }
        });

        element.addEventListener("click", clickEvent);
    }
}