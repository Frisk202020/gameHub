import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export abstract class Happening extends BoardEvent {
    protected name: string;
    protected description: string;
    protected tx: Sender<void>;

    constructor(name: string, description: string, disableOk: boolean, denyButton: boolean, tx: Sender<void>, ...elements: HTMLElement[]) {
        let allElements: HTMLElement[] = [
            BoardEvent.generateTextBox(name),
            BoardEvent.generateTextBox(description)
        ];
        allElements = allElements.concat(elements);

        super(
            allElements,
            BoardEvent.okSetup(!disableOk, undefined, () => {
                this.event();
            }),
            BoardEvent.denySetup(denyButton, undefined, ()=>tx.send())
        )
        this.name = name;
        this.description = description;
        this.tx = tx;
    } 

    // Specific event logic
    protected abstract event(): void;

    static async pickRandomEvent(player: Player, tx: Sender<void>): Promise<Happening> {
        const pick = Math.floor(Math.random() * 100)
        
        if (pick < 25) {
            const { GiftEvent } = await import("./Gift.js");
            return new GiftEvent(player, tx);
        }
        else if (pick < 31.25) {
            const { RibbonSale } = await import("./RibbonSale.js");
            return new RibbonSale(player, tx);
        } else if (pick < 37.5) {
            const { RibbonSell } = await import("./RibbonSell.js");
            return new RibbonSell(player, tx);
        } else if (pick < 43.75) {
            const { StarSale } = await import("./StarSale.js");
            return new StarSale(player, tx);
        } else if (pick < 50) {
            const { StarSell } = await import("./StarSell.js");
            return new StarSell(player, tx);
        } else if (pick < 75) {
            const { PigHappening } = await import("./PigHappening.js");
            return new PigHappening(tx);
        } else {
            const { Theft } = await import("./Theft.js");
            return new Theft(player, tx);
        }
    }
}