import { boardCanvas } from "./Board.js";
import { defaultCasePadding } from "./Case.js";
import { Position } from "../util/Position.js";

export abstract class BoardElement {
    drawLine(other: BoardElement, color: string, radius?: number): void {
        if (boardCanvas === undefined) {
            console.log("can't draw lines because board's canvas is undefined");
            return;
        }

        const canvas = boardCanvas;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        const fromPos = this.getEndPos();
        const toPos = other.getBeginPos();

        context.beginPath();
        context.moveTo(fromPos.x, canvas.height - fromPos.y);
        
        if (radius === undefined) {
            context.lineTo(toPos.x, canvas.height - toPos.y);
        } else {    
            if (fromPos.x < toPos.x) {
                context.arcTo(toPos.x, canvas.height - fromPos.y, toPos.x, canvas.height - toPos.y, radius + defaultCasePadding);
            } else {
                context.arcTo(fromPos.x, canvas.height - toPos.y, toPos.x, canvas.height - toPos.y, radius + defaultCasePadding);
            }
        }
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.stroke();
    }

    abstract getBeginPos(): Position;
    abstract getEndPos(): Position;
}