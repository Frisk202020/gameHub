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