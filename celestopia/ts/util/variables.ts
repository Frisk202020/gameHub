import { BoardId, buildBoard } from "../board/Board.js";
import { Piggy } from "../piggy.js";
import { Player } from "../Player.js";
import { DynamicPlacement } from "./DynamicPlacement.js";
import { appear } from "./functions.js";
import { KeyboardListener } from "./KeyboardListener.js";

export let currentKeyboardEventListener: KeyboardListener | undefined;
export function setGlobalKeyboardListener(listener: KeyboardListener) {
    currentKeyboardEventListener = listener;
}
export const resizables: DynamicPlacement[] = Array();
export const players: Player[] = Array();
export let board = buildBoard(0);
export let boardId = 0;
export const pig = new Piggy();
export type Money = "coin" | "ribbon" | "star";

export const boardNames = {
    0: "Banlieue",
    1: "Quartier de la mode",
    2: "Spatioport",
}

export function changeBoard(id: BoardId) {
    document.body.removeChild(document.getElementById("board") as HTMLElement);
    for (const p of players) {
        if (document.body.contains(p.pawn)) { document.body.removeChild(p.pawn); }
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