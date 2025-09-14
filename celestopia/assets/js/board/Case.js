var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Case_instances, _Case_nextId, _Case_fromSide, _Case_nextSide, _Case_type, _Case_position, _Case_uiPosition, _Case_size, _Case_padding, _Case_description, _Case_walkWay, _Case_convex, _Case_leftSide_get, _Case_rightSide_get, _Case_topSide_get, _Case_downSide_get;
import { assets_link, createHelperBox, removeFromBodyOrWarn, unwrap_or_default } from "../util/functions.js";
import { Position } from "../util/Position.js";
const gradientBank = {
    "red": { "begin": "#ea1d1d", "end": "#f55a5a" },
    "blue": { "begin": "#1738f0", "end": "#6b80ff" },
    "cyan": { "begin": "#18ebfa", "end": "#63f6ff" },
    "green": { "begin": "#0bbe08", "end": "#16ff69" },
    "grey": { "begin": "#878787", "end": "#9292c4" },
    "pink": { "begin": "#ea22ea", "end": "#f56ff5" },
    "purple": { "begin": "#a716f5", "end": "#b861ff" },
    "yellow": { "begin": "#f9f11e", "end": "#ffff7d" },
    "turquoise": { "begin": "#27fab7", "end": "#72ffd8" },
    "none": { begin: "none", end: "none" },
};
const caseBank = {
    "blueCoin": { imgName: "coin", color: "blue", size: 60 },
    "redCoin": { imgName: "coin", color: "red", size: 60 },
    "blueRibbon": { imgName: "ribbon", color: "blue" },
    "redRibbon": { imgName: "ribbon", color: "red" },
    "blueStar": { imgName: "star", color: "blue" },
    "redStar": { imgName: "star", color: "red" },
    "event": { imgName: "question", color: "green" },
    "ladder": { imgName: "ladder", color: "turquoise", size: 80 },
    "dice": { imgName: "diceAction", color: "blue" },
    "piggy": { imgName: "pig", color: "blue", size: 55 },
    "aquisition": { imgName: "chest", color: "cyan", size: 60 },
    "wonder": { imgName: "wonder", color: "yellow" },
    "duel": { imgName: "fist", color: "purple", size: 80, position: "bottom" },
    "sale": { imgName: "sale", color: "pink" },
    "saleRibbon": { imgName: "saleRibbon", color: "pink" },
    "saleStar": { imgName: "saleStar", color: "pink" },
    "item": { imgName: "item", color: "blue", position: "top", size: 80 },
    "intersection": { imgName: "intersection", color: "grey" },
    "start": { imgName: "start", color: "grey" },
    "startRotate": { imgName: "start", color: "grey", rotate: true },
    "end": { imgName: "end", color: "yellow" },
    "teleporter": { imgName: "teleporter", color: "none", size: 100 }
};
const descriptions = {
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
};
export const caseSize = 100;
const caseMargin = 50;
export const defaultCasePadding = 0;
let pHelpBox;
export let disableCaseHelpers = false;
export function setDisableCaseHelper(value) { disableCaseHelpers = value; }
export class Case {
    constructor(x, y, type, walkway) {
        _Case_instances.add(this);
        _Case_nextId.set(this, void 0);
        _Case_fromSide.set(this, void 0);
        _Case_nextSide.set(this, void 0);
        _Case_type.set(this, void 0);
        _Case_position.set(this, void 0);
        _Case_uiPosition.set(this, void 0);
        _Case_size.set(this, void 0);
        _Case_padding.set(this, void 0);
        _Case_description.set(this, void 0);
        _Case_walkWay.set(this, void 0);
        _Case_convex.set(this, void 0);
        __classPrivateFieldSet(this, _Case_type, type, "f");
        __classPrivateFieldSet(this, _Case_position, new Position(x, y), "f");
        __classPrivateFieldSet(this, _Case_uiPosition, new Position(caseMargin + __classPrivateFieldGet(this, _Case_position, "f").x * (caseMargin + caseSize), caseMargin + __classPrivateFieldGet(this, _Case_position, "f").y * (caseMargin + caseSize)), "f");
        __classPrivateFieldSet(this, _Case_size, caseSize, "f");
        __classPrivateFieldSet(this, _Case_padding, defaultCasePadding, "f");
        __classPrivateFieldSet(this, _Case_description, descriptions[type], "f");
        walkway === undefined ? __classPrivateFieldSet(this, _Case_walkWay, "straight", "f") : __classPrivateFieldSet(this, _Case_walkWay, walkway, "f");
    }
    withCaseConfig(config) {
        if (config.convex !== undefined) {
            __classPrivateFieldSet(this, _Case_convex, config.convex, "f");
        }
        if (config.ladderDestination !== undefined) {
            this.destination = config.ladderDestination;
        }
        if (config.wonderName !== undefined) {
            this.wonder = config.wonderName;
        }
        if (config.nextId !== undefined) {
            __classPrivateFieldSet(this, _Case_nextId, config.nextId, "f");
        }
        if (config.fromSide !== undefined) {
            __classPrivateFieldSet(this, _Case_fromSide, config.fromSide, "f");
        }
        if (config.targetSide !== undefined) {
            __classPrivateFieldSet(this, _Case_nextSide, config.targetSide, "f");
        }
        if (config.padding !== undefined) {
            __classPrivateFieldSet(this, _Case_padding, config.padding, "f");
        }
        if (config.intersectionConfig !== undefined) {
            this.intersection = config.intersectionConfig;
        }
        return this;
    }
    get fromSide() {
        return __classPrivateFieldGet(this, _Case_fromSide, "f");
    }
    get nextSide() {
        return __classPrivateFieldGet(this, _Case_nextSide, "f");
    }
    get size() {
        return __classPrivateFieldGet(this, _Case_size, "f");
    }
    get type() {
        return __classPrivateFieldGet(this, _Case_type, "f");
    }
    get uiPosition() {
        return __classPrivateFieldGet(this, _Case_uiPosition, "f");
    }
    get position() {
        return __classPrivateFieldGet(this, _Case_position, "f");
    }
    get beginPos() {
        let output;
        switch (__classPrivateFieldGet(this, _Case_walkWay, "f")) {
            case "straight":
                output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_leftSide_get);
                break;
            case "backwards":
                output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_rightSide_get);
                break;
            case "downwards":
                output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_topSide_get);
                break;
            case "upwards": output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_downSide_get);
        }
        return output;
    }
    get endPos() {
        let output;
        switch (__classPrivateFieldGet(this, _Case_walkWay, "f")) {
            case "straight":
                output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_rightSide_get);
                break;
            case "backwards":
                output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_leftSide_get);
                break;
            case "downwards":
                output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_downSide_get);
                break;
            case "upwards": output = __classPrivateFieldGet(this, _Case_instances, "a", _Case_topSide_get);
        }
        return output;
    }
    get convex() {
        return __classPrivateFieldGet(this, _Case_convex, "f");
    }
    get nextId() {
        return __classPrivateFieldGet(this, _Case_nextId, "f");
    }
    getSide(input) {
        switch (input) {
            case "bottom": return __classPrivateFieldGet(this, _Case_instances, "a", _Case_downSide_get);
            case "top": return __classPrivateFieldGet(this, _Case_instances, "a", _Case_topSide_get);
            case "left": return __classPrivateFieldGet(this, _Case_instances, "a", _Case_leftSide_get);
            case "right": return __classPrivateFieldGet(this, _Case_instances, "a", _Case_rightSide_get);
        }
    }
    getDefaultRadius(other) {
        return Math.abs(other.uiPosition.y - this.uiPosition.y) - this.size / 2;
    }
    createHtmlElement(id) {
        const config = caseBank[__classPrivateFieldGet(this, _Case_type, "f")];
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
            }
            else {
                caseImg.style.bottom = "3px";
            }
        }
        if (config.rotate !== undefined) {
            caseImg.classList.add("rotate270");
        }
        caseElm.appendChild(caseImg);
        const caseStyle = caseElm.style;
        caseStyle.width = `${caseSize}px`;
        caseStyle.height = `${caseSize}px`;
        caseStyle.position = "absolute";
        caseStyle.top = `${__classPrivateFieldGet(this, _Case_uiPosition, "f").y}px`;
        caseStyle.left = `${__classPrivateFieldGet(this, _Case_uiPosition, "f").x}px`;
        caseElm.addEventListener("mouseenter", () => {
            if (disableCaseHelpers) {
                return;
            }
            const helpBox = createHelperBox(__classPrivateFieldGet(this, _Case_description, "f"), __classPrivateFieldGet(this, _Case_uiPosition, "f").translate(0, caseSize), caseSize);
            document.body.appendChild(helpBox);
            pHelpBox = helpBox;
        });
        caseElm.addEventListener("mouseleave", () => {
            if (disableCaseHelpers) {
                return;
            }
            removeFromBodyOrWarn(pHelpBox);
        });
        return caseElm;
    }
}
_Case_nextId = new WeakMap(), _Case_fromSide = new WeakMap(), _Case_nextSide = new WeakMap(), _Case_type = new WeakMap(), _Case_position = new WeakMap(), _Case_uiPosition = new WeakMap(), _Case_size = new WeakMap(), _Case_padding = new WeakMap(), _Case_description = new WeakMap(), _Case_walkWay = new WeakMap(), _Case_convex = new WeakMap(), _Case_instances = new WeakSet(), _Case_leftSide_get = function _Case_leftSide_get() {
    return __classPrivateFieldGet(this, _Case_uiPosition, "f").translate(__classPrivateFieldGet(this, _Case_padding, "f"), caseSize / 2);
}, _Case_rightSide_get = function _Case_rightSide_get() {
    return __classPrivateFieldGet(this, _Case_uiPosition, "f").translate(caseSize - __classPrivateFieldGet(this, _Case_padding, "f"), caseSize / 2);
}, _Case_topSide_get = function _Case_topSide_get() {
    return __classPrivateFieldGet(this, _Case_uiPosition, "f").translate(caseSize / 2, __classPrivateFieldGet(this, _Case_padding, "f"));
    ;
}, _Case_downSide_get = function _Case_downSide_get() {
    return __classPrivateFieldGet(this, _Case_uiPosition, "f").translate(caseSize / 2, caseSize - __classPrivateFieldGet(this, _Case_padding, "f"));
};
