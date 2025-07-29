import { Position } from "./position.js";

export function createHelperBox(text: string, position: Position, invertYAxis: boolean, size?: number) {
    const helpBox = document.createElement("p");
    helpBox.textContent = text;
    helpBox.style.position = "absolute";
    helpBox.style.zIndex = "4";
    helpBox.style.left = `${position.x}px`;
    if (invertYAxis) {
        helpBox.style.bottom = `${position.y}px`;
    }
    else {
        helpBox.style.top = `${position.y}px`;
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