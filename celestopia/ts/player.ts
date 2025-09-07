import { Item, type ItemName } from "./item/Item.js";
import { Aquisition, type AquisitionName } from "./card/Aquisition.js";
import { Card } from "./card/Card.js";
import { Wonder, type WonderName } from "./card/Wonder.js";
import { Position } from "./util/Position.js";
import { DiceEvent } from "./event/DiceEvent.js";
import { assets_link, createHelperBox, removeFromArray, removeFromBodyOrWarn } from "./util/functions.js";
import { initChannel, Sender } from "./util/channel.js";
import { caseSize, type CaseType } from "./board/Case.js";
import { board, boardId, changeBoard, type Money, pig } from "./util/variables.js";
import { Happening } from "./event/Happening.js";
import { Popup } from "./event/Popup.js";
import { Chest } from "./event/Chest.js";
import { Crown } from "./event/Crown.js";
import { PigEvent } from "./event/PigEvent.js";
import { Tuple } from "./util/tuple.js";
import { Magic } from "./event/Magic.js";
import { ItemMenu } from "./item/ItemMenu.js";
import { Intersection } from "./event/Intersection.js";
import { TeleporterEvent } from "./event/TeleporterEvent.js";
import { DuelEvent } from "./event/DuelEvent.js";
import { Convert } from "./event/Convert.js";
import { Seller } from "./item/Seller.js";
import type { BoardId } from "./board/Board.js";

export type Avatar = "hat" | "strawberry" | "crown" | "dice" | "heart";
type gameIcon = "coin" | "ribbon" | "star" | "wonder" | "chest";
export type PlayerId = 1 | 2 | 3 | 4;

const playerBox: HTMLDivElement = document.getElementById("players") as HTMLDivElement;
const activeInfoHelp = "Cliquez pour replier.";
const inactiveInfoHelp = "Cliquez pour voir les ressources du joueur.";
let helperBox: HTMLDivElement | undefined = undefined;

const startingCoins = 3000;

interface ColorPalette {
    name: PlayerColor,
    base: string,
    action: string,
    info: string,
}

