import type { DynamicPlacement } from "../util/DynamicPlacement.js";
import type { Money } from "../util/variables.js";
import { Popup } from "../event/Popup.js";
import { initChannel, Sender } from "../util/channel.js";
import { appendBlurryBackground, appendCross, assets_link, createHelperBox, translateAnimation, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { Position } from "../util/Position.js";
import { Tuple } from "../util/tuple.js";
import { Aquisition } from "./Aquisition.js";

export const cardId = "activeCard";
export const newCardId = "newCard";
export const boxId = "menuHelperBox";
export const navId = "menuNavBar";
export type ImgFolder = "aquisitions" | "wonders";

interface SellConfig {
    tx: Sender<Tuple<Aquisition, Aquisition> | undefined>,
    type?: Money
}


let sellingAq: Aquisition | undefined = undefined;
let boostedClone: Aquisition | undefined = undefined;
let boost: Money | undefined = undefined;

export abstract class Card implements DynamicPlacement {
    #name: string;
    #src: string;
    static #cardWidth = 30;

    static get cardWidth(): number {
        return this.#cardWidth;
    }

    constructor(name: string, folder: "aquisitions" | "wonders") {
        this.#name = name;
        this.#src = assets_link(`${folder}/${name}.png`);
    }

    get name() {
        return this.#name;
    } get src() {
        return this.#src;
    }

    move(windowWidth: number, windowHeight: number): void {
        const img = document.getElementById(cardId);
        const px = vwToPx(Card.#cardWidth);
        if (img != undefined) {
            img.style.left = `${(windowWidth - px)/2}px`;
            img.style.top = `${(windowHeight - px)/2}px`;

            const helpBox = document.getElementById(boxId);
            if (helpBox != undefined) {
                const rect = helpBox.getBoundingClientRect();
                const width = rect.right - rect.left;
                helpBox.style.left = `${(windowWidth - width)/2}px`;
                helpBox.style.top = `${img.getBoundingClientRect().bottom}px`;
            } else {
                console.log("WARN: aquisition card is loaded, but not the helper box");
            }

            const nav = document.getElementById(navId);
            if (nav != undefined) {
                const rect = nav.getBoundingClientRect();
                const width = rect.right - rect.left;
                nav.style.left = `${(windowWidth - width)/2}px`;
                nav.style.top = `${img.getBoundingClientRect().bottom - 50}px`;
            } else {
                console.log("WARN: aquisition card is loaded, but not the nav bar");
            }
        }
    }

    static generateMenu(list: Card[], imgFolder: ImgFolder, helperText: string, config?: SellConfig) {
        if (list.length === 0) {
            if (config !== undefined) {
                const {tx, rx} = initChannel<void>();
                new Popup("Vous n'avez aucune carte...", undefined, tx);
                rx.recv().then(()=>config.tx.send(undefined))
            } else {
                new Popup("Vous n'avez aucune carte...")
            }
            return;
        } 
        
        const screenSize = new Position(document.documentElement.clientWidth, document.documentElement.clientHeight);
        const bg = appendBlurryBackground();
        
        if (config !== undefined) {
            sellingAq = list[0] as Aquisition;
            boost = config.type;
            boost === undefined ? boostedClone = (list[0] as Aquisition).clone() : boostedClone = (list[0] as Aquisition).getBoostedClone(boost);

            const box = document.createElement("div");
            box.style.display = "flex";
            box.style.justifyContent = "center";
            box.style.alignItems = "center";
            box.style.marginLeft = "auto";
            box.style.marginRight = "auto";
            
            const gains = document.createElement("div");
            gains.style.display = "flex";
            gains.style.justifyContent = "center";
            gains.style.alignItems = "center";
            gains.style.flexDirection = "column";
            gains.style.margin = "1vh";
            gains.style.marginRight = "3vw";

            const msg = document.createElement("p");
            msg.textContent = "Gains de vente";
            msg.style.fontSize = "5vh";
            gains.appendChild(msg);

            const gainsSubBox = document.createElement("div");
            gainsSubBox.style.display = "flex";
            gainsSubBox.style.justifyContent = "center";
            gainsSubBox.style.alignItems = "center";
            gains.appendChild(gainsSubBox);

            const {box: coinElm, ammount: coinAmmount} = createGainDiv("coin", sellingAq.coins);
            gainsSubBox.appendChild(coinElm);
            sellCoinCounterRoutine(coinAmmount);

            const {box: ribbonElm, ammount: ribbonAmmount} = createGainDiv("ribbon", sellingAq.ribbons);
            gainsSubBox.appendChild(ribbonElm);
            sellRibbonCounterRoutine(ribbonAmmount);

            const {box: starElm, ammount: starAmmount} = createGainDiv("star", sellingAq.stars);
            gainsSubBox.appendChild(starElm);
            sellStarCounterRoutine(starAmmount);
            box.appendChild(gains);

            const button = document.createElement("div");
            button.className = "pointerHover";
            button.textContent = "Vendre";
            button.style.fontSize = "5vh";
            button.style.borderRadius = "15px";
            button.style.backgroundColor = "#ffd700";
            button.style.border = "solid black 2px";
            button.addEventListener("click", () => {
                document.body.removeChild(bg);
                config.tx.send(new Tuple(sellingAq as Aquisition, boostedClone as Aquisition));
            });
            box.appendChild(button);
            bg.appendChild(box);
        }

        const img = appendImg(
            list[0].src,
            screenSize,
            bg
        )

        img.onload = () => {
            const imgRect = img.getBoundingClientRect();
            appendHelperBox(helperText, imgRect, screenSize, bg);
            const navSquares = appendNavBar(imgRect, screenSize, list.length, imgFolder, bg);

            if (config === undefined) {
                appendCross(["menu"], bg);
            } else {
                const {tx, rx} = initChannel<void>();
                appendCross(["menu"], bg, tx);
                rx.recv().then(() => {
                    sellingAq = undefined;
                    boostedClone = undefined;
                    boost = undefined;
                });
            }

            new CardKeyboardListener(img, bg, imgFolder, navSquares, list);
        }
    }
}

function sellCoinCounterRoutine(elm: HTMLParagraphElement) {
    if (boostedClone === undefined) {
        console.log("WARN: called coin counter routine but clone aquisition is undefined");
        return;
    }
    elm.textContent = boostedClone.coins.toString();

    requestAnimationFrame(() => sellCoinCounterRoutine(elm));
}
function sellRibbonCounterRoutine(elm: HTMLParagraphElement) {
    if (boostedClone === undefined) {
        console.log("WARN: called coin counter routine but clone aquisition is undefined");
        return;
    }
    elm.textContent = boostedClone.ribbons.toString();

    requestAnimationFrame(() => sellRibbonCounterRoutine(elm));
}
function sellStarCounterRoutine(elm: HTMLParagraphElement) {
    if (boostedClone === undefined) {
        console.log("WARN: called coin counter routine but clone aquisition is undefined");
        return;
    }
    elm.textContent = boostedClone.stars.toString();

    requestAnimationFrame(() => sellStarCounterRoutine(elm));
}

function createGainDiv(type: Money, value: number) {
    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.height = "5vh";
    box.style.margin = "1vh";

    const img = document.createElement("img");
    img.src = assets_link(`icons/${type}.png`);
    img.style.marginRight = "10px";
    box.appendChild(img);

    const ammount = document.createElement("p");
    ammount.textContent = value.toString();
    ammount.style.fontSize = "3vh";
    ammount.style.margin = "0px";
    ammount.style.width = "10vw";
    ammount.style.textAlign = "center";
    ammount.style.display = "grid";
    ammount.style.alignItems = "center";
    box.appendChild(ammount);

    return {box, ammount};
}

function appendImg(src: string, screenSize: Position, parent: HTMLDivElement) {
    const img = document.createElement("img");
    img.id = cardId;
    img.src = src;
    img.style.width = `${Card.cardWidth}vw`;
    img.style.zIndex = "6";

    const px = vwToPx(Card.cardWidth);
    img.style.position = "fixed";
    img.style.left = `${(screenSize.x - px)/2}px`;
    img.style.top = `${(screenSize.y - px)/2}px`;

    parent.appendChild(img);
    return img;
}

function appendHelperBox(text: string, imgRect: DOMRect, screenSize: Position, parent: HTMLDivElement) {
    const box = createHelperBox(text, undefined, undefined, 6);
    box.id = boxId;
    box.style.opacity = "0";
    box.style.top = `${imgRect.bottom}px`;
    parent.appendChild(box);

    const boxRect = box.getBoundingClientRect();
    const boxWidth = boxRect.right - boxRect.left;
    box.style.left = `${(screenSize.x - boxWidth)/2}px`;
    box.style.opacity = "1";

    return box;
}

function appendNavBar(imgRect: DOMRect, screenSize: Position, length: number, folder: ImgFolder, parent: HTMLDivElement) {
    const navBar = document.createElement("div");
    navBar.id = navId;

    navBar.style.display = "flex";
    navBar.style.justifyContent = "center";
    navBar.style.position = "absolute";
    navBar.style.top = `${imgRect.bottom - 50}px`; 
    navBar.style.zIndex = "6";
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

    switch(folder) {
        case "aquisitions": navSquares[0].style.backgroundColor = "#b3ec69"; break;
        case "wonders": navSquares[0].style.backgroundColor = "#ffd700"; break;
        default: console.log("Unhandled img folder");
    }

    navBar.style.opacity = "0";
    parent.appendChild(navBar);
    const navRect = navBar.getBoundingClientRect();
    const navWidth = navRect.right - navRect.left;
    navBar.style.left = `${(screenSize.x - navWidth)/2}px`;
    navBar.style.opacity = "1";

    return navSquares;
}

class CardKeyboardListener extends KeyboardListener {
    cards: Card[];
    folderName: ImgFolder;
    bg: HTMLDivElement;
    navBar: HTMLDivElement[];
    currentIndex: number;

    constructor(element: HTMLImageElement, bg: HTMLDivElement, folder: ImgFolder, nav: HTMLDivElement[], cards: Card[]) {
        super(element);
        this.folderName = folder;
        this.bg = bg;
        this.navBar = nav;
        this.cards = cards;
        this.currentIndex = 0;
    }

    eventHandler(event: KeyboardEvent): void {
        if (!this.enabled) { return; }

        this.enabled = false;
        const rect = this.element.getBoundingClientRect();
        let newCard: HTMLImageElement;
        const leftPos = this.element.getBoundingClientRect().left; // compute it before animation starts

        switch (event.key) {
            case "ArrowRight": 
                translateAnimation(this.element, new Position(vwToPx(-100 + Card.cardWidth), rect.top), 60, 0.5, false);
                newCard = this.#generateNewCard("left");
                break;
            case "ArrowLeft": 
                translateAnimation(this.element, new Position(vwToPx(100 + Card.cardWidth), rect.top), 60, 0.5, false);
                newCard = this.#generateNewCard("right");
                break;
            default: this.enabled = true; return;
        }

        translateAnimation(newCard, new Position(leftPos, rect.top), 60, 0.5, false).then(() => {
            if (this.bg.contains(this.element)) {
                this.bg.removeChild(this.element); // can be removed if cross is prompted
            }
            this.element = newCard;
            this.element.id = cardId;
            this.enabled = true;
        });   
    }

    #generateNewCard(position: "left" | "right") {
        const card = document.createElement("img");
        card.style.position = "fixed";
        card.style.top = this.element.style.top;
        card.style.width = `${Card.cardWidth}vw`;
        card.style.zIndex = "6";

        this.navBar[this.currentIndex].style.backgroundColor = "#5e5c5cff";
        if (position === "right") {
            card.style.left = `${-100 + Card.cardWidth}vw`;
            if (this.currentIndex === 0) {
                this.currentIndex = this.cards.length - 1;
            } else {
                this.currentIndex--;
            }
        } else {
            card.style.left = `${100 + Card.cardWidth}vw`;
            if (this.currentIndex === this.cards.length - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
        }

        switch(this.folderName) {
            case "aquisitions": this.navBar[this.currentIndex].style.backgroundColor = "#b3ec69"; break;
            case "wonders": this.navBar[this.currentIndex].style.backgroundColor = "#ffd700"; break;
            default: console.log("Unhandled img folder");
        }

        const cardObj = this.cards[this.currentIndex] as Aquisition;
        card.src = cardObj.src;
        card.id = newCardId;
        if (sellingAq !== undefined) {
            sellingAq = cardObj;
            if (boost !== undefined) { boostedClone = cardObj.getBoostedClone(boost) }
            else { boostedClone = cardObj.clone(); }
        }

        this.bg.appendChild(card);
        return card;
    }
}