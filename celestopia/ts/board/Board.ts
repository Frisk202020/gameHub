import { Case, defaultCasePadding, IntersectionConfig } from "./Case.js";
import { Position } from "../util/Position.js";
import { Tuple } from "../util/tuple.js";

export type BoardId = 0 | 1 | 2;
export function buildBoard(id: BoardId) {
    return new Board(id);
}
export let boardCanvas: HTMLCanvasElement | undefined;

type BoardBackground = "Banlieue" | "Quartier chic" | "Spatioport";
interface ArcConfig {
    radius: number,
    convex: boolean,
}

class Board {
    #elements: Array<Case>;
    #background: BoardBackground;
    #length: number;
    #height: number;

    constructor(id: BoardId) {
        let board: BoardConstructor;

        switch(id) {
            case 0: board = this.#board0(); break;
            case 1: board = this.#board1(); break;
            case 2: board = this.#board2();
        }

        this.#elements = board.elements;
        this.#background = board.background;
        this.#height = board.height;
        this.#length = board.length;

        this.#stylish();
    }

    get elements() {
        return this.#elements;
    } get height() {
        return this.#height;
    }

    #stylish(): void {
        let boardDiv = document.createElement("div");

        let canvas = document.createElement("canvas");
        boardCanvas = canvas;
        boardDiv.appendChild(boardCanvas);

