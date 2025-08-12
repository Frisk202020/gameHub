import { Item } from "./item/Item.js";
import { Aquisition } from "./card/Aquisition.js";
import { Card, ImgFolder } from "./card/Card.js";
import { Wonder } from "./card/Wonder.js";
import { Position } from "./util/Position.js";
import { DiceEvent } from "./event/DiceEvent.js";
import { createHelperBox, removeFromArray, removeFromBodyOrWarn, translateAnimation } from "./util/functions.js";
import { MailEvent } from "./event/MailEvent.js";
import { initChannel, Sender } from "./util/channel.js";
import { Case, caseSize, caseType } from "./board/Case.js";
import { board, boardId, changeBoard, Money, pig } from "./util/variables.js";
import { Happening } from "./event/Happening.js";
import { Popup } from "./event/Popup.js";
import { Chest } from "./event/Chest.js";
import { Crown } from "./event/Crown.js";
import { PigEvent } from "./event/PigEvent.js";
import { Tuple } from "./util/tuple.js";
import { Magic } from "./event/Magic.js";
import { ItemMenu } from "./item/ItemMenu.js";
import { Intersection } from "./event/Intersection.js";
import { BoardId } from "./board/Board.js";
import { TeleporterEvent } from "./event/TeleporterEvent.js";
import { DuelEvent } from "./event/DuelEvent.js";

