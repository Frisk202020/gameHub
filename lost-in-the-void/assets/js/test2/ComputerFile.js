export class ComputerFile{
    constructor(name, order){
        this.name = name;
        this.order = order;
        this.type = "";
    }

    executeFile(){
        let extention = this.name.split(".")[1];
        if (extention === "txt" || extention === "md" || extention === "c"){
            return "OPEN";
        }
        else if (extention === "pdf" || extention === "png" || extention === "jpg"){
            return "WEB";
        }
        else if (extention === "exe" || extention === "kill" || extention === "SOUL" || extention === "sys"){
            return "EXECUTE";
        }

        return "NO";
    }

    toString(){
        return this.name;
    }
}