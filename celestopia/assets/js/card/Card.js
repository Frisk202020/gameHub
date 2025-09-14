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
var _Card_title, _Card_html, _Card_neutralHtml, _CardMenu_instances, _a, _CardMenu_cards, _CardMenu_imgBox, _CardMenu_navSquares, _CardMenu_navColor, _CardMenu_current, _CardMenu_sellChannel, _CardMenu_setup, _CardMenu_sellEvent, _CardMenu_appendToRight, _CardMenu_appendToLeft, _CardMenu_moveCards, _Listener_caller;
import { BoardEvent } from "../event/BoardEvent.js";
import { Popup } from "../event/Popup.js";
import { initChannel } from "../util/channel.js";
import { assets_link, pxToVw, unwrap_or_default, vwToPx } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { Aquisition } from "./Aquisition.js";
export const cardWidth = 35; //vw
export const cardHeight = 20; //vw
const border = cardHeight / 25; //vw
const oultine = cardHeight / 35; //vw
const frames = 60; //FPS
const animationTime = 0.5; //seconds
const centerX = (100 - cardWidth) / 2;
const inactiveSquareColor = "#5e5c5c";
export class Card {
    constructor(name, title, imgFolder, baseColor, midColor, endColor, extention) {
        _Card_title.set(this, void 0);
        _Card_html.set(this, void 0);
        _Card_neutralHtml.set(this, void 0);
        this._name = name;
        __classPrivateFieldSet(this, _Card_title, title, "f");
        this.imgSrc = assets_link(`cards/${imgFolder}/${name}.${unwrap_or_default(extention, "png")}`);
        __classPrivateFieldSet(this, _Card_html, null, "f");
        __classPrivateFieldSet(this, _Card_neutralHtml, null, "f");
        this.color = { base: baseColor, mid: midColor, end: endColor };
    }
    get title() {
        return __classPrivateFieldGet(this, _Card_title, "f");
    }
    // lazy initialization because we have circular imports otherwhise 
    get html() {
        if (__classPrivateFieldGet(this, _Card_html, "f") === null) {
            this.buildHtml(true);
        }
        return __classPrivateFieldGet(this, _Card_html, "f");
    }
    get neutralHtml() {
        if (__classPrivateFieldGet(this, _Card_neutralHtml, "f") === null) {
            this.buildHtml(false);
        }
        return __classPrivateFieldGet(this, _Card_neutralHtml, "f");
    }
    buildHtml(centered) {
        const elm = document.createElement("div");
        elm.style.width = `${cardWidth}vw`;
        elm.style.height = `${cardHeight}vw`;
        elm.style.display = "flex";
        elm.style.flexDirection = "column";
        elm.style.alignItems = "center";
        elm.style.justifyContent = "center";
        elm.style.border = `solid black ${border}vw`;
        elm.style.borderRadius = "20px";
        elm.style.outline = `solid ${oultine}vw white`;
        elm.style.background = `radial-gradient(${this.color.base} 30%, ${this.color.mid} 80%, ${this.color.end} 100%)`;
        let titleWidth = cardWidth / 8;
        const title = Card.generateParagraph(this.title, titleWidth);
        title.style.margin = "0.5vw";
        title.style.textShadow = "2px 2px 2px #ffffff";
        title.style.whiteSpace = "nowrap";
        const obs = new ResizeObserver(() => {
            if (title.scrollWidth === 0) {
                return; // wait for style to be computed before any operation
            }
            while (title.scrollWidth > vwToPx(cardWidth)) {
                titleWidth *= 0.8;
                title.style.fontSize = `${titleWidth}vw`;
            }
            obs.disconnect();
        });
        obs.observe(title);
        elm.appendChild(title);
        const box = document.createElement("box");
        box.style.display = "flex";
        box.style.justifyContent = "space-evenly";
        box.style.alignItems = "center";
        box.style.height = "20vw";
        box.style.width = `${cardWidth}vw`;
        box.style.marginTop = "1vw";
        const img = document.createElement("img");
        img.src = this.imgSrc;
        img.style.height = `${cardHeight / 2}vw`;
        img.style.width = `${cardHeight / 2}vw`;
        img.style.borderRadius = "20px";
        img.style.maskImage = "radial-gradient(rgba(0, 0, 0, 1) 50%, transparent 100%)";
        box.appendChild(img);
        const values = this.dataLayout();
        box.appendChild(values);
        elm.appendChild(box);
        if (centered) {
            elm.style.position = "absolute";
            __classPrivateFieldSet(this, _Card_html, elm, "f");
        }
        else {
            __classPrivateFieldSet(this, _Card_neutralHtml, elm, "f");
        }
    }
    static generateValueBoxes(coinValue, ribbonValue, starValue, highlight) {
        const args = [
            { m: "coin", n: coinValue, h: highlight === "coin" },
            { m: "ribbon", n: ribbonValue, h: highlight === "ribbon" },
            { m: "star", n: starValue, h: highlight === "star" }
        ];
        return args.map((x) => this.generateValueBox(x.m, x.n, x.h));
    }
    static generateValueBox(money, value, highlight) {
        const box = document.createElement("div");
        box.className = "row-box";
        box.style.margin = "0.1vw";
        const img = document.createElement("img");
        img.src = assets_link(`icons/${money}.png`);
        img.style.height = `${cardHeight / 10}vw`;
        img.style.marginRight = "1vw";
        box.appendChild(img);
        const p = this.generateParagraph(value.toString(), cardHeight / 12);
        if (highlight) {
            p.className = "hue";
            p.style.color = "#ffd700";
        }
        box.appendChild(p);
        return box;
    }
    static generateParagraph(text, height) {
        const p = document.createElement("p");
        p.textContent = text;
        p.className = "centered-p";
        p.style.fontSize = `${unwrap_or_default(height, cardHeight / 10)}vw`;
        p.style.margin = "0.5vw";
        return p;
    }
    static generateMenu(cards, sellConfig) {
        if (cards.length === 0) {
            if (sellConfig !== undefined) {
                const { tx, rx } = initChannel();
                new Popup("Vous n'avez aucune carte...", undefined, tx);
                rx.recv().then(() => sellConfig.tx.send(undefined));
            }
            else {
                new Popup("Vous n'avez aucune carte...");
            }
            return;
        }
        else {
            new CardMenu(cards, cards[0].color.base, sellConfig);
        }
    }
}
_Card_title = new WeakMap(), _Card_html = new WeakMap(), _Card_neutralHtml = new WeakMap();
class CardMenu extends BoardEvent {
    constructor(cards, navBarColor, config) {
        const setup = __classPrivateFieldGet(_a, _a, "m", _CardMenu_setup).call(_a, cards, navBarColor, config);
        const okSetup = (() => {
            switch (setup.okSetup) {
                case 1 /* MenuOkSetup.Appended */: return BoardEvent.okSetup(true);
                case 0 /* MenuOkSetup.Unappended */: return BoardEvent.unappendedOkSetup();
                case 2 /* MenuOkSetup.Sell */: return BoardEvent.okSetup(true, "Vendre", () => __classPrivateFieldGet(this, _CardMenu_instances, "m", _CardMenu_sellEvent).call(this));
            }
        })();
        super(setup.elements, okSetup, setup.denySetup ? BoardEvent.denySetup(true, "Retour") : BoardEvent.denySetup(false));
        _CardMenu_instances.add(this);
        _CardMenu_cards.set(this, void 0);
        _CardMenu_imgBox.set(this, void 0);
        _CardMenu_navSquares.set(this, void 0);
        _CardMenu_navColor.set(this, void 0);
        _CardMenu_current.set(this, void 0);
        _CardMenu_sellChannel.set(this, void 0);
        this.menu.style.overflowY = "scroll";
        __classPrivateFieldSet(this, _CardMenu_current, 0, "f");
        if (cards.length > 0) {
            if (cards.length !== 1) {
                new Listener(this.menu, this);
            } // menu as seperate arg bc it's protected
            __classPrivateFieldSet(this, _CardMenu_imgBox, setup.elements[0], "f");
            __classPrivateFieldSet(this, _CardMenu_navSquares, setup.navSquares, "f");
            __classPrivateFieldSet(this, _CardMenu_navColor, navBarColor, "f");
        }
        __classPrivateFieldSet(this, _CardMenu_cards, setup.cards, "f");
        __classPrivateFieldSet(this, _CardMenu_sellChannel, setup.sellChannel, "f");
    }
    async nextCard() {
        await __classPrivateFieldGet(this, _CardMenu_instances, "m", _CardMenu_moveCards).call(this, (__classPrivateFieldGet(this, _CardMenu_current, "f") + 1) % __classPrivateFieldGet(this, _CardMenu_cards, "f").length, -cardWidth, true);
    }
    async previousCard() {
        let i = __classPrivateFieldGet(this, _CardMenu_current, "f") - 1;
        if (i < 0) {
            i = __classPrivateFieldGet(this, _CardMenu_cards, "f").length - 1;
        }
        ;
        await __classPrivateFieldGet(this, _CardMenu_instances, "m", _CardMenu_moveCards).call(this, i, 100, false);
    }
}
_a = CardMenu, _CardMenu_cards = new WeakMap(), _CardMenu_imgBox = new WeakMap(), _CardMenu_navSquares = new WeakMap(), _CardMenu_navColor = new WeakMap(), _CardMenu_current = new WeakMap(), _CardMenu_sellChannel = new WeakMap(), _CardMenu_instances = new WeakSet(), _CardMenu_setup = function _CardMenu_setup(cards, navBarColor, config) {
    if (cards.length === 0) {
        return {
            cards,
            elements: [BoardEvent.generateTextBox("Vous n'avez aucune carte")],
            okSetup: 1 /* MenuOkSetup.Appended */,
            denySetup: false
        };
    }
    const imgBox = document.createElement("div");
    imgBox.style.width = "100vw";
    imgBox.style.height = `${cardHeight + border + oultine + cardHeight / 10}vw`;
    imgBox.style.marginTop = `${cardHeight / 10}vw`;
    const { boostedCards, okSetup, sellChannel } = config === undefined ? { boostedCards: cards, okSetup: 0 /* MenuOkSetup.Unappended */, sellChannel: undefined } : (() => {
        if (config.type === undefined) {
            return { boostedCards: cards, okSetup: 2 /* MenuOkSetup.Sell */, sellChannel: config.tx };
        }
        else {
            if (cards[0] instanceof Aquisition) {
                return {
                    boostedCards: cards.map((x) => x.getBoostedClone(config.type)),
                    okSetup: 2 /* MenuOkSetup.Sell */,
                    sellChannel: config.tx
                };
            }
            else {
                console.log("ERROR: Called sell config on acard that is not an Aquisition");
                return { boostedCards: cards, okSetup: 0 /* MenuOkSetup.Unappended */, sellChannel: undefined };
            }
        }
    })();
    // append to center
    // not its how method since it's only supposed to happen at menu's build
    const card = boostedCards[0].html;
    card.style.left = `${centerX}vw`;
    imgBox.appendChild(card);
    const { navBar, navSquares } = createNavBar(cards.length, navBarColor);
    const elements = cards.length === 1
        ? [imgBox, navBar]
        : [imgBox, BoardEvent.generateTextBox("Utilisez les flèches du clavier pour naviguer entre vos aquisitions"), navBar];
    return {
        cards: boostedCards,
        elements,
        navSquares,
        okSetup,
        denySetup: true,
        sellChannel
    };
}, _CardMenu_sellEvent = function _CardMenu_sellEvent() {
    if (__classPrivateFieldGet(this, _CardMenu_sellChannel, "f") === undefined) {
        console.log("ERROR: tried to send a sell message but menu's channel is undefined");
    }
    else {
        __classPrivateFieldGet(this, _CardMenu_sellChannel, "f").send(__classPrivateFieldGet(this, _CardMenu_cards, "f")[__classPrivateFieldGet(this, _CardMenu_current, "f")]); // already checked at ok button init if cards are actually aquisitions
    }
}, _CardMenu_appendToRight = function _CardMenu_appendToRight(card) {
    card.style.left = "100vw";
    __classPrivateFieldGet(this, _CardMenu_imgBox, "f").appendChild(card);
}, _CardMenu_appendToLeft = function _CardMenu_appendToLeft(card) {
    card.style.left = `${-cardWidth}vw`;
    __classPrivateFieldGet(this, _CardMenu_imgBox, "f").appendChild(card);
}, _CardMenu_moveCards = async function _CardMenu_moveCards(nextIndex, oldCardTargetX, appendRight) {
    const promises = [];
    const oldCard = __classPrivateFieldGet(this, _CardMenu_cards, "f")[__classPrivateFieldGet(this, _CardMenu_current, "f")].html;
    promises.push(translate(oldCard, oldCardTargetX).then(() => __classPrivateFieldGet(this, _CardMenu_imgBox, "f").removeChild(oldCard)));
    __classPrivateFieldGet(this, _CardMenu_navSquares, "f")[__classPrivateFieldGet(this, _CardMenu_current, "f")].style.backgroundColor = "#5e5c5c";
    __classPrivateFieldSet(this, _CardMenu_current, nextIndex, "f");
    const card = __classPrivateFieldGet(this, _CardMenu_cards, "f")[__classPrivateFieldGet(this, _CardMenu_current, "f")].html;
    if (appendRight) {
        __classPrivateFieldGet(this, _CardMenu_instances, "m", _CardMenu_appendToRight).call(this, card);
    }
    else {
        __classPrivateFieldGet(this, _CardMenu_instances, "m", _CardMenu_appendToLeft).call(this, card);
    }
    promises.push(translate(card, centerX));
    __classPrivateFieldGet(this, _CardMenu_navSquares, "f")[__classPrivateFieldGet(this, _CardMenu_current, "f")].style.backgroundColor = __classPrivateFieldGet(this, _CardMenu_navColor, "f");
    await Promise.all(promises);
};
class Listener extends KeyboardListener {
    constructor(menu, caller) {
        super(menu);
        _Listener_caller.set(this, void 0);
        __classPrivateFieldSet(this, _Listener_caller, caller, "f");
    }
    eventHandler(event) {
        if (!this.enabled) {
            return;
        }
        this.enabled = false;
        if (event.key === "ArrowRight") {
            __classPrivateFieldGet(this, _Listener_caller, "f").nextCard().then(() => this.enabled = true);
        }
        else if (event.key === "ArrowLeft") {
            __classPrivateFieldGet(this, _Listener_caller, "f").previousCard().then(() => this.enabled = true);
        }
        else {
            this.enabled = true;
        }
    }
}
_Listener_caller = new WeakMap();
function createNavBar(length, color) {
    const navBar = document.createElement("div");
    navBar.id = "navBar";
    navBar.style.display = "flex";
    navBar.style.justifyContent = "center";
    const navSquares = Array();
    for (let i = 0; i < length; i++) {
        const sq = document.createElement("div");
        sq.style.width = "20px";
        sq.style.height = "20px";
        sq.style.margin = "10px";
        sq.style.borderRadius = "5px";
        sq.style.backgroundColor = inactiveSquareColor;
        navSquares.push(sq);
        navBar.appendChild(sq);
    }
    navSquares[0].style.backgroundColor = color;
    return { navBar, navSquares };
}
// uses animationTime & frames consts
async function translate(elm, targetX) {
    const it = animationTime * frames;
    const dt = 1000 / frames;
    let current = pxToVw(elm.getBoundingClientRect().left);
    const dx = (targetX - current) / it;
    for (let i = 0; i < it; i++) {
        current += dx;
        elm.style.left = `${current}vw`;
        await new Promise(r => setTimeout(r, dt));
    }
    elm.style.left = `${targetX}vw`;
}
