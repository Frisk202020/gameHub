import { boardCanvas } from "./board/Board.js";
import { Case } from "./board/Case.js";
import { Player } from "./Player.js";
import { debugTools } from "./util/debug.js";
import { updateCounterValue } from "./util/functions.js";
import { board, boardId, currentKeyboardEventListener, pig, players, resizables } from "./util/variables.js";

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

async function gameRenderLoop() {
    for (const p of players) {
        updateCounterValue(`${p.id}.coin`, p.coins);
        updateCounterValue(`${p.id}.ribbon`, p.ribbons);
        updateCounterValue(`${p.id}.star`, p.stars);
        updateCounterValue(`${p.id}.chest`, p.aquisitionCount);
        updateCounterValue(`${p.id}.wonder`, p.wonderCount);
        updateCounterValue(`bankCounter`, pig.content);
        pig.setColor();

        if (p.boardId !== boardId) { continue; }

        if (p.teleport) {
            p.caseId = p.pendingCaseId;
            p.movePawn().then(() => p.teleport = false);
        } else if (p.caseId < p.pendingCaseId) {            
            while (p.caseId < p.pendingCaseId) {
                const currentCase = board.elements[p.caseId];
                if (currentCase.type === "intersection") {
                    await p.caseResponse("intersection");
                    continue;
                } else if (currentCase.type === "item" || currentCase.type === "teleporter") {
                    await p.caseResponse(currentCase.type);
                } else if (currentCase.type === "end") {
                    await p.caseResponse("end");
                    break;
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
        } else if (p.caseId > p.pendingCaseId) {
            p.caseId = p.pendingCaseId;
            await p.movePawn();
            p.teleport = false;
        }
    } 

    requestAnimationFrame(gameRenderLoop);
}

function initPlayers() {
    const frisk = new Player(1, "Frisk", "strawberry");
    const dokueki = new Player(2, "Dokueki", "crown");
    const q = new Player(3, "New Quark", "dice");
    const cas = new Player(4, "Casyaks", "hat");

    players.push(frisk);
    players.push(dokueki);
    players.push(q);
    players.push(cas);

    for (const p of players) {
        document.body.appendChild(p.pawn);
    }
}

function main() {
    initPlayers();
    gameRenderLoop();
}

main();