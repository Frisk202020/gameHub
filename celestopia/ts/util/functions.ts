import { Position } from "./Position.js";

export function updateCounterValue(elementId: string, value: number) {
    const element = document.getElementById(elementId);
    if (element === null) {
        console.log(`WARN: can't file ${elementId} element.`);
        return;
    }

    element.textContent = Math.round(value).toString();
}

export function removeFromArray(array: any[], index: number): any {
    if (index < 0 || index >= array.length) {
        console.log("ERROR: index is in invalid range");
        return undefined;
    }

    const value = array[index];
    array[index] = array[array.length - 1];
    array.pop();

    return value;
}
 
export function appendCross(idsToRemove: string[]) {
    const cross = document.createElement("img");
    cross.className = "pointerHover";
    cross.id = "cross";
    cross.src = "get_file/celestopia/assets/icons/cross.png";
    cross.style.width = "10vw";
    cross.style.position = "fixed";
    cross.style.right = "0px";
    cross.style.top = "0px";
    cross.style.zIndex = "6";
    cross.addEventListener("click", () => {
        for (const id of idsToRemove) {
            const e = document.getElementById(id);
            if (e === null) {
                console.log(`WARN: ${id} is already removed`);
            } else {
                document.body.removeChild(e);
            }
        }

        document.body.removeChild(cross);
    });
    document.body.appendChild(cross);
}

export function appendBlurryBackground() {
    const blurryBackground = document.createElement("div");
    blurryBackground.id = "menu";
    const bgStyle = blurryBackground.style;
    bgStyle.position = "fixed";
    bgStyle.left = "0px";
    bgStyle.top = "0px";
    bgStyle.backgroundColor = "#d4d4cba1";
    bgStyle.width = "100vw";
    bgStyle.height = "100vh";
    bgStyle.zIndex = "5";
    document.body.appendChild(blurryBackground);

    return blurryBackground;
}

export function createHelperBox(text: string, position?: Position, size?: number, zIndex?: number) {
    const helpBox = document.createElement("p");
    helpBox.textContent = text;
    helpBox.style.position = "absolute";
    helpBox.style.zIndex = zIndex === undefined ? "4" : zIndex.toString();
    if (position !== undefined) {
        helpBox.style.left = `${position.x}px`;
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

export async function translateAnimation(element: HTMLElement, target: Position, frames: number, timeSeconds: number) {
    // assumes the element is position: absolute
    const it = timeSeconds * frames;
    const dt = 1000 / frames;
    
    const rect = element.getBoundingClientRect();
    let currentPos = new Position(rect.left + window.scrollX, rect.top);
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