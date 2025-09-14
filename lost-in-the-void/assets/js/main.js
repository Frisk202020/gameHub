import {getRandomGlitch as glitch} from "./glitchPicker.js"
import {readInstruction} from "../js/script.js"
import {absoluteAssetsPath, addFullscreenEventListener, playAudioUntilEnd, readFile, wait} from "./utilities.js";

export let data;
export let bgMusic;

addFullscreenEventListener();

export const MAIN = document.getElementById("mainframe");
const BUTTON = document.getElementById("start");
BUTTON.addEventListener('click', start);

function start(){
    BUTTON.removeEventListener('click', start);
    BUTTON.style.opacity = 0;
    BUTTON.className = ""; /* Remove the button from existence */
    glitch().play();
    
    main();
}

async function main(){
    MAIN.classList.remove("hide");
    MAIN.classList.add("mainframe");
    let home = window.location.href;
    let filepath;
    let intro;

    if (home.includes("act2")){
        filepath = absoluteAssetsPath("script/2.md");
        bgMusic = new Audio(absoluteAssetsPath("sound/main.mp3"));
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        bgMusic.play();
        intro = new Audio(absoluteAssetsPath("sound/vanish.mp3"));
    }
    else if (home.includes("act3")){
        filepath = absoluteAssetsPath("script/3.md");
        bgMusic = new Audio(absoluteAssetsPath("sound/outcome.mp3"));
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        bgMusic.play();
        await wait(5000);
    }
    else {
        filepath = absoluteAssetsPath("script/1.md");
        bgMusic = new Audio(absoluteAssetsPath("sound/main.mp3"));
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        bgMusic.play();
        intro = new Audio(absoluteAssetsPath("sound/awake.mp3"));
    }

    data = await readFile(filepath); // local paths from HTML file !
    if (intro !== undefined){
        await playAudioUntilEnd(intro);
    }
    await readInstruction(data);
} 

