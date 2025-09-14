import { imgPathRoot } from "./utilities.js";

export class Boat{
    constructor(name, length, number, relativePath, relativePathVertical){
        this.name = name;
        this.path = imgPathRoot + relativePath;
        this.pathVertical = imgPathRoot + relativePathVertical;
        this.number = number;
        this.max = number;
        this.length = length;
    }

    updateBoardInfo(arr, startingPoint, vertical=false){    
        console.log(startingPoint);
        if (vertical){
            for (let i = 0; i < this.length; i++){
                arr[startingPoint.y - 1 + i][startingPoint.x - 1] = this.name;
            }
        }
        else{
            for (let i = 0; i < this.length; i++){
                arr[startingPoint.y - 1][startingPoint.x - 1 + i] = this.name;
            }
        }
    }

    canPlaceBoat(arr, startingPoint, vertical=false){
        if (vertical){
            if (startingPoint.y > 11 - this.length){
            }

            for (let i = 0; i < this.length; i++){
                if (arr[startingPoint.y - 1 + i][startingPoint.x - 1] !== ""){
                    return false;
                }
            }

            return true;
        }

        console.log(vertical);
        if (startingPoint.x > 11 - this.length){
            return false;
        }
        
        for (let i = 0; i < this.length; i++){
            if (arr[startingPoint.y - 1][startingPoint.x - 1 + i] !== ""){
                return false;
            }
        }

        return true;
    }
}