import { Point } from "./Point.js";
import { Boat } from "./Boat.js";
import { vwToPx, vhToPx, pxToVh, filePathRoot } from "./utilities.js";

let BOARD = document.getElementById("board");
let HINT = document.getElementById("hintBox");

let BOARD_INFO = buildEmptyBoardArray();
let CASE_DIV_MATRIX = Array();
const HEAD_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--headColor");
const HOVER_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--hoverColor");
const BOATS = {"DESTROYER":new Boat("DESTROYER", 2, 1, "destroyer.png", "destroyerVertical.png"), "BATTLESHIP":new Boat("BATTLESHIP", 3, 2, "battleship.png", "battleshipVertical.png"), "SUBMARINE":new Boat("SUBMARINE", 4, 1, "submarine.png", "submarineVertical.png"), "PLANE":new Boat("PLANE", 5, 1, "plane.png", "planeVertical.png")};
const BOATS_IMG = new Map();
const LETTERS = Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J");
let size;
let state = "HOME";
let color = "white";

let DOT_MATRIX_HOME = buildEmptyBoardArray();
let DOT_MATRIX_OTHER = buildEmptyBoardArray();

let mode = "NONE";
let placeHolder;
let vertical = false;

document.addEventListener("mousemove", (event) => {
    let x = event.clientX - 100;
    let y = event.clientY - 50;
    HINT.style.left = x + "px";
    HINT.style.top = y + "px";
})

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => { 
                for (const [k, v] of BOATS_IMG) {
                    let m0 = v.getBoundingClientRect();
                    k.style.left = `${m0.left}px`;
                    k.style.top = `${m0.top}px`;
                }
            })
        } else {
            document.documentElement.requestFullscreen().then(() => { 
                for (const [k, v] of BOATS_IMG) {
                    let m0 = v.getBoundingClientRect();
                    k.style.left = `${m0.left}px`;
                    k.style.top = `${m0.top}px`;
                }
            })
        }
    }
})

export function initialize(generateBoard=false){
    if (generateBoard){
        BOARD = document.createElement("div");
        BOARD.id = "board";
        BOARD.className = "home";
        document.body.appendChild(BOARD);

        HINT = document.createElement("div");
        HINT.id = "hintBox";
        document.body.appendChild(HINT);
    }

    size = pxToVh(getComputedStyle(BOARD)["width"].split("px")[0] / 11);
    document.documentElement.style.setProperty('--caseSize', size + "vh");

    for (let y = 0; y < 11; y++){
        placeLine(y);
    }

    styleHead();
    addButtons();
}

function styleHead(){
    CASE_DIV_MATRIX[0][0].style.backgroundColor = HEAD_COLOR;
    for (let i = 1; i < 11; i++){
        CASE_DIV_MATRIX[0][i].style.backgroundColor = HEAD_COLOR;
        CASE_DIV_MATRIX[0][i].textContent = LETTERS[i - 1];
        CASE_DIV_MATRIX[i][0].style.backgroundColor = HEAD_COLOR;
        CASE_DIV_MATRIX[i][0].textContent = i;
    }
}

function placeLine(y, boat=true){
    let line = document.createElement("div");
    line.className = "caseLine";
    let caseDocs = Array();

    for (let i = 0; i < 11; i++){
        let caseDoc = document.createElement("div");
        caseDoc.className = "case";
        caseDoc.id = i + " " + y;
        addEventListeners(caseDoc, boat);

        caseDocs.push(caseDoc);
        line.appendChild(caseDoc);
    }

    BOARD.appendChild(line);
    CASE_DIV_MATRIX.push(caseDocs);
}

