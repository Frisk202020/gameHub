import { Sender } from "./channel.js";
import { Position } from "./Position.js";

export function unwrap_or_default<T>(x: T | undefined, default_value: T) {
    return x === undefined ? default_value : x;
}

export function isCharAlphanumeric(c: string) {
    if (c.length > 1) {
        return false;
    } else {
        return c[0] >= "0" &&  c[0] <= "9" || c[0] >= "a" && c[0] <= "z" || c[0] >= "A" && c[0] <= "Z";
    }
}

export function assets_link(x: string) { return `get_file/celestopia/assets/${x}`; }

export function updateCounterValue(elementId: string, value: number) {
    const element = document.getElementById(elementId);
    if (element === null) {
        console.log(`WARN: can't file ${elementId} element.`);
        return;
    }

    element.textContent = Math.round(value).toString();
}

export function removeFromArrayByValue<T>(array: T[], value: T) {
    const index = array.indexOf(value);
    if (index === undefined) {
        console.log("ERROR: value is not in array");
        return;
    }

    array[index] = array[array.length - 1];
    array.pop();
}

export function removeFromArray<T>(array: T[], index: number): T | undefined {
    if (index < 0 || index >= array.length) {
        console.log("ERROR: index is in invalid range");
        return undefined;
    }

    const value = array[index];
    array[index] = array[array.length - 1];
    array.pop();

    return value;
}
 
// tx is when we need to alert the caller when cross is pressed
export function appendCross(idsToRemove: string[], parent?: HTMLDivElement, tx?: Sender<void>) {
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

        if (tx !== undefined) {
            tx.send();
        }

        if (document.body.contains(cross)) {
            document.body.removeChild(cross);
        }
    });
    (parent === undefined ? document.body : parent).appendChild(cross);
}

export function appendBlurryBackground() {
    const blurryBackground = document.createElement("div");
    blurryBackground.id = "menu";
    const bgStyle = blurryBackground.style;
    bgStyle.position = "fixed";
    bgStyle.left = "0px";
    bgStyle.top = "0px";
    bgStyle.backgroundColor = "#858582d2";
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

export function pxToVw(px: number) {
    return px * 100 / document.documentElement.clientWidth;
}

export function vwToPx(vw: number) {
    return vw * document.documentElement.clientWidth/100;
}

export function vhToPx(vh: number) {
    return vh * document.documentElement.clientHeight/100;
}

export function removeFromBodyOrWarn(element: Node | undefined) {
    if (element !== undefined) {
        if (document.body.contains(element)) {
            document.body.removeChild(element);
        } else {
            console.log("WARN: element is not in body");
        }
        element = undefined;
    } else {
        console.log("WARN: helper box is null before proper removal");
    }
}

export async function appear(elm: HTMLElement) {
    elm.classList.add("appear");
    await new Promise(r => setTimeout(r, 1000)); // animation set to 1s by css code
    elm.style.opacity = "1";
    elm.classList.remove("appear");
}