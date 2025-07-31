import { Position } from "./position.js";

export let currentKeyboardEventListener: KeyboardListener | undefined;
export function setGlobalKeyboardListener(listener: KeyboardListener) {
    currentKeyboardEventListener = listener;
}

export function createHelperBox(text: string, invertYAxis: boolean, position?: Position, size?: number, zIndex?: number) {
    const helpBox = document.createElement("p");
    helpBox.textContent = text;
    helpBox.style.position = "absolute";
    helpBox.style.zIndex = zIndex === undefined ? "4" : zIndex.toString();
    if (position !== undefined) {
        helpBox.style.left = `${position.x}px`;
        if (invertYAxis) {
            helpBox.style.bottom = `${position.y}px`;
        }
        else {
            helpBox.style.top = `${position.y}px`;
        }
    }

    if (size !== undefined) { helpBox.style.width = `${size}px` };
    helpBox.style.backgroundColor = "azure";
    helpBox.style.padding = "10px";
    helpBox.style.borderRadius = "10px";
    helpBox.style.textAlign = "center";

    return helpBox;
}

export function vwToPx(vw: number) {
    return vw * document.documentElement.clientWidth/100;
}

export function removeFromBodyOrWarn(element: Node | undefined) {
    if (element !== undefined) {
        document.body.removeChild(element);
        element = undefined;
    } else {
        console.log("WARN: helper box is null before proper removal");
    }
}

export async function translateAnimation(element: HTMLElement, target: Position, frames: number, timeSeconds: number) {
    // assumes the element is position: absolute
    const it = timeSeconds * frames;
    const dt = 1000 / frames;
    
    const rect = element.getBoundingClientRect();
    let currentPos = new Position(rect.left, rect.top);
    let dP = target.difference(currentPos);
    dP.divideMut(it);

    for (let i = 0; i < it; i++) {
        currentPos.translateMut(dP);
        element.style.left = `${currentPos.x}px`;
        element.style.top = `${currentPos.y}px`;
        await new Promise(r => setTimeout(r, dt));
    }

    element.style.left = `${target.x}px`;
    element.style.top = `${target.y}px`;
}

export interface DynamicPlacement {
    move(windowWidth: number, windowHeight: number): void;
}
export const resizables: DynamicPlacement[] = Array();

export abstract class KeyboardListener {
    element: HTMLElement;
    enabled: boolean;

    constructor(element: HTMLElement) {
        this.element = element;
        this.enabled = true;
    }

    abstract eventHandler(event: KeyboardEvent): void;
}