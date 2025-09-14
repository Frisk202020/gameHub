export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static new(x) {
        return new Position(x.left, x.top);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    translate(x, y) {
        return new Position(this.x + x, this.y + y);
    }
    difference(other) {
        return new Position(this.x - other.x, this.y - other.y);
    }
    divideMut(z) {
        this.x /= z;
        this.y /= z;
    }
    divide(z) {
        return new Position(this.x / z, this.y / z);
    }
    translateMut(other) {
        this.x += other.x;
        this.y += other.y;
    }
}
