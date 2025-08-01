export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    translate(x: number, y: number) {
        return new Position(this.x + x, this.y + y);
    }

    difference(other: Position) {
        return new Position(this.x - other.x, this.y - other.y);
    }

    divideMut(z: number) {
        this.x /= z;
        this.y /= z;
    }

    translateMut(other: Position) {
        this.x += other.x;
        this.y += other.y;
    }
}