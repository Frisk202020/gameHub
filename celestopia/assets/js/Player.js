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
var _Player_instances, _a, _Player_id, _Player_name, _Player_avatar, _Player_pawn, _Player_coins, _Player_ribbons, _Player_stars, _Player_items, _Player_aquisitions, _Player_wonders, _Player_infoBox, _Player_infoActive, _Player_diceActionEnabled, _Player_itemActionEnabled, _Player_palette, _Player_removeAquisition, _Player_progressiveChange, _Player_createHtml, _Player_createBanner, _Player_createInfoBox, _Player_createSubInfoBox, _Player_createActionBox, _Player_createAction;
import { Item } from "./item/Item.js";
import { Aquisition } from "./card/Aquisition.js";
import { Card } from "./card/Card.js";
import { Wonder } from "./card/Wonder.js";
import { Position } from "./util/Position.js";
import { DiceEvent } from "./event/DiceEvent.js";
import { assets_link, createHelperBox, removeFromArray, removeFromBodyOrWarn } from "./util/functions.js";
import { initChannel } from "./util/channel.js";
import { caseSize } from "./board/Case.js";
import { board, boardId, changeBoard, pig } from "./util/variables.js";
import { Happening } from "./event/Happening.js";
import { Popup } from "./event/Popup.js";
import { Chest } from "./event/Chest.js";
import { Crown } from "./event/Crown.js";
import { PigEvent } from "./event/PigEvent.js";
import { Magic } from "./event/Magic.js";
import { ItemMenu } from "./item/ItemMenu.js";
import { Intersection } from "./event/Intersection.js";
import { TeleporterEvent } from "./event/TeleporterEvent.js";
import { DuelEvent } from "./event/DuelEvent.js";
import { Convert } from "./event/Convert.js";
import { Seller } from "./item/Seller.js";
const playerBox = document.getElementById("players");
const activeInfoHelp = "Cliquez pour replier.";
const inactiveInfoHelp = "Cliquez pour voir les ressources du joueur.";
let helperBox = undefined;
const startingCoins = 3000;
export class Player {
    constructor(id, name, avatar, color) {
        _Player_instances.add(this);
        _Player_id.set(this, void 0);
        _Player_name.set(this, void 0);
        _Player_avatar.set(this, void 0);
        _Player_pawn.set(this, void 0);
        _Player_coins.set(this, void 0);
        _Player_ribbons.set(this, void 0);
        _Player_stars.set(this, void 0);
        _Player_items.set(this, void 0);
        _Player_aquisitions.set(this, void 0);
        _Player_wonders.set(this, void 0);
        _Player_infoBox.set(this, void 0);
        _Player_infoActive.set(this, void 0);
        _Player_diceActionEnabled.set(this, void 0);
        _Player_itemActionEnabled.set(this, void 0);
        this.moneyMap = {
            coin: {
                get: () => __classPrivateFieldGet(this, _Player_coins, "f"),
                set: (v) => __classPrivateFieldSet(this, _Player_coins, v, "f"),
                getUi: () => this.uiCoins,
                setUi: (v) => this.uiCoins = v,
                html: "coin",
            },
            ribbon: {
                get: () => __classPrivateFieldGet(this, _Player_ribbons, "f"),
                set: (v) => __classPrivateFieldSet(this, _Player_ribbons, v, "f"),
                getUi: () => this.uiRibbons,
                setUi: (v) => this.uiRibbons = v,
                html: "ribbon",
            },
            star: {
                get: () => __classPrivateFieldGet(this, _Player_stars, "f"),
                set: (v) => __classPrivateFieldSet(this, _Player_stars, v, "f"),
                getUi: () => this.uiStars,
                setUi: (v) => this.uiStars = v,
                html: "star",
            }
        };
        __classPrivateFieldSet(this, _Player_id, id, "f");
        this.color = _a.palette(color);
        __classPrivateFieldSet(this, _Player_name, name, "f");
        __classPrivateFieldSet(this, _Player_avatar, avatar, "f");
        this.boardId = 0;
        this.caseId = 0;
        this.pendingCaseId = 0;
        this.teleport = false;
        this.diceNumber = 1;
        __classPrivateFieldSet(this, _Player_coins, startingCoins, "f");
        this.uiCoins = __classPrivateFieldGet(this, _Player_coins, "f");
        __classPrivateFieldSet(this, _Player_ribbons, 0, "f");
        this.uiRibbons = __classPrivateFieldGet(this, _Player_ribbons, "f");
        __classPrivateFieldSet(this, _Player_stars, 0, "f");
        this.uiStars = __classPrivateFieldGet(this, _Player_stars, "f");
        __classPrivateFieldSet(this, _Player_items, Array(), "f");
        __classPrivateFieldSet(this, _Player_aquisitions, Array(), "f");
        __classPrivateFieldSet(this, _Player_wonders, Array(), "f");
        __classPrivateFieldSet(this, _Player_infoBox, __classPrivateFieldGet(this, _Player_instances, "m", _Player_createInfoBox).call(this), "f");
        __classPrivateFieldSet(this, _Player_infoActive, false, "f");
        __classPrivateFieldSet(this, _Player_diceActionEnabled, false, "f");
        __classPrivateFieldSet(this, _Player_itemActionEnabled, false, "f");
        __classPrivateFieldGet(this, _Player_instances, "m", _Player_createHtml).call(this);
    }
    get name() {
        return __classPrivateFieldGet(this, _Player_name, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _Player_id, "f");
    }
    get pawn() {
        return __classPrivateFieldGet(this, _Player_pawn, "f");
    }
    get aquisitionCount() {
        return __classPrivateFieldGet(this, _Player_aquisitions, "f").length;
    }
    get wonderCount() {
        return __classPrivateFieldGet(this, _Player_wonders, "f").length;
    }
    get coins() {
        return __classPrivateFieldGet(this, _Player_coins, "f");
    }
    get ribbons() {
        return __classPrivateFieldGet(this, _Player_ribbons, "f");
    }
    get stars() {
        return __classPrivateFieldGet(this, _Player_stars, "f");
    }
    get avatar() {
        return __classPrivateFieldGet(this, _Player_avatar, "f");
    }
    get enabled() {
        return __classPrivateFieldGet(this, _Player_diceActionEnabled, "f");
    }
    static palette(color) {
        const v = __classPrivateFieldGet(this, _a, "f", _Player_palette).get(color);
        if (v === undefined) {
            console.log(`ERROR: unhandled color - ${color}`);
            return __classPrivateFieldGet(this, _a, "f", _Player_palette).get("red");
        }
        else {
            return v;
        }
    }
    static colors() {
        return [...__classPrivateFieldGet(this, _a, "f", _Player_palette).keys()];
    }
    addAquisition(aq) {
        __classPrivateFieldGet(this, _Player_aquisitions, "f").push(aq);
    }
    listAquisitions() {
        return __classPrivateFieldGet(this, _Player_aquisitions, "f").map((aq) => aq.name);
    }
    removeRandomAquisition() {
        return removeFromArray(__classPrivateFieldGet(this, _Player_aquisitions, "f"), Math.floor(Math.random() * this.aquisitionCount));
    }
    generateSellMenu() {
        const { tx, rx } = initChannel();
        Card.generateMenu(__classPrivateFieldGet(this, _Player_aquisitions, "f"), { tx });
        rx.recv().then((t) => {
            if (t !== undefined) {
                __classPrivateFieldGet(this, _Player_instances, "m", _Player_removeAquisition).call(this, t);
            }
            else {
                this.addItem(new Seller(this));
            }
        });
    }
    addWonder(w) {
        __classPrivateFieldGet(this, _Player_wonders, "f").push(w);
    }
    listWonders() {
        return __classPrivateFieldGet(this, _Player_wonders, "f").map((w) => w.name);
    }
    async caseResponse(type) {
        const { tx, rx } = initChannel();
        if (type === "redCoin") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            pig.feed(chosen);
            await this.progressiveCoinChange(-chosen);
        }
        else if (type === "blueCoin") {
            const choices = [50, 100, 300, 600, 1000];
            const chosen = choices[Math.floor(Math.random() * 5)];
            await this.progressiveCoinChange(chosen);
        }
        else if (type === "redStar") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            const delta = Math.min(__classPrivateFieldGet(this, _Player_stars, "f"), chosen);
            pig.feed(delta * 2);
            await this.progressiveStarChange(-delta);
        }
        else if (type === "blueStar") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            await this.progressiveStarChange(chosen);
        }
        else if (type === "redRibbon") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            const delta = Math.min(__classPrivateFieldGet(this, _Player_ribbons, "f"), chosen);
            pig.feed(delta * 2);
            await this.progressiveRibbonChange(-delta);
        }
        else if (type === "blueRibbon") {
            const choices = [50, 100, 250, 500];
            const chosen = choices[Math.floor(Math.random() * 4)];
            await this.progressiveRibbonChange(chosen);
        }
        else if (type === "event") {
            Happening.pickRandomEvent(this, tx);
            await rx.recv();
        }
        else if (type === "aquisition") {
            new Chest(this, tx);
            await rx.recv();
        }
        else if (type === "ladder") {
            this.pendingCaseId = board.elements[this.caseId].destination;
            this.teleport = true;
        }
        else if (type === "dice") {
            new Popup("Relancez les dés !");
        }
        else if (type === "wonder") {
            new Crown(this, board.elements[this.caseId].wonder, tx);
            await rx.recv();
        }
        else if (type === "duel") {
            new DuelEvent(tx);
            await rx.recv();
        }
        else if (type === "piggy") {
            new PigEvent(this, tx);
            await rx.recv();
        }
        else if (type === "sale") {
            const { tx, rx } = initChannel();
            Card.generateMenu(__classPrivateFieldGet(this, _Player_aquisitions, "f"), { tx, type: "coin" });
            const t = await rx.recv();
            if (t !== undefined) {
                await __classPrivateFieldGet(this, _Player_instances, "m", _Player_removeAquisition).call(this, t);
            }
        }
        else if (type === "saleRibbon") {
            const { tx, rx } = initChannel();
            Card.generateMenu(__classPrivateFieldGet(this, _Player_aquisitions, "f"), { tx, type: "ribbon" });
            const t = await rx.recv();
            if (t !== undefined) {
                await __classPrivateFieldGet(this, _Player_instances, "m", _Player_removeAquisition).call(this, t);
            }
        }
        else if (type === "saleStar") {
            const { tx, rx } = initChannel();
            Card.generateMenu(__classPrivateFieldGet(this, _Player_aquisitions, "f"), { tx, type: "star" });
            const t = await rx.recv();
            if (t !== undefined) {
                await __classPrivateFieldGet(this, _Player_instances, "m", _Player_removeAquisition).call(this, t);
            }
        }
        else if (type === "item") {
            const i = await Item.getRandomItem(this);
            const { tx: innerTx, rx } = initChannel();
            new Popup(`Vous obtenez un ${i.name}`, "Objet obtenu !", innerTx);
            await rx.recv();
            await this.addItem(i);
        }
        else if (type === "intersection") {
            const { tx, rx } = initChannel();
            new Intersection(this, board.elements[this.caseId].intersection, tx);
            await rx.recv();
            if (this.pendingCaseId === this.caseId) {
                await this.caseResponse(board.elements[this.caseId].type);
            }
        }
        else if (type === "teleporter") {
            const { tx, rx } = initChannel();
            this.progressiveCoinChange(1500);
            new TeleporterEvent(this, tx);
            const x = await rx.recv();
            if (x) {
                this.pendingCaseId = this.pendingCaseId - this.caseId;
                this.caseId = 0; // If we land on telporter and change board, we SPAWN on case 0
                changeBoard(this.boardId);
                switch (this.boardId) {
                    case 0: break;
                    case 1:
                        const { tx, rx } = initChannel();
                        new Convert(tx, "ribbon");
                        const x = await rx.recv();
                        this.progressiveCoinChange(-x);
                        this.progressiveRibbonChange(Math.floor(x / 3));
                        break;
                    case 2:
                        const { tx: tx2, rx: rx2 } = initChannel();
                        new Convert(tx2, "star");
                        const x2 = await rx2.recv();
                        this.progressiveCoinChange(-x2);
                        this.progressiveStarChange(Math.floor(x2 / 3));
                }
            }
            else {
                if (this.pendingCaseId === this.caseId) {
                    this.pendingCaseId = 0; // If we land on teleporter and stay on board, we go TOWARDS case 0
                }
            }
        }
        else if (type === "end") {
            const { tx: tx1, rx: rx1 } = initChannel();
            new Popup("Vous êtes arrivé à la fin du plateau. Payez vos courriers, des intérêt sur votre découvert et recevez 5000 pièces !", "Fin du mois !", tx1);
            await rx1.recv();
            let finalVal = 5000 + __classPrivateFieldGet(this, _Player_coins, "f");
            if (finalVal < 0) {
                finalVal += (finalVal * 0.25);
            }
            await this.progressiveCoinChange(finalVal - __classPrivateFieldGet(this, _Player_coins, "f"));
            this.caseId = 0;
            this.pendingCaseId = 0;
            this.boardId = 0;
            this.diceNumber = 1;
            changeBoard(0);
        }
        else {
            console.log(`unhandled case type: ${type}`);
        }
    }
    hasItems() {
        return __classPrivateFieldGet(this, _Player_items, "f").length > 0;
    }
    async addItem(item) {
        if (__classPrivateFieldGet(this, _Player_items, "f").length >= 5) {
            const { tx, rx } = initChannel();
            new ItemMenu(this, { item, tx });
            await rx.recv();
            return;
        }
        __classPrivateFieldGet(this, _Player_items, "f").push(item);
    }
    replaceItem(old, newItem) {
        const i = __classPrivateFieldGet(this, _Player_items, "f").indexOf(old);
        if (i === -1) {
            console.log("ERROR: tried to replace item but older one is non-existant");
        }
        else {
            __classPrivateFieldGet(this, _Player_items, "f")[i] = newItem;
        }
    }
    removeItem(item) {
        const index = __classPrivateFieldGet(this, _Player_items, "f").indexOf(item);
        if (index === -1) {
            console.log("ERROR: tried to remove a item but the player didn't have it.");
            return;
        }
        else {
            __classPrivateFieldGet(this, _Player_items, "f").splice(index, 1);
        }
    }
    itemIterator() {
        let index = 0;
        const data = __classPrivateFieldGet(this, _Player_items, "f");
        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
    stringifyItems() {
        return __classPrivateFieldGet(this, _Player_items, "f").map((i) => i.constructor.name);
    }
    async progressiveCoinChange(delta) {
        return __classPrivateFieldGet(this, _Player_instances, "m", _Player_progressiveChange).call(this, "coin", delta);
    }
    async progressiveRibbonChange(delta) {
        return __classPrivateFieldGet(this, _Player_instances, "m", _Player_progressiveChange).call(this, "ribbon", delta);
    }
    async progressiveStarChange(delta) {
        return __classPrivateFieldGet(this, _Player_instances, "m", _Player_progressiveChange).call(this, "star", delta);
    }
    // assumes caseId has been changed by the caller (to indicate the target)
    async movePawn() {
        const frames = 60;
        const it = 0.25 * frames;
        const dt = 1000 / frames;
        const pawnPos = Position.new(__classPrivateFieldGet(this, _Player_pawn, "f").getBoundingClientRect());
        const current = pawnPos.translate(window.scrollX, window.scrollY); // correct pos with scroll values
        const target = board.elements[this.caseId].uiPosition.translate(caseSize / 4, 0);
        const dP = target.difference(current).divide(it);
        for (let i = 0; i < it; i++) {
            current.translateMut(dP);
            __classPrivateFieldGet(this, _Player_pawn, "f").style.left = `${current.x}px`;
            __classPrivateFieldGet(this, _Player_pawn, "f").style.top = `${current.y}px`;
            window.scrollTo({
                left: current.x - (window.innerWidth / 2) + (__classPrivateFieldGet(this, _Player_pawn, "f").offsetWidth / 2), // keep centered
                top: current.y - (window.innerHeight / 2) + (__classPrivateFieldGet(this, _Player_pawn, "f").offsetHeight / 2),
                behavior: 'instant' // no built-in scroll animation
            });
            await new Promise(r => setTimeout(r, dt));
        }
        __classPrivateFieldGet(this, _Player_pawn, "f").style.left = `${target.x}px`;
        __classPrivateFieldGet(this, _Player_pawn, "f").style.top = `${target.y}px`;
    }
    enable() {
        for (const id of ["diceAction", "itemAction"]) {
            const elm = document.getElementById(`${__classPrivateFieldGet(this, _Player_id, "f")}.${id}`);
            elm.style.backgroundColor = this.color.action;
        }
        __classPrivateFieldSet(this, _Player_diceActionEnabled, true, "f");
        __classPrivateFieldSet(this, _Player_itemActionEnabled, true, "f");
    }
    disable() {
        for (const id of ["diceAction", "itemAction"]) {
            const elm = document.getElementById(`${__classPrivateFieldGet(this, _Player_id, "f")}.${id}`);
            elm.style.backgroundColor = "#bebdbd";
        }
        __classPrivateFieldSet(this, _Player_diceActionEnabled, false, "f");
        __classPrivateFieldSet(this, _Player_itemActionEnabled, false, "f");
    }
    loadData(data, enabled) {
        __classPrivateFieldSet(this, _Player_coins, data.coins, "f");
        this.uiCoins = data.coins;
        __classPrivateFieldSet(this, _Player_ribbons, data.ribbons, "f");
        this.uiRibbons = data.ribbons;
        __classPrivateFieldSet(this, _Player_stars, data.stars, "f");
        this.uiStars = data.stars;
        __classPrivateFieldSet(this, _Player_aquisitions, data.aquisitions.map((aq) => Aquisition.getByName(aq)).filter((aq) => aq !== undefined), "f");
        __classPrivateFieldSet(this, _Player_wonders, data.wonders.map((w) => Wonder.getWonder(w, true)).filter((w) => w !== undefined), "f");
        Promise.all(data.items.map((i) => Item.getByName(i, this))).then((items) => __classPrivateFieldSet(this, _Player_items, items, "f"));
        this.pendingCaseId = data.caseId;
        this.teleport = true;
        this.ignoreTurnSystem = true;
        this.boardId = data.boardId;
        this.diceNumber = data.diceNumber;
        if (boardId !== this.boardId) {
            __classPrivateFieldGet(this, _Player_pawn, "f").style.opacity = "0";
        }
        if (enabled) {
            this.enable();
        }
        else {
            this.disable();
        }
    }
}
_a = Player, _Player_id = new WeakMap(), _Player_name = new WeakMap(), _Player_avatar = new WeakMap(), _Player_pawn = new WeakMap(), _Player_coins = new WeakMap(), _Player_ribbons = new WeakMap(), _Player_stars = new WeakMap(), _Player_items = new WeakMap(), _Player_aquisitions = new WeakMap(), _Player_wonders = new WeakMap(), _Player_infoBox = new WeakMap(), _Player_infoActive = new WeakMap(), _Player_diceActionEnabled = new WeakMap(), _Player_itemActionEnabled = new WeakMap(), _Player_instances = new WeakSet(), _Player_removeAquisition = async function _Player_removeAquisition(aq) {
    if (__classPrivateFieldGet(this, _Player_aquisitions, "f").length === 0) {
        console.log("ERROR: tried to remove aquisition, but player didn't have one");
        return;
    }
    let ind = -1;
    for (let i = 0; i < __classPrivateFieldGet(this, _Player_aquisitions, "f").length; i++) {
        if (__classPrivateFieldGet(this, _Player_aquisitions, "f")[i].name === aq.name) {
            ind = i;
            break;
        }
    }
    if (ind === -1) {
        console.log("ERROR: tried to remove aquisition but player did not have it");
        return;
    }
    else {
        __classPrivateFieldGet(this, _Player_aquisitions, "f").splice(ind, 1);
    }
    Aquisition.returnToBank(aq);
    if (aq.name === "magic") {
        const { tx, rx } = initChannel();
        new Magic(tx);
        const m = await rx.recv();
        switch (m) {
            case "coin":
                await this.progressiveCoinChange(aq.coins);
                break;
            case "ribbon":
                await this.progressiveRibbonChange(aq.ribbons);
                break;
            case "star": await this.progressiveStarChange(aq.stars);
        }
    }
    else {
        await Promise.all([
            this.progressiveCoinChange(aq.coins),
            this.progressiveRibbonChange(aq.ribbons),
            this.progressiveStarChange(aq.stars)
        ]);
    }
}, _Player_progressiveChange = async function _Player_progressiveChange(kind, delta) {
    const c = this.moneyMap[kind];
    if (!__classPrivateFieldGet(this, _Player_infoActive, "f")) {
        __classPrivateFieldGet(this, _Player_infoBox, "f").classList.add("visible");
    }
    c.set(c.get() + delta);
    const dN = delta / 120;
    const current = c.getUi();
    c.setUi(delta);
    const elm = document.getElementById(`${__classPrivateFieldGet(this, _Player_id, "f")}.${c.html}`);
    if (c.getUi() < 0) {
        elm.style.color = "#b70808";
    }
    else {
        elm.style.color = "#009220";
    }
    await new Promise(r => setTimeout(r, 2000));
    c.setUi(current);
    elm.style.color = "black";
    for (let i = 0; i < 120; i++) {
        c.setUi(c.getUi() + dN);
        await new Promise(r => setTimeout(r, 100 / 6));
    }
    c.setUi(c.get());
    __classPrivateFieldGet(this, _Player_infoBox, "f").classList.remove("visible");
}, _Player_createHtml = function _Player_createHtml() {
    const player = document.createElement("div");
    player.classList.add("player");
    player.id = __classPrivateFieldGet(this, _Player_name, "f");
    player.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createBanner).call(this));
    player.appendChild(__classPrivateFieldGet(this, _Player_infoBox, "f"));
    player.style.display = "flex";
    player.style.flexDirection = "column";
    playerBox.appendChild(player);
    player.addEventListener("mouseenter", () => {
        const box = createHelperBox(__classPrivateFieldGet(this, _Player_infoActive, "f") ? activeInfoHelp : inactiveInfoHelp, new Position(player.getBoundingClientRect().right + 10, 0));
        box.style.position = "fixed";
        document.body.appendChild(box);
        helperBox = box;
    });
    player.addEventListener("mouseleave", () => {
        removeFromBodyOrWarn(helperBox);
    });
    player.addEventListener("click", () => {
        if (__classPrivateFieldGet(this, _Player_infoActive, "f")) {
            __classPrivateFieldGet(this, _Player_infoBox, "f").classList.remove("visible");
        }
        else {
            __classPrivateFieldGet(this, _Player_infoBox, "f").classList.add("visible");
        }
        if (__classPrivateFieldGet(this, _Player_infoActive, "f")) {
            __classPrivateFieldGet(this, _Player_infoBox, "f").classList.remove("visible");
            if (helperBox !== undefined) {
                helperBox.textContent = inactiveInfoHelp;
                __classPrivateFieldGet(this, _Player_infoBox, "f").style.pointerEvents = "none";
            }
        }
        else {
            if (helperBox !== undefined) {
                helperBox.textContent = activeInfoHelp;
                __classPrivateFieldGet(this, _Player_infoBox, "f").style.pointerEvents = "auto";
            }
            __classPrivateFieldGet(this, _Player_infoBox, "f").classList.add("visible");
        }
        __classPrivateFieldSet(this, _Player_infoActive, !__classPrivateFieldGet(this, _Player_infoActive, "f"), "f");
    });
    const pawn = document.createElement("img");
    pawn.src = assets_link(`icons/${__classPrivateFieldGet(this, _Player_avatar, "f")}.png`);
    pawn.id = `${__classPrivateFieldGet(this, _Player_id, "f")}.pawn`;
    pawn.style.width = `${caseSize / 2}px`;
    pawn.style.height = `${caseSize / 2}px`;
    pawn.style.position = "absolute";
    const currentCase = board.elements[this.caseId];
    pawn.style.left = `${currentCase.uiPosition.x + caseSize / 4}px`;
    pawn.style.top = `${currentCase.uiPosition.y}px`;
    pawn.style.zIndex = "3";
    __classPrivateFieldSet(this, _Player_pawn, pawn, "f");
}, _Player_createBanner = function _Player_createBanner() {
    const banner = document.createElement("div");
    banner.className = "pointerHover";
    const style = banner.style;
    style.display = "flex";
    style.flexDirection = "row";
    style.padding = "0.5vw";
    style.backgroundColor = this.color.base;
    style.width = "10vw";
    style.justifyContent = "space-between";
    style.borderRadius = "10px";
    style.pointerEvents = "auto";
    const name = document.createElement("div");
    name.textContent = __classPrivateFieldGet(this, _Player_name, "f");
    name.style.display = "grid";
    name.style.alignItems = "center";
    name.style.height = "5vh";
    name.style.marginRight = "5px";
    const icon = document.createElement("img");
    icon.src = assets_link(`icons/${__classPrivateFieldGet(this, _Player_avatar, "f")}.png`);
    icon.style.height = "5vh";
    icon.style.marginLeft = "5px";
    banner.appendChild(name);
    banner.appendChild(icon);
    return banner;
}, _Player_createInfoBox = function _Player_createInfoBox() {
    const info = document.createElement("div");
    const infoStyle = info.style;
    infoStyle.width = "10vw";
    infoStyle.background = `linear-gradient(to bottom, ${this.color.base}, ${this.color.info})`;
    infoStyle.padding = "0.5vw";
    infoStyle.borderRadius = "10px";
    infoStyle.pointerEvents = "none";
    info.className = "reveal-vertical";
    info.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createSubInfoBox).call(this, "coin", __classPrivateFieldGet(this, _Player_coins, "f"), false));
    info.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createSubInfoBox).call(this, "ribbon", __classPrivateFieldGet(this, _Player_ribbons, "f"), false));
    info.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createSubInfoBox).call(this, "star", __classPrivateFieldGet(this, _Player_stars, "f"), false));
    const aq = __classPrivateFieldGet(this, _Player_instances, "m", _Player_createSubInfoBox).call(this, "chest", __classPrivateFieldGet(this, _Player_aquisitions, "f").length, true);
    aq.addEventListener("mouseenter", () => {
        if (helperBox !== undefined) {
            helperBox.textContent = "Cliquez pour afficher votre collection d'aquisitions.";
        }
        else {
            console.log("WARN: helper box is undefined");
        }
    });
    aq.addEventListener("mouseleave", () => {
        if (helperBox !== undefined) {
            helperBox.textContent = activeInfoHelp;
        }
    });
    aq.addEventListener("click", () => {
        Card.generateMenu(__classPrivateFieldGet(this, _Player_aquisitions, "f"));
    });
    info.appendChild(aq);
    const w = __classPrivateFieldGet(this, _Player_instances, "m", _Player_createSubInfoBox).call(this, "wonder", __classPrivateFieldGet(this, _Player_wonders, "f").length, true);
    w.addEventListener("mouseenter", () => {
        if (helperBox !== undefined) {
            helperBox.textContent = "Cliquez pour afficher votre collection de merveilles.";
        }
        else {
            console.log("WARN: helper box is undefined");
        }
    });
    w.addEventListener("mouseleave", () => {
        if (helperBox !== undefined) {
            helperBox.textContent = activeInfoHelp;
        }
    });
    w.addEventListener("click", () => {
        Card.generateMenu(__classPrivateFieldGet(this, _Player_wonders, "f"));
    });
    info.appendChild(w);
    info.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createActionBox).call(this));
    return info;
}, _Player_createSubInfoBox = function _Player_createSubInfoBox(imgName, counterValue, pointerHover) {
    const box = document.createElement("div");
    if (pointerHover) {
        box.className = "pointerHover";
    }
    box.style.display = "flex";
    box.style.justifyContent = "space-between";
    box.style.alignItems = "center";
    const img = document.createElement("img");
    img.src = assets_link(`icons/${imgName}.png`);
    img.style.width = "2vw";
    img.style.marginLeft = "0.5vw";
    const counter = document.createElement("p");
    counter.id = `${__classPrivateFieldGet(this, _Player_id, "f")}.${imgName}`;
    counter.textContent = counterValue.toString();
    counter.style.marginRight = "0.5vw";
    box.appendChild(img);
    box.appendChild(counter);
    return box;
}, _Player_createActionBox = function _Player_createActionBox() {
    const box = document.createElement("div");
    box.className = "pointerHover";
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.alignItems = "center";
    box.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createAction).call(this, `${__classPrivateFieldGet(this, _Player_id, "f")}.diceAction`, "diceAction.png", "Lancez le dé quand c'est votre tour.", () => {
        if (!__classPrivateFieldGet(this, _Player_diceActionEnabled, "f")) {
            return;
        }
        const { tx, rx } = initChannel();
        new DiceEvent(tx, this.diceNumber, false);
        rx.recv().then((n) => {
            this.pendingCaseId = this.caseId + n;
        });
    }));
    box.appendChild(__classPrivateFieldGet(this, _Player_instances, "m", _Player_createAction).call(this, `${__classPrivateFieldGet(this, _Player_id, "f")}.itemAction`, "bag.png", "Utilisez un objet (avant de lancer le dé).", () => {
        if (!__classPrivateFieldGet(this, _Player_itemActionEnabled, "f")) {
            return;
        }
        new ItemMenu(this);
    }));
    return box;
}, _Player_createAction = function _Player_createAction(id, imgSrc, hover, action) {
    const elm = document.createElement("img");
    elm.id = id;
    elm.src = assets_link(`icons/${imgSrc}`);
    elm.style.width = "25%";
    elm.style.margin = "2.5%";
    elm.style.borderRadius = "25%";
    elm.style.backgroundColor = "#bebdbd";
    elm.addEventListener("mouseenter", () => {
        if (helperBox !== undefined) {
            helperBox.textContent = hover;
        }
        else {
            console.log("WARN: helper box is undefined");
        }
    });
    elm.addEventListener("mouseleave", () => {
        if (helperBox !== undefined) {
            helperBox.textContent = activeInfoHelp;
        }
    });
    elm.addEventListener("click", action);
    elm.onload = () => elm.style.border = `solid ${elm.offsetHeight * 0.05}px #ffd700`;
    return elm;
};
_Player_palette = { value: new Map([
        ["red", { name: "red", base: "#fa2714", action: "#c40202", info: "#fa271448" }],
        ["orange", { name: "orange", base: "#fa9214", action: "#c46c02", info: "#fa921448" }],
        ["yellow", { name: "yellow", base: "#ebdf3f", action: "#c4b902", info: "#ebdf3f48" }],
        ["green", { name: "green", base: "#4ac75e", action: "#029c20", info: "#4ac75e48" }],
        ["blue", { name: "blue", base: "#4a4aff", action: "#0202c4", info: "#4a4aff48" }],
        ["cyan", { name: "cyan", base: "#45f6ed", action: "#02c4b9", info: "#45f6ed48" }],
        ["purple", { name: "purple", base: "#f645f0", action: "#c402c0", info: "#f645f048" }],
        ["pink", { name: "pink", base: "#f64583", action: "#c4023c", info: "#f6458348" }],
    ]) };
