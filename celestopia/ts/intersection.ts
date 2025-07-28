import { BoardElement } from "./boardElement.js";
import { Case } from "./case.js";
import { Position } from "./position.js";

export class Intersection extends BoardElement {
    beginPos: Position;
    endPos: Position;
    cases: Array<Case>;

    constructor(beginPos: Position, endPos: Position, cases: Array<Case>) {
        super();
        this.beginPos = beginPos;
        this.endPos = endPos;
        this.cases = cases;
    }

    getBeginPos(): Position {
        return this.beginPos;
    }

    getEndPos(): Position {
        return this.endPos;
    }
}