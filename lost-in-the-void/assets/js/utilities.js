export async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function readFile(filepath){
    let response = await fetch(filepath);
    let text = await response.text();
    return text.split("\n");
}

export async function readFileWithoutSplit(filepath){
    let response = await fetch(filepath);
    let text = await response.text();
    return text;
}

export function resetFrame(div){
    div.innerHTML = "";
    return;
}

export async function playAudioUntilEnd(audio) {
    return new Promise((resolve) => {
        audio.onended = resolve;
        audio.play();
    });
}

export function pxToVh(px){
    return px/document.documentElement.clientHeight;
}

export function vwToPx(vh){
    return vh * document.documentElement.clientWidth;
}

export function arrayContains(array, element){
    for (let e of array){
        if (e === element){
            return true;
        }
    }
    return false;
}

export function arrayWithoutElement(array, element){
    let newArr = Array();
    for (let e of array){
        if (e !== element){
            newArr.push(e)
        }
    }

    return newArr
}

export async function fade(audio, time){
    let waitTime = time / (100 * audio.volume)
    while (audio.volume > 0.01){
        audio.volume -= 0.01;
        await wait(waitTime);
    }
}

// Easier than relative paths when scripts are called from pages other than index
export function absoluteAssetsPath(relativePath) {
    return `/lost-in-the-void/assets/${relativePath}`;
}

export function addFullscreenEventListener() {
    document.addEventListener("keydown", (event)=>{
        if (event.key !== "Enter") {
            return;
        }
        fullScreenHandler();
    });
}

export function fullScreenHandler() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}