import { buildBoard } from "./board.js";

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