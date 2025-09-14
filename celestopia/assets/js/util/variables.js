import { buildBoard } from "../board/Board.js";
import { Piggy } from "../piggy.js";
import { appear } from "./functions.js";
export let currentKeyboardEventListener;
export function setGlobalKeyboardListener(listener) {
    currentKeyboardEventListener = listener;
}
export function clearGlobalKeyboardListener() {
    currentKeyboardEventListener = undefined;
}
export const players = Array();
export let board = buildBoard(0);
export let boardId = 0;
export const pig = new Piggy();
export const boardNames = {
    0: "Banlieue",
    1: "Quartier de la mode",
    2: "Spatioport",
};
export function changeBoard(id) {
    document.body.removeChild(document.getElementById("board"));
    for (const p of players) {
        if (document.body.contains(p.pawn)) {
            document.body.removeChild(p.pawn);
        }
    }
    board = buildBoard(id);
    for (const p of players) {
        if (p.boardId === id) {
            p.pawn.style.opacity = "0";
            p.movePawn().then(() => appear(p.pawn));
            document.body.appendChild(p.pawn);
        }
    }
    boardId = id;
}
