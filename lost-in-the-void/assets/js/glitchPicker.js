import { absoluteAssetsPath } from "./utilities.js";

export function getRandomGlitch(){
    let n = Math.floor(Math.random()*4);
    let filename;
    if (n === 0){
        let m = Math.floor(Math.random()*11) + 1;
        filename = generateFileName("medium_add_", m);
    }
    else if (n === 1){
        let m = Math.floor(Math.random()*11) + 1;
        filename = generateFileName("medium_main_", m);
    }
    else if (n === 2){
        let m = Math.floor(Math.random()*25) + 1;
        filename = generateFileName("short_add_", m);
    }
    else if (n === 3){
        let m = Math.floor(Math.random()*25) + 1;
        filename = generateFileName("short_main_", m);
    }
    
    let audio = new Audio(absoluteAssetsPath("sound/glitches/" + filename));
    return audio;
}

function generateFileName(body, n){
    let filename;
    if (n > 9){
        filename = body + n + ".wav";
    } 
    else{
        filename = body + "0" + n + ".wav";
    }
    return filename;
}
