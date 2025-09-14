var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Board_instances, _Board_elements, _Board_length, _Board_height, _Board_stylish, _Board_board0, _Board_board1, _Board_board2;
import { Case, defaultCasePadding } from "./Case.js";
import { Tuple } from "../util/tuple.js";
import { assets_link } from "../util/functions.js";
export function buildBoard(id) {
    return new Board(id);
}
export let boardCanvas;
const bg = document.getElementById("bg");
class Board {
    constructor(id) {
        _Board_instances.add(this);
        _Board_elements.set(this, void 0);
        _Board_length.set(this, void 0);
        _Board_height.set(this, void 0);
        let board;
        let b_id = 0;
        switch (id) {
            case 0:
                board = __classPrivateFieldGet(this, _Board_instances, "m", _Board_board0).call(this);
                break;
            case 1:
                board = __classPrivateFieldGet(this, _Board_instances, "m", _Board_board1).call(this);
                b_id = 1;
                break;
            case 2:
                board = __classPrivateFieldGet(this, _Board_instances, "m", _Board_board2).call(this);
                b_id = 2;
        }
        __classPrivateFieldSet(this, _Board_elements, board.elements, "f");
        __classPrivateFieldSet(this, _Board_height, board.height, "f");
        __classPrivateFieldSet(this, _Board_length, board.length, "f");
        __classPrivateFieldGet(this, _Board_instances, "m", _Board_stylish).call(this, b_id, board.class);
    }
    get elements() {
        return __classPrivateFieldGet(this, _Board_elements, "f");
    }
    get height() {
        return __classPrivateFieldGet(this, _Board_height, "f");
    }
}
_Board_elements = new WeakMap(), _Board_length = new WeakMap(), _Board_height = new WeakMap(), _Board_instances = new WeakSet(), _Board_stylish = function _Board_stylish(id, className) {
    let boardDiv = document.createElement("div");
    bg.className = className;
    let canvas = document.createElement("canvas");
    boardCanvas = canvas;
    boardDiv.appendChild(boardCanvas);
    boardDiv.id = "board";
    const width = 100 + 200 * __classPrivateFieldGet(this, _Board_length, "f");
    const height = 100 + 200 * __classPrivateFieldGet(this, _Board_height, "f");
    boardDiv.style.height = `${height}px`;
    boardDiv.style.width = `${width}px`;
    boardCanvas.width = width;
    boardCanvas.height = height;
    boardDiv.style.left = "0px";
    boardDiv.style.position = "absolute";
    for (let i = 0; i < __classPrivateFieldGet(this, _Board_elements, "f").length; i++) {
        let elm = __classPrivateFieldGet(this, _Board_elements, "f")[i];
        if (i < __classPrivateFieldGet(this, _Board_elements, "f").length - 1) {
            let nextElm;
            if (elm.nextId === undefined) {
                nextElm = __classPrivateFieldGet(this, _Board_elements, "f")[i + 1];
            }
            else {
                nextElm = __classPrivateFieldGet(this, _Board_elements, "f")[elm.nextId];
            }
            let nextPos;
            if (elm.nextSide === undefined) {
                nextPos = nextElm.beginPos;
            }
            else {
                nextPos = nextElm.getSide(elm.nextSide);
            }
            if (elm.type === "intersection") {
                const config = elm.intersection;
                drawIntersectionLines(elm, __classPrivateFieldGet(this, _Board_elements, "f")[config.leftId].beginPos, __classPrivateFieldGet(this, _Board_elements, "f")[config.rightId].beginPos, "#ffd700", { radius: elm.getDefaultRadius(nextElm), convex: elm.convex === undefined ? true : elm.convex });
            }
            else {
                let from = elm.endPos;
                if (elm.fromSide !== undefined) {
                    from = elm.getSide(elm.fromSide);
                }
                if (elm.convex === undefined) {
                    drawLine(from, nextPos, "#ffd700");
                }
                else {
                    drawLine(from, nextPos, "#ffd700", { radius: elm.getDefaultRadius(nextElm), convex: elm.convex });
                }
            }
        }
        boardDiv.appendChild(elm.createHtmlElement(i));
    }
    document.body.appendChild(boardDiv);
    switch (id) {
        case 0:
            const statue = createWonderImg("case.15", "mayor.png", {
                heightModifier: (x) => 2 * x,
                leftModifier: (x) => x + 100,
                topModifier: (x) => x - 50,
            });
            statue.className = "glow";
            boardDiv.appendChild(statue);
            statue.onload = () => wonderHelpBox(statue, boardDiv, "Statue de la mairesse", 25000, 0, 0);
            break;
        case 1:
            const bridge = createWonderImg("case.18", "longBridge.png", {
                leftModifier: (x) => x + 65,
                topModifier: (x) => x + 20,
                widthModifier: (x) => 10 * x
            });
            bridge.style.zIndex = "1";
            boardDiv.appendChild(bridge);
            bridge.onload = () => wonderHelpBox(bridge, boardDiv, "Pont de tissu", 1200, 30000, 0);
            const teleporter = createWonderImg("case.37", "tel.png", {
                leftModifier: (x) => x - 50,
                topModifier: (x) => x + 100,
                heightModifier: (x) => 2 * x,
            });
            teleporter.id = "teleporter";
            boardDiv.appendChild(teleporter);
            teleporter.onload = () => wonderHelpBox(teleporter, boardDiv, "Téléporteur de tissu", 10000, 10000, 0);
            const dress = createWonderImg("case.21", "gold.png", {
                leftModifier: (x) => x - 200,
                heightModifier: (x) => 2 * x,
                topModifier: (x) => x - 50
            });
            dress.className = "glow";
            boardDiv.appendChild(dress);
            dress.onload = () => wonderHelpBox(dress, boardDiv, "Robe maitresse", 7500, 20000, 0);
            break;
        case 2:
            const comet = createWonderImg("case.33", "mother.png", {
                topModifier: (x) => x - 300,
                leftModifier: (x) => x + 50,
                heightModifier: (x) => 3 * x,
            });
            comet.id = "comet";
            comet.onload = () => wonderHelpBox(comet, boardDiv, "Comète mère", 0, 0, 40000);
            const trail = document.createElement("div");
            trail.id = "comet-trail";
            boardDiv.appendChild(comet);
            boardDiv.appendChild(trail);
            const bank = createWonderImg("case.25", "moonBank.png", {
                topModifier: (x) => x - 150,
                leftModifier: (x) => x - 450,
                heightModifier: (x) => 3 * x
            });
            bank.id = "moon";
            boardDiv.appendChild(bank);
            bank.onload = () => wonderHelpBox(bank, boardDiv, "Banque municipale", 15000, 0, 15000);
            const planet = createWonderImg("case.10", "planet.png", {
                leftModifier: (x) => x + 200,
                heightModifier: (x) => 2 * x
            });
            planet.id = "planet";
            planet.style.zIndex = "1";
            boardDiv.appendChild(planet);
            planet.onload = () => wonderHelpBox(planet, boardDiv, "Astropy", 4000, 0, 20000);
    }
}, _Board_board0 = function _Board_board0() {
    return {
        elements: Array(new Case(0, 3, "start"), new Case(1, 3, "blueCoin"), new Case(2, 3, "event"), new Case(3, 3, "redCoin"), new Case(4, 3, "aquisition"), new Case(5, 3, "ladder").withCaseConfig({ ladderDestination: 28 }), new Case(6, 3, "blueCoin"), new Case(7, 3, "blueCoin"), new Case(8, 3, "redCoin"), new Case(9, 3, "aquisition"), new Case(10, 3, "dice"), new Case(11, 3, "redCoin"), new Case(12, 3, "redCoin"), new Case(13, 3, "dice"), new Case(14, 3, "aquisition", "straight").withCaseConfig({ convex: true }), new Case(15, 2, "wonder", "upwards").withCaseConfig({ convex: false, wonderName: "statue" }), new Case(14, 1, "duel", "backwards"), new Case(13, 1, "aquisition", "backwards"), new Case(12, 1, "event", "backwards"), new Case(11, 1, "dice", "backwards"), new Case(10, 1, "piggy", "backwards"), new Case(9, 1, "piggy", "backwards"), new Case(8, 1, "aquisition", "backwards"), new Case(7, 1, "sale", "backwards"), new Case(6, 1, "redCoin", "backwards"), new Case(5, 1, "item", "backwards"), new Case(4, 1, "item", "backwards"), new Case(3, 1, "duel", "backwards"), new Case(2, 1, "ladder", "backwards").withCaseConfig({ ladderDestination: 5 }), new Case(1, 1, "event", "backwards"), new Case(0, 1, "teleporter", "backwards").withCaseConfig({ nextId: 0 })),
        length: 16,
        height: 4,
        class: "cityBG",
    };
}, _Board_board1 = function _Board_board1() {
    return {
        elements: Array(new Case(0, 4, "start"), new Case(1, 4, "aquisition"), new Case(2, 4, "aquisition", "straight").withCaseConfig({ convex: true }), new Case(3, 3, "blueRibbon", "upwards"), new Case(3, 2, "item", "upwards"), new Case(3, 1, "saleRibbon", "upwards").withCaseConfig({ convex: false }), new Case(4, 0, "ladder", "straight").withCaseConfig({ convex: false, ladderDestination: 17 }), new Case(5, 1, "blueRibbon", "downwards"), new Case(5, 2, "sale", "downwards"), new Case(5, 3, "duel", "downwards").withCaseConfig({ convex: true }), new Case(6, 4, "event", "straight").withCaseConfig({ convex: true }), new Case(7, 3, "piggy", "upwards"), new Case(7, 2, "aquisition", "upwards"), new Case(7, 1, "redRibbon", "upwards").withCaseConfig({ convex: false }), new Case(8, 0, "redRibbon"), new Case(9, 0, "blueRibbon"), new Case(10, 0, "aquisition"), new Case(11, 0, "ladder", "straight").withCaseConfig({ ladderDestination: 6 }), new Case(12, 0, "ladder", "straight").withCaseConfig({ ladderDestination: 36, convex: false }), new Case(13, 1, "intersection", "downwards").withCaseConfig({ intersectionConfig: { leftId: 20, rightId: 23 }, convex: false }), new Case(12, 2, "blueCoin", "downwards"), new Case(12, 3, "wonder", "downwards").withCaseConfig({ wonderName: "dress" }), new Case(12, 4, "redCoin", "downwards").withCaseConfig({ nextId: 26, convex: true, targetSide: "left" }), new Case(14, 2, "redRibbon", "downwards"), new Case(14, 3, "wonder", "downwards").withCaseConfig({ wonderName: "bridge" }), new Case(14, 4, "blueRibbon", "downwards").withCaseConfig({ convex: true, targetSide: "right" }), new Case(13, 5, "aquisition", "downwards").withCaseConfig({ convex: true }), new Case(14, 6, "event"), new Case(15, 6, "event"), new Case(16, 6, "saleRibbon"), new Case(17, 6, "sale", "straight").withCaseConfig({ convex: true }), new Case(18, 5, "item", "upwards"), new Case(18, 4, "aquisition", "upwards"), new Case(18, 3, "blueRibbon", "upwards"), new Case(18, 2, "blueCoin", "upwards"), new Case(18, 1, "piggy", "upwards").withCaseConfig({ convex: false }), new Case(19, 0, "ladder", "straight").withCaseConfig({ ladderDestination: 18 }), new Case(20, 0, "teleporter", "straight").withCaseConfig({ convex: false }), new Case(21, 1, "wonder", "downwards").withCaseConfig({ wonderName: "teleporter" }), new Case(21, 2, "event", "downwards"), new Case(21, 3, "duel", "downwards"), new Case(21, 4, "event", "downwards"), new Case(21, 5, "sale", "downwards"), new Case(21, 6, "ladder", "downwards").withCaseConfig({ nextId: 0, ladderDestination: 0 })),
        length: 22,
        height: 7,
        class: "ribbonBG",
    };
}, _Board_board2 = function _Board_board2() {
    return {
        elements: Array(new Case(3, 15, "startRotate", "upwards"), new Case(3, 14, "intersection", "upwards").withCaseConfig({ intersectionConfig: { leftId: 2, rightId: 16 }, convex: true }), new Case(2, 13, "event", "upwards").withCaseConfig({ convex: true, fromSide: "left" }), new Case(1, 12, "intersection", "upwards").withCaseConfig({ intersectionConfig: { leftId: 4, rightId: 8 } }), new Case(0, 11, "redStar", "upwards"), new Case(0, 10, "saleStar", "upwards"), new Case(0, 9, "aquisition", "upwards"), new Case(0, 8, "redStar", "upwards").withCaseConfig({ nextId: 12, convex: false, targetSide: "left" }), new Case(2, 11, "blueStar", "upwards"), new Case(2, 10, "blueStar", "upwards"), new Case(2, 9, "wonder", "upwards").withCaseConfig({ wonderName: "astropy" }), new Case(2, 8, "aquisition", "upwards").withCaseConfig({ convex: false, targetSide: "right" }), new Case(1, 7, "duel", "upwards"), new Case(1, 6, "redStar", "upwards").withCaseConfig({ convex: false, targetSide: "left" }), new Case(2, 5, "piggy", "upwards"), new Case(2, 4, "item", "upwards").withCaseConfig({ convex: false, nextId: 38, targetSide: "left" }), new Case(4, 13, "aquisition", "upwards").withCaseConfig({ convex: true, fromSide: "right" }), new Case(5, 12, "saleStar", "upwards").withCaseConfig({ convex: true, fromSide: "right" }), new Case(6, 11, "intersection", "upwards").withCaseConfig({ intersectionConfig: { leftId: 19, rightId: 23 } }), new Case(5, 10, "blueStar", "upwards"), new Case(5, 9, "aquisition", "upwards"), new Case(5, 8, "sale", "upwards"), new Case(5, 7, "redStar", "upwards").withCaseConfig({ convex: false, nextId: 29 }), new Case(7, 10, "duel", "upwards").withCaseConfig({ convex: true, fromSide: "right" }), new Case(8, 9, "event", "upwards").withCaseConfig({ convex: true, fromSide: "right" }), new Case(9, 8, "wonder", "upwards").withCaseConfig({ convex: false, wonderName: "bank", targetSide: "right" }), new Case(8, 7, "redCoin", "upwards").withCaseConfig({ convex: false }), new Case(7, 6, "blueCoin", "backwards").withCaseConfig({ convex: false, fromSide: "top", targetSide: "right" }), new Case(6, 5, "piggy", "backwards").withCaseConfig({ targetSide: "right" }), new Case(5, 5, "event", "upwards"), new Case(5, 4, "intersection", "upwards").withCaseConfig({ intersectionConfig: { leftId: 38, rightId: 31 } }), new Case(6, 3, "redStar", "upwards").withCaseConfig({ fromSide: "right" }), new Case(7, 3, "redStar").withCaseConfig({ convex: true }), new Case(8, 2, "wonder", "upwards").withCaseConfig({ convex: false, wonderName: "comet" }), new Case(7, 1, "redStar", "backwards"), new Case(6, 1, "redStar", "backwards").withCaseConfig({ convex: false }), new Case(5, 2, "redStar", "downwards").withCaseConfig({ convex: true }), new Case(4, 3, "item", "backwards").withCaseConfig({ targetSide: "right" }), new Case(3, 3, "event", "upwards"), new Case(3, 2, "end", "upwards")),
        length: 9,
        height: 16,
        class: "spaceBG"
    };
};
function drawLine(from, to, color, arcConfig) {
    if (boardCanvas === undefined) {
        console.log("can't draw lines because board's canvas is undefined");
        return;
    }
    const canvas = boardCanvas;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(from.x, from.y);
    if (arcConfig === undefined) {
        context.lineTo(to.x, to.y);
    }
    else {
        if (from.y > to.y && arcConfig.convex || from.y < to.y && !arcConfig.convex) {
            context.arcTo(to.x, from.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        }
        else {
            context.arcTo(from.x, to.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        }
    }
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.stroke();
}
function drawIntersectionLines(elm, leftPos, rightPos, color, arcConfig) {
    if (elm.type !== "intersection") {
        console.log("ERROR: tried to draw intersections lines on wrong case type -- aborting");
        return;
    }
    if (boardCanvas === undefined) {
        console.log("can't draw lines because board's canvas is undefined");
        return;
    }
    const canvas = boardCanvas;
    const context = canvas.getContext("2d");
    context.beginPath();
    for (const t of [new Tuple(elm.getSide("left"), leftPos), new Tuple(elm.getSide("right"), rightPos)]) {
        const from = t.first;
        const to = t.second;
        context.moveTo(from.x, from.y);
        if (from.y > to.y && arcConfig.convex || from.y < to.y && !arcConfig.convex) {
            context.arcTo(to.x, from.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        }
        else {
            context.arcTo(from.x, to.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        }
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.stroke();
    }
}
function createWonderImg(refElmId, name, style) {
    const elmStyle = getComputedStyle(document.getElementById(refElmId));
    const elm = document.createElement("img");
    elm.src = assets_link(`wonders/${name}`);
    let height = parseInt(elmStyle.width);
    let width = height;
    if (style.heightModifier !== undefined) {
        height = style.heightModifier(height);
    }
    if (style.widthModifier !== undefined) {
        width = style.widthModifier(width);
    }
    let left = parseInt(elmStyle.left);
    if (style.leftModifier !== undefined) {
        left = style.leftModifier(left);
    }
    let top = parseInt(elmStyle.top);
    if (style.topModifier !== undefined) {
        top = style.topModifier(top);
    }
    elm.style.height = `${height}px`;
    if (style.widthModifier !== undefined) {
        elm.style.width = `${width}px`;
    }
    elm.style.position = "absolute";
    elm.style.left = `${left}px`;
    elm.style.top = `${top}px`;
    elm.style.zIndex = "2";
    return elm;
}
function wonderHelpBox(refElm, boardDiv, name, coins, ribbons, stars) {
    const box = document.createElement("div");
    box.style.padding = "10px";
    box.style.borderRadius = "10px";
    box.style.position = "absolute";
    const style = getComputedStyle(refElm);
    box.style.left = `${parseInt(style.left) + refElm.offsetWidth + 50}px`;
    box.style.top = refElm.style.top;
    box.style.backgroundColor = "#ffec7d";
    box.style.zIndex = "5";
    box.innerHTML = boxInnerHtml(name, coins, ribbons, stars);
    refElm.addEventListener("mouseenter", () => boardDiv.appendChild(box));
    refElm.addEventListener("mouseleave", () => boardDiv.removeChild(box));
}
function boxInnerHtml(name, coin, ribbon, star) {
    return `
        <p style="font-size: 20px; text-align: center">${name}</p>
        <div style="display: flex; justify-content: center; align-items: center">
            <img src=${assets_link("icons/coin.png")} style="width: 2vw; margin: 1vw;">
            <p style="font-size: 15px">${coin}</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center">
            <img src=${assets_link("icons/ribbon.png")} style="width: 2vw; margin: 1vw;">
            <p style="font-size: 15px">${ribbon}</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center">
            <img src=${assets_link("icons/star.png")} style="width: 2vw; margin: 1vw;">
            <p style="font-size: 15px">${star}</p>
        </div>
    `;
}