export type Avatar = "hat" | "strawberry" | "crown" | "dice" | "heart";
type gameIcon = "coin" | "ribbon" | "star" | "wonder" | "chest";
export type PlayerId = 1 | 2 | 3 | 4;

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
    #id: PlayerId;
    #name: string;
    #avatar: Avatar;
    #pawn!: HTMLImageElement;
    boardId: 0 | 1 | 2;
    caseId: number;
    pendingCaseId: number;
    teleport: boolean;
    diceNumber: 1 | 2 | 3;
    coins: number;
    ribbons: number;
    stars: number;
    #items: Array<Item<any>>;
    #aquisitions: Array<Aquisition>;
    #wonders: Array<Wonder>;
    #infoBox: HTMLDivElement;
    #infoActive: boolean;
    color: string;

    constructor(id: PlayerId, name: string, avatar: Avatar) {
        this.#id = id;
        this.color = playerColor[id];
        this.#name = name;
        this.#avatar = avatar;
        this.boardId = 0;
        this.caseId = 0;
        this.pendingCaseId = 0;
        this.teleport = false;
        this.diceNumber = 1;
        this.coins = 0;
        this.ribbons = 0;
        this.stars = 0;
        this.#items = Array();
        this.#aquisitions = Array();
        this.#wonders = Array();
        this.#infoBox = this.#createInfoBox();
        this.#infoActive = false;

        this.#createHtml();
    }

    get name() {
        return this.#name;
    } get id() {
        return this.#id;
    } get pawn() {
        return this.#pawn;
    } get aquisitionCount() {
        return this.#aquisitions.length;
    } get wonderCount() {
        return this.#wonders.length;
    }

    addAquisition(aq: Aquisition) {
        this.#aquisitions.push(aq);
    } 
    #removeAquisition(aq: Aquisition, boostedClone: Aquisition) {
        if (this.#aquisitions.length === 0) {
            console.log("ERROR: tried to remove aquisition, but player didn't have one");
            return;
        }
        const i = this.#aquisitions.indexOf(aq);
        if (i === -1) {
            console.log("ERROR: tried to remove aquisition but player did not have it");
            return;
        } else {
            this.#aquisitions.splice(i, 1);
        }

        Aquisition.returnToBank(aq);
        if (aq.name === "magic") {
            const {tx, rx} = initChannel<Money>();
            new Magic(tx);
            rx.recv().then((m) => {
                switch(m) {
                    case "coin": this.progressiveCoinChange(this.coins + boostedClone.coins); break;
                    case "ribbon": this.progressiveRibbonChange(this.ribbons + boostedClone.ribbons); break;
                    case "star": this.progressiveStarChange(this.stars + boostedClone.stars);
                }
            });
        } else {
            this.progressiveCoinChange(this.coins + boostedClone.coins);
            this.progressiveRibbonChange(this.ribbons + boostedClone.ribbons);
            this.progressiveStarChange(this.stars + boostedClone.stars);
        }
    }
    removeRandomAquisition() {
        return removeFromArray(this.#aquisitions, Math.floor(Math.random() * this.aquisitionCount));  
    }
    generateSellMenu() {
        const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition>>();
        Card.generateMenu(this.#aquisitions, "aquisitions", Aquisition.menuText, this.#sellInterface(tx));
        rx.recv().then((t) => this.#removeAquisition(t.first, t.second));
    }

    addWonder(w: Wonder) {
        this.#wonders.push(w);
    }

    async caseResponse(type: caseType) {
        if (type === "redCoin") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            pig.feed(chosen);
            const newValue = this.coins - chosen;

            this.progressiveCoinChange(newValue);
        } else if (type === "blueCoin") {
            const choices = [50, 100, 300, 600, 1000];
            const newValue = this.coins + choices[Math.floor(Math.random() * 5)];

            this.progressiveCoinChange(newValue);
        } else if (type === "redStar") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            const delta = Math.min(this.stars, chosen)
            pig.feed(delta * 2);
            const newValue = this.stars - delta;

            this.progressiveStarChange(newValue);
        } else if (type === "star") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];

            this.progressiveStarChange(this.stars + chosen);
        } else if (type === "greenEvent") {
            Happening.pickRandomEvent(this);
        } else if (type === "mail") {
            new Popup("Vous avez reçu 1 courrier !");
        } else if (type === "3Mail") {
            new Popup("Vous avez reçu 3 courriers !");
        } else if (type === "5Mail") {
            new Popup("Vous avez reçu 5 courriers !");
        } else if (type === "aquisition") {
            new Chest(this);
        } else if (type === "ladder") {
            this.pendingCaseId = (board.elements[this.caseId] as any).destination;
            this.teleport = true;
        } else if (type === "dice") {
            new Popup("Relancez les dés !");
            //TODO: re-enable dices when turn system is implemented
        } else if (type === "furnace") {
            new Popup("Brulez tous vos courriers. Vous n'avez rien à payer !");
        } else if (type === "wonder") {
            new Crown(this, (board.elements[this.caseId] as any).wonder);
        } else if (type === "duel") {
            new DuelEvent()
        } else if (type === "piggy") {
            new PigEvent(this);
        } else if (type === "postBox") {
            const {tx, rx} = initChannel<number>();
            new MailEvent(true, tx, this.color);
            rx.recv().then((n) => {
                this.progressiveCoinChange(this.coins - n);
            });
        } else if (type === "sale") {
            const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition>>();
            Card.generateMenu(this.#aquisitions, "aquisitions", Aquisition.menuText, this.#sellInterface(tx, "coin"));
            rx.recv().then((t) => {
                this.#removeAquisition(t.first, t.second);
            });
        } else if (type === "saleRibbon") {
            const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition>>();
            Card.generateMenu(this.#aquisitions, "aquisitions", Aquisition.menuText, this.#sellInterface(tx, "ribbon"));
            rx.recv().then((t) => {
                this.#removeAquisition(t.first, t.second);
            });
        } else if (type === "saleStar") {
            const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition>>();
            Card.generateMenu(this.#aquisitions, "aquisitions", Aquisition.menuText, this.#sellInterface(tx, "star"));
            rx.recv().then((t) => {
                this.#removeAquisition(t.first, t.second);
            });
        } else if (type === "item") {
            const i = await Item.getRandomItem(this);
            const {tx: innerTx, rx} = initChannel<void>();
            new Popup(`Vous obtenez un ${i.name}`, "Objet obtenu !", innerTx);
            await rx.recv();
            await this.addItem(i);
        } else if (type === "intersection") {
            const {tx, rx} = initChannel<void>();
            new Intersection(this, (board.elements[this.caseId] as any).intersection, tx);
            await rx.recv();
            if (this.pendingCaseId === this.caseId) {
                await this.caseResponse(board.elements[this.caseId].type);
            }
        } else if (type === "teleporter") {
            const {tx, rx} = initChannel<boolean>();
            const newBoardId = (boardId + 1) as BoardId;
            new TeleporterEvent(this, newBoardId, tx);
            
            const x = await rx.recv();
            if (x) {
                const delta = this.pendingCaseId - this.caseId;
                this.caseId = 0;
                this.pendingCaseId = 0;

                this.boardId = newBoardId;
                changeBoard(newBoardId);
                this.pendingCaseId = this.caseId + delta;
            }
        } else if (type === "end") {
            const {tx: tx1, rx: rx1} = initChannel<void>();
            new Popup("Vous êtes arrivé à la fin du plateau. Payez vos courriers, des intérêt sur votre découvert et recevez 2500 pièces !", "Fin du mois !", tx1);
            await rx1.recv();

            const {tx, rx} = initChannel<number>();
            new MailEvent(false, tx, this.color);
            const n = await rx.recv();

            let finalVal = 2500 + this.coins - n;
            console.log(finalVal);
            if (finalVal < 0) {
                finalVal += (finalVal * 0.25);
            }
            this.progressiveCoinChange(finalVal);

            this.caseId = 0;
            this.pendingCaseId = 0;
            this.boardId = 0;
            changeBoard(0);
        } else {
            console.log(`unhandled case type: ${type}`);
        }
    }

    hasItems() {
        return this.#items.length > 0;
    }

    async addItem<T=void>(item: Item<T>) {
        if (this.#items.length >= 5) {
            const {tx, rx} = initChannel<void>();
            new ItemMenu(this, {item, tx});

            await rx.recv();
            return;
        }

        this.#items.push(item);
    }

    replaceItem<T>(old: Item, newItem: Item<T>) {
        const i = this.#items.indexOf(old);
        if (i === -1) {
            console.log("ERROR: tried to replace item but older one is non-existant");
        } else {
            this.#items[i] = newItem;
        }
    }

    removeItem<T = void>(item: Item<T>) {
        const index = this.#items.indexOf(item);
        if (index === -1) {
            console.log("ERROR: tried to remove a item but the player didn't have it.");
            return;
        } else {
            this.#items.splice(index, 1);
        }
    }

    itemIterator(): IterableIterator<Item> {
        let index = 0;
        const data = this.#items;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next(): IteratorResult<Item> {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }

    async progressiveCoinChange(target: number) {
        if (!this.#infoActive) {
            this.#infoBox.classList.add("visible");
        }
        const dN = (target - this.coins) / 120;
        const current = this.coins;
        this.coins = target - this.coins;
        const elm = document.getElementById(`${this.#id}.coin`) as HTMLElement;
        if (this.coins < 0) {
            elm.style.color = "#b70808";
        } else {
            elm.style.color = "#009220";
        }

        await new Promise(r => setTimeout(r, 2000));
        this.coins = current;
        elm.style.color = "black";

        for (let i = 0; i < 120; i++) {
            this.coins += dN;
            await new Promise(r => setTimeout(r, 100/6));
        }

        this.coins = target;
        this.#infoBox.classList.remove("visible");
    }
    async progressiveRibbonChange(target: number) {
        if (!this.#infoActive) {
            this.#infoBox.classList.add("visible");
        }
        const dN = (target - this.ribbons) / 120;
        const current = this.ribbons;
        this.ribbons = target - this.ribbons;
        const elm = document.getElementById(`${this.#id}.ribbon`) as HTMLElement;
        if (this.ribbons < 0) {
            elm.style.color = "#b70808";
        } else {
            elm.style.color = "#009220";
        }

        await new Promise(r => setTimeout(r, 2000));
        this.ribbons = current;
        elm.style.color = "black";

        for (let i = 0; i < 120; i++) {
            this.ribbons += dN;
            await new Promise(r => setTimeout(r, 100/6));
        }

        this.ribbons = target;
        this.#infoBox.classList.remove("visible");
    }
    async progressiveStarChange(target: number) {
        if (!this.#infoActive) {
            this.#infoBox.classList.add("visible");
        }
        const dN = (target - this.stars) / 120;
        const current = this.stars;
        this.stars = target - this.stars;
        const elm = document.getElementById(`${this.#id}.star`) as HTMLElement;
        if (this.stars < 0) {
            elm.style.color = "#b70808";
        } else {
            elm.style.color = "#009220";
        }

        await new Promise(r => setTimeout(r, 2000));
        this.stars = current;
        elm.style.color = "black";

        for (let i = 0; i < 120; i++) {
            this.stars += dN;
            await new Promise(r => setTimeout(r, 100/6));
        }

        this.stars = target;
        this.#infoBox.classList.remove("visible");
    }

    // assumes caseId has been changed by the caller (to indicate the target)
    async movePawn() {
        return translateAnimation(
            this.#pawn,
            computePawnPosition(board.elements[this.caseId]),
            60,
            0.25,
            true,
            true
        )
    }

    #createHtml() {
        const player = document.createElement("div");
        player.classList.add("player");
        player.id = this.#name;
        player.appendChild(this.#createBanner());
        player.appendChild(this.#infoBox);
        player.style.display = "flex";
        player.style.flexDirection = "column";
        playerBox.appendChild(player);
        player.addEventListener("mouseenter", () => {
            const box = createHelperBox(
                this.#infoActive ? activeInfoHelp : inactiveInfoHelp, 
                new Position(player.getBoundingClientRect().right + 10, 0), 
            );
            box.style.position = "fixed";
            document.body.appendChild(box);
            helperBox = box;
        })
        player.addEventListener("mouseleave", () => {
            removeFromBodyOrWarn(helperBox);
        })
        player.addEventListener("click", () => {
            if (this.#infoActive) {
                this.#infoBox.classList.remove("visible");
            } else {
                this.#infoBox.classList.add("visible");
            }

            if (this.#infoActive) {
                this.#infoBox.classList.remove("visible");
                if (helperBox !== undefined) {
                    helperBox.textContent = inactiveInfoHelp;
                    this.#infoBox.style.pointerEvents = "none";
                }
            } else {
                if (helperBox !== undefined) {
                    helperBox.textContent = activeInfoHelp;
                    this.#infoBox.style.pointerEvents = "auto";
                }
                this.#infoBox.classList.add("visible");
            }
            this.#infoActive = !this.#infoActive;
        })

        const pawn = document.createElement("img");
        pawn.src = `get_file/celestopia/assets/icons/${this.#avatar}.png`;
        pawn.id = `${this.#id}.pawn`;
        pawn.style.width = `${caseSize/2}px`;
        pawn.style.height = `${caseSize/2}px`
        pawn.style.position = "absolute";
        
        const pos = computePawnPosition(board.elements[this.caseId] as Case);
        pawn.style.left = `${pos.x}px`;
        pawn.style.top = `${pos.y}px`;
        pawn.style.zIndex = "3";
        this.#pawn = pawn;
    }

    #createBanner() {
        const banner = document.createElement("div");
        banner.className = "pointerHover";
        const style = banner.style;
        style.display = "flex";
        style.flexDirection = "row";
        style.padding = "0.5vw";
        style.backgroundColor = this.color;
        style.width = "10vw";
        style.justifyContent = "space-between";
        style.borderRadius = "10px";
        style.pointerEvents = "auto";

        const name = document.createElement("div");
        name.textContent = this.#name;
        name.style.display = "grid";
        name.style.alignItems = "center";
        name.style.height = "5vh";
        name.style.marginRight = "5px";

        const icon = document.createElement("img");
        icon.src = `get_file/celestopia/assets/icons/${this.#avatar}.png`;
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
        infoStyle.background = `linear-gradient(to bottom, ${this.color}, ${infoColor[this.#id]})`;
        infoStyle.padding = "0.5vw";
        infoStyle.borderRadius = "10px";
        infoStyle.pointerEvents = "none";

        info.className = "reveal-vertical";
        info.appendChild(this.#createSubInfoBox("coin", this.coins, false));
        info.appendChild(this.#createSubInfoBox("ribbon", this.ribbons, false));
        info.appendChild(this.#createSubInfoBox("star", this.stars, false));

        const aq = this.#createSubInfoBox("chest", this.#aquisitions.length, true);
        this.#addCardEventListeners(
            aq, 
            "aquisitions",
            "Cliquez pour afficher votre collection d'aquisitions.", 
            "Utilisez les flèches du clavier pour naviguer entre vos aquisitions."
        );
        info.appendChild(aq);

        const w = this.#createSubInfoBox("wonder", this.#wonders.length, true);
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

    #createSubInfoBox(imgName: gameIcon, counterValue: number, pointerHover: boolean) {
        const box = document.createElement("div");
        if (pointerHover) { box.className = "pointerHover"; }
        box.style.display = "flex";
        box.style.justifyContent = "space-between";
        box.style.alignItems = "center";

        const img = document.createElement("img");
        img.src = `get_file/celestopia/assets/icons/${imgName}.png`;
        img.style.width  = "2vw";
        img.style.marginLeft = "0.5vw";

        const counter = document.createElement("p");
        counter.id = `${this.#id}.${imgName}`;
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
            case "aquisitions" : folder = this.#aquisitions; break;
            case "wonders": folder = this.#wonders; break;
            default: console.log("unhandled img folder");
        }

        element.addEventListener("click", () => {
            Card.generateMenu(folder, imgFolder, clickMsg);
        });
    }

    #createActionBox() {
        const box = document.createElement("div");
        box.className = "pointerHover";
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";
        box.appendChild(this.#createAction("diceAction.png", "Lancez le dé quand c'est votre tour.", () => { 
            const {tx, rx} = initChannel<number>();
            new DiceEvent(tx, this.diceNumber, false);
            rx.recv().then((n) => this.pendingCaseId = this.caseId + n); 
        }));
        box.appendChild(this.#createAction("mail.png", "Payez vos courriers en avance.",  () => {
            const {tx, rx} = initChannel<number>();
            new MailEvent(false, tx, this.color);
            rx.recv().then((n) => {
                this.progressiveCoinChange(this.coins - n);
            })
        }));
        box.appendChild(this.#createAction("bag.png", "Utilisez un objet (avant de lancer le dé).",  () => new ItemMenu(this)));
        return box;
    }

    #createAction(imgSrc: string, hover: string, action: ()=>void) {
        const elm = document.createElement("img");
        elm.src = `get_file/celestopia/assets/icons/${imgSrc}`;
        elm.style.width = "25%";
        elm.style.margin = "2.5%";
        elm.style.borderRadius = "25%";
        elm.style.backgroundColor = actionColor[this.#id];
        
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

    #sellInterface(tx: Sender<Tuple<Aquisition, Aquisition>>, type?: Money) {
        return { tx, type }
    }
}

function computePawnPosition(elm: Case) {
    return new Position(elm.uiPosition.x + caseSize/4, elm.uiPosition.y);
}