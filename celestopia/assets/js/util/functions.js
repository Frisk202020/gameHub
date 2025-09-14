export function unwrap_or_default(x, default_value) {
    return x === undefined ? default_value : x;
}
export function isCharAlphanumeric(c) {
    if (c.length > 1) {
        return false;
    }
    else {
        return c[0] >= "0" && c[0] <= "9" || c[0] >= "a" && c[0] <= "z" || c[0] >= "A" && c[0] <= "Z";
    }
}
export function assets_link(x) { return `assets/${x}`; }
export function updateCounterValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element === null) {
        console.log(`WARN: can't file ${elementId} element.`);
        return;
    }
    element.textContent = Math.round(value).toString();
}
export function removeFromArrayByValue(array, value) {
    const index = array.indexOf(value);
    if (index === undefined) {
        console.log("ERROR: value is not in array");
        return;
    }
    array[index] = array[array.length - 1];
    array.pop();
}
export function removeFromArray(array, index) {
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
export function appendCross(idsToRemove, parent, tx) {
    const cross = document.createElement("img");
    cross.className = "pointerHover";
    cross.id = "cross";
    cross.src = assets_link("icons/cross.png");
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
            }
            else {
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
export function createHelperBox(text, position, size, zIndex) {
    const helpBox = document.createElement("p");
    helpBox.textContent = text;
    helpBox.style.position = "absolute";
    helpBox.style.zIndex = zIndex === undefined ? "4" : zIndex.toString();
    if (position !== undefined) {
        helpBox.style.left = `${position.x}px`;
        helpBox.style.top = `${position.y}px`;
    }
    if (size !== undefined) {
        helpBox.style.width = `${size}px`;
    }
    ;
    helpBox.style.backgroundColor = "azure";
    helpBox.style.padding = "10px";
    helpBox.style.borderRadius = "10px";
    helpBox.style.textAlign = "center";
    return helpBox;
}
export function pxToVw(px) {
    return px * 100 / document.documentElement.clientWidth;
}
export function vwToPx(vw) {
    return vw * document.documentElement.clientWidth / 100;
}
export function vhToPx(vh) {
    return vh * document.documentElement.clientHeight / 100;
}
export function removeFromBodyOrWarn(element) {
    if (element !== undefined) {
        if (document.body.contains(element)) {
            document.body.removeChild(element);
        }
        else {
            console.log(`WARN: ${element} is not in body`);
        }
        element = undefined;
    }
    else {
        console.log("WARN: helper box is null before proper removal");
    }
}
export async function appear(elm) {
    elm.classList.add("appear");
    await new Promise(r => setTimeout(r, 1000)); // animation set to 1s by css code
    elm.style.opacity = "1";
    elm.classList.remove("appear");
}