function addDot(elem, color="white", ignoreMatrix=false){
    let matrix;
    if (state === "HOME"){
        matrix = DOT_MATRIX_HOME;
    }
    else{
        matrix = DOT_MATRIX_OTHER;
    }

    let p = new Point(elem.id.split(" "));
    if (matrix[p.y - 1][p.x - 1] === "" || ignoreMatrix){
        addDotElement(elem, color);
        matrix[p.y - 1][p.x - 1] = color;

        if (!ignoreMatrix && state === "HOME"){
            if (color === "white"){
                new Audio(filePathRoot + "plouf.mp3").play();
            }
            else{
                new Audio(filePathRoot + "explosion.mp3").play();
            }
        }
    }
    else if (matrix[p.y - 1][p.x - 1] !== ""){
        removeDot(elem);
        matrix[p.y - 1][p.x - 1] = "";
    }
}

function addDotElement(elem, color){
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.id = "dot" + elem.id;
    dot.style.backgroundColor = color;
    dot.style.width = size/2 + "vh";
    dot.style.height = size/2 + "vh";

    elem.appendChild(dot);
}

function removeDot(elem){
    let dot = document.getElementById("dot" + elem.id);
    elem.removeChild(dot);
}

function addEventListeners(caseDiv, boat=true){
    caseDiv.addEventListener("mouseenter", () => {
        let p = new Point(caseDiv.id.split(" "));
        if (!p.isBorder()){
            HINT.style.opacity = 1;
            HINT.textContent = LETTERS[p.x - 1] + p.y;
            document.body.style.cursor = "pointer";
        }
        if (!p.isBorder()){
            caseDiv.style.backgroundColor = HOVER_COLOR;
            caseDiv.style.borderColor = "red";

            if (mode !== "NONE"){
                boatTemplate(caseDiv);
            }
        }
    })

    caseDiv.addEventListener("mouseleave", () => {
        let p = new Point(caseDiv.id.split(" "));
        HINT.style.opacity = 0;
        if (!p.isBorder()){
            caseDiv.style.backgroundColor = "";
            caseDiv.style.borderColor = "white";
            document.body.style.cursor = "";

            if (mode !== "NONE"){
                document.body.removeChild(placeHolder);
                BOATS_IMG.delete(placeHolder);
            }
        }
    });

    if (boat){
        caseDiv.addEventListener("click", () => {
            if (mode !== "NONE"){
                placeBoatEvent(caseDiv);
            }
        })
    }
    else{
        caseDiv.addEventListener("click", () => {
            let p = new Point(caseDiv.id.split(" "));
            if (!p.isBorder()){
                addDot(caseDiv, color);
            }
        })
    }
}

function placeBoatEvent(caseDiv){
    let p = new Point(caseDiv.id.split(" "));
    let boat = BOATS[mode];
    if (boat.canPlaceBoat(BOARD_INFO, p, vertical)){
        boatTemplate(caseDiv, false);
        boat.updateBoardInfo(BOARD_INFO, p, vertical);
        mode = "NONE";

        boat.number--;
        document.getElementById(boat.name + "_Num").textContent = boat.number;
    }
}

function addButtons(){
    let reset = document.createElement("div");
    reset.className = "reset";
    reset.style.bottom = "5vh";
    reset.textContent = "REINITIALISER"
    document.body.appendChild(reset);
    reset.addEventListener("click", () => {
        resetBoard();
    })

    let done = document.createElement("div");
    done.className = "done";
    done.style.bottom = "5vh";
    done.textContent = "TERMINER"
    document.body.appendChild(done);
    done.addEventListener("click", () => {
        if (isDone()){
            beginGame();
        }
    })
    
    let i = 1;
    for (let b in BOATS){
        b = BOATS[b];
        i++;
        
        addBoatButton(b, i);

        addBoatNumberButton(b, i);

        addBoatTurnButton(b, i);
    }
}

function addBoatButton(b, i){
    let boat = document.createElement("div");
    boat.className = "boatButton";
    let img  = document.createElement("img");
    img.src = b.path;

    boat.appendChild(img);
    let n = i*10;
    boat.style.bottom = n + "vh";

    boat.addEventListener("mouseenter", () => {
        if (b.number > 0){
            boat.style.border = "5px solid red";
            boat.backgroundColor = "hsla(0,0%,76%,0.504)";
            document.body.style.cursor = "pointer";
        }
    })

    boat.addEventListener("mouseleave", () => {
        if (b.number > 0){
            boat.style.border = "5px solid white";
            boat.backgroundColor = "hsla(240, 1%, 46%, 0.504)";
            document.body.style.cursor = "";
        }
    })

    boat.addEventListener("click", () => {
        if (mode === b.name){
            mode = "NONE";
        }
        else if (b.number > 0){
            mode = b.name;
        }
        console.log(mode);
    })
    document.body.appendChild(boat);
}

