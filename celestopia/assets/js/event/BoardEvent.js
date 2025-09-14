var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BoardEvent_instances, _a, _BoardEvent_appendButtons, _BoardEvent_okButton, _BoardEvent_denyButton, _BoardEvent_handlerOrDefault;
import { appendBlurryBackground } from "../util/functions.js";
export class BoardEvent {
    constructor(elements, ok, deny) {
        _BoardEvent_instances.add(this);
        const menu = appendBlurryBackground();
        const flex = document.createElement("div");
        flex.style.display = "flex";
        flex.style.justifyContent = "center";
        flex.style.alignItems = "center";
        flex.style.height = "100%";
        flex.style.flexDirection = "column";
        menu.appendChild(flex);
        this.box = flex;
        for (const e of elements) {
            this.box.appendChild(e);
        }
        __classPrivateFieldGet(this, _BoardEvent_instances, "m", _BoardEvent_appendButtons).call(this, ok, deny);
        this.menu = menu;
        document.body.appendChild(menu);
    }
    static generateTextBox(text) {
        const description = document.createElement("div");
        description.textContent = text;
        description.style.fontSize = "30px";
        description.style.margin = "50px";
        description.style.textAlign = "center";
        return description;
    }
    static generateImage(src) {
        const img = document.createElement("img");
        img.src = src;
        img.style.width = "30%";
        return img;
    }
    static generateButton(label, color, enabled, event, borderColor) {
        const button = document.createElement("div");
        if (enabled) {
            button.className = "pointerHover";
        }
        button.textContent = label;
        button.style.fontSize = "30px";
        button.style.margin = "50px";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.border = `3px solid ${borderColor === undefined ? "#ffd700" : borderColor}`;
        button.style.backgroundColor = color;
        button.addEventListener("click", event);
        return button;
    }
    static unappendedOkSetup() {
        return { append: false, enable: false };
    }
    static okSetup(enable, customLabel, customHandler) {
        return { append: true, enable, customLabel, customHandler };
    }
    enableOk(customHandler) {
        const button = document.getElementById("menuOk");
        if (button === null) {
            console.log("WARN: called enable ok while button isn't initialized yet");
            return;
        }
        button.style.backgroundColor = "#03a316";
        button.className = "pointerHover";
        button.addEventListener("click", __classPrivateFieldGet(this, _BoardEvent_instances, "m", _BoardEvent_handlerOrDefault).call(this, customHandler));
    }
    disableOk() {
        const button = document.getElementById("menuOk");
        if (button === null) {
            console.log("WARN: called disable ok while button isn't initialized yet");
            return;
        }
        const clone = button.cloneNode(true);
        button.parentNode?.replaceChild(clone, button);
        clone.style.backgroundColor = "#aba7a7";
        clone.className = "";
    }
    static denySetup(append, customLabel, customHandler) {
        return { append, customLabel, customHandler };
    }
}
_a = BoardEvent, _BoardEvent_instances = new WeakSet(), _BoardEvent_appendButtons = function _BoardEvent_appendButtons(ok, deny) {
    if (!ok.append && !deny.append) {
        return;
    }
    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.justifyContent = "center";
    if (ok.append) {
        buttons.appendChild(__classPrivateFieldGet(this, _BoardEvent_instances, "m", _BoardEvent_okButton).call(this, ok));
    }
    if (deny.append) {
        buttons.appendChild(__classPrivateFieldGet(this, _BoardEvent_instances, "m", _BoardEvent_denyButton).call(this, deny.customLabel, deny.customHandler));
    }
    this.box.appendChild(buttons);
}, _BoardEvent_okButton = function _BoardEvent_okButton(config) {
    const button = _a.generateButton(config.customLabel === undefined ? "Ok" : config.customLabel, config.enable ? "#03a316" : "#aba7a7", config.enable, () => { });
    if (config.enable) {
        button.className = "pointerHover";
        button.addEventListener("click", __classPrivateFieldGet(this, _BoardEvent_instances, "m", _BoardEvent_handlerOrDefault).call(this, config.customHandler));
    }
    button.id = "menuOk";
    button.style.textAlign = "center";
    return button;
}, _BoardEvent_denyButton = function _BoardEvent_denyButton(label, handler) {
    const button = _a.generateButton(label === undefined ? "Refuser" : label, "#c10a19ff", true, __classPrivateFieldGet(this, _BoardEvent_instances, "m", _BoardEvent_handlerOrDefault).call(this, handler));
    button.id = "menuDeny";
    button.style.textAlign = "center";
    return button;
}, _BoardEvent_handlerOrDefault = function _BoardEvent_handlerOrDefault(handler) {
    return handler === undefined ? () => { document.body.removeChild(this.menu); } : () => { document.body.removeChild(this.menu); handler(); };
};
