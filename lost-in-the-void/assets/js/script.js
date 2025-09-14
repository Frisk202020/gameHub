import {wait, resetFrame as reset, playAudioUntilEnd, fade} from "./utilities.js"
import {data, MAIN, bgMusic} from "./main.js"
import { conclusion } from "./conclusion.js"
import { absoluteAssetsPath } from "./utilities.js";

const BOX = document.getElementById("messageSlot");
const RBOX = document.getElementById("responseBox");

let responses = Array();
let texts = Array();
let pointers = Array();
let clickListeners = Array();

let state = "OTHER";
let pointer = 0;
let indicator = false; // indicates if action has been made before incomming death 
let timeBetweenMessages = 0; // in ms

export async function readInstruction(){
    if (pointer >= data.length){
        return;
    }
    var instruction = data[pointer];
    if (instruction.substring(0, 5) === "BEGIN"){
        pointer++;
        state = instruction.substring(6);
        await readInstruction();
        return;
    }
    if (instruction.substring(0, 6) === "REVEAL"){
        pointer++;
        document.getElementById("person").textContent = "EXolotl MÜÜSKE";
        document.head.title = "EXolotl MÜÜSKE"
        await readInstruction();
        return;
    }
    if (instruction.substring(0, 4) === "HURT"){
        pointer++;
        new Audio("assets/sound/hurt.mp3").play();
        await readInstruction();
        return;
    }
    if (instruction.substring(0, 5) === "DEATH"){
        await death(Number(instruction.split("@")[1]));
        return;
    }
    if (instruction.substring(0, 4) === "TEST"){
        let id = instruction.split(".")[1];
        let filename = absoluteAssetsPath("html/test" + id + ".html");
        
        fade(bgMusic, 5000);
        let end = document.createElement("div");
        end.className = "activeWhiteScreen";
        end.id = "end";
        end.style.width = "100vw";
        end.style.height = "100vh";
        document.body.prepend(end);
        if (MAIN.classList.contains("mainframe")){
            MAIN.classList.remove("mainframe");
        }
        if (MAIN.classList.contains("mainframeRestore")){
            MAIN.classList.remove("mainframeRestore");
        }
        MAIN.classList.add("mainframeGlitch");
        playAudioUntilEnd(new Audio(absoluteAssetsPath("sound/exit.wav"))).then(function(){
            window.location.href = filename;
        })
        return;
    }
    if (instruction.substring(0, 10) === "CONCLUSION"){
        state = "DONE";
        await fade(bgMusic, 3000);
        conclusion();
    }
    if (state === "OTHER"){
        let arr = instruction.split("@");
        generateOtherBox();
        var sfx = new Audio(absoluteAssetsPath("sound/message.mp3"));
        sfx.volume = 0.4;
        sfx.play();
        if (arr.length > 1){
            pointer = Number(arr[1]) - 1;
        }
        else{
            pointer++;
        }
        await wait(timeBetweenMessages);
        await readInstruction();
        return;
    }
    if (state.substring(0, 4) === "HOST"){ 
        let arr = state.split('.');
        let arr2 = arr[0].split('*');
        let timer = -1;
        let deathPointer = -1;
        if (arr2.length > 1){
            arr2 = arr2[1].split('>');
            timer = Number(arr2[0]);
            deathPointer = Number(arr2[1]);
        } 
        if (timer > 0){
            indicator = true;
            wait(3000).then(
                async function(){
                    if (indicator){
                        forbidResponse();
                        if (RBOX.className === "activeResponseBox"){
                            RBOX.className = "unactiveResponseBox";
                        }
                        await wait(1000);
                        RBOX.innerHTML = "";
                        responses.length = 0; 
                        texts.length = 0;
                        pointers.length = 0;
                        await death(deathPointer);
                    }
                }
            );
        }
        let len = Number(arr[1]);
        for (var i = 0; i < len; i++){
            let arr = data[pointer].split("@");
            texts.push(arr[0]);
            if (arr.length == 1){
                pointers.push(pointer + 1);
            }
            else{
                pointers.push(Number(arr[1]) - 1);
            }
            pointer++;
        }
        updateRBOX();
        RBOX.className = "activeResponseBox";
        allowResponse();
        return;
    }
}

function updateRBOX(){
    for (var i = 0; i < texts.length; i++){
        let res = document.createElement('div');
        res.className = "response";
        res.id = "response" + i;
        let p = document.createElement('p');
        p.id = "text" + i;
        p.textContent = texts[i];
        RBOX.appendChild(res);
        res.appendChild(p);
        responses.push(res);
    }
    return;
}

function allowResponse(){
    for (let i = 0; i < responses.length; i++){
        async function event(){
            await generateNewBox(i);
            await wait(1000);
            await readInstruction();
        }
        responses[i].addEventListener('click', event);
        responses[i].classList.add("active");
        clickListeners.push(event);
    }
}

function forbidResponse(){
    for (var i = 0; i < responses.length; i++){
        responses[i].removeEventListener('click', clickListeners[i]);
        responses[i].classList.remove("active");
    }
    clickListeners.length = 0;
}

async function generateOtherBox(){
    let text = data[pointer].split("@")[0]; 
    let html = '<div class="message" id="other"><p>' + text + '</p></div>';
    BOX.innerHTML += html;
}

async function generateNewBox(resId){
    forbidResponse();
    indicator = false;
    if (RBOX.className === "activeResponseBox"){
        RBOX.className = "unactiveResponseBox";
    }
    let text = document.getElementById("text" + resId).textContent;
    pointer = pointers[resId];
    
    let html = '<div class="message" id="host"><p>' + text + '</p></div>';;
    BOX.innerHTML += html;
    await wait(1000); /* wait for the response box to disappear */
    RBOX.innerHTML = "";
    responses.length = 0; /* clear array */
    texts.length = 0;
    pointers.length = 0;
    return;
}

async function death(deathPointer){
    pointer = deathPointer - 1;
    await playAudioUntilEnd(new Audio(absoluteAssetsPath("sound/shatter.mp3")));
    if (MAIN.classList.contains("mainframe")){
        MAIN.classList.remove("mainframe");
    }
    if (MAIN.classList.contains("mainframeRestore")){
        MAIN.classList.remove("mainframeRestore");
    }
    MAIN.classList.add("mainframeGlitch");
    let audio = new Audio(absoluteAssetsPath("sound/disappear.mp3"));
    audio.play();
    await wait(5000);
    reset(BOX);
    
    MAIN.classList.remove("mainframeGlitch");
    MAIN.classList.add("mainframeRestore");
    audio = new Audio(absoluteAssetsPath("sound/appear.mp3"));
    audio.play();
    await readInstruction();
    return;
}