function addBoatTurnButton(b, i){
    let turn = document.createElement("div");
    turn.className = "turnButton";
    let x = vwToPx(5) + vhToPx(25);
    turn.style.left = x + "px";
    x = i*10;
    turn.style.bottom = x + "vh";

    let img = document.createElement("img");
    img.src = filePathRoot + "turn.png";
    turn.appendChild(img);
    document.body.appendChild(turn);

    turn.addEventListener("mouseenter", () => {
        if (mode === b.name){
            turn.className = "turnButtonHover"
        }
    })

    turn.addEventListener("mouseleave", () => {
        if (mode === b.name){
            turn.className = "turnButton";
        }
    })

    turn.addEventListener("click", () => {
        if (mode === b.name){
            vertical = !vertical;
        }
    })
}

function addBoatNumberButton(b, i){
    let boatNum = document.createElement("div");
    boatNum.className = "boatNumber";
    boatNum.id = b.name + "_Num";
    let x = vwToPx(5) - vhToPx(7);
    boatNum.style.left = x + "px";
    x = i*10;
    boatNum.style.bottom = x + "vh";
    boatNum.textContent = b.number;
    document.body.appendChild(boatNum);
}

function boatTemplate(caseDiv, isPlaceHolder=true){
    let boat = BOATS[mode];
    let m0 = caseDiv.getBoundingClientRect();

    placeHolder = document.createElement("img");
    if (vertical){
        placeHolder.src = boat.pathVertical;
        placeHolder.style.width = size + "vh";
    }
    else{
        placeHolder.src = boat.path;
        placeHolder.style.height = size + "vh";
    }
    if (isPlaceHolder){
        placeHolder.className = "placeHolder";
    }
    else{
        placeHolder.className = "boat";
    }
    BOATS_IMG.set(placeHolder, caseDiv);
    placeHolder.style.left = m0.left + "px";
    placeHolder.style.top = m0.top + "px";

    document.body.appendChild(placeHolder);
}

function isDone(){
    for (let b in BOATS){
        b = BOATS[b];
        if (b.number > 0){
            return false;
        }
    }

    return true;
}

function resetBoard(resetBoard=true){
    if (resetBoard){
        BOARD_INFO = buildEmptyBoardArray();
        CASE_DIV_MATRIX = Array();
        for (let boat in BOATS){
            BOATS[boat].number = BOATS[boat].max;
        }
    }
    document.querySelectorAll("body > *:not(style)").forEach(el => el.remove());
    initialize(true);
}

function beginGame(){
    document.querySelectorAll("body > *:not(style)").forEach(el => el.remove());
    CASE_DIV_MATRIX = Array();

    let board = document.createElement("div");
    board.id = "board";
    if (state === "HOME"){
        board.className = "home";
    }
    else{
        board.className = "other";
    }
    document.body.appendChild(board);
    BOARD = board;

    size = pxToVh(getComputedStyle(BOARD)["width"].split("px")[0] / 11);
    document.documentElement.style.setProperty('--caseSize', size + "vh");

    for (let y = 0; y < 11; y++){
        placeLine(y, false);
    }

    styleHead();
    buildBoardFromArray();
    gameButtons();
}

