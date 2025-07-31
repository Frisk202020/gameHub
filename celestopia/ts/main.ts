import { Aquisition } from "./aquisition.js";
import { buildBoard } from "./board.js";
import { Player } from "./player.js";
import {currentKeyboardEventListener, resizables } from "./util.js";

buildBoard(0);

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "Enter": 
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
            break;
        case "ArrowLeft": // similar handler than ArrowRight
        case "ArrowRight":
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

const frisk = new Player(1, "Frisk", "hat");
new Player(2, "Dokueki", "hat");
new Player(3, "New Quark", "hat");
new Player(4, "Casyaks", "hat");

for (let i = 0; i < 3; i++) {
    frisk.addAquisition(Aquisition.getRandomAquisition());
}