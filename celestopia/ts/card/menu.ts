import { createHelperBox, translateAnimation, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { Position } from "../util/Position.js";
import { setGlobalKeyboardListener } from "../util/variables.js";
import { Card } from "./Card";

export const cardId = "activeCard";
export const newCardId = "newCard";
export const boxId = "menuHelperBox";
export const navId = "menuNavBar";

export function generateMenu(list: Card[], helperText: string) {
    const screenSize = new Position(document.documentElement.clientWidth, document.documentElement.clientHeight);

    const bg = appendBackground();
    const img = appendImg(
        `get_file/celestopia/assets/aquisitions/${list[0].name}.png`,
        screenSize
    )

    img.onload = () => {
        const imgRect = img.getBoundingClientRect();
        const box = appendHelperBox(helperText, imgRect, screenSize);
        const {navBar, navSquares} = appendNavBar(imgRect, screenSize, list.length);

        appendCross(bg, img, box, navBar);
        setGlobalKeyboardListener(new CardKeyboardListener(img, navSquares, list))
    }
}

function appendImg(src: string, screenSize: Position) {
    const img = document.createElement("img");
    img.id = cardId;
    img.src = src;
    img.style.width = "40vw";
    img.style.zIndex = "6";

    const px = vwToPx(40);
    img.style.position = "absolute";
    img.style.left = `${(screenSize.x - px)/2}px`;
    img.style.top = `${(screenSize.y - px)/2}px`;

    document.body.appendChild(img);
    return img;
}

function appendHelperBox(text: string, imgRect: DOMRect, screenSize: Position) {
    const box = createHelperBox(text, false, undefined, undefined, 6);
    box.id = boxId;
    box.style.opacity = "0";
    box.style.top = `${imgRect.bottom}px`;
    document.body.appendChild(box);

    const boxRect = box.getBoundingClientRect();
    const boxWidth = boxRect.right - boxRect.left;
    box.style.left = `${(screenSize.x - boxWidth)/2}px`;
    box.style.opacity = "1";

    return box;
}

function appendNavBar(imgRect: DOMRect, screenSize: Position, length: number) {
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
    navSquares[0].style.backgroundColor = "#ffd700";

    navBar.style.opacity = "0";
    document.body.appendChild(navBar);
    const navRect = navBar.getBoundingClientRect();
    const navWidth = navRect.right - navRect.left;
    navBar.style.left = `${(screenSize.x - navWidth)/2}px`;
    navBar.style.opacity = "1";

    return {navBar, navSquares};
}

function appendCross(bg: HTMLDivElement, img: HTMLImageElement, box: HTMLParagraphElement, nav: HTMLDivElement) {
    const cross = document.createElement("img");
    cross.src = "get_file/celestopia/assets/icons/cross.png";
    cross.style.width = "10vw";
    cross.style.position = "fixed";
    cross.style.right = "0px";
    cross.style.top = "0px";
    cross.style.zIndex = "6";
    cross.addEventListener("click", () => {
        document.body.removeChild(bg);

        const card = document.getElementById(cardId);
        card === null ? console.log("WARN: none active card caught while clearing the menu") : document.body.removeChild(card);
        
        const newCard = document.getElementById(newCardId);
        if (newCard !== null) {
            document.body.removeChild(newCard);
        }
        document.body.removeChild(nav);
        document.body.removeChild(box);
        document.body.removeChild(cross);
    });
    document.body.appendChild(cross);
}

function appendBackground() {
    const blurryBackground = document.createElement("div");
    const bgStyle = blurryBackground.style;
    bgStyle.position = "absolute";
    bgStyle.left = "0px";
    bgStyle.top = "0px";
    bgStyle.backgroundColor = "#d4d4cb6f";
    bgStyle.width = "100vw";
    bgStyle.height = "100vh";
    bgStyle.zIndex = "5";
    document.body.appendChild(blurryBackground);

    return blurryBackground;
}

class CardKeyboardListener extends KeyboardListener {
    cards: Card[];
    navBar: HTMLDivElement[];
    currentIndex: number;

    constructor(element: HTMLImageElement, nav: HTMLDivElement[], cards: Card[]) {
        super(element)
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
                translateAnimation(this.element, new Position(vwToPx(-60), rect.top), 60, 0.5);
                newCard = this.#generateNewCard("left");
                break;
            case "ArrowLeft": 
                translateAnimation(this.element, new Position(vwToPx(140), rect.top), 60, 0.5);
                newCard = this.#generateNewCard("right");
                break;
            default: this.enabled = true; return;
        }

        translateAnimation(newCard, new Position(leftPos, rect.top), 60, 0.5).then(() => {
            if (document.body.contains(this.element)) {
                document.body.removeChild(this.element); // can be removed if cross is prompted
            }
            this.element = newCard;
            this.element.id = cardId;
            this.enabled = true;
        })        
    }

    #generateNewCard(position: "left" | "right") {
        const card = document.createElement("img");
        card.style.position = "absolute";
        card.style.top = this.element.style.top;
        card.style.width = "40vw";
        card.style.zIndex = "6";

        this.navBar[this.currentIndex].style.backgroundColor = "#5e5c5cff";
        if (position === "right") {
            card.style.left = "-60vw";
            if (this.currentIndex === 0) {
                this.currentIndex = this.cards.length - 1;
            } else {
                this.currentIndex--;
            }
        } else {
            card.style.left = "140vw";
            if (this.currentIndex === this.cards.length - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
        }
        this.navBar[this.currentIndex].style.backgroundColor = "#ffd700";

        card.src = `get_file/celestopia/assets/aquisitions/${this.cards[this.currentIndex].name}.png`;
        card.id = newCardId;
        document.body.appendChild(card);
        return card;
    }
}