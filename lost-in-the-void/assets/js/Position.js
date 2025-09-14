export class Position{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    setPosition(elem){
        elem.style.left = this.x + "px";
        elem.style.bottom = this.y + "px";
    }

    static getPosFromElem(elem){
        let bounds = elem.getBoundingClientRect();
        return new Position(bounds.left, bounds.top);
    }
}