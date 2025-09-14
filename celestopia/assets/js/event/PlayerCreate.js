var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _InitEvent_instances, _InitEvent_chosen, _InitEvent_chosenBtn, _InitEvent_tx, _InitEvent_okHandler, _PlayerCreate_instances, _PlayerCreate_tx, _PlayerCreate_textBox, _PlayerCreate_okEnabled, _PlayerCreate_prompt, _PlayerCreate_chosenColor, _PlayerCreate_chosenAvatar, _PlayerCreate_updateOk, _PlayerCreate_okHandler, _Listener_prompt, _Listener_caller;
import { Player } from "../Player.js";
import { initChannel } from "../util/channel.js";
import { assets_link, isCharAlphanumeric, removeFromArrayByValue } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { BoardEvent } from "./BoardEvent.js";
const AVAILABLE_AVATARS = ["crown", "dice", "hat", "heart", "strawberry"];
const AVATAR_BUTTONS = new Map();
const AVAILABLE_COLORS = Player.colors();
const COLOR_BUTTONS = new Map();
export async function initPlayersLocal() {
    const { tx, rx } = initChannel();
    new InitEvent(tx);
    return await rx.recv();
}
class InitEvent extends BoardEvent {
    constructor(tx) {
        const boxes = document.createElement("div");
        boxes.style.display = "flex";
        boxes.style.justifyContent = "space-between";
        boxes.style.width = "80vw";
        for (let i = 2; i < 5; i++) {
            const btn = document.createElement("div");
            btn.textContent = i.toString();
            btn.style.height = "10vh";
            btn.style.backgroundColor = "#ffd700";
            btn.style.border = "5px solid black";
            btn.style.fontSize = "6vh";
            btn.style.textAlign = "center";
            btn.style.display = "grid";
            btn.style.alignItems = "center";
            btn.style.width = "10vw";
            btn.style.borderRadius = "20px";
            btn.addEventListener("click", () => {
                if (__classPrivateFieldGet(this, _InitEvent_chosenBtn, "f") !== undefined) {
                    __classPrivateFieldGet(this, _InitEvent_chosenBtn, "f").className = "";
                }
                else {
                    this.enableOk(() => __classPrivateFieldGet(this, _InitEvent_instances, "m", _InitEvent_okHandler).call(this));
                }
                __classPrivateFieldSet(this, _InitEvent_chosen, i, "f");
                __classPrivateFieldSet(this, _InitEvent_chosenBtn, btn, "f");
                btn.className = "hue";
            });
            boxes.appendChild(btn);
        }
        super([BoardEvent.generateTextBox("Combien sommes nous à jouer ?"), boxes], BoardEvent.okSetup(false), BoardEvent.denySetup(false));
        _InitEvent_instances.add(this);
        _InitEvent_chosen.set(this, void 0);
        _InitEvent_chosenBtn.set(this, void 0);
        _InitEvent_tx.set(this, void 0);
        __classPrivateFieldSet(this, _InitEvent_tx, tx, "f");
    }
}
_InitEvent_chosen = new WeakMap(), _InitEvent_chosenBtn = new WeakMap(), _InitEvent_tx = new WeakMap(), _InitEvent_instances = new WeakSet(), _InitEvent_okHandler = async function _InitEvent_okHandler() {
    const res = [];
    for (let j = 0; j < __classPrivateFieldGet(this, _InitEvent_chosen, "f"); j++) {
        const { tx, rx } = initChannel();
        new PlayerCreate(tx);
        const data = await rx.recv();
        removeFromArrayByValue(AVAILABLE_AVATARS, data.avatar);
        removeFromArrayByValue(AVAILABLE_COLORS, data.color);
        res.push(new Player(j + 1, data.name, data.avatar, data.color));
    }
    __classPrivateFieldGet(this, _InitEvent_tx, "f").send(res);
};
class PlayerCreate extends BoardEvent {
    constructor(tx) {
        const nameBox = document.createElement("p");
        nameBox.textContent = "Entrez un nom: ";
        nameBox.style.height = "10vh";
        nameBox.style.width = "60vw";
        nameBox.style.textAlign = "center";
        nameBox.style.display = "grid";
        nameBox.style.alignItems = "center";
        nameBox.style.fontSize = "4vh";
        nameBox.style.border = "5px solid black";
        nameBox.style.borderRadius = "10px";
        nameBox.style.backgroundColor = "#f9e678";
        nameBox.style.marginTop = "2vh";
        const avatarButtons = document.createElement("div");
        avatarButtons.className = "row-box";
        avatarButtons.style.width = "100vw";
        AVAILABLE_AVATARS.forEach((x) => {
            const box = document.createElement("div");
            box.style.padding = "0.5vw";
            box.style.backgroundColor = "#f9e678";
            box.style.margin = "1vw";
            box.style.borderRadius = "20px";
            box.addEventListener("click", () => {
                if (__classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f") !== undefined) {
                    disableAvatarButton(__classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f"));
                }
                enableAvatarButton(x, __classPrivateFieldGet(this, _PlayerCreate_chosenColor, "f"));
                __classPrivateFieldSet(this, _PlayerCreate_chosenAvatar, x, "f");
                __classPrivateFieldGet(this, _PlayerCreate_instances, "m", _PlayerCreate_updateOk).call(this);
            });
            const img = document.createElement("img");
            img.src = assets_link(`icons/${x}.png`);
            img.style.width = "9.5vw";
            box.appendChild(img);
            avatarButtons.appendChild(box);
            AVATAR_BUTTONS.set(x, box);
        });
        const colorButtons = document.createElement("div");
        colorButtons.className = "row-box";
        colorButtons.style.width = "100vw";
        AVAILABLE_COLORS.forEach((x) => {
            const box = document.createElement("div");
            box.style.backgroundColor = Player.palette(x).base;
            box.style.width = "10vh";
            box.style.height = "10vh";
            box.style.margin = "1vw";
            box.style.borderRadius = "20px";
            box.addEventListener("click", () => {
                if (__classPrivateFieldGet(this, _PlayerCreate_chosenColor, "f") !== undefined) {
                    disableColorButton(__classPrivateFieldGet(this, _PlayerCreate_chosenColor, "f"));
                }
                enableColorButton(x);
                __classPrivateFieldSet(this, _PlayerCreate_chosenColor, x, "f");
                const color = Player.palette(x);
                nameBox.style.borderColor = color.base;
                this.menu.style.backgroundColor = color.info;
                if (__classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f") === undefined) {
                    return;
                }
                const elm = AVATAR_BUTTONS.get(__classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f"));
                if (elm === undefined) {
                    console.log(`unhandled chosen avatar: ${__classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f")}`);
                    return;
                }
                elm.style.borderColor = color.base;
                __classPrivateFieldGet(this, _PlayerCreate_instances, "m", _PlayerCreate_updateOk).call(this);
            });
            colorButtons.appendChild(box);
            COLOR_BUTTONS.set(x, box);
        });
        const avatarText = BoardEvent.generateTextBox("Choisissez un avatar...");
        const colorText = BoardEvent.generateTextBox("... et une couleur.");
        [avatarText, colorText].forEach((x) => {
            x.style.marginTop = "5vh";
            x.style.marginBottom = "1vh";
        });
        super([
            nameBox,
            avatarText,
            avatarButtons,
            colorText,
            colorButtons
        ], BoardEvent.okSetup(false), BoardEvent.denySetup(false));
        _PlayerCreate_instances.add(this);
        _PlayerCreate_tx.set(this, void 0);
        _PlayerCreate_textBox.set(this, void 0);
        _PlayerCreate_okEnabled.set(this, void 0);
        _PlayerCreate_prompt.set(this, void 0);
        _PlayerCreate_chosenColor.set(this, void 0);
        _PlayerCreate_chosenAvatar.set(this, void 0);
        __classPrivateFieldSet(this, _PlayerCreate_tx, tx, "f");
        __classPrivateFieldSet(this, _PlayerCreate_okEnabled, false, "f");
        this.menu.style.overflowY = "scroll";
        __classPrivateFieldSet(this, _PlayerCreate_prompt, "", "f");
        new Listener(nameBox, this);
        __classPrivateFieldSet(this, _PlayerCreate_textBox, nameBox, "f");
    }
    update(text) {
        __classPrivateFieldSet(this, _PlayerCreate_prompt, text, "f");
        __classPrivateFieldGet(this, _PlayerCreate_textBox, "f").textContent = `Entrez un nom: ${text}`;
        __classPrivateFieldGet(this, _PlayerCreate_instances, "m", _PlayerCreate_updateOk).call(this);
    }
}
_PlayerCreate_tx = new WeakMap(), _PlayerCreate_textBox = new WeakMap(), _PlayerCreate_okEnabled = new WeakMap(), _PlayerCreate_prompt = new WeakMap(), _PlayerCreate_chosenColor = new WeakMap(), _PlayerCreate_chosenAvatar = new WeakMap(), _PlayerCreate_instances = new WeakSet(), _PlayerCreate_updateOk = function _PlayerCreate_updateOk() {
    if (__classPrivateFieldGet(this, _PlayerCreate_okEnabled, "f")) {
        if (__classPrivateFieldGet(this, _PlayerCreate_prompt, "f").length === 0 || __classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f") === undefined || __classPrivateFieldGet(this, _PlayerCreate_chosenColor, "f") === undefined) {
            console.log("disable");
            this.disableOk();
            __classPrivateFieldSet(this, _PlayerCreate_okEnabled, false, "f");
        }
    }
    else {
        if (__classPrivateFieldGet(this, _PlayerCreate_prompt, "f").length > 0 && __classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f") !== undefined && __classPrivateFieldGet(this, _PlayerCreate_chosenColor, "f") !== undefined) {
            this.enableOk(() => __classPrivateFieldGet(this, _PlayerCreate_instances, "m", _PlayerCreate_okHandler).call(this));
            __classPrivateFieldSet(this, _PlayerCreate_okEnabled, true, "f");
        }
    }
}, _PlayerCreate_okHandler = function _PlayerCreate_okHandler() {
    __classPrivateFieldGet(this, _PlayerCreate_tx, "f").send({ name: __classPrivateFieldGet(this, _PlayerCreate_prompt, "f"), avatar: __classPrivateFieldGet(this, _PlayerCreate_chosenAvatar, "f"), color: __classPrivateFieldGet(this, _PlayerCreate_chosenColor, "f") });
};
class Listener extends KeyboardListener {
    constructor(elm, caller) {
        super(elm);
        _Listener_prompt.set(this, void 0);
        _Listener_caller.set(this, void 0);
        __classPrivateFieldSet(this, _Listener_prompt, "", "f");
        __classPrivateFieldSet(this, _Listener_caller, caller, "f");
    }
    eventHandler(event) {
        if (isCharAlphanumeric(event.key)) {
            __classPrivateFieldSet(this, _Listener_prompt, __classPrivateFieldGet(this, _Listener_prompt, "f") + event.key, "f");
        }
        else if (event.key === "Backspace") {
            __classPrivateFieldSet(this, _Listener_prompt, __classPrivateFieldGet(this, _Listener_prompt, "f").substring(0, __classPrivateFieldGet(this, _Listener_prompt, "f").length - 1), "f");
        }
        else {
            return;
        }
        __classPrivateFieldGet(this, _Listener_caller, "f").update(__classPrivateFieldGet(this, _Listener_prompt, "f"));
    }
}
_Listener_prompt = new WeakMap(), _Listener_caller = new WeakMap();
function enableAvatarButton(x, borderColor) {
    const elm = AVATAR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }
    elm.classList.add("hue");
    elm.style.border = `solid 5px ${borderColor === undefined ? "black" : Player.palette(borderColor).base}`;
}
function disableAvatarButton(x) {
    const elm = AVATAR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }
    elm.classList.remove("hue");
    elm.style.border = "none";
}
function enableColorButton(x) {
    const elm = COLOR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }
    elm.style.border = "solid 5px #ffd700";
}
function disableColorButton(x) {
    const elm = COLOR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }
    elm.style.border = "none";
}
