import { buildBoard } from "./board.js";
import { Player } from "./player.js";

buildBoard(0);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }
})

new Player(1, "Frisk", "hat");
new Player(2, "Dokueki", "hat");
new Player(3, "New Quark", "hat");
new Player(4, "Casyaks", "hat");