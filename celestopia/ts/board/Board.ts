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
    elements: Array<BoardElement>;
    background: BoardBackground;
    length: number;
    height: number;

    constructor(id: BoardId) {
        let board: BoardConstructor;

        switch(id) {
            case 0: board = this.#board0(); break;
            case 1: board = this.#board2(); break;
            case 2: board = this.#board3();
        }

        this.elements = board.elements;
        this.background = board.background;
        this.height = board.height;
        this.length = board.length;

        this.#stylish();
    }

    #stylish(): void {
        let boardDiv = document.createElement("div");

        let canvas = document.createElement("canvas");
        boardCanvas = canvas;
        boardDiv.appendChild(boardCanvas);

        boardDiv.id = "board";
        boardDiv.style.backgroundColor = "grey";

        const width = 100 + 200 * this.length;
        const height = 100 + 200 * this.height;
        boardDiv.style.height = `${height}px`;
        boardDiv.style.width = `${width}px`
        boardCanvas.width = width;
        boardCanvas.height = height;

        boardDiv.style.bottom = "0px";
        boardDiv.style.left = "0px";
        boardDiv.style.position = "absolute";

        for (let i = 0; i < this.elements.length; i++) {
            let elm = this.elements[i];
            if (elm instanceof Case) {
                if (i < this.elements.length - 1) {
                    const nextElm = this.elements[i + 1];

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
                new Case(new Position(0, 0), "start"), new Case(new Position(1, 0), "mail"), new Case(new Position(2, 0), "greenCoin"),
                new Case(new Position(3, 0), "3Mail"), new Case(new Position(4, 0), "aquisition"), new Case(new Position(5, 0), "ladder"),
                new Case(new Position(6, 0), "blueCoin"), new Case(new Position(7, 0), "blueCoin"), new Case(new Position(8, 0), "redCoin"),
                new Case(new Position(9, 0), "mail"), new Case(new Position(10, 0), "5Mail"), new Case(new Position(11, 0), "redCoin"),
                new Case(new Position(12, 0), "redCoin"), new Case(new Position(13, 0), "dice"), new Case(new Position(14, 0), "aquisition"),
                new Case(new Position(15, 1), "wonder", "vertiacal-backwards"), new Case(new Position(14, 2), "duel", "backwards"), new Case(new Position(13, 2), "furnace", "backwards"), 
                new Case(new Position(12, 2), "greenCoin", "backwards"), new Case(new Position(11, 2), "dice", "backwards"), new Case(new Position(10, 2), "piggy", "backwards"),
                new Case(new Position(9, 2), "piggy", "backwards"), new Case(new Position(8, 2), "aquisition", "backwards"), new Case(new Position(7, 2), "sale", "backwards"),
                new Case(new Position(6, 2), "redCoin", "backwards"), new Case(new Position(5, 2), "greenCoin", "backwards"), new Case(new Position(4, 2), "redCoin", "backwards"),
                new Case(new Position(3, 2), "duel", "backwards"), new Case(new Position(2, 2), "ladder", "backwards"), new Case(new Position(1, 2), "postBox", "backwards"), 
                new Case(new Position(0, 2), "teleporter", "backwards", 0)
            ),
            background: "Banlieue",
            length: 16,
            height: 3,
        };
    }

    // TODO
    #board2(): BoardConstructor {
        return {
            elements: Array(),
            background: "Quartier chic",
            length: 0,
            height: 0,
        }
    }

    // TODO
    #board3(): BoardConstructor {
        return {
            elements: Array(),
            background: "Spatioport",
            length: 0,
            height: 0,
        }
    }
}

interface BoardConstructor {
    elements: Array<BoardElement>
    background: BoardBackground;
    length: number;
    height: number;
}