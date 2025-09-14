import {ComputerFile} from "./ComputerFile.js";

export class Directory{
    constructor(name, order){
        this.name = name;
        this.order = order;
        this.files = Array();
        this.directories = Array();
        this.password = "";

        this.cleanName();
    }

    addFile(file){
        if (file instanceof ComputerFile){
            this.files.push(file);
        }
        else{
            console.log("Invalid File to register");
        }
    }

    addDirectory(directory){
        if (directory instanceof Directory){
            this.directories.push(directory);
        }
        else{
            console.log("Invalid directory to register");
        }
    }

    buildDirectory(data, index){
        while (index < data.length){
            let order = findOrder(data[index]);
            if (order <= this.order){
                return index;
            }

            if (isDirectory(data[index])){
                let d = new Directory(data[index], this.order + 1);
                index = d.buildDirectory(data, index + 1);
                this.addDirectory(d);
            }
            else{
                let arr = data[index].split("$");
                let file = new ComputerFile(cleanFileName(arr[0], order), order);
                if (arr[1] !== ""){
                    file.type = arr[1];
                }
                this.addFile(file);
                index++;
            }
        }

        return index;
    }

    toString(){
        let res = "";
        let tabs = "";
        for (let i = 0; i < this.order; i++){
            tabs += "\t";
        }
        res += tabs + this.name + "\n";

        for (let f of this.files){
            res += tabs + "\t" +  f.name + "\n";
        }
        for (let d of this.directories){
            res += d.toString();
        }
        return res;
    }

    getChildPosition(child){
        for (let i = 0; i < this.directories.length; i++){
            if (this.directories[i].name === child.name){
                return i;
            }
        }
        for (let i = 0; i < this.files.length; i++){
            if (this.files[i].name === child.name){
                return i;
            }
        }
        console.log("Child not found !");
        return -1;
    }

    cleanName(){
        this.name = this.name.substring(this.order);
        let splitData = this.name.split("$");
        this.name = splitData[0];
        splitData = splitData[1].split(":");
        if (splitData[1] !==  undefined){
            this.password = splitData[1];
        }
    }
}

function cleanFileName(file, order){
    return file.substring(order);
}

function isDirectory(value){
    let x = value.split("$")[1];
    if (x === undefined){
        return false;
    }
    return value.split("$")[1].substring(0, 1) === "d";
}

function findOrder(value){
    let order = 0;
    for (let char of value){
        if (char == '>'){
            order++;
        }
    }
    return order;
}