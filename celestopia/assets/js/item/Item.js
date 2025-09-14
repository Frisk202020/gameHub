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
var _Item_name, _Item_description, _Item_img, _Item_imgEvent, _Item_event;
import { Popup } from "../event/Popup.js";
import { assets_link, vwToPx } from "../util/functions.js";
export class Item {
    constructor(p, name, description, imgId, event, padding) {
        _Item_name.set(this, void 0);
        _Item_description.set(this, void 0);
        _Item_img.set(this, void 0);
        _Item_imgEvent.set(this, void 0);
        _Item_event.set(this, void 0);
        this.holder = p;
        __classPrivateFieldSet(this, _Item_imgEvent, () => { }, "f");
        __classPrivateFieldSet(this, _Item_name, name, "f");
        __classPrivateFieldSet(this, _Item_description, description, "f");
        const img = document.createElement("img");
        img.src = assets_link(`items/${imgId}.png`);
        img.style.width = padding ? "10vw" : "11vw";
        img.style.margin = "5vw";
        if (padding) {
            img.style.padding = "0.5vw";
        }
        img.style.backgroundColor = `${p.color}96`; // 96(hex) = 150(dec)
        img.style.borderRadius = "15px";
        img.style.border = "solid 5px transparent";
        img.addEventListener("click", () => __classPrivateFieldGet(this, _Item_imgEvent, "f").call(this));
        __classPrivateFieldSet(this, _Item_img, img, "f");
        __classPrivateFieldSet(this, _Item_event, event, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _Item_name, "f");
    }
    get imgStyle() {
        return __classPrivateFieldGet(this, _Item_img, "f").style;
    }
    getImg(event) {
        this.removeBorder();
        if (event === undefined) {
            __classPrivateFieldSet(this, _Item_imgEvent, () => { }, "f");
        }
        else {
            __classPrivateFieldSet(this, _Item_imgEvent, event, "f");
        }
        __classPrivateFieldGet(this, _Item_img, "f").className = "pointerHover";
        return __classPrivateFieldGet(this, _Item_img, "f");
    }
    setBorder() {
        __classPrivateFieldGet(this, _Item_img, "f").style.borderColor = "#ffd700";
    }
    removeBorder() {
        __classPrivateFieldGet(this, _Item_img, "f").style.borderColor = "transparent";
    }
    event(param) {
        __classPrivateFieldGet(this, _Item_event, "f").call(this, param);
        this.holder.removeItem(this);
    }
    // Expected to be called after appending the img to the menu
    addHelpButton(parent) {
        const rect = __classPrivateFieldGet(this, _Item_img, "f").getBoundingClientRect();
        const button = document.createElement("img");
        button.src = assets_link("icons/help.png");
        button.className = "pointerHover";
        button.style.width = "5vw";
        button.style.position = "absolute";
        button.style.left = `${rect.right - vwToPx(2.5)}px`;
        button.style.top = `${rect.top - vwToPx(2.5)}px`;
        button.addEventListener("click", () => new Popup(__classPrivateFieldGet(this, _Item_description, "f"), __classPrivateFieldGet(this, _Item_name, "f")));
        parent.appendChild(button);
    }
    static async getRandomItem(holder) {
        const pick = Math.floor(Math.random() * 130);
        let name;
        if (pick < 5) {
            name = "AquisitionThief";
        }
        else if (pick < 20) {
            name = "MoneyThief";
        }
        else if (pick < 35) {
            name = "Pipe";
        }
        else if (pick < 50) {
            name = "TrickItem";
        }
        else if (pick < 65) {
            name = "Seller";
        }
        else {
            name = "DiceItem";
        }
        return await itemFactory(name, holder);
    }
    static async getByName(name, holder) {
        return await itemFactory(name, holder);
    }
}
_Item_name = new WeakMap(), _Item_description = new WeakMap(), _Item_img = new WeakMap(), _Item_imgEvent = new WeakMap(), _Item_event = new WeakMap();
async function itemFactory(name, holder) {
    switch (name) {
        case "DiceItem":
            const { DiceItem } = await import("./DiceItem.js");
            return new DiceItem(holder);
        case "AquisitionThief":
            const { AquisitionThief } = await import("./AquisitionThief.js");
            return new AquisitionThief(holder);
        case "MoneyThief":
            const { MoneyThief } = await import("./MoneyThief.js");
            return new MoneyThief(holder);
        case "Pipe":
            const { Pipe } = await import("./Pipe.js");
            return new Pipe(holder);
        case "Seller":
            const { Seller } = await import("./Seller.js");
            return new Seller(holder);
        case "TrickItem":
            const { TrickItem } = await import("./TrickItem.js");
            return new TrickItem(holder);
    }
}
