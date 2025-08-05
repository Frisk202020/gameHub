import { Position } from "../util/Position.js";
import { BoardElement } from "./BoardElement.js";
import { Case } from "./Case.js";

export class Intersection extends BoardElement {
    #beginPos: Position;
    #endPos: Position;
    #cases: Array<Case>;

    constructor(beginPos: Position, endPos: Position, cases: Array<Case>) {
        super();
        this.#beginPos = beginPos;
        this.#endPos = endPos;
        this.#cases = cases;
    }

    get beginPos() {
        return this.#beginPos;
    }

    get endPos() {
        return this.#endPos;
    }
}