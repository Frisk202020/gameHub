import { Item } from "./board/Item.js";
import { Aquisition } from "./card/Aquisition.js";
import { Card } from "./card/Card.js";
import { Wonder } from "./card/Wonder.js";
import { generateMenu, ImgFolder } from "./card/menu.js";
import { Position } from "./util/Position.js";
import { DiceEvent } from "./action/dice.js";
import { createHelperBox, removeFromBodyOrWarn } from "./util/functions.js";
import { MailEvent } from "./action/mail.js";
import { initChannel } from "./util/channel.js";
import { Case, caseSize } from "./board/Case.js";
import { board } from "./util/variables.js";

type Avatar = "hat";
type gameIcon = "coin" | "ribbon" | "star" | "wonder" | "chest";
type PlayerId = 1 | 2 | 3 | 4;

const playerBox: HTMLDivElement = document.getElementById("players") as HTMLDivElement;
const activeInfoHelp = "Cliquez pour replier.";
const inactiveInfoHelp = "Cliquez pour voir les ressources du joueur.";
let helperBox: HTMLDivElement | undefined = undefined;

const playerColor = {
    1: "#29b0ff",
    2: "#fa2714",
    3: "#4ac75e",
    4: "#ebdf3f"
}

const actionColor = {
    1: "#0063ae",
    2: "#c40202",
    3: "#04890d",
    4: "#b39803",
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
    pawn!: HTMLImageElement;
    boardId: 0 | 1 | 2;
    caseId: number;
    pendingCaseId: number;
    diceNumber: 1 | 2 | 3;
    coins: number;
    ribbons: number;
    stars: number;
    items: Array<Item>;
    aquisitions: Array<Aquisition>;
    wonders: Array<Wonder>;
    infoBox: HTMLDivElement;
    infoActive: boolean;

    constructor(id: PlayerId, name: string, avatar: Avatar) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.boardId = 0;
        this.caseId = 0;
        this.pendingCaseId = 0;
        this.diceNumber = 1;
        this.coins = 0;
        this.ribbons = 0;
        this.stars = 0;
        this.items = Array();
        this.aquisitions = Array();
        this.wonders = Array();
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
            helperBox = box;
        })
        player.addEventListener("mouseleave", () => {
            removeFromBodyOrWarn(helperBox);
        })
        player.addEventListener("click", () => {
            if (this.infoActive) {
                this.infoBox.classList.remove("visible");
            } else {
                this.infoBox.classList.add("visible");
            }

            if (this.infoActive) {
                this.infoBox.classList.remove("visible");
                if (helperBox !== undefined) {
                    helperBox.textContent = inactiveInfoHelp;
                    this.infoBox.style.pointerEvents = "none";
                }
            } else {
                if (helperBox !== undefined) {
                    helperBox.textContent = activeInfoHelp;
                    this.infoBox.style.pointerEvents = "auto";
                }
                this.infoBox.classList.add("visible");
            }
            this.infoActive = !this.infoActive;
        })

        const pawn = document.createElement("img");
        pawn.src = `get_file/celestopia/assets/icons/${this.avatar}.png`;
        pawn.id = `${this.id}.pawn`;
        pawn.style.width = `${caseSize/2}px`;
        pawn.style.height = `${caseSize/2}px`
        pawn.style.position = "absolute";
        
        const pos = computeOnBoardPosition(board.elements[this.caseId] as Case);
        pawn.style.left = `${pos.x}px`;
        pawn.style.bottom = `${pos.y}px`;
        this.pawn = pawn;
        
        pawn.style.zIndex = "3";
        document.body.appendChild(pawn);

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

    #addCardEventListeners(element: HTMLElement, imgFolder: ImgFolder, hoverMsg: string, clickMsg: string) {
        element.addEventListener("mouseenter", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = hoverMsg;
            } else {
                console.log("WARN: helper box is undefined");
            }
        });
        element.addEventListener("mouseleave", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = activeInfoHelp;
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

    #createActionBox() {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";
        box.appendChild(this.#createAction("dice.png", "Lancez le dé quand c'est votre tour.", () => { 
            const {tx, rx} = initChannel<number>();
            new DiceEvent(tx, this.diceNumber);
            rx.recv().then((n) => this.pendingCaseId = this.caseId + n); 
        }));
        box.appendChild(this.#createAction("mail.png", "Payez vos courriers en avance.",  () => {
            const {tx, rx} = initChannel<number>();
            new MailEvent(tx, playerColor[this.id]);
            rx.recv().then((n) => {
                this.coins -= n;
            })
        }));
        box.appendChild(this.#createAction("bag.png", "Utilisez un objet (avant de lancer le dé).",  () => {}));
        return box;
    }

    #createAction(imgSrc: string, hover: string, action: ()=>void) {
        const elm = document.createElement("img");
        elm.src = `get_file/celestopia/assets/icons/${imgSrc}`;
        elm.style.width = "25%";
        elm.style.margin = "2.5%";
        elm.style.borderRadius = "25%";
        elm.style.backgroundColor = actionColor[this.id];
        
        elm.addEventListener("mouseenter", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = hover;
            } else {
                console.log("WARN: helper box is undefined");
            }
        });
        elm.addEventListener("mouseleave", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = activeInfoHelp;
            }
        });

        elm.addEventListener("click", action);
        elm.onload = () => elm.style.border = `solid ${elm.offsetHeight * 0.05}px #ffd700`;
        return elm;
    }
}

export function computeOnBoardPosition(elm: Case) {
    return new Position(elm.uiPosition.x + caseSize/4, elm.uiPosition.y + caseSize/2);
}