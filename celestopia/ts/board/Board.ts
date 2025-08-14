import { Case, defaultCasePadding, IntersectionConfig } from "./Case.js";
import { Position } from "../util/Position.js";
import { Tuple } from "../util/tuple.js";

export type BoardId = 0 | 1 | 2;
export function buildBoard(id: BoardId) {
    return new Board(id);
}
export let boardCanvas: HTMLCanvasElement | undefined;
const bg = document.getElementById("bg") as HTMLDivElement;

interface ArcConfig {
    radius: number,
    convex: boolean,
}

class Board {
    #elements: Array<Case>;
    #length: number;
    #height: number;

    constructor(id: BoardId) {
        let board: BoardConstructor;
        let b_id: BoardId = 0;

        switch(id) {
            case 0: board = this.#board0(); break;
            case 1: board = this.#board1(); b_id = 1; break;
            case 2: board = this.#board2(); b_id = 2;
        }

        this.#elements = board.elements;
        this.#height = board.height;
        this.#length = board.length;

        this.#stylish(b_id, board.class);
    }

    get elements() {
        return this.#elements;
    } get height() {
        return this.#height;
    }

    #stylish(id: BoardId, className: string): void {
        let boardDiv = document.createElement("div");
        bg.className = className;

        let canvas = document.createElement("canvas");
        boardCanvas = canvas;
        boardDiv.appendChild(boardCanvas);

        boardDiv.id = "board";
        const width = 100 + 200 * this.#length;
        const height = 100 + 200 * this.#height;
        boardDiv.style.height = `${height}px`;
        boardDiv.style.width = `${width}px`
        boardCanvas.width = width;
        boardCanvas.height = height;

        boardDiv.style.left = "0px";
        boardDiv.style.position = "absolute";

        for (let i = 0; i < this.#elements.length; i++) {
            let elm = this.#elements[i];
            if (i < this.#elements.length - 1) {
                let nextElm: Case;
                if (elm.nextId === undefined) {
                    nextElm = this.#elements[i + 1];
                } else {
                    nextElm = this.#elements[elm.nextId];
                }
                let nextPos: Position;
                if (elm.nextSide === undefined) {
                    nextPos = nextElm.beginPos;
                } else {
                    nextPos = nextElm.getSide(elm.nextSide);
                }

                if (elm.type === "intersection") {
                    const config = (elm as any).intersection as IntersectionConfig;
                    drawIntersectionLines(
                        elm, 
                        this.#elements[config.leftId].beginPos, 
                        this.#elements[config.rightId].beginPos, 
                        "#ffd700", 
                        {radius: elm.getDefaultRadius(nextElm), convex: elm.convex === undefined ? true : elm.convex}
                    );
                } else {
                    let from = elm.endPos;
                    if (elm.fromSide !== undefined) {
                        from = elm.getSide(elm.fromSide);
                    }
                    if (elm.convex === undefined) {
                        drawLine(from, nextPos, "#ffd700");
                    } else {
                        drawLine(from, nextPos, "#ffd700", { radius: elm.getDefaultRadius(nextElm), convex: elm.convex })
                    }
                }
            }
            
            boardDiv.appendChild(elm.createHtmlElement(i));
        }

        document.body.appendChild(boardDiv);

