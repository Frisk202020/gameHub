import { buildBoard } from "./board/Board.js";
import { Aquisition } from "./card/Aquisition.js";
import { Wonder } from "./card/Wonder.js";
import { Player } from "./Player.js";
import { debugTools } from "./util/debug.js";
import { updateCounterValue } from "./util/functions.js";
import { currentKeyboardEventListener, players, resizables } from "./util/variables.js";

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "Enter": 
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
            break;
        default:
            if (currentKeyboardEventListener !== undefined) {
                event.preventDefault();
                currentKeyboardEventListener.eventHandler(event);
            }
            break;
    }
});
window.addEventListener("resize", () => {
    const doc = document.documentElement;
    for (const obj of resizables) {
        obj.move(doc.clientWidth, doc.clientHeight);
    }
});
(window as any).debugTools = debugTools

function gameRenderLoop() {
    for (const p of players) {
        updateCounterValue(`${p.id}.coin`, p.coins);
        updateCounterValue(`${p.id}.ribbon`, p.ribbons);
        updateCounterValue(`${p.id}.star`, p.stars);
        updateCounterValue(`${p.id}.chest`, p.aquisitions.length);
        updateCounterValue(`${p.id}.wonder`, p.wonders.length);
    }

    requestAnimationFrame(gameRenderLoop);
}

function main() {
    gameRenderLoop();

    buildBoard(0);
    const frisk = new Player(1, "Frisk", "hat");
    const dokueki = new Player(2, "Dokueki", "hat");
    new Player(3, "New Quark", "hat");
    new Player(4, "Casyaks", "hat");

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
}

main();