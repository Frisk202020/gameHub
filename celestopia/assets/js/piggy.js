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
var _Piggy_instances, _Piggy_counter, _Piggy_icon, _Piggy_counterRevealed, _Piggy_generateUI, _Piggy_progressiveCounterIncrement;
import { assets_link, vhToPx, vwToPx } from "./util/functions.js";
const MAX = 10000;
export class Piggy {
    constructor() {
        _Piggy_instances.add(this);
        _Piggy_counter.set(this, void 0);
        _Piggy_icon.set(this, void 0);
        _Piggy_counterRevealed.set(this, void 0);
        this.content = 0;
        __classPrivateFieldSet(this, _Piggy_counterRevealed, false, "f");
        __classPrivateFieldGet(this, _Piggy_instances, "m", _Piggy_generateUI).call(this);
    }
    feed(cash) {
        if (this.content >= MAX) {
            return;
        }
        if (this.content + cash > MAX) {
            cash = MAX - this.content;
        }
        __classPrivateFieldGet(this, _Piggy_instances, "m", _Piggy_progressiveCounterIncrement).call(this, cash);
    }
    async multiply(factor) {
        if (this.content >= MAX) {
            return;
        }
        if (this.content * factor >= MAX) {
            await __classPrivateFieldGet(this, _Piggy_instances, "m", _Piggy_progressiveCounterIncrement).call(this, MAX - this.content);
        }
        else {
            await __classPrivateFieldGet(this, _Piggy_instances, "m", _Piggy_progressiveCounterIncrement).call(this, (factor - 1) * this.content);
        }
    }
    break() {
        const rect = __classPrivateFieldGet(this, _Piggy_icon, "f").getBoundingClientRect();
        const boom = document.createElement("img");
        boom.src = assets_link(`boom.gif?t=${Date.now()}`);
        boom.style.left = `${rect.left - vwToPx(1)}px`;
        boom.style.top = `${rect.top - vhToPx(5)}px`;
        boom.style.width = "10vw";
        boom.style.zIndex = "5";
        boom.style.position = "fixed";
        new Audio(assets_link("boom.mp3")).play();
        document.body.appendChild(boom);
        new Promise(r => setTimeout(r, 1800)).then(() => {
            document.body.removeChild(boom);
        });
        const content = this.content;
        __classPrivateFieldGet(this, _Piggy_instances, "m", _Piggy_progressiveCounterIncrement).call(this, -content);
        return content;
    }
    loadContent(n) { this.content = n; }
    //gold: 255,215,0
    setColor() {
        const ratio = this.content / MAX;
        __classPrivateFieldGet(this, _Piggy_counter, "f").style.backgroundColor = `rgb(255, ${255 - Math.round(40 * ratio)}, ${255 - Math.round(255 * ratio)})`;
        if (this.content === MAX) {
            __classPrivateFieldGet(this, _Piggy_counter, "f").style.color = "#ab0c0c";
        }
    }
}
_Piggy_counter = new WeakMap(), _Piggy_icon = new WeakMap(), _Piggy_counterRevealed = new WeakMap(), _Piggy_instances = new WeakSet(), _Piggy_generateUI = function _Piggy_generateUI() {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.bottom = "1vh";
    box.style.right = "1vw";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.zIndex = "1";
    const counter = document.createElement("p");
    counter.id = "bankCounter";
    counter.classList.add("reveal-horizontal");
    counter.textContent = "0";
    counter.style.fontSize = "2vw";
    counter.style.backgroundColor = "#ffffff";
    counter.style.padding = "0.5vw";
    counter.style.margin = "0px";
    counter.style.height = "3vw";
    counter.style.width = "6vw";
    counter.style.borderRadius = "10px";
    counter.style.textAlign = "right";
    __classPrivateFieldSet(this, _Piggy_counter, counter, "f");
    box.appendChild(counter);
    const icon = document.createElement("img");
    icon.src = assets_link("icons/pig.png");
    icon.style.height = "8vw";
    icon.style.width = "8vw";
    icon.style.marginLeft = "2vw";
    icon.className = "pointerHover";
    __classPrivateFieldSet(this, _Piggy_icon, icon, "f");
    box.appendChild(icon);
    icon.addEventListener("click", () => {
        icon.src = assets_link("icons/pigHappy.png");
        new Promise(r => setTimeout(r, 500)).then(() => icon.src = assets_link("icons/pig.png"));
        if (__classPrivateFieldGet(this, _Piggy_counterRevealed, "f")) {
            counter.classList.remove("visible");
        }
        else {
            counter.classList.add("visible");
        }
        __classPrivateFieldSet(this, _Piggy_counterRevealed, !__classPrivateFieldGet(this, _Piggy_counterRevealed, "f"), "f");
    });
    document.body.appendChild(box);
}, _Piggy_progressiveCounterIncrement = async function _Piggy_progressiveCounterIncrement(increment) {
    if (!__classPrivateFieldGet(this, _Piggy_counterRevealed, "f")) {
        __classPrivateFieldGet(this, _Piggy_counter, "f").classList.add("visible");
    }
    const dN = increment / 120;
    const current = this.content;
    const target = current + increment;
    this.content = increment;
    __classPrivateFieldGet(this, _Piggy_counter, "f").style.color = increment >= 0 ? "#009220" : "#b70808";
    await new Promise(r => setTimeout(r, 2000));
    this.content = current;
    __classPrivateFieldGet(this, _Piggy_counter, "f").style.color = "black";
    for (let i = 0; i < 120; i++) {
        this.content += dN;
        await new Promise(r => setTimeout(r, 100 / 6));
    }
    this.content = target;
};
