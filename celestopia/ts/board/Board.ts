import { Case } from "./Case.js";
import { Position } from "../util/Position.js";
import { BoardElement } from "./BoardElement.js";

export type BoardId = 0 | 1 | 2;
export function buildBoard(id: BoardId) {
    return new Board(id);
}
export let boardCanvas: HTMLCanvasElement | undefined;

type BoardBackground = "Banlieue" | "Quartier chic" | "Spatioport";

class Board {
    #elements: Array<BoardElement>;
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

        boardDiv.style.bottom = "0px";
        boardDiv.style.left = "0px";
        boardDiv.style.position = "absolute";

        for (let i = 0; i < this.#elements.length; i++) {
            let elm = this.#elements[i];
            if (elm instanceof Case) {
                if (i < this.#elements.length - 1) {
                    const nextElm = this.#elements[i + 1];

                    if (nextElm instanceof Case) {
                        if (nextElm.position.x === elm.position.x || nextElm.position.y === elm.position.y) {
                            elm.drawLine(nextElm, "#ffd700");
                        } else {
                            elm.drawLine(nextElm, "#ffd700", Math.abs(nextElm.uiPosition.y - elm.uiPosition.y) - elm.size/2);
                        }
                    }
                }
                boardDiv.appendChild(elm.createHtmlElement());
            } 
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
                new Case(new Position(5, 3), "ladder", undefined, undefined, 28),
                new Case(new Position(6, 3), "blueCoin"),
                new Case(new Position(7, 3), "blueCoin"),
                new Case(new Position(8, 3), "redCoin"),
                new Case(new Position(9, 3), "mail"),
                new Case(new Position(10, 3), "5Mail"),
                new Case(new Position(11, 3), "redCoin"),
                new Case(new Position(12, 3), "redCoin"),
                new Case(new Position(13, 3), "dice"),
                new Case(new Position(14, 3), "aquisition"),
                new Case(new Position(15, 2), "wonder", "vertical-backwards", undefined, undefined, "astropy"),
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
                new Case(new Position(2, 1), "ladder", "backwards", undefined, 5),
                new Case(new Position(1, 1), "postBox", "backwards"),
                new Case(new Position(0, 1), "teleporter", "backwards", 0)
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
                new Case(new Position(0, 1), "start"),
                new Case(new Position(1, 1), "aquisition"),
                new Case(new Position(2, 1), "aquisition"),
                new Case(new Position(3, 2), "blueCoin", "vertical-backwards"),
                new Case(new Position(3, 3), "item", "vertical-backwards"),
                new Case(new Position(3, 4), "saleRibbon", "vertical-backwards"),
                new Case(new Position(4, 5), "ladder"),
                new Case(new Position(5, 4), "postBox", "vertical"),
                new Case(new Position(5, 3), "sale", "vertical"),
                new Case(new Position(5, 2), "duel", "vertical"),
                new Case(new Position(6, 1), "greenEvent"),
                new Case(new Position(7, 2), "piggy", "vertical-backwards"),
                new Case(new Position(7, 3), "3Mail", "vertical-backwards"),
                new Case(new Position(7, 4), "redCoin", "vertical-backwards"),
                new Case(new Position(8, 5), "redCoin"),
                new Case(new Position(9, 5), "blueCoin"),
                new Case(new Position(10, 5), "aquisition"),
                new Case(new Position(11, 5), "ladder"),
                new Case(new Position(12, 5), "ladder"),
                new Case(new Position(11, 3), "blueCoin", "vertical-backwards"),
                new Case(new Position(11, 2), "wonder", "vertical-backwards", undefined, undefined, "dress"),
                new Case(new Position(11, 1), "redCoin", "vertical-backwards"),
                new Case(new Position(13, 3), "redCoin", "vertical-backwards"),
                new Case(new Position(13, 2), "wonder", "vertical-backwards", undefined, undefined, "bridge"),
                new Case(new Position(13, 1), "blueCoin", "vertical-backwards"),
                new Case(new Position(14, 0), "greenEvent"),
                new Case(new Position(15, 0), "saleRibbon"),
                new Case(new Position(16, 0), "furnace"),
                new Case(new Position(17, 1), "mail", "vertical"),
                new Case(new Position(18, 2), "5Mail", "vertical"),
                new Case(new Position(18, 3), "postBox", "vertical"),
                new Case(new Position(18, 4), "piggy", "vertical"),
                new Case(new Position(19, 5), "ladder"),
                new Case(new Position(20, 5), "teleporter"),
                new Case(new Position(21, 4), "furnace", "vertical-backwards"),
                new Case(new Position(21, 3), "greenEvent", "vertical-backwards"),
                new Case(new Position(21, 2), "duel", "vertical-backwards"),
                new Case(new Position(21, 1), "greenEvent", "vertical-backwards"),
                new Case(new Position(21, 0), "sale", "vertical-backwards"),
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

interface BoardConstructor {
    elements: Array<BoardElement>
    background: BoardBackground;
    length: number;
    height: number;
}