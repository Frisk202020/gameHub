import { BoardEvent, DenySetup, OkSetup } from "../event/BoardEvent.js";
import { Popup } from "../event/Popup.js";
import { initChannel, Sender } from "../util/channel.js";
import { assets_link, translateAnimation, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { Tuple } from "../util/tuple.js";
import { Money } from "../util/variables.js";
import { Aquisition } from "./Aquisition.js";

const cardWidth = 50 //vw
const cardHeight = 40; //vh
const translationDX = vwToPx((100-cardWidth)/2);

export abstract class Card {
    protected _name: string;
    #html: HTMLDivElement | null;
    imgSrc: string;
    
    constructor(name: string, imgFolder: string) {
        this._name = name;
        this.imgSrc = assets_link(`cards/${imgFolder}/${name}.png`);
        this.#html = null;
    }

    // lazy initialization because we have circular imports otherwhise
    get html() {
        if (this.#html === null) {
            this.buildHtml();
            console.log(this.#html);
        }
        return this.#html as HTMLDivElement;
    }

    protected buildHtml() {
        const elm = document.createElement("div");
        elm.style.width = `${cardWidth}vw`;
        elm.style.height = `${cardHeight}vh`;
        elm.style.display = "flex";
        elm.style.flexDirection = "column";
        elm.style.alignItems = "center";
        elm.style.justifyContent = "center";
        elm.style.border = "solid black 10px";
        elm.style.borderRadius = "20px";
        elm.style.position = "absolute";
        elm.style.backgroundColor = this.cardColor();

        const title = Card.generateParagraph(this._name);
        title.style.fontSize = "5vh";
        title.style.margin = "1vh";
        title.style.marginBottom = "1vh";

        elm.appendChild(title);
        const box = document.createElement("box");
        box.style.display = "flex";
        box.style.justifyContent = "space-between";
        box.style.alignItems = "center";
        box.style.height = "20vh";
        box.style.width = `${cardWidth}vw`;
        box.style.marginTop = "1vh";
        
        const img = document.createElement("img");
        img.src = this.imgSrc;
        img.style.height = "15vh";
        img.style.width = "15vh";
        img.style.marginLeft = "5vw"; 
        img.style.borderRadius = "20px";
        box.appendChild(img);

        const values = this.dataLayout();
        values.style.marginRight = "5vw";
        box.appendChild(values);
        elm.appendChild(box);

        this.#html = elm;
    }
    protected static generateValueBoxes(
        coinValue: number,
        ribbonValue: number,
        starValue: number
    ) {
        const args: Array<{m: Money, n: number}> = [
            {m: "coin", n: coinValue}, 
            {m: "ribbon", n: ribbonValue},
            {m: "star", n: starValue}
        ];
        return args.map((x)=>this.generateValueBox(x.m, x.n))
    }

    protected static generateValueBox(money: Money, value: number) {
        const box = document.createElement("div");
        box.className = "row-box";
        box.style.margin = "0.5vh";
        
        const img = document.createElement("img");
        img.src = assets_link(`icons/${money}.png`);
        img.style.height = "3vh";
        box.appendChild(img);
        box.appendChild(this.generateParagraph(value.toString()));

        return box;
    }
    protected static generateParagraph(text: string) {
        const p = document.createElement("p");
        p.textContent = text;
        p.className = "centered-p";
        p.style.fontSize = "3vh";
        p.style.margin = "0.5vh";

        return p;
    }
    protected abstract dataLayout(): HTMLDivElement; // set specific card layout
    abstract cardColor(): string;

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
            new CardMenu(cards, cards[0].cardColor());
        }
    }
}

class CardMenu extends BoardEvent {
    #cards: HTMLDivElement[];
    #imgBox!: HTMLDivElement;
    current: number;

    constructor(cards: Card[], navBarColor: string) {
        const setup = CardMenu.#setup(cards, navBarColor);
        super(setup.elements, setup.okSetup, setup.denySetup);

        this.#cards = cards.map((x)=>x.html);
        this.current = 0;
        if (cards.length > 0) {
            new Listener(this.menu, this); // menu as seperate arg bc it's protected
            this.#imgBox = setup.elements[0] as HTMLDivElement;
        }
    }

    static #setup(cards: Card[], navBarColor: string): {
        elements: HTMLElement[],
        okSetup: OkSetup,
        denySetup : DenySetup,
    } {
        if (cards.length === 0) {
            return {
                elements: [BoardEvent.generateTextBox("Vous n'avez aucune carte")],
                okSetup: BoardEvent.okSetup(true),
                denySetup: BoardEvent.denySetup(false)
            }
        }

        const imgBox = document.createElement("div");
        imgBox.style.width = "100vw";
        imgBox.style.height = `${cardHeight}vh`;

        // append to center
        // not its how method since it's only supposed to happen at menu's build
        const card = cards[0].html;
        card.style.left = `${(100 - cardWidth)/2}vw`;
        imgBox.appendChild(card);

        const elements = [
            imgBox,
            BoardEvent.generateTextBox("Utilisez les flèches du clavier pour naviguer entre vos aquisitions"),
            createNavBar(cards.length, navBarColor)
        ];

        return {
            elements,
            okSetup: BoardEvent.unappendedOkSetup(),
            denySetup: BoardEvent.denySetup(false)
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

    async nextCard() {
        const dx = -translationDX;
        translateAnimation(
            this.#cards[this.current],
            dx,
            0,
            60,
            2,
            false // since position fixed
        );

        this.current = (this.current + 1) % this.#cards.length;
        const card = this.#cards[this.current];
        this.#appendToRight(card);
        translateAnimation(
            card,
            dx,
            0,
            60,
            2,
            false // since position fixed
        );
    }

    async previousCard() {
        translateAnimation(
            this.#cards[this.current],
            translationDX,
            0,
            60,
            2,
            false // since position fixed
        );

        this.current--; 
        if (this.current < 0) {
            this.current = this.#cards.length - 1;
        }
        const card = this.#cards[this.current];
        this.#appendToLeft(card);
        translateAnimation(
            card,
            translationDX,
            0,
            60,
            2,
            false // since position fixed
        );
    }
}

class Listener extends KeyboardListener {
    #caller: CardMenu;

    constructor(menu: HTMLDivElement, caller: CardMenu) {
        super(menu);
        this.#caller = caller;
    }

    eventHandler(event: KeyboardEvent): void {
        this.enabled = false;
        if (event.key === "ArrowLeft") {
            this.#caller.nextCard().then(()=>this.enabled = true);
        } else if (event.key === "ArrowRight") {
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
        sq.style.backgroundColor = "#5e5c5cff";
        navSquares.push(sq);
        navBar.appendChild(sq);
    }

    navSquares[0].style.backgroundColor = color;
    return navBar;
}

interface SellConfig {
    tx: Sender<Tuple<Aquisition, Aquisition> | undefined>,
    type?: Money
}