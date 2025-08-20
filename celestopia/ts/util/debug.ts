import type { BoardId } from "../board/Board.js";
import { Aquisition } from "../card/Aquisition.js";
import { Wonder, WonderName } from "../card/Wonder.js";
import { AquisitionThief } from "../item/AquisitionThief.js";
import { DiceItem } from "../item/DiceItem.js";
import { MoneyThief } from "../item/MoneyThief.js";
import { Pipe } from "../item/Pipe.js";
import { Seller } from "../item/Seller.js";
import { TrickItem } from "../item/TrickItem.js";
import { currentKeyboardEventListener, pig, players, resizables } from "./variables.js";

type PlayerId = 1 | 2 |  3 | 4;

export const debugTools = {
    keys: false,
    currentKeyboardEventListener() { console.log(currentKeyboardEventListener); },
    resizables() { console.log(resizables); },
    diceNumber(id: PlayerId, n: 1 | 2 | 3) { players[id - 1].diceNumber = n; },
    showKeys() { this.keys = true },
    throwDice(id: PlayerId, value: number) { 
        const p = players[id - 1];
        p.pendingCaseId = p.caseId + value;    
    },
    showPig() { console.log(pig); },
    setPigAmmount(ammount: number) { pig.content = ammount; },
    addCoins(id: PlayerId, value: number) { players[id - 1].progressiveCoinChange(value); },
    addRibbons(id: PlayerId, value: number) { players[id - 1].progressiveRibbonChange(value); },
    addStars(id: PlayerId, value: number) { players[id - 1].progressiveStarChange(value); },
    setRich(id: PlayerId) {
        const p = players[id - 1];
        p.progressiveCoinChange(99999);
        p.progressiveRibbonChange(99999);
        p.progressiveStarChange(99999);
    },
    giveItem(id: PlayerId, item: string) {
        const p = players[id - 1];
        switch(item) {
            case "dice": p.addItem(new DiceItem(p)); break;
            case "trick": p.addItem(new TrickItem(p)); break;
            case "aq": p.addItem(new AquisitionThief(p)); break;
            case "money": p.addItem(new MoneyThief(p)); break;
            case "seller": p.addItem(new Seller(p)); break;
            case "pipe": p.addItem(new Pipe(p)); break;
            case "all": 
                p.addItem(new DiceItem(p));
                p.addItem(new TrickItem(p));
                p.addItem(new AquisitionThief(p));
                p.addItem(new MoneyThief(p));
                p.addItem(new Seller(p));
                p.addItem(new Pipe(p));
            default: console.log("Unrecognized item");
        }
    },
    giveAquisition(id: PlayerId, name: string) {
        const aq = Aquisition.DEBUG_get_aquisition(name);
        if (aq === undefined) { return "unrecognized aquisition"; }
        players[id-1].addAquisition(aq);
    },
    giveWonder(id: PlayerId, name: WonderName) {
        const aq = Wonder.getWonder(name);
        if (aq === undefined) { return "unrecognized aquisition"; }
        players[id-1].addWonder(aq);
    },
    setBoardId(id: PlayerId, board: BoardId) {players[id-1].boardId = board;},
    setCaseId(id: PlayerId, n: number) {
        const p = players[id-1];
        p.pendingCaseId = n;
        p.teleport = true;
    }
};