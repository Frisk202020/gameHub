import { DiceEvent } from "../event/DiceEvent.js";
import { initChannel } from "../util/channel.js";
import { Item } from "./Item.js";
export class TrickItem extends Item {
    constructor(p) {
        super(p, "Dé pipé", "Lancez un dé dont vous pouvez choisir le résultat (quelque soit votre nombre de dés, ce dé donne un résultat entre 1 et 6).", "trick", () => {
            const { tx, rx } = initChannel();
            new DiceEvent(tx, 1, true);
            rx.recv().then((n) => p.pendingCaseId = p.caseId + n);
        }, true);
    }
}
