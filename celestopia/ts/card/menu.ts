import { Popup } from "../event/Popup.js";
import { appendBlurryBackground, appendCross, createHelperBox, translateAnimation, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { Position } from "../util/Position.js";
import { Card } from "./Card.js";

export const cardId = "activeCard";
export const newCardId = "newCard";
export const boxId = "menuHelperBox";
export const navId = "menuNavBar";
export type ImgFolder = "aquisitions" | "wonders";

export function generateMenu(list: Card[], imgFolder: ImgFolder, helperText: string) {
    if (list.length === 0) {
        new Popup("Vous n'avez aucune carte...");
        return;
    } 
    
    const screenSize = new Position(document.documentElement.clientWidth, document.documentElement.clientHeight);
    const bg = appendBlurryBackground();
    const img = appendImg(
        list[0].src,
        screenSize,
        bg
    )

    img.onload = () => {
        const imgRect = img.getBoundingClientRect();
        appendHelperBox(helperText, imgRect, screenSize, bg);
        const navSquares = appendNavBar(imgRect, screenSize, list.length, imgFolder, bg);

        appendCross(["menu"]);
        new CardKeyboardListener(img, bg, imgFolder, navSquares, list);
    }
}

function appendImg(src: string, screenSize: Position, parent: HTMLDivElement) {
    const img = document.createElement("img");
    img.id = cardId;
    img.src = src;
    img.style.width = "40vw";
    img.style.zIndex = "6";

    const px = vwToPx(40);
    img.style.position = "absolute";
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
            if (this.bg.contains(this.element)) {
                this.bg.removeChild(this.element); // can be removed if cross is prompted
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

        switch(this.folderName) {
            case "aquisitions": this.navBar[this.currentIndex].style.backgroundColor = "#b3ec69"; break;
            case "wonders": this.navBar[this.currentIndex].style.backgroundColor = "#ffd700"; break;
            default: console.log("Unhandled img folder");
        }

        card.src = this.cards[this.currentIndex].src;
        card.id = newCardId;
        this.bg.appendChild(card);
        return card;
    }
}