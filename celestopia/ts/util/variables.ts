import { DynamicPlacement } from "./DynamicPlacement.js";
import { KeyboardListener } from "./KeyboardListener.js";

export let currentKeyboardEventListener: KeyboardListener | undefined;
export function setGlobalKeyboardListener(listener: KeyboardListener) {
    currentKeyboardEventListener = listener;
}

export const resizables: DynamicPlacement[] = Array();