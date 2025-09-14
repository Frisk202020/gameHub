import { getRandomGlitch } from "./glitchPicker.js";
import { absoluteAssetsPath, fullScreenHandler, playAudioUntilEnd } from "./utilities.js";

const bgMusic = new Audio(absoluteAssetsPath("sound/birds.mp3"));
bgMusic.volume = 0.5;
bgMusic.loop = true;
let activated = false;

const PLAYER = document.getElementById("player");
const ARROW = document.getElementById("arrow");
const END = document.getElementById("end");
let goal;
let end = false;
PLAYER.style.left = "10px";
const HEIGHT = window.innerHeight;
let w = Math.max(HEIGHT * (1920/1080), window.innerWidth);

function setBG(){
    let im = new Image();
    im.src = absoluteAssetsPath("img/test1BG.png");
    im.onload = function(){
        document.body.style.backgroundImage = `url(${im.src})`;
        goal = 0.58*w;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = w + "px " + HEIGHT + "px";
        END.style.width = w + "px";
        END.style.height = HEIGHT + "px";
    }
}
setBG();

window.addEventListener("resize", function(){
    setBG();    
})

document.addEventListener('keydown', (event) => {
    if (!activated){
        bgMusic.play();
        activated = true;
    }
    if (event.key === "ArrowRight"){
        event.preventDefault();
        let newVal = Number(PLAYER.style.left.split("px")[0]) + 10;
        
        if (newVal <= 0.8 * w){
            PLAYER.style.left = newVal + "px";
            window.scrollBy(10, 0);
        }
        
        if (newVal >= goal && !end){
            end = true;
            bgMusic.pause();
            getRandomGlitch().play();
            ARROW.style.opacity = 0;
            playAudioUntilEnd(new Audio(absoluteAssetsPath("sound/exit.wav"))).then(function(){
                getRandomGlitch().play();
                window.location.href = absoluteAssetsPath('html/act2.html');
            })
            END.className = "activeWhiteScreen";
        }
    }
    else if (event.key === "ArrowLeft"){
        event.preventDefault();
        if (!activated){
            bgMusic.play();
            activated = true;
        }
        let newVal = Number(PLAYER.style.left.split("px")[0]) - 10;
        if (newVal > -21){
            PLAYER.style.left = newVal + "px";
            window.scrollBy(-10, 0);
        }
    } else if (event.key === "Enter") {
        fullScreenHandler();
    }
});
