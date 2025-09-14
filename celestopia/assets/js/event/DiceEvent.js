var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DiceEvent_instances, _DiceEvent_bg, _DiceEvent_tx, _DiceEvent_diceNumber, _DiceEvent_n, _DiceEvent_color, _DiceEvent_stop, _DiceEvent_FPS, _DiceEvent_routine, _DiceEvent_selectAnimation, _DiceEvent_randomGenerator, _DiceEvent_linearGenerator;
import { appendBlurryBackground, appendCross, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
function generateMenu(color, tricked) {
    const bg = appendBlurryBackground();
    bg.style.display = "flex";
    bg.style.justifyContent = "center";
    bg.style.alignItems = "center";
    const dice = document.createElement("div");
    dice.style.width = "30vw";
    dice.style.height = "30vw";
    dice.style.zIndex = "6";
    dice.style.backgroundColor = tricked ? "#ffd700" : "azure";
    dice.style.borderRadius = "20%";
    dice.style.border = `solid ${vwToPx(3)}px ${color}`;
    dice.style.display = "grid";
    dice.style.alignItems = "center";
    dice.style.textAlign = "center";
    dice.style.fontSize = `${vwToPx(20)}px`;
    bg.appendChild(dice);
    if (!tricked) {
        appendCross(["menu"], bg);
    }
    ;
    return { bg, dice };
}
export class DiceEvent extends KeyboardListener {
    constructor(tx, dices, tricked) {
        let color;
        switch (dices) {
            case 1:
                color = "#496dfe";
                break;
            case 2:
                color = "#e01e1e";
                break;
            case 3:
                color = "#ffd700";
                break;
        }
        const { bg, dice } = generateMenu(color, tricked);
        super(dice);
        _DiceEvent_instances.add(this);
        _DiceEvent_bg.set(this, void 0);
        _DiceEvent_tx.set(this, void 0);
        _DiceEvent_diceNumber.set(this, void 0);
        _DiceEvent_n.set(this, void 0);
        _DiceEvent_color.set(this, void 0);
        _DiceEvent_stop.set(this, void 0);
        _DiceEvent_FPS.set(this, void 0);
        __classPrivateFieldSet(this, _DiceEvent_bg, bg, "f");
        __classPrivateFieldSet(this, _DiceEvent_tx, tx, "f");
        __classPrivateFieldSet(this, _DiceEvent_diceNumber, tricked ? 1 : dices, "f");
        __classPrivateFieldSet(this, _DiceEvent_n, __classPrivateFieldGet(this, _DiceEvent_diceNumber, "f"), "f");
        __classPrivateFieldSet(this, _DiceEvent_stop, false, "f");
        __classPrivateFieldSet(this, _DiceEvent_color, color, "f");
        __classPrivateFieldSet(this, _DiceEvent_FPS, tricked ? 1 : 15, "f");
        __classPrivateFieldGet(this, _DiceEvent_instances, "m", _DiceEvent_routine).call(this, tricked ? () => __classPrivateFieldGet(this, _DiceEvent_instances, "m", _DiceEvent_linearGenerator).call(this) : () => __classPrivateFieldGet(this, _DiceEvent_instances, "m", _DiceEvent_randomGenerator).call(this));
    }
    eventHandler(event) {
        if (event.key === " ") {
            __classPrivateFieldSet(this, _DiceEvent_stop, true, "f");
            __classPrivateFieldGet(this, _DiceEvent_instances, "m", _DiceEvent_selectAnimation).call(this).then(() => {
                __classPrivateFieldGet(this, _DiceEvent_tx, "f").send(__classPrivateFieldGet(this, _DiceEvent_n, "f"));
                document.body.removeChild(__classPrivateFieldGet(this, _DiceEvent_bg, "f"));
            });
        }
    }
}
_DiceEvent_bg = new WeakMap(), _DiceEvent_tx = new WeakMap(), _DiceEvent_diceNumber = new WeakMap(), _DiceEvent_n = new WeakMap(), _DiceEvent_color = new WeakMap(), _DiceEvent_stop = new WeakMap(), _DiceEvent_FPS = new WeakMap(), _DiceEvent_instances = new WeakSet(), _DiceEvent_routine = async function _DiceEvent_routine(generator) {
    while (!__classPrivateFieldGet(this, _DiceEvent_stop, "f")) {
        generator();
        this.element.textContent = __classPrivateFieldGet(this, _DiceEvent_n, "f").toString();
        await new Promise(r => setTimeout(r, 1000 / __classPrivateFieldGet(this, _DiceEvent_FPS, "f")));
    }
}, _DiceEvent_selectAnimation = async function _DiceEvent_selectAnimation() {
    let black = false;
    for (let i = 0; i < 10; i++) {
        this.element.style.color = black ? "#000000" : __classPrivateFieldGet(this, _DiceEvent_color, "f");
        black = !black;
        await new Promise(r => setTimeout(r, 200));
    }
}, _DiceEvent_randomGenerator = function _DiceEvent_randomGenerator() {
    switch (__classPrivateFieldGet(this, _DiceEvent_diceNumber, "f")) {
        case 1:
            __classPrivateFieldSet(this, _DiceEvent_n, 1 + Math.floor(Math.random() * 6), "f");
            break;
        case 2:
            __classPrivateFieldSet(this, _DiceEvent_n, 2 + Math.floor(Math.random() * 11), "f");
            break;
        case 3:
            __classPrivateFieldSet(this, _DiceEvent_n, 3 + Math.floor(Math.random() * 16), "f");
            break;
    }
}, _DiceEvent_linearGenerator = function _DiceEvent_linearGenerator() {
    var _a;
    if (__classPrivateFieldGet(this, _DiceEvent_n, "f") === 6) {
        __classPrivateFieldSet(this, _DiceEvent_n, 1, "f");
    }
    else {
        __classPrivateFieldSet(this, _DiceEvent_n, (_a = __classPrivateFieldGet(this, _DiceEvent_n, "f"), _a++, _a), "f");
    }
};
