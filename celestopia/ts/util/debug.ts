import { BoardId } from "../board/Board.js";
import { AquisitionThief } from "../item/AquisitionThief.js";
import { DiceItem } from "../item/DiceItem.js";
import { MoneyThief } from "../item/MoneyThief.js";
import { Pipe } from "../item/Pipe.js";
import { Seller } from "../item/Seller.js";
import { TrickItem } from "../item/TrickItem.js";
import { changeBoard, currentKeyboardEventListener, pig, players, resizables } from "./variables.js";

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
    setCoins(id: PlayerId, value: number) { players[id - 1].coins = value; },
    setRibbons(id: PlayerId, value: number) { players[id - 1].ribbons = value; },
    setStars(id: PlayerId, value: number) { players[id - 1].stars = value; },
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
    changeCurrentBoard(id: BoardId) { changeBoard(id); }
};