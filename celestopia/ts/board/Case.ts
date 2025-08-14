import { WonderName } from "../card/Wonder.js";
import { createHelperBox, removeFromBodyOrWarn } from "../util/functions.js";
import { Position } from "../util/Position.js";

const caseFolder = "get_file/celestopia/assets/cases/";
export type caseType = "blueCoin" | "redCoin" | "greenEvent" | "end" |
    "mail" | "3Mail" | "5Mail" | "furnace" | "postBox" | "ladder" | "teleporter" | "dice" | "duel" |
    "piggy" | "wonder" | "aquisition" | "sale" | "saleRibbon" | "saleStar" | "start" | "item" | "intersection" | "star" | "redStar";

const descriptions = {
    "start": "Le début d'un long voyage...",
    "blueCoin": "Gagnez etre 50 et 1000 pièces. Le somme est aléatoire.",
    "redCoin": "Donnez entre 50 et 500 pièces à la cagnotte. La somme est aléatoire.",
    "greenEvent": "Participez à un événement aléatoire pour tenter de gagner des pièces !",
    "mail": "Prenez 1 courrier.",
    "3Mail": "Prenez 3 courriers.",
    "5Mail": "Prenez 5 courriers.",
    "furnace": "Brulez tous vos courriers : vous n'aurez rien à payer !",
    "postBox": "Payez tous vos courriers. Chaque courrier vaut deux fois la somme indiquée sur la carte !",
    "ladder": "Déplacez vous à l'autre extremité de l'échelle.",
    "teleporter": "Empruntez ce téléporteur pour passer à la prochaine zone. Vous pouvez ne pas l'emprunter à ce tour. Vous recevrez une gratifcation de 1500 pièces.",
    "dice": "Relancez les dés !",
    "duel": "Participez à un mini-jeu pour gagner des pièces ! Le joueur qui tombe sur cette case sera légèrement avantagé.",
    "piggy": "Récuperez la cagnotte ou doublez la somme contenue.",
    "aquisition": "Vous donne accès à une aquisition. Si vous prenez effectivement une carte, vous êtes obligé de la payer.",
    "sale": "Vendez une aquisition. Les aquisitions de type 'pièce' rapporteront plus gros.",
    "saleRibbon": "Vendez une aquisition. Les aquisitions de type 'rubban' rapporteront plus gros.",
    "saleStar": "Vendez une aquisition. Les aquisitions de type 'étoile' rapporteront plus gros.",
    "wonder": "Achetez une merveille si vous en avez les moyens !",
    "item": "Obtenez un objet aléatoire.",
    "intersection": "Vous pouvez choisir quel chemin emprunter",
    "star": "Gagnez entre 50 et 500 étoiles",
    "redStar": "Perdez entre 50 et 500 étoiles",
    "end": "Réclamez votre salaire de 5000 pièces après avoir payé vos courriers et des intérêts si vous êtes à découvert."
}

export const caseSize = 100;
const caseMargin = 50;
export const defaultCasePadding = 48 * caseSize / 729;
let pHelpBox: HTMLParagraphElement | undefined;

export let disableCaseHelpers = false;
export function setDisableCaseHelper(value: boolean) { disableCaseHelpers = value; }

type WalkWay = "straight" | "backwards" | "upwards" | "downwards";
type Side = "top" | "bottom" | "right" | "left";

export interface CaseConfig {
    nextId?: number,
    fromSide?: Side
    targetSide?: Side,
    convex?: boolean,
    padding?: number,
    ladderDestination?: number,
    wonderName?: WonderName,
    intersectionConfig?: IntersectionConfig,
}

export interface IntersectionConfig {
    leftId: number,
    rightId: number,
}

export class Case {
    #nextId?: number;
    #fromSide?: Side;
    #nextSide?: Side;
    #type: caseType;
    #position: Position;
    #uiPosition: Position;
    #size: number;
    #link: string;
    #padding: number;
    #description: string;
    #walkWay: WalkWay;
    #convex?: boolean;