function gameButtons(){
    let done = document.createElement("div");
    done.className = "done";
    done.style.bottom = "5vh";
    done.textContent = "Changer de Base";
    document.body.appendChild(done);
    done.addEventListener("click", () => {
        switchBoard();
    })

    let whiteDot = document.createElement("div");
    whiteDot.className = "dotBtn";
    whiteDot.style.right = "5vw";
    whiteDot.style.bottom = "17vh";
    addDotElement(whiteDot, "white");
    document.body.appendChild(whiteDot);
    whiteDot.addEventListener("click", () => {
        color = "white";
        whiteDot.style.border = "gold solid 5px";
        whiteDot.style.backgroundColor = "rgba(0, 155, 23, 0.867)";
        redDot.style.border = "white 5px solid";
        redDot.style.backgroundColor = "hsla(240, 1%, 46%, 0.504)";
    });
    whiteDot.addEventListener("mouseenter", () => {
        if (color === "red"){
            document.body.style.cursor = "pointer";
            whiteDot.style.border = "5px solid red";
            whiteDot.style.backgroundColor = "hsla(0,0%,76%,0.504)";
        }
    })
    whiteDot.addEventListener("mouseleave", () => {
        if (color === "red"){
            document.body.style.cursor = "";
            whiteDot.style.border = "5px solid white";
            whiteDot.style.backgroundColor = "hsla(240, 1%, 46%, 0.504)";
        }
    })

    let redDot = document.createElement("div");
    redDot.className = "dotBtn";
    let x = vwToPx(5) + vhToPx(18);
    redDot.style.right = x + "px";
    redDot.style.bottom = "17vh";
    addDotElement(redDot, "red");
    document.body.appendChild(redDot);
    redDot.addEventListener("click", () => {
        color = "red";
        redDot.style.border = "gold solid 5px";
        redDot.style.backgroundColor = "rgba(0, 155, 23, 0.867)";
        whiteDot.style.border = "white 5px solid";
        whiteDot.style.backgroundColor = "hsla(240, 1%, 46%, 0.504)";
    });
    redDot.addEventListener("mouseenter", () => {
        if (color === "white"){
            document.body.style.cursor = "pointer";
            redDot.style.border = "5px solid red";
            redDot.style.backgroundColor = "hsla(0,0%,76%,0.504)";
        }
    })
    redDot.addEventListener("mouseleave", () => {
        if (color === "white"){
            document.body.style.cursor = "";
            redDot.style.border = "5px solid white";
            redDot.style.backgroundColor = "hsla(240, 1%, 46%, 0.504)";
        }
    })

    if (color === "white"){
        whiteDot.style.border = "gold solid 5px";
        whiteDot.style.backgroundColor = "rgba(0, 155, 23, 0.867)";
    }
    else{
        redDot.style.border = "gold solid 5px";
        redDot.style.backgroundColor = "rgba(0, 155, 23, 0.867)";
    }
}

function switchBoard(){
    if (state === "HOME"){
        state = "OTHER";
    }
    else{
        state = "HOME";
    }
    beginGame();
}

function buildEmptyBoardArray(){
    let arr = Array();
    for (let i = 0; i < 10; i++){
        let line = Array();
        for (let j = 0; j < 10; j++){
            line.push("");
        }   
        arr.push(line);
    }

    return arr;
}

function buildBoardFromArray(){
    let placed = Array();
    let matrix;
    if (state === "HOME"){
        matrix = DOT_MATRIX_HOME;
    }
    else{
        matrix = DOT_MATRIX_OTHER;
    }

    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            if (state === "HOME" && BOARD_INFO[y][x] !== "" && !new Point(Array(x, y)).arrayContains(placed)){
                let boat = BOATS[BOARD_INFO[y][x]];

                if (y < 9 && BOARD_INFO[y + 1][x] === BOARD_INFO[y][x]){
                    vertical = true;

                    for (let i = 0; i < boat.length; i++){
                        placed.push(new Point(Array(x, y + i)));
                    }
                }
                else{
                    vertical = false;

                    for (let i = 0; i < boat.length; i++){
                        placed.push(new Point(Array(x + i, y)));
                    }
                }

                mode = BOARD_INFO[y][x];
                boatTemplate(CASE_DIV_MATRIX[y + 1][x + 1], false);
            }


            if (matrix[y][x] !== ""){
                addDot(CASE_DIV_MATRIX[y + 1][x + 1], matrix[y][x], true);
            }
        }
    }

    mode = "NONE";
}