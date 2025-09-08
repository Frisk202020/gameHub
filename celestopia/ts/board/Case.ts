import type { WonderName } from "../card/Wonder.js";
import { assets_link, createHelperBox, removeFromBodyOrWarn, unwrap_or_default } from "../util/functions.js";
import { Position } from "../util/Position.js";

export type CaseType = "blueCoin" | "redCoin" | "event" | "end" |"ladder" | "teleporter" | "dice" | "duel" | "blueRibbon" | "redRibbon" | 
    "piggy" | "wonder" | "aquisition" | "sale" | "saleRibbon" | "saleStar" | "start" | "item" | "intersection" | "blueStar" | "redStar" | "startRotate";

type CaseColor = "red" | "blue" | "green" | "purple" | "pink" | "yellow" | "grey" | "turquoise" | "cyan" | "none";

interface CaseBuilder {
    imgName: string,
    color: CaseColor,
    size?: number, // expects a percentage. Defaults to 70
    position?: "top" | "bottom", // defaults to center. Defines vertical position relative to case container
    rotate?: boolean // for start case on board 2
}

interface Gradient {
    begin: string,
    end: string
}

const gradientBank: Record<CaseColor, Gradient> = {
    "red": { "begin": "#ea1d1d", "end": "#f55a5a" },
    "blue": { "begin": "#1738f0", "end": "#6b80ff" },
    "cyan": { "begin": "#18ebfa", "end": "#63f6ff" },
    "green": { "begin": "#0bbe08", "end": "#16ff69" },
    "grey": { "begin": "#878787", "end": "#9292c4" },
    "pink": { "begin": "#ea22ea", "end": "#f56ff5" },
    "purple": { "begin": "#a716f5", "end": "#b861ff" },
    "yellow": { "begin": "#f9f11e", "end": "#ffff7d" },
    "turquoise": { "begin": "#27fab7", "end": "#72ffd8" },
    "none": {begin: "none", end: "none"},
}

const caseBank: Record<CaseType, CaseBuilder> = {
    "blueCoin": {imgName: "coin", color: "blue", size: 60},
    "redCoin": {imgName: "coin", color: "red", size: 60},
    "blueRibbon": {imgName: "ribbon", color: "blue"},
    "redRibbon": {imgName: "ribbon", color: "red"},
    "blueStar": {imgName: "star", color: "blue"},
    "redStar": {imgName: "star", color: "red"},
    "event": {imgName: "question", color: "green"},
    "ladder": {imgName: "ladder", color: "turquoise", size: 80},
    "dice": {imgName: "diceAction", color: "blue"},
    "piggy": {imgName: "pig", color: "blue", size: 55},
    "aquisition": {imgName: "chest", color: "cyan", size: 60},
    "wonder": {imgName: "wonder", color: "yellow"},
    "duel": {imgName: "fist", color: "purple", size: 80, position: "bottom"},
    "sale": {imgName: "sale", color: "pink"},
    "saleRibbon": {imgName: "saleRibbon", color: "pink"},
    "saleStar": {imgName: "saleStar", color: "pink"},
    "item": {imgName: "item", color: "blue", position: "top", size: 80},
    "intersection": {imgName: "intersection", color: "grey"},
    "start": {imgName: "start", color: "grey"},
    "startRotate": {imgName: "start", color: "grey", rotate: true},
    "end": {imgName: "end", color: "yellow"},
    "teleporter": {imgName: "teleporter", color: "none", size: 100}
}

const descriptions: Record<CaseType, string> = {
    "start": "Le début d'un long voyage...",
    "startRotate": "La fin approche...",
    "blueCoin": "Gagnez etre 50 et 1000 pièces. Le somme est aléatoire.",
    "redCoin": "Donnez entre 50 et 500 pièces à la cagnotte. La somme est aléatoire.",
    "blueRibbon": "Gagnez entre 50 et 500 rubans.",
    "redRibbon": "Perdez entre 50 et 500 rubans.",
    "event": "Participez à un événement aléatoire pour tenter de gagner des pièces !",
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
    "blueStar": "Gagnez entre 50 et 500 étoiles",
    "redStar": "Perdez entre 50 et 500 étoiles",
    "end": "Réclamez votre salaire de 5000 pièces après avoir payé vos courriers et des intérêts si vous êtes à découvert."
}

export const caseSize = 100;
const caseMargin = 50;
export const defaultCasePadding = 0;
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
    #type: CaseType;
    #position: Position;
    #uiPosition: Position;
    #size: number;
    #padding: number;
    #description: string;
    #walkWay: WalkWay;
    #convex?: boolean;

    constructor(x: number, y: number, type: CaseType, walkway?: WalkWay) {
        this.#type = type;
        this.#position = new Position(x, y);
        this.#uiPosition = new Position(caseMargin + this.#position.x * (caseMargin + caseSize), caseMargin + this.#position.y * (caseMargin + caseSize));
        this.#size = caseSize;
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
        const config = caseBank[this.#type];
        const gradient = gradientBank[config.color];

        const caseElm = document.createElement("div");
        caseElm.classList.add("case");
        caseElm.id = `case.${id}`;
        if (config.color !== "none") {
            caseElm.style.background = `radial-gradient(circle, ${gradient.begin}, ${gradient.end})`;
            caseElm.classList.add("with-case-border");
            caseElm.style.borderRadius = "100%";
        }

        const caseImg = document.createElement("img");
        caseImg.src = assets_link(`icons/${config.imgName}.png`);
        caseImg.style.width = `${unwrap_or_default(config.size, 70)}%`;
        caseImg.style.zIndex = "1";
        if (config.position !== undefined) {
            caseImg.style.position = "absolute";
            if (config.position === "top") {
                caseImg.style.top = "3px"; // under border
            } else {
                caseImg.style.bottom = "3px";
            }
        }
        if (config.rotate !== undefined) { caseImg.classList.add("rotate270"); }
        caseElm.appendChild(caseImg);

        const caseStyle = caseElm.style;
        caseStyle.width = `${caseSize}px`;
        caseStyle.height = `${caseSize}px`;
        caseStyle.position = "absolute";
        caseStyle.top = `${this.#uiPosition.y}px`;
        caseStyle.left = `${this.#uiPosition.x}px`;

        caseElm.addEventListener("mouseenter", () => {
            if (disableCaseHelpers) { return; }
            const helpBox = createHelperBox(this.#description, this.#uiPosition.translate(0, caseSize), caseSize);
            document.body.appendChild(helpBox);

            pHelpBox = helpBox;
        });
        caseElm.addEventListener("mouseleave", () => {
            if (disableCaseHelpers) { return; }
            removeFromBodyOrWarn(pHelpBox);
        })

        return caseElm;
    }
}