        switch(id) {
            case 0:
                const statue = createWonderImg(
                    "case.15",
                    "mayor.png",
                    {
                        heightModifier: (x)=>2*x,
                        leftModifier: (x)=>x+100,
                        topModifier: (x)=>x-50,
                    }
                );
                statue.className = "glow";
                boardDiv.appendChild(statue);
                break;
            case 1:
                const bridge = createWonderImg(
                    "case.18",
                    "longBridge.png",
                    {
                        leftModifier: (x)=>x+65,
                        topModifier: (x)=>x+20,
                        widthModifier: (x)=>10*x
                    }
                )
                bridge.style.zIndex = "1";
                boardDiv.appendChild(bridge);

                const teleporter = createWonderImg(
                    "case.37",
                    "tel.png",
                    {
                        leftModifier: (x)=>x-50,
                        topModifier: (x)=>x+100,
                        heightModifier: (x)=>2*x,
                    }
                )
                teleporter.id = "teleporter";
                boardDiv.appendChild(teleporter);

                const dress = createWonderImg(
                    "case.21",
                    "gold.png",
                    {
                        leftModifier: (x)=>x-200,
                        heightModifier: (x)=>2*x,
                        topModifier: (x)=>x-50
                    }
                )
                dress.className = "glow";
                boardDiv.appendChild(dress);
                break;
            case 2:
                (document.getElementById("case.0") as HTMLElement).className = "rotate270";

                const comet = createWonderImg(
                    "case.33",
                    "mother.png",
                    {
                        topModifier: (x)=>x-300,
                        leftModifier: (x)=>x+50,
                        heightModifier: (x)=>3*x,
                    }
                );
                comet.id = "comet";

                const trail = document.createElement("div");
                trail.id = "comet-trail";
                boardDiv.appendChild(comet);
                boardDiv.appendChild(trail);

                const bank = createWonderImg(
                    "case.25",
                    "moonBank.png",
                    {
                        topModifier: (x)=>x-150,
                        leftModifier: (x)=>x-450,
                        heightModifier: (x)=>3*x
                    }
                );
                bank.id = "moon";
                boardDiv.appendChild(bank);

                const planet = createWonderImg(
                    "case.10",
                    "planet.png",
                    {
                        leftModifier: (x)=>x+200,
                        heightModifier: (x)=>2*x
                    }
                );
                planet.id = "planet";
                planet.style.zIndex = "1";
                boardDiv.appendChild(planet);
        }
    }

    #board0(): BoardConstructor {
        return {
            elements: Array(
                new Case(0, 3, "start"),
                new Case(1, 3, "mail"),
                new Case(2, 3, "greenEvent"),
                new Case(3, 3, "3Mail"),
                new Case(4, 3, "aquisition"),
                new Case(5, 3, "ladder").withCaseConfig({ ladderDestination: 28 }),
                new Case(6, 3, "blueCoin"),
                new Case(7, 3, "blueCoin"),
                new Case(8, 3, "redCoin"),
                new Case(9, 3, "mail"),
                new Case(10, 3, "5Mail"),
                new Case(11, 3, "redCoin"),
                new Case(12, 3, "redCoin"),
                new Case(13, 3, "dice"),
                new Case(14, 3, "aquisition", "straight").withCaseConfig({ convex: true }),
                new Case(15, 2, "wonder", "upwards").withCaseConfig({ convex: false, wonderName: "statue" }),
                new Case(14, 1, "duel", "backwards"),
                new Case(13, 1, "furnace", "backwards"),
                new Case(12, 1, "greenEvent", "backwards"),
                new Case(11, 1, "dice", "backwards"),
                new Case(10, 1, "piggy", "backwards"),
                new Case(9, 1, "piggy", "backwards"),
                new Case(8, 1, "aquisition", "backwards"),
                new Case(7, 1, "sale", "backwards"),
                new Case(6, 1, "redCoin", "backwards"),
                new Case(5, 1, "item", "backwards"),
                new Case(4, 1, "item", "backwards"),
                new Case(3, 1, "duel", "backwards"),
                new Case(2, 1, "ladder", "backwards").withCaseConfig({ ladderDestination: 5 }),
                new Case(1, 1, "postBox", "backwards"),
                new Case(0, 1, "teleporter", "backwards").withCaseConfig({ nextId: 0 })
            ),
            length: 16,
            height: 4,
            class: "cityBG",
        };
    }

    #board1(): BoardConstructor {
        return {
            elements: Array(
                new Case(0, 4, "start"),
                new Case(1, 4, "aquisition"),
                new Case(2, 4, "aquisition", "straight").withCaseConfig({ convex: true }),
                new Case(3, 3, "blueCoin", "upwards"),
                new Case(3, 2, "item", "upwards"),
                new Case(3, 1, "saleRibbon", "upwards").withCaseConfig({ convex: false }),
                new Case(4, 0, "ladder", "straight").withCaseConfig({ convex: false, ladderDestination: 17 }),
                new Case(5, 1, "postBox", "downwards"),
                new Case(5, 2, "sale", "downwards"),
                new Case(5, 3, "duel", "downwards").withCaseConfig({ convex: true }),
                new Case(6, 4, "greenEvent", "straight").withCaseConfig({ convex: true }),
                new Case(7, 3, "piggy", "upwards"),
                new Case(7, 2, "3Mail", "upwards"),
                new Case(7, 1, "redCoin", "upwards").withCaseConfig({ convex: false }),
                new Case(8, 0, "redCoin"),
                new Case(9, 0, "blueCoin"),
                new Case(10, 0, "aquisition"),
                new Case(11, 0, "ladder", "straight").withCaseConfig({ ladderDestination: 6 }),
                new Case(12, 0, "ladder", "straight").withCaseConfig({ ladderDestination: 36, convex: false }),
                new Case(13, 1, "intersection", "downwards").withCaseConfig({ intersectionConfig: { leftId: 20, rightId: 23 }, convex: false }),
                new Case(12, 2, "blueCoin", "downwards"),
                new Case(12, 3, "wonder", "downwards").withCaseConfig({ wonderName: "dress" }),
                new Case(12, 4, "redCoin", "downwards").withCaseConfig({ nextId: 26, convex: true, targetSide: "left" }),
                new Case(14, 2, "redCoin", "downwards"),
                new Case(14, 3, "wonder", "downwards").withCaseConfig({ wonderName: "bridge" }),
                new Case(14, 4, "blueCoin", "downwards").withCaseConfig({ convex: true, targetSide: "right" }),
                new Case(13, 5, "aquisition", "downwards").withCaseConfig({ convex: true }),
                new Case(14, 6, "greenEvent"),
                new Case(15, 6, "greenEvent"),
                new Case(16, 6, "saleRibbon"),
                new Case(17, 6, "furnace", "straight").withCaseConfig({ convex: true }),
                new Case(18, 5, "item", "upwards"),
                new Case(18, 4, "mail", "upwards"),
                new Case(18, 3, "5Mail", "upwards"),
                new Case(18, 2, "postBox", "upwards"),
                new Case(18, 1, "piggy", "upwards").withCaseConfig({ convex: false }),
                new Case(19, 0, "ladder", "straight").withCaseConfig({ ladderDestination: 18 }),
                new Case(20, 0, "teleporter", "straight").withCaseConfig({ convex: false }),
                new Case(21, 1, "wonder", "downwards").withCaseConfig({wonderName: "teleporter"}),
                new Case(21, 2, "greenEvent", "downwards"),
                new Case(21, 3, "duel", "downwards"),
                new Case(21, 4, "greenEvent", "downwards"),
                new Case(21, 5, "sale", "downwards"),
                new Case(21, 6, "ladder", "downwards").withCaseConfig({ nextId: 0, ladderDestination: 0 })
            ),
            length: 22,
            height: 7,
            class: "ribbonBG",
        };
    }

    #board2(): BoardConstructor {
        return {
            elements: Array(
                new Case(3, 15, "start", "upwards"),
                new Case(3, 14, "intersection", "upwards").withCaseConfig({intersectionConfig: {leftId: 2, rightId: 16}, convex: true}),
                new Case(2, 13, "greenEvent", "upwards").withCaseConfig({convex: true, fromSide: "left"}),
                new Case(1, 12, "intersection", "upwards").withCaseConfig({intersectionConfig: {leftId: 4, rightId: 8}}),
                new Case(0, 11, "redStar", "upwards"),
                new Case(0, 10, "saleStar", "upwards"),
                new Case(0, 9, "5Mail", "upwards"),
                new Case(0, 8, "furnace", "upwards").withCaseConfig({nextId: 12, convex: false, targetSide: "left"}),
                new Case(2, 11, "star", "upwards"),
                new Case(2, 10, "star", "upwards"),
                new Case(2, 9, "wonder", "upwards").withCaseConfig({wonderName: "astropy"}),
                new Case(2, 8, "aquisition", "upwards").withCaseConfig({convex: false, targetSide: "right"}),
                new Case(1, 7, "duel", "upwards"),
                new Case(1, 6, "redStar", "upwards").withCaseConfig({convex: false, targetSide: "left"}),
                new Case(2, 5, "piggy", "upwards"),
                new Case(2, 4, "item", "upwards").withCaseConfig({convex: false, nextId: 38, targetSide: "left"}),
                new Case(4, 13, "aquisition", "upwards").withCaseConfig({convex: true, fromSide: "right"}),
                new Case(5, 12, "saleStar", "upwards").withCaseConfig({convex: true, fromSide: "right"}),
                new Case(6, 11, "intersection", "upwards").withCaseConfig({intersectionConfig: {leftId: 19, rightId: 23}}),
                new Case(5, 10, "star", "upwards"),
                new Case(5, 9, "furnace", "upwards"),
                new Case(5, 8, "sale", "upwards"),
                new Case(5, 7, "redStar", "upwards").withCaseConfig({convex: false, nextId: 29}),
                new Case(7, 10, "duel", "upwards").withCaseConfig({convex: true, fromSide: "right"}),  
                new Case(8, 9, "greenEvent", "upwards").withCaseConfig({convex: true, fromSide: "right"}),
                new Case(9, 8, "wonder", "upwards").withCaseConfig({convex: false, wonderName: "bank", targetSide: "right"}),
                new Case(8, 7, "redCoin", "upwards").withCaseConfig({convex: false}),
                new Case(7, 6, "blueCoin", "backwards").withCaseConfig({convex: false, fromSide: "top", targetSide: "right"}),
                new Case(6, 5, "piggy", "backwards").withCaseConfig({targetSide: "right"}),
                new Case(5, 5, "greenEvent", "upwards"),
                new Case(5, 4, "intersection", "upwards").withCaseConfig({intersectionConfig: {leftId: 38, rightId: 31}}),
                new Case(6, 3, "redStar", "upwards").withCaseConfig({fromSide: "right"}),
                new Case(7, 3, "redStar").withCaseConfig({convex: true}),
                new Case(8, 2, "wonder", "upwards").withCaseConfig({convex: false, wonderName: "comet"}),
                new Case(7, 1, "redStar", "backwards"),
                new Case(6, 1, "redStar", "backwards").withCaseConfig({convex: false}),
                new Case(5, 2, "redStar", "downwards").withCaseConfig({convex: true}),
                new Case(4, 3, "item", "backwards").withCaseConfig({targetSide: "right"}),
                new Case(3, 3, "postBox", "upwards"),
                new Case(3, 2, "end", "upwards")
            ),
            length: 9,
            height: 16,
            class: "spaceBG"
        }
    }
}

