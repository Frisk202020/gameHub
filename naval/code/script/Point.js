export class Point{
    constructor(arr){
        this.x = Number(arr[0]);
        this.y = Number(arr[1]);
    }

    transpose(){
        let z = this.x;
        this.x = this.y;
        this.y = z;
    }

    isBorder(){
        return this.x == 0 || this.y == 0;
    }

    equals(other){
        return this.x === other.x && this.y === other.y
    }

    arrayContains(arr){
        for (let x of arr){
            if (this.equals(x)){
                return true;
            }
        }

        return false;
    }
}