        boardDiv.id = "board";
        boardDiv.style.backgroundColor = "grey";

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
                        {radius: elm.getDefaultRadius(nextElm), convex: false}
                    );
                } else {
                    if (elm.convex === undefined) {
                        drawLine(elm.endPos, nextPos, "#ffd700");
                    } else {
                        drawLine(elm.endPos, nextPos, "#ffd700", { radius: elm.getDefaultRadius(nextElm), convex: elm.convex })
                    }
                }
            }
            boardDiv.appendChild(elm.createHtmlElement());
        }

        document.body.appendChild(boardDiv);
    }

    #board0(): BoardConstructor {
        return {
            elements: Array(
                new Case(new Position(0, 3), "start"),
                new Case(new Position(1, 3), "mail"),
                new Case(new Position(2, 3), "greenEvent"),
                new Case(new Position(3, 3), "3Mail"),
                new Case(new Position(4, 3), "aquisition"),
                new Case(new Position(5, 3), "ladder").withCaseConfig({ladderDestination: 28}),
                new Case(new Position(6, 3), "blueCoin"),
                new Case(new Position(7, 3), "blueCoin"),
                new Case(new Position(8, 3), "redCoin"),
                new Case(new Position(9, 3), "mail"),
                new Case(new Position(10, 3), "5Mail"),
                new Case(new Position(11, 3), "redCoin"),
                new Case(new Position(12, 3), "redCoin"),
                new Case(new Position(13, 3), "dice"),
                new Case(new Position(14, 3), "aquisition", "straight").withCaseConfig({convex: true}),
                new Case(new Position(15, 2), "wonder", "upwards").withCaseConfig({convex: false, wonderName: "astropy"}),
                new Case(new Position(14, 1), "duel", "backwards"),
                new Case(new Position(13, 1), "furnace", "backwards"),
                new Case(new Position(12, 1), "greenEvent", "backwards"),
                new Case(new Position(11, 1), "dice", "backwards"),
                new Case(new Position(10, 1), "piggy", "backwards"),
                new Case(new Position(9, 1), "piggy", "backwards"),
                new Case(new Position(8, 1), "aquisition", "backwards"),
                new Case(new Position(7, 1), "sale", "backwards"),
                new Case(new Position(6, 1), "redCoin", "backwards"),
                new Case(new Position(5, 1), "item", "backwards"),
                new Case(new Position(4, 1), "item", "backwards"),
                new Case(new Position(3, 1), "duel", "backwards"),
                new Case(new Position(2, 1), "ladder", "backwards").withCaseConfig({ladderDestination: 5}),
                new Case(new Position(1, 1), "postBox", "backwards"),
                new Case(new Position(0, 1), "teleporter", "backwards")
            ),
            background: "Banlieue",
            length: 16,
            height: 3,
        };
    }

    // TODO
    #board1(): BoardConstructor {
        return {
            elements: Array(
                new Case(new Position(0, 4), "start"),
                new Case(new Position(1, 4), "aquisition"),
                new Case(new Position(2, 4), "aquisition", "straight").withCaseConfig({convex: true}),
                new Case(new Position(3, 3), "blueCoin", "upwards"),
                new Case(new Position(3, 2), "item", "upwards"),
                new Case(new Position(3, 1), "saleRibbon", "upwards").withCaseConfig({convex: false}),
                new Case(new Position(4, 0), "ladder", "straight").withCaseConfig({convex: false, ladderDestination: 17}),
                new Case(new Position(5, 1), "postBox", "downwards"),
                new Case(new Position(5, 2), "sale", "downwards"),
                new Case(new Position(5, 3), "duel", "downwards").withCaseConfig({convex: true}),
                new Case(new Position(6, 4), "greenEvent", "straight").withCaseConfig({convex: true}),
                new Case(new Position(7, 3), "piggy", "upwards"),
                new Case(new Position(7, 2), "3Mail", "upwards"),
                new Case(new Position(7, 1), "redCoin", "upwards").withCaseConfig({convex: false}),
                new Case(new Position(8, 0), "redCoin"),
                new Case(new Position(9, 0), "blueCoin"),
                new Case(new Position(10, 0), "aquisition"),
                new Case(new Position(11, 0), "ladder", "straight").withCaseConfig({ladderDestination: 6}),
                new Case(new Position(12, 0), "ladder", "straight").withCaseConfig({ladderDestination: 32, convex: false}),
                new Case(new Position(13, 1), "intersection", "downwards").withCaseConfig({intersectionConfig: {leftId: 20, rightId: 23}}),
                new Case(new Position(12, 2), "blueCoin", "downwards"),
                new Case(new Position(12, 3), "wonder", "downwards").withCaseConfig({wonderName: "dress"}),
                new Case(new Position(12, 4), "redCoin", "downwards").withCaseConfig({nextId: 26, convex: true, targetSide: "left"}),
                new Case(new Position(14, 2), "redCoin", "downwards"),
                new Case(new Position(14, 3), "wonder", "downwards").withCaseConfig({wonderName: "bridge"}),
                new Case(new Position(14, 4), "blueCoin", "downwards").withCaseConfig({convex: true, targetSide: "right"}),
                new Case(new Position(13, 5), "aquisition", "downwards").withCaseConfig({convex: true}),
                new Case(new Position(14, 6), "greenEvent"),
                new Case(new Position(15, 6), "greenEvent"),
                new Case(new Position(16, 6), "saleRibbon"),
                new Case(new Position(17, 6), "furnace", "straight").withCaseConfig({convex: true}),
                new Case(new Position(18, 5), "item", "upwards"),
                new Case(new Position(18, 4), "mail", "upwards"),
                new Case(new Position(18, 3), "5Mail", "upwards"),
                new Case(new Position(18, 2), "postBox", "upwards"),
                new Case(new Position(18, 1), "piggy", "upwards").withCaseConfig({convex: false}),
                new Case(new Position(19, 0), "ladder", "straight").withCaseConfig({ladderDestination: 18}),
                new Case(new Position(20, 0), "teleporter", "straight").withCaseConfig({convex: false}),
                new Case(new Position(21, 1), "furnace", "downwards"),
                new Case(new Position(21, 2), "greenEvent", "downwards"),
                new Case(new Position(21, 3), "duel", "downwards"),
                new Case(new Position(21, 4), "greenEvent", "downwards"),
                new Case(new Position(21, 5), "sale", "downwards"),
            ),
            background: "Banlieue",
            length: 22,
            height: 6,
        };
    }

    // TODO
    #board2(): BoardConstructor {
        return {
            elements: Array(),
            background: "Spatioport",
            length: 0,
            height: 0
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
    background: BoardBackground;
    length: number;
    height: number;
}