import { BoardEvent } from "./BoardEvent.js";
export class Happening extends BoardEvent {
    constructor(name, description, disableOk, denyButton, tx, ...elements) {
        let allElements = [
            BoardEvent.generateTextBox(name),
            BoardEvent.generateTextBox(description)
        ];
        allElements = allElements.concat(elements);
        super(allElements, BoardEvent.okSetup(!disableOk, undefined, () => {
            this.event();
        }), BoardEvent.denySetup(denyButton, undefined, () => tx.send()));
        this.name = name;
        this.description = description;
        this.tx = tx;
    }
    static async pickRandomEvent(player, tx) {
        const pick = Math.floor(Math.random() * 100);
        if (pick < 25) {
            const { GiftEvent } = await import("./Gift.js");
            return new GiftEvent(player, tx);
        }
        else if (pick < 31.25) {
            const { RibbonSale } = await import("./RibbonSale.js");
            return new RibbonSale(player, tx);
        }
        else if (pick < 37.5) {
            const { RibbonSell } = await import("./RibbonSell.js");
            return new RibbonSell(player, tx);
        }
        else if (pick < 43.75) {
            const { StarSale } = await import("./StarSale.js");
            return new StarSale(player, tx);
        }
        else if (pick < 50) {
            const { StarSell } = await import("./StarSell.js");
            return new StarSell(player, tx);
        }
        else if (pick < 75) {
            const { PigHappening } = await import("./PigHappening.js");
            return new PigHappening(tx);
        }
        else {
            const { Theft } = await import("./Theft.js");
            return new Theft(player, tx);
        }
    }
}
