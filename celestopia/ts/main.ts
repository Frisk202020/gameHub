import { boardCanvas } from "./board/Board.js";
import { Case, setDisableCaseHelper } from "./board/Case.js";
import { ChangeBoardEvent } from "./event/ChangeBoardEvent.js";
import { Popup } from "./event/Popup.js";
import { Player } from "./Player.js";
import { initChannel } from "./util/channel.js";
import { debugTools } from "./util/debug.js";
import { updateCounterValue } from "./util/functions.js";
import { board, boardId, clearGlobalKeyboardListener, currentKeyboardEventListener, pig, players, resizables, setGlobalKeyboardListener } from "./util/variables.js";

document.addEventListener("keydown", (event) => {
    if (debugTools.keys) { console.log(event.key) };
    if (currentKeyboardEventListener !== undefined) {
        event.preventDefault();
        currentKeyboardEventListener.eventHandler(event);
    } else {
        switch (event.key) {
            case "Enter": 
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
                break;
        }
    }
});
window.addEventListener("resize", () => {
    const doc = document.documentElement;
    for (const obj of resizables) {
        obj.move(doc.clientWidth, doc.clientHeight);
    }
});
(window as any).debugTools = debugTools

async function counterRenderLoop() {
    for (const p of players) {
        updateCounterValue(`${p.id}.coin`, p.coins);
        updateCounterValue(`${p.id}.ribbon`, p.ribbons);
        updateCounterValue(`${p.id}.star`, p.stars);
        updateCounterValue(`${p.id}.chest`, p.aquisitionCount);
        updateCounterValue(`${p.id}.wonder`, p.wonderCount);
        updateCounterValue(`bankCounter`, pig.content);
        pig.setColor();
    }
    if (currentKeyboardEventListener !== undefined) {
        if (!document.body.contains(currentKeyboardEventListener.element)) {
            clearGlobalKeyboardListener();
        }
    }

    requestAnimationFrame(counterRenderLoop);
}

async function boardRenderLoop() {
    for (const p of players) {
        if (p.boardId !== boardId) { continue; }

        if (p.teleport) {
            p.teleport = false;
            p.caseId = p.pendingCaseId;
            p.movePawn().then(()=>nextPlayer(p));
        } else if (p.caseId < p.pendingCaseId) {            
            setDisableCaseHelper(true);
            let firstMove = true;
            while (p.caseId < p.pendingCaseId) {
                const currentCase = board.elements[p.caseId]
                if (firstMove) {
                    firstMove = false;
                } else {
                    if (currentCase.type === "intersection") {
                        await p.caseResponse("intersection");
                        continue;
                    } else if (currentCase.type === "item" || currentCase.type === "teleporter") {
                        await p.caseResponse(currentCase.type);
                    } else if (currentCase.type === "end") {
                        await p.caseResponse("end");
                        break;
                    }
                }

                if (currentCase.nextId === undefined) {
                    p.caseId++
                } else {
                    const delta = p.pendingCaseId - p.caseId;
                    p.caseId = currentCase.nextId;
                    p.pendingCaseId = p.caseId + delta - 1;
                }
                if (boardCanvas !== undefined) {
                    await p.movePawn();
                }
                
                await new Promise(r => setTimeout(r, 100));
            }

            const caseElm = board.elements[p.caseId] as Case;
            await p.caseResponse(caseElm.type);
            setDisableCaseHelper(false);

            if (caseElm.type === "ladder" || caseElm.type === "dice") { continue; }
            nextPlayer(p);
        } else if (p.caseId > p.pendingCaseId) {
            p.caseId = p.pendingCaseId;
            await p.movePawn();
            p.teleport = false;
        }
    } 

    requestAnimationFrame(boardRenderLoop);
}

function initPlayers() {
    /*
    const frisk = new Player(1, "Frisk", "strawberry");
    const dokueki = new Player(2, "Dokueki", "crown");
    const q = new Player(3, "New Quark", "dice");
    const cas = new Player(4, "Casyaks", "hat");
    

    players.push(frisk);
    players.push(dokueki);
    players.push(q);
    players.push(cas);
    */

    const clem = new Player(1, "Clem", "strawberry");
    const eve = new Player(2, "Eve", "heart");

    players.push(clem);
    players.push(eve);

    for (const p of players) {
        document.body.appendChild(p.pawn);
    }
}

function initBoardBtn() {
    const p = document.createElement("p");
    p.className = "pointerHover";
    p.textContent = "Changer de plateau";
    p.style.position = "fixed";
    p.style.bottom = "0px";
    p.style.left = "0px";
    p.style.width = "10vw";
    p.style.textAlign = "center";
    p.style.fontSize = "1.5vw";
    p.style.borderRadius = "10px";
    p.style.backgroundColor = "#fff8cbff";
    p.style.padding = "10px";
    p.style.margin = "0px";
    p.style.zIndex = "1";

    p.addEventListener("click", ()=>new ChangeBoardEvent());
    document.body.appendChild(p);
}

async function nextPlayer(p: Player) {
    let id: number = p.id;
    if (p.id === players.length) {
        id = 0;
    }
    const nextP = players[id];
    const {tx, rx} = initChannel<void>();
    new Popup(`A toi de jouer, ${nextP.name} !`, undefined, tx);
    await rx.recv();
    p.disable();
    nextP.enable();
}

function main() {
    initPlayers();
    counterRenderLoop();
    boardRenderLoop();
    initBoardBtn();
    players[0].enable();
}

main();