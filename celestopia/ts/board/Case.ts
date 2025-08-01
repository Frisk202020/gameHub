import { createHelperBox, removeFromBodyOrWarn } from "../util/functions.js";
import { Position } from "../util/Position.js";
import { BoardElement } from "./BoardElement.js";

const caseFolder = "get_file/celestopia/assets/cases/";
type caseType = "blueCoin" | "redCoin" | "greenCoin" |
    "mail" | "3Mail" | "5Mail" | "furnace" | "postBox" | "ladder" | "teleporter" | "dice" | "duel" |
    "piggy" | "wonder" | "aquisition" | "sale" | "saleRibbon" | "saleStar" | "start";

const descriptions = {
    "start": "Le début d'un long voyage...",
    "blueCoin": "Gagnez etre 50 et 1000 pièces. Le somme est aléatoire.",
    "redCoin": "Donnez entre 50 et 500 pièces à la cagnotte. La somme est aléatoire.",
    "greenCoin": "Participez à un événement aléatoire pour tenter de gagner des pièces !",
    "mail": "Prenez 1 courrier.",
    "3Mail": "Prenez 3 courriers.",
    "5Mail": "Prenez 5 courriers.",
    "furnace": "Brulez tous vos courriers : vous n'aurez rien à payer !",
    "postBox": "Payez tous vos courriers. Chaque courrier vaut deux fois la somme indiquée sur la carte !",
    "ladder": "Déplacez vous à l'autre extremité de l'échelle.",
    "teleporter": "Empruntez ce téléporteur pour passer à la prochaine zone. Vous pouvez ne pas l'emprunter à ce tour.",
    "dice": "Relancez les dés !",
    "duel": "Participez à un mini-jeu pour gagner des pièces ! Le joueur qui tombe sur cette case sera légèrement avantagé.",
    "piggy": "Récuperez la cagnotte ou doublez la somme contenue.",
    "aquisition": "Vous donne accès à une aquisition. Si vous prenez effectivement une carte, vous êtes obligé de la payer.",
    "sale": "Vendez une aquisition. Les aquisitions de type 'pièce' rapporteront plus gros.",
    "saleRibbon": "Vendez une aquisition. Les aquisitions de type 'rubban' rapporteront plus gros.",
    "saleStar": "Vendez une aquisition. Les aquisitions de type 'étoile' rapporteront plus gros.",
    "wonder": "Achetez une merveille si vous en avez les moyens !",
}

type WalkWay = "straight" | "backwards" | "vertical" | "vertiacal-backwards";

const caseSize = 100;
const caseMargin = 50;
export const defaultCasePadding = 48 * caseSize / 729;
let pHelpBox: HTMLParagraphElement | undefined;

export class Case extends BoardElement {
    position: Position;
    uiPosition: Position;
    walkWay: WalkWay;
    size: number;
    link: string;
    padding: number;
    description: string;

    constructor(position: Position, type: caseType, walkway?: WalkWay, padding?: number) {
        super();
        this.position = position;
        this.uiPosition = new Position(caseMargin + position.x * (caseMargin + caseSize), caseMargin + position.y * (caseMargin + caseSize));
        this.walkWay = walkway === undefined ? "straight" : walkway;
        this.size = caseSize;
        this.link = caseFolder + type + ".png";
        this.padding = padding === undefined ? defaultCasePadding : padding;
        this.description = descriptions[type];
    }

    createHtmlElement() {
        const caseImg = document.createElement("img");
        caseImg.classList.add("case");
        caseImg.src = this.link;

        const caseStyle = caseImg.style;
        caseStyle.width = `${caseSize}px`;
        caseStyle.position = "absolute";
        caseStyle.bottom = `${this.uiPosition.y}px`;
        caseStyle.left = `${this.uiPosition.x}px`;

        caseImg.addEventListener("mouseenter", () => {
            const helpBox = createHelperBox(this.description, true, this.uiPosition.translate(0, caseSize), caseSize);
            document.body.appendChild(helpBox);

            pHelpBox = helpBox;
        });
        caseImg.addEventListener("mouseleave", () => {
            removeFromBodyOrWarn(pHelpBox);
        })

        return caseImg;
    }

    getBeginPos(): Position {
        let output: Position;
        switch (this.walkWay) {
            case "straight": output = this.uiPosition.translate(this.padding, caseSize / 2); break;
            case "backwards": output = this.uiPosition.translate(caseSize - this.padding, caseSize / 2); break;
            case "vertical": output = this.uiPosition.translate(caseSize/2, caseSize - this.padding); break;
            case "vertiacal-backwards": output = this.uiPosition.translate(caseSize/2, this.padding);
        }

        return output;
    }

    getEndPos(): Position {
        let output: Position;
        switch (this.walkWay) {
            case "straight": output = this.uiPosition.translate(caseSize - this.padding, caseSize / 2); break;
            case "backwards": output = this.uiPosition.translate(this.padding, caseSize / 2); break;
            case "vertical": output = this.uiPosition.translate(caseSize/2, this.padding); break;
            case "vertiacal-backwards": output = this.uiPosition.translate(caseSize/2, caseSize - 2 * this.padding);
        }

        return output;
    }
}