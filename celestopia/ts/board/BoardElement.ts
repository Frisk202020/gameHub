import { boardCanvas } from "./Board.js";
import { defaultCasePadding } from "./Case.js";
import { Position } from "../util/Position.js";

interface ArcConfig {
    radius: number,
    convex: boolean,
}

export type WalkWay = "straight" | "backwards" | "upwards" | "downwards";

export abstract class BoardElement {
    protected walkWay: WalkWay;
    constructor(way?: WalkWay) { this.walkWay = way === undefined ? "straight" : way; }

    drawLine(other: BoardElement, color: string, arcConfig?: ArcConfig): void {
        if (boardCanvas === undefined) {
            console.log("can't draw lines because board's canvas is undefined");
            return;
        }

        const canvas = boardCanvas;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        const fromPos = this.endPos;
        const toPos = other.beginPos;

        context.beginPath();
        context.moveTo(fromPos.x, fromPos.y);
        
        if (arcConfig === undefined) {
            context.lineTo(toPos.x, toPos.y);
        } else {    
            if (fromPos.y > toPos.y && arcConfig.convex || fromPos.y < toPos.y && !arcConfig.convex) {
                context.arcTo(toPos.x, fromPos.y, toPos.x, toPos.y, arcConfig.radius + defaultCasePadding);
            } else {
                context.arcTo(fromPos.x, toPos.y, toPos.x, toPos.y, arcConfig.radius + defaultCasePadding);
            }
        }
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.stroke();
    }

    abstract get beginPos(): Position;
    abstract get endPos(): Position;
}