    constructor(x: number, y: number, type: caseType, walkway?: WalkWay) {
        this.#type = type;
        this.#position = new Position(x, y);
        this.#uiPosition = new Position(caseMargin + this.#position.x * (caseMargin + caseSize), caseMargin + this.#position.y * (caseMargin + caseSize));
        this.#size = caseSize;
        this.#link = caseFolder + type + ".png";
        this.#padding = defaultCasePadding;
        this.#description = descriptions[type];
        walkway === undefined ? this.#walkWay = "straight" : this.#walkWay = walkway
    }
    withCaseConfig(config: CaseConfig): Case {
        if (config.convex !== undefined) { this.#convex = config.convex; }
        if (config.ladderDestination !== undefined) { (this as any).destination = config.ladderDestination; }
        if (config.wonderName !== undefined) { (this as any).wonder = config.wonderName; }
        if (config.nextId !== undefined) { this.#nextId = config.nextId; }
        if (config.fromSide !== undefined) { this.#fromSide = config.fromSide; }
        if (config.targetSide !== undefined) { this.#nextSide = config.targetSide; }
        if (config.padding !== undefined) { this.#padding = config.padding; }
        if (config.intersectionConfig !== undefined) { (this as any).intersection = config.intersectionConfig; }

        return this;
    }

    get fromSide() {
        return this.#fromSide;
    } get nextSide() {
        return this.#nextSide;
    } get size() {
        return this.#size;
    } get type() {
        return this.#type;
    } get uiPosition() {
        return this.#uiPosition;
    } get position() {
        return this.#position;
    } get beginPos() {
        let output: Position;
        switch (this.#walkWay) {
            case "straight": output = this.#leftSide; break;
            case "backwards": output = this.#rightSide; break;
            case "downwards": output = this.#topSide; break;
            case "upwards": output = this.#downSide;
        }

        return output;
    } get endPos() {
        let output: Position;
        switch (this.#walkWay) {
            case "straight": output = this.#rightSide; break;
            case "backwards": output = this.#leftSide; break;
            case "downwards": output = this.#downSide; break;
            case "upwards": output = this.#topSide;
        }

        return output;
    } get convex() {
        return this.#convex;
    } get nextId() {
        return this.#nextId;
    } get #leftSide() {
        return this.#uiPosition.translate(this.#padding, caseSize / 2);
    } get #rightSide() {
        return this.#uiPosition.translate(caseSize - this.#padding, caseSize / 2);
    } get #topSide() {
        return this.#uiPosition.translate(caseSize/2, this.#padding);;
    } get #downSide() {
        return this.#uiPosition.translate(caseSize/2, caseSize - this.#padding);
    } getSide(input: Side) {
        switch(input) {
            case "bottom": return this.#downSide;
            case "top": return this.#topSide;
            case "left": return this.#leftSide;
            case "right": return this.#rightSide;
        }
    } getDefaultRadius(other: Case) {
        return Math.abs(other.uiPosition.y - this.uiPosition.y) - this.size/2;
    }

    createHtmlElement(id: number) {
        const caseImg = document.createElement("img");
        caseImg.classList.add("case");
        caseImg.src = this.#link;
        caseImg.id = `case.${id}`;

        const caseStyle = caseImg.style;
        caseStyle.width = `${caseSize}px`;
        caseStyle.position = "absolute";
        caseStyle.top = `${this.#uiPosition.y}px`;
        caseStyle.left = `${this.#uiPosition.x}px`;

        caseImg.addEventListener("mouseenter", () => {
            if (disableCaseHelpers) { return; }
            const helpBox = createHelperBox(this.#description, this.#uiPosition.translate(0, caseSize), caseSize);
            document.body.appendChild(helpBox);

            pHelpBox = helpBox;
        });
        caseImg.addEventListener("mouseleave", () => {
            if (disableCaseHelpers) { return; }
            removeFromBodyOrWarn(pHelpBox);
        })

        return caseImg;
    }
}