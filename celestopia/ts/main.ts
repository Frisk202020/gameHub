import { boardCanvas } from "./board/Board.js";
import { Case } from "./board/Case.js";
import { Aquisition } from "./card/Aquisition.js";
import { Wonder } from "./card/Wonder.js";
import { computeOnBoardPosition, Player } from "./Player.js";
import { debugTools } from "./util/debug.js";
import { translateAnimation, updateCounterValue } from "./util/functions.js";
import { board, currentKeyboardEventListener, pig, players, resizables } from "./util/variables.js";

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
        updateCounterValue(`${p.id}.chest`, p.aquisitions.length);
        updateCounterValue(`${p.id}.wonder`, p.wonders.length);
        updateCounterValue(`bankCounter`, pig.content);
        pig.setColor();

        if (p.caseId < p.pendingCaseId) {
            while (p.caseId < p.pendingCaseId) {
                p.caseId++;
                const elm = board.elements[p.caseId];
                if (elm instanceof Case) {
                    if (boardCanvas !== undefined) {
                        let pos = computeOnBoardPosition(elm);
                        await translateAnimation(p.pawn, pos , 60, 0.25);
                    }
                } else {
                    // TODO: manage intersections
                }

                await new Promise(r => setTimeout(r, 100));
            }

            const caseElm = board.elements[p.caseId] as Case;
            p.caseResponse(caseElm.type);
        } else if (p.caseId > p.pendingCaseId) {
            while (p.caseId > p.pendingCaseId) {
                p.caseId--;
                const elm = board.elements[p.caseId];
                if (elm instanceof Case) {
                    if (boardCanvas !== undefined) {
                        let pos = computeOnBoardPosition(elm);
                        await translateAnimation(p.pawn, pos , 60, 0.25);
                    }
                } else {
                    // TODO: manage intersections
                }

                await new Promise(r => setTimeout(r, 100));
            }

            const caseElm = board.elements[p.caseId] as Case;
            p.caseResponse(caseElm.type);
        }
    } 

    requestAnimationFrame(gameRenderLoop);
}

function main() {
    gameRenderLoop();

    const frisk = new Player(1, "Frisk", "hat");
    const dokueki = new Player(2, "Dokueki", "hat");
    const q = new Player(3, "New Quark", "hat");
    const cas = new Player(4, "Casyaks", "hat");

    for (let i = 0; i < 3; i++) {
        frisk.addAquisition(Aquisition.getRandomAquisition());
    }

    frisk.addWonder(Wonder.getWonder("astropy") as Wonder);
    frisk.addWonder(Wonder.getWonder("teleporter") as Wonder);
    frisk.addWonder(Wonder.getWonder("comet") as Wonder);
    frisk.addWonder(Wonder.getWonder("bridge") as Wonder);
    dokueki.addWonder(Wonder.getWonder("dress") as Wonder);
    dokueki.addWonder(Wonder.getWonder("bank") as Wonder);

    players.push(frisk);
    players.push(dokueki);
    players.push(q);
    players.push(cas);
}

main();