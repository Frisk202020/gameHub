import { BoardEvent } from "../event/BoardEvent.js";
import { Popup } from "../event/Popup.js";
import { initChannel, Sender } from "../util/channel.js";
import { assets_link, pxToVw, unwrap_or_default, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { Money } from "../util/variables.js";
import { Aquisition } from "./Aquisition.js";

export const cardWidth = 35 //vw
export const cardHeight = 20; //vw
const border = cardHeight/25; //vw
const oultine = cardHeight/35; //vw
const frames = 60; //FPS
const animationTime = 0.5; //seconds
const centerX = (100 - cardWidth) / 2;
const inactiveSquareColor = "#5e5c5c";

export abstract class Card {
    protected _name: string;
    #title: string;
    #html: HTMLDivElement | null;
    #neutralHtml: HTMLDivElement | null;
    imgSrc: string;
    color: {base: string, mid: string, end: string};
    
    constructor(name: string, title: string, imgFolder: string, baseColor: string, midColor: string, endColor: string, extention?: string) {
        this._name = name;
        this.#title = title;
        this.imgSrc = assets_link(`cards/${imgFolder}/${name}.${unwrap_or_default(extention, "png")}`);
        this.#html = null;
        this.#neutralHtml = null;
        this.color = {base: baseColor, mid: midColor, end: endColor};
    }

    get title() {
        return this.#title;
    }
    // lazy initialization because we have circular imports otherwhise 
    get html() {
        if (this.#html === null) {
            this.buildHtml(true);
        }
        return this.#html as HTMLDivElement;
    } get neutralHtml(): Readonly<HTMLDivElement> {
        if (this.#neutralHtml === null) {
            this.buildHtml(false);
        }
        return this.#neutralHtml as HTMLDivElement;
    }

    protected buildHtml(centered: boolean) {
        const elm = document.createElement("div");
        elm.style.width = `${cardWidth}vw`;
        elm.style.height = `${cardHeight}vw`;
        elm.style.display = "flex";
        elm.style.flexDirection = "column";
        elm.style.alignItems = "center";
        elm.style.justifyContent = "center";
        elm.style.border = `solid black ${border}vw`;
        elm.style.borderRadius = "20px";
        elm.style.outline = `solid ${oultine}vw white`;
        elm.style.background = `radial-gradient(${this.color.base} 30%, ${this.color.mid} 80%, ${this.color.end} 100%)`;

        let titleWidth = cardWidth/8;
        const title = Card.generateParagraph(this.title, titleWidth);
        title.style.margin = "0.5vw";
        title.style.textShadow = "2px 2px 2px #ffffff";
        title.style.whiteSpace = "nowrap";

        const obs = new ResizeObserver(()=>{
            if (title.scrollWidth === 0) {
                return; // wait for style to be computed before any operation
            } 
            while (title.scrollWidth > vwToPx(cardWidth)) {
                titleWidth *= 0.8;
                title.style.fontSize = `${titleWidth}vw`;
            }
            obs.disconnect();
        })
        obs.observe(title);
        elm.appendChild(title);

        const box = document.createElement("box");
        box.style.display = "flex";
        box.style.justifyContent = "space-evenly";
        box.style.alignItems = "center";
        box.style.height = "20vw";
        box.style.width = `${cardWidth}vw`;
        box.style.marginTop = "1vw";
        
        const img = document.createElement("img");
        img.src = this.imgSrc;
        img.style.height = `${cardHeight/2}vw`;
        img.style.width = `${cardHeight/2}vw`;
        img.style.borderRadius = "20px";
        img.style.maskImage = "radial-gradient(rgba(0, 0, 0, 1) 50%, transparent 100%)";
        box.appendChild(img);

        const values = this.dataLayout();
        box.appendChild(values);
        elm.appendChild(box);

        if (centered) {
            elm.style.position = "absolute";
            this.#html = elm;
        } else {
            this.#neutralHtml = elm;
        }
    }
    protected static generateValueBoxes(
        coinValue: number,
        ribbonValue: number,
        starValue: number,
        highlight?: Money
    ) {
        const args: Array<{m: Money, n: number, h: boolean}> = [
            {m: "coin", n: coinValue, h: highlight === "coin"}, 
            {m: "ribbon", n: ribbonValue, h: highlight === "ribbon"},
            {m: "star", n: starValue, h: highlight === "star"}
        ];
        return args.map((x)=>this.generateValueBox(x.m, x.n, x.h));
    }

    protected static generateValueBox(money: Money, value: number, highlight: boolean) {
        const box = document.createElement("div");
        box.className = "row-box";
        box.style.margin = "0.1vw";
        
        const img = document.createElement("img");
        img.src = assets_link(`icons/${money}.png`);
        img.style.height = `${cardHeight/10}vw`;
        img.style.marginRight = "1vw";
        box.appendChild(img);
        const p = this.generateParagraph(value.toString(), cardHeight/12);
        if (highlight) {
            p.className = "hue";
            p.style.color = "#ffd700";
        }
        box.appendChild(p);

        return box;
    }
    protected static generateParagraph(text: string, height?: number) {
        const p = document.createElement("p");
        p.textContent = text;
        p.className = "centered-p";
        p.style.fontSize = `${unwrap_or_default(height, cardHeight/10)}vw`;
        p.style.margin = "0.5vw";

        return p;
    }
    protected abstract dataLayout(): HTMLDivElement; // set specific card layout

    static generateMenu(cards: Card[], sellConfig?: SellConfig) {
        if (cards.length === 0) {
            if (sellConfig !== undefined) {
                const {tx, rx} = initChannel<void>();
                new Popup("Vous n'avez aucune carte...", undefined, tx);
                rx.recv().then(()=>sellConfig.tx.send(undefined))
            } else {
                new Popup("Vous n'avez aucune carte...")
            }
            return;
        } else {
            new CardMenu(cards, cards[0].color.base, sellConfig);
        }
    }
}

const enum MenuOkSetup {
    Unappended,
    Appended,
    Sell,
}

class CardMenu extends BoardEvent {
    #cards: Card[];
    #imgBox!: HTMLDivElement;
    #navSquares!: HTMLDivElement[];
    #navColor!: string;
    #current: number;
    #sellChannel?: Sender<Aquisition | undefined>;

    constructor(cards: Card[], navBarColor: string, config?: SellConfig) { 
        const setup = CardMenu.#setup(cards, navBarColor, config);
        const okSetup = (()=> {
            switch (setup.okSetup) {
                case MenuOkSetup.Appended: return BoardEvent.okSetup(true);
                case MenuOkSetup.Unappended: return BoardEvent.unappendedOkSetup();
                case MenuOkSetup.Sell: return BoardEvent.okSetup(true, "Vendre", ()=>this.#sellEvent());
            }
        })();
        super(setup.elements, okSetup, setup.denySetup ? BoardEvent.denySetup(true, "Retour") : BoardEvent.denySetup(false));
        this.menu.style.overflowY = "scroll";

        this.#current = 0;
        if (cards.length > 0) {
            if (cards.length !== 1) { new Listener(this.menu, this); }// menu as seperate arg bc it's protected
            this.#imgBox = setup.elements[0]!;
            this.#navSquares = setup.navSquares!;
            this.#navColor = navBarColor;
        }
        this.#cards = setup.cards;
        this.#sellChannel = setup.sellChannel;
    }

    static #setup(cards: Card[], navBarColor: string, config?: SellConfig): {
        cards: Card[];
        elements: HTMLDivElement[],
        navSquares?: HTMLDivElement[],
        okSetup: MenuOkSetup,
        denySetup : boolean,
        sellChannel?: Sender<Aquisition | undefined>
    } {
        if (cards.length === 0) {
            return {
                cards,
                elements: [BoardEvent.generateTextBox("Vous n'avez aucune carte")],
                okSetup: MenuOkSetup.Appended,
                denySetup: false
            }
        }

        const imgBox = document.createElement("div");
        imgBox.style.width = "100vw";
        imgBox.style.height = `${cardHeight + border + oultine + cardHeight / 10}vw`;
        imgBox.style.marginTop = `${cardHeight / 10}vw`;

        const {boostedCards, okSetup, sellChannel} = config === undefined ? {boostedCards: cards, okSetup: MenuOkSetup.Unappended, sellChannel: undefined} : (()=>{
            if (config.type === undefined) { return {boostedCards: cards, okSetup: MenuOkSetup.Sell, sellChannel: config.tx }; }
            else {
                if (cards[0] instanceof Aquisition) {
                    return {
                        boostedCards: cards.map((x)=>(x as Aquisition).getBoostedClone(config.type!)), 
                        okSetup: MenuOkSetup.Sell,
                        sellChannel: config.tx
                    };
                } else {
                    console.log("ERROR: Called sell config on acard that is not an Aquisition");
                    return {boostedCards: cards, okSetup: MenuOkSetup.Unappended, sellChannel: undefined};
                }
            }
        })();

        // append to center
        // not its how method since it's only supposed to happen at menu's build
        const card = boostedCards[0].html;
        card.style.left = `${centerX}vw`;
        imgBox.appendChild(card);

        const {navBar, navSquares} = createNavBar(cards.length, navBarColor);

        const elements = 
            cards.length === 1 
            ? [imgBox, navBar] 
            : [imgBox, BoardEvent.generateTextBox("Utilisez les flèches du clavier pour naviguer entre vos aquisitions"), navBar];

        return {
            cards: boostedCards,
            elements,
            navSquares,
            okSetup,
            denySetup: true,
            sellChannel
        }
    }

    #sellEvent() {
        if (this.#sellChannel === undefined) {
            console.log("ERROR: tried to send a sell message but menu's channel is undefined");
        } else {
            this.#sellChannel.send(this.#cards[this.#current] as Aquisition); // already checked at ok button init if cards are actually aquisitions
        }
    }

    #appendToRight(card: HTMLDivElement) {
        card.style.left = "100vw";
        this.#imgBox.appendChild(card);
    }    

    #appendToLeft(card: HTMLDivElement) {
        card.style.left = `${-cardWidth}vw`;
        this.#imgBox.appendChild(card);
    }

    async #moveCards(nextIndex: number, oldCardTargetX: number, appendRight: boolean) {
        const promises = [];

        const oldCard = this.#cards[this.#current].html;
        promises.push(translate(oldCard, oldCardTargetX).then(()=>this.#imgBox.removeChild(oldCard)));
        this.#navSquares[this.#current].style.backgroundColor = "#5e5c5c";

        this.#current = nextIndex;
        const card = this.#cards[this.#current].html;
        if (appendRight) { this.#appendToRight(card); } else { this.#appendToLeft(card); }
        promises.push(translate(card, centerX));
        this.#navSquares[this.#current].style.backgroundColor = this.#navColor;

        await Promise.all(promises);
    }

    async nextCard() {
        await this.#moveCards((this.#current + 1) % this.#cards.length, -cardWidth, true);
    }

    async previousCard() {
        let i = this.#current - 1;
        if (i < 0) { i = this.#cards.length - 1; };
        await this.#moveCards(i, 100, false);
    }
}

class Listener extends KeyboardListener {
    #caller: CardMenu;

    constructor(menu: HTMLDivElement, caller: CardMenu) {
        super(menu);
        this.#caller = caller;
    }

    eventHandler(event: KeyboardEvent): void {
        if (!this.enabled) { return; }
        
        this.enabled = false;
        if (event.key === "ArrowRight") {
            this.#caller.nextCard().then(()=>this.enabled = true);
        } else if (event.key === "ArrowLeft") {
            this.#caller.previousCard().then(()=>this.enabled = true);
        } else {
            this.enabled = true;
        }
    }
}

function createNavBar(length: number, color: string) {
    const navBar = document.createElement("div");
    navBar.id = "navBar";

    navBar.style.display = "flex";
    navBar.style.justifyContent = "center";
    const navSquares: HTMLDivElement[] = Array();

    for (let i = 0; i < length; i++) {
        const sq = document.createElement("div");
        sq.style.width = "20px";
        sq.style.height = "20px";
        sq.style.margin = "10px";
        sq.style.borderRadius = "5px";
        sq.style.backgroundColor = inactiveSquareColor;
        navSquares.push(sq);
        navBar.appendChild(sq);
    }

    navSquares[0].style.backgroundColor = color;
    return {navBar, navSquares};
}

interface SellConfig {
    tx: Sender<Aquisition | undefined>,
    type?: Money
}

// uses animationTime & frames consts
async function translate(elm: HTMLElement, targetX: number) {
    const it = animationTime * frames;
    const dt = 1000 / frames;
    let current = pxToVw(elm.getBoundingClientRect().left);
    const dx = (targetX - current)/it;

    for (let i = 0; i < it; i++) {
        current += dx;
        elm.style.left = `${current}vw`;
        await new Promise(r => setTimeout(r, dt));
    }

    elm.style.left = `${targetX}vw`;
}