export type PlayerColor = "red" | "orange" | "yellow" | "green" | "cyan" | "blue" | "purple" | "pink";

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
    #coins: number;
    uiCoins: number;
    #ribbons: number;
    uiRibbons: number;
    #stars: number;
    uiStars: number;
    #items: Array<Item<any>>;
    #aquisitions: Array<Aquisition>;
    #wonders: Array<Wonder>;
    #infoBox: HTMLDivElement;
    #infoActive: boolean;
    color: ColorPalette;
    #diceActionEnabled: boolean;
    #itemActionEnabled: boolean;
    static readonly #palette: Map<PlayerColor, ColorPalette> = new Map([
        ["red",    { name: "red", base: "#fa2714", action: "#c40202", info: "#fa271448" }],
        ["orange", { name: "orange", base: "#fa9214", action: "#c46c02", info: "#fa921448" }],
        ["yellow", { name: "yellow", base: "#ebdf3f", action: "#c4b902", info: "#ebdf3f48" }],
        ["green",  { name: "green", base: "#4ac75e", action: "#029c20", info: "#4ac75e48" }],
        ["blue",   { name: "blue", base: "#4a4aff", action: "#0202c4", info: "#4a4aff48" }],
        ["cyan",   { name: "cyan", base: "#45f6ed", action: "#02c4b9", info: "#45f6ed48" }],
        ["purple", { name: "purple", base: "#f645f0", action: "#c402c0", info: "#f645f048" }],
        ["pink",   { name: "pink", base: "#f64583", action: "#c4023c", info: "#f6458348" }],
    ]);

    constructor(id: PlayerId, name: string, avatar: Avatar, color: PlayerColor) {
        this.#id = id;
        this.color = Player.palette(color);
        this.#name = name;
        this.#avatar = avatar;
        this.boardId = 0;
        this.caseId = 0;
        this.pendingCaseId = 0;
        this.teleport = false;
        this.diceNumber = 1;
        this.#coins = startingCoins;
        this.uiCoins = this.#coins;
        this.#ribbons = 0;
        this.uiRibbons = this.#ribbons;
        this.#stars = 0;
        this.uiStars = this.#stars;
        this.#items = Array();
        this.#aquisitions = Array();
        this.#wonders = Array();
        this.#infoBox = this.#createInfoBox();
        this.#infoActive = false;
        this.#diceActionEnabled = false;
        this.#itemActionEnabled = false;

        this.#createHtml();
    }

    private moneyMap = {
        coin: {
            get: ()=>this.#coins,
            set: (v: number)=>this.#coins=v,
            getUi: ()=>this.uiCoins,
            setUi: (v: number)=>this.uiCoins=v,
            html: "coin",
        },
        ribbon: {
            get: ()=>this.#ribbons,
            set: (v: number)=>this.#ribbons=v,
            getUi: ()=>this.uiRibbons,
            setUi: (v: number)=>this.uiRibbons=v,
            html: "ribbon",
        },
        star: {
            get: ()=>this.#stars,
            set: (v: number)=>this.#stars=v,
            getUi: ()=>this.uiStars,
            setUi: (v: number)=>this.uiStars=v,
            html: "star",
        }
    } as const;

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
    } get coins(): number {
        return this.#coins;
    } get ribbons(): number {
        return this.#ribbons;
    } get stars(): number {
        return this.#stars;
    } get avatar() {
        return this.#avatar;
    } get enabled() {
        return this.#diceActionEnabled;
    } static palette(color: PlayerColor): Readonly<ColorPalette> {
        const v = this.#palette.get(color);
        if (v === undefined) {
            console.log(`ERROR: unhandled color - ${color}`);
            return this.#palette.get("red") as ColorPalette;
        } else {
            return v;
        }
    } static colors(): PlayerColor[] {
        return [...this.#palette.keys()]
    }

    addAquisition(aq: Aquisition) {
        this.#aquisitions.push(aq);
    } 
    listAquisitions(): AquisitionName[] {
        return this.#aquisitions.map((aq) => aq.name);
    }
    async #removeAquisition(aq: Aquisition, boostedClone: Aquisition) {
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
            const m = await rx.recv()
            switch(m) {
                case "coin": await this.progressiveCoinChange(boostedClone.coins); break;
                case "ribbon": await this.progressiveRibbonChange(boostedClone.ribbons); break;
                case "star": await this.progressiveStarChange(boostedClone.stars);
            }
        } else {
            await Promise.all([
                this.progressiveCoinChange(boostedClone.coins),
                this.progressiveRibbonChange(boostedClone.ribbons),
                this.progressiveStarChange(boostedClone.stars)
            ]);
        }
    }
    removeRandomAquisition() {
        return removeFromArray(this.#aquisitions, Math.floor(Math.random() * this.aquisitionCount));  
    }
    generateSellMenu() {
        const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition> | undefined>();
        Card.generateMenu(this.#aquisitions, this.#sellInterface(tx));
        rx.recv().then((t) => {
            if (t !== undefined) { this.#removeAquisition(t.first, t.second) } 
            else { this.addItem(new Seller(this))}
        });
    }

    addWonder(w: Wonder) {
        this.#wonders.push(w);
    }
    listWonders() {
        return this.#wonders.map((w)=>w.name);
    }

    async caseResponse(type: CaseType) {
        const {tx, rx} = initChannel<void>();
        if (type === "redCoin") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            pig.feed(chosen);

            await this.progressiveCoinChange(-chosen);
        } else if (type === "blueCoin") {
            const choices = [50, 100, 300, 600, 1000];
            const chosen = choices[Math.floor(Math.random() * 5)];

            await this.progressiveCoinChange(chosen);
        } else if (type === "redStar") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            const delta = Math.min(this.#stars, chosen)
            pig.feed(delta * 2);

            await this.progressiveStarChange(delta);
        } else if (type === "blueStar") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];

            await this.progressiveStarChange(chosen);
        } else if (type === "redRibbon") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            const delta = Math.min(this.#ribbons, chosen)
            pig.feed(delta * 2);

            await this.progressiveRibbonChange(delta);
        } else if (type === "blueRibbon") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];

            await this.progressiveRibbonChange(chosen);
        } else if (type === "event") {
            Happening.pickRandomEvent(this, tx);
            await rx.recv();
        } else if (type === "aquisition") {
            new Chest(this, tx);
            await rx.recv();
        } else if (type === "ladder") {
            this.pendingCaseId = (board.elements[this.caseId] as any).destination;
            this.teleport = true;
        } else if (type === "dice") {
            new Popup("Relancez les dés !");
        } else if (type === "wonder") {
            new Crown(this, (board.elements[this.caseId] as any).wonder, tx);
            await rx.recv();
        } else if (type === "duel") {
            new DuelEvent(tx);
            await rx.recv();
        } else if (type === "piggy") {
            new PigEvent(this, tx);
            await rx.recv();
        } else if (type === "sale") {
            const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition> | undefined>();
            Card.generateMenu(this.#aquisitions, this.#sellInterface(tx, "coin"));
            const t = await rx.recv()
            if (t !== undefined) { await this.#removeAquisition(t.first, t.second); }
        } else if (type === "saleRibbon") {
            const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition> | undefined>();
            Card.generateMenu(this.#aquisitions, this.#sellInterface(tx, "ribbon"));
            const t = await rx.recv()
            if (t !== undefined) { await this.#removeAquisition(t.first, t.second); }
        } else if (type === "saleStar") {
            const {tx, rx} = initChannel<Tuple<Aquisition, Aquisition> | undefined>();
            Card.generateMenu(this.#aquisitions, this.#sellInterface(tx, "star"));
            const t = await rx.recv()
            if (t !== undefined) { await this.#removeAquisition(t.first, t.second); }
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
            this.progressiveCoinChange(1500);
            new TeleporterEvent(this, tx);
            
            const x = await rx.recv();
            if (x) {
                this.pendingCaseId = this.pendingCaseId - this.caseId;
                this.caseId = 0; // If we land on telporter and change board, we SPAWN on case 0
                changeBoard(this.boardId);
                switch(this.boardId) {
                    case 0: break;
                    case 1:
                        const {tx, rx} = initChannel<number>();
                        new Convert(tx, "ribbon");
                        const x = await rx.recv();
                        this.progressiveCoinChange(-x);
                        this.progressiveRibbonChange(Math.floor(x / 3));
                        break;
                    case 2: 
                        const {tx: tx2, rx: rx2} = initChannel<number>();
                        new Convert(tx2, "star");
                        const x2 = await rx2.recv();
                        this.progressiveCoinChange(-x2);
                        this.progressiveStarChange(Math.floor(x2 / 3));
                }
            } else {
                if (this.pendingCaseId === this.caseId) {
                    this.pendingCaseId = 0; // If we land on teleporter and stay on board, we go TOWARDS case 0
                }
            }
        } else if (type === "end") {
            const {tx: tx1, rx: rx1} = initChannel<void>();
            new Popup("Vous êtes arrivé à la fin du plateau. Payez vos courriers, des intérêt sur votre découvert et recevez 5000 pièces !", "Fin du mois !", tx1);
            await rx1.recv();

            let finalVal = 5000 + this.#coins;
            if (finalVal < 0) {
                finalVal += (finalVal * 0.25);
            }
            await this.progressiveCoinChange(finalVal - this.#coins);

            this.caseId = 0;
            this.pendingCaseId = 0;
            this.boardId = 0;
            this.diceNumber = 1;
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
    stringifyItems() {
        return this.#items.map((i)=>(i as any).constructor.name as ItemName);
    }

    async #progressiveChange(
        kind: keyof typeof this.moneyMap,
        delta: number
    ) {
        const c = this.moneyMap[kind];
        if (!this.#infoActive) {
        this.#infoBox.classList.add("visible");
        }
        c.set(c.get() + delta);

        const dN = delta / 120;
        const current = c.getUi();

        c.setUi(delta);

        const elm = document.getElementById(`${this.#id}.${c.html}`) as HTMLElement;
        if (c.getUi() < 0) {
        elm.style.color = "#b70808";
        } else {
        elm.style.color = "#009220";
        }

        await new Promise(r => setTimeout(r, 2000));
        c.setUi(current);
        elm.style.color = "black";

        for (let i = 0; i < 120; i++) {
        c.setUi(c.getUi() + dN);
        await new Promise(r => setTimeout(r, 100 / 6));
        }

        c.setUi(c.get());
        this.#infoBox.classList.remove("visible");
    }

    async progressiveCoinChange(delta: number) {
        return this.#progressiveChange("coin", delta);
    }
    async progressiveRibbonChange(delta: number) {
        return this.#progressiveChange("ribbon", delta);
    }
    async progressiveStarChange(delta: number) {
        return this.#progressiveChange("star", delta);
    }

    // assumes caseId has been changed by the caller (to indicate the target)
    async movePawn() {
        const frames = 60;
        const it = 0.25 * frames;
        const dt = 1000 / frames;

        const pawnPos = Position.new(this.#pawn.getBoundingClientRect());
        const current = pawnPos.translate(window.scrollX, window.scrollY) // correct pos with scroll values
        const target = board.elements[this.caseId].uiPosition.translate(caseSize / 4, 0);
        const dP = target.difference(current).divide(it);

        for (let i = 0; i < it; i++) {
            current.translateMut(dP);
            this.#pawn.style.left = `${current.x}px`;
            this.#pawn.style.top = `${current.y}px`;
            window.scrollTo({
                left: current.x - (window.innerWidth / 2) + (this.#pawn.offsetWidth / 2), // keep centered
                top: current.y - (window.innerHeight / 2) + (this.#pawn.offsetHeight / 2),
                behavior: 'instant' // no built-in scroll animation
            });
            await new Promise(r => setTimeout(r, dt));
        }

        this.#pawn.style.left = `${target.x}px`;
        this.#pawn.style.top = `${target.y}px`;
    }

    enable() {
        for (const id of ["diceAction", "itemAction"]) {
            const elm = document.getElementById(`${this.#id}.${id}`)  as HTMLElement;
            elm.style.backgroundColor = this.color.action;
        }

        this.#diceActionEnabled = true;
        this.#itemActionEnabled = true;
    }

    disable() {
        for (const id of ["diceAction", "itemAction"]) {
            const elm = document.getElementById(`${this.#id}.${id}`)  as HTMLElement;
            elm.style.backgroundColor = "#bebdbd";
        }

        this.#diceActionEnabled = false;
        this.#itemActionEnabled = false;
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
        pawn.src = assets_link(`icons/${this.#avatar}.png`);
        pawn.id = `${this.#id}.pawn`;
        pawn.style.width = `${caseSize/2}px`;
        pawn.style.height = `${caseSize/2}px`
        pawn.style.position = "absolute";
        
        const currentCase = board.elements[this.caseId];
        pawn.style.left = `${currentCase.uiPosition.x + caseSize/4}px`;
        pawn.style.top = `${currentCase.uiPosition.y}px`;
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
        style.backgroundColor = this.color.base;
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
        icon.src = assets_link(`icons/${this.#avatar}.png`);
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
        infoStyle.background = `linear-gradient(to bottom, ${this.color.base}, ${this.color.info})`;
        infoStyle.padding = "0.5vw";
        infoStyle.borderRadius = "10px";
        infoStyle.pointerEvents = "none";

        info.className = "reveal-vertical";
        info.appendChild(this.#createSubInfoBox("coin", this.#coins, false));
        info.appendChild(this.#createSubInfoBox("ribbon", this.#ribbons, false));
        info.appendChild(this.#createSubInfoBox("star", this.#stars, false));

        const aq = this.#createSubInfoBox("chest", this.#aquisitions.length, true);
        aq.addEventListener("mouseenter", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = "Cliquez pour afficher votre collection d'aquisitions.";
            } else {
                console.log("WARN: helper box is undefined");
            }
        });
        aq.addEventListener("mouseleave", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = activeInfoHelp;
            }
        });
        aq.addEventListener("click", () => {
            Card.generateMenu(this.#aquisitions);
        });
        info.appendChild(aq);

        const w = this.#createSubInfoBox("wonder", this.#wonders.length, true);
        w.addEventListener("mouseenter", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = "Cliquez pour afficher votre collection de merveilles.";
            } else {
                console.log("WARN: helper box is undefined");
            }
        });
        w.addEventListener("mouseleave", () => {
            if (helperBox !== undefined) {
                helperBox.textContent = activeInfoHelp;
            }
        });
        w.addEventListener("click", () => {
            Card.generateMenu(this.#wonders);
        });
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
        img.src = assets_link(`icons/${imgName}.png`);
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

    #createActionBox() {
        const box = document.createElement("div");
        box.className = "pointerHover";
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";
        box.appendChild(this.#createAction(`${this.#id}.diceAction`, "diceAction.png", "Lancez le dé quand c'est votre tour.", () => {
            if (!this.#diceActionEnabled) { return; }

            const {tx, rx} = initChannel<number>();
            new DiceEvent(tx, this.diceNumber, false);
            rx.recv().then((n) => {
                this.pendingCaseId = this.caseId + n;
            }); 
        }))
        box.appendChild(this.#createAction(`${this.#id}.itemAction`, "bag.png", "Utilisez un objet (avant de lancer le dé).",  () => {
            if (!this.#itemActionEnabled) { return; }

            new ItemMenu(this);
        }));
        return box;
    }

    #createAction(id: string, imgSrc: string, hover: string, action: ()=>void) {
        const elm = document.createElement("img");
        elm.id = id;
        elm.src = assets_link(`icons/${imgSrc}`);
        elm.style.width = "25%";
        elm.style.margin = "2.5%";
        elm.style.borderRadius = "25%";
        elm.style.backgroundColor = "#bebdbd"
        
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

    #sellInterface(tx: Sender<Tuple<Aquisition, Aquisition> | undefined>, type?: Money) {
        return { tx, type }
    }

    loadData(data: PlayerData, enabled: boolean) {
        this.#coins = data.coins;
        this.uiCoins = data.coins;
        this.#ribbons = data.ribbons;
        this.uiRibbons = data.ribbons;
        this.#stars = data.stars;
        this.uiStars = data.stars;
        this.#aquisitions = data.aquisitions.map((aq) => Aquisition.getByName(aq)).filter((aq) => aq !== undefined);
        this.#wonders = data.wonders.map((w) => Wonder.getWonder(w, true)).filter((w) => w !== undefined);
        Promise.all(data.items.map((i) => Item.getByName(i, this))).then((items) => this.#items = items);
        this.pendingCaseId = data.caseId;
        this.teleport = true;
        (this as any).ignoreTurnSystem = true;
        this.boardId = data.boardId;
        this.diceNumber = data.diceNumber;
        if (boardId !== this.boardId) {
            this.#pawn.style.opacity = "0";
        }

        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    }
}

export interface PlayerData {
    name: string,
    icon: Avatar,
    color: PlayerColor,
    coins: number,
    ribbons: number,
    stars: number,
    aquisitions: AquisitionName[],
    wonders: WonderName[],
    items: ItemName[],
    caseId: number,
    boardId: BoardId,
    diceNumber: 1 | 2 | 3,
}