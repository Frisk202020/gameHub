import { buildBoard } from "../board/Board.js";
import { Piggy } from "../piggy.js";
import { Player } from "../Player.js";
import { DynamicPlacement } from "./DynamicPlacement.js";
import { KeyboardListener } from "./KeyboardListener.js";

export let currentKeyboardEventListener: KeyboardListener | undefined;
export function setGlobalKeyboardListener(listener: KeyboardListener) {
    currentKeyboardEventListener = listener;
}

export const resizables: DynamicPlacement[] = Array();
export const players: Player[] = Array();
export const board = buildBoard(0);

export const pig = new Piggy();