function drawLine(from: Position, to: Position, color: string, arcConfig?: ArcConfig): void {
    if (boardCanvas === undefined) {
        console.log("can't draw lines because board's canvas is undefined");
        return;
    }

    const canvas = boardCanvas;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(from.x, from.y);
    
    if (arcConfig === undefined) {
        context.lineTo(to.x, to.y);
    } else {    
        if (from.y > to.y && arcConfig.convex || from.y < to.y && !arcConfig.convex) {
            context.arcTo(to.x, from.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        } else {
            context.arcTo(from.x, to.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        }
    }
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.stroke();
}

function drawIntersectionLines(elm: Case, leftPos: Position, rightPos: Position, color: string, arcConfig: ArcConfig): void {
    if (elm.type !== "intersection") {
        console.log("ERROR: tried to draw intersections lines on wrong case type -- aborting");
        return;
    } 
    if (boardCanvas === undefined) {
        console.log("can't draw lines because board's canvas is undefined");
        return;
    }

    const canvas = boardCanvas;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.beginPath();

    for (const t of [new Tuple(elm.getSide("left"), leftPos), new Tuple(elm.getSide("right"), rightPos)]) {
        const from = t.first;
        const to = t.second;

        context.moveTo(from.x, from.y);
        if (from.y > to.y && arcConfig.convex || from.y < to.y && !arcConfig.convex) {
            context.arcTo(to.x, from.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        } else {
            context.arcTo(from.x, to.y, to.x, to.y, arcConfig.radius + defaultCasePadding);
        }

        context.strokeStyle = color;
        context.lineWidth = 5;
        context.stroke();
    }
}

interface BoardConstructor {
    elements: Array<Case>
    length: number;
    height: number;
    class: string;
}

interface ImgStyle {
    widthModifier?: (width: number)=>number;
    heightModifier?: (height: number)=>number;
    leftModifier?: (left: number)=>number;
    topModifier?: (top: number)=>number;
}

function createWonderImg(refElmId: string, name: string, style: ImgStyle) {
    const elmStyle = getComputedStyle(document.getElementById(refElmId) as HTMLElement);
    const elm = document.createElement("img");
    elm.src = `get_file/celestopia/assets/wonders/${name}`;

    let height = parseInt(elmStyle.width);
    let width = height;
    if (style.heightModifier !== undefined) { height = style.heightModifier(height); }

    if (style.widthModifier !== undefined) { width = style.widthModifier(width); }

    let left = parseInt(elmStyle.left);
    if (style.leftModifier !== undefined) { left = style.leftModifier(left); }

    let top = parseInt(elmStyle.top);
    if (style.topModifier !== undefined) { top = style.topModifier(top); }

    elm.style.height = `${height}px`;
    if (style.widthModifier !== undefined) { elm.style.width = `${width}px`; }
    elm.style.position = "absolute";
    elm.style.left = `${left}px`;
    elm.style.top = `${top}px`;
    elm.style.zIndex = "2";

    return elm; 
}