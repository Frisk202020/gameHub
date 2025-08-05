import { Player } from "../Player.js";
import { appendBlurryBackground } from "../util/functions.js";
import { BoardEvent } from "./BoardEvent.js";

export abstract class Happening extends BoardEvent {
    name: string;
    description: string;

    constructor(name: string, description: string, disableOk: boolean, denyButton: boolean, ...elements: HTMLElement[]) {
        let allElements: HTMLElement[] = [
            BoardEvent.generateTextBox(name),
            BoardEvent.generateTextBox(description)
        ];
        allElements = allElements.concat(elements);

        super(
            allElements,
            disableOk, 
            denyButton, 
            () => {
                document.body.removeChild(this.menu);
                this.event();
            },
        )
        this.name = name;
        this.description = description;
    } 

    // Specific event logic
    protected abstract event(): void;

    static async pickRandomEvent(player: Player): Promise<Happening> {
        //const pick = Math.floor(Math.random() * 100);
        const pick = 44;
        if (pick < 25) {
            const { GiftEvent } = await import("./Gift.js");
            return new GiftEvent(player);
        }
        else if (pick < 31.25) {
            const { RibbonSale } = await import("./RibbonSale.js");
            return new RibbonSale(player);
        } else if (pick < 37.5) {
            const { RibbonSell } = await import("./RibbonSell.js");
            return new RibbonSell(player);
        } else if (pick < 43.75) {
            const { StarSale } = await import("./StarSale.js");
            return new StarSale(player);
        } else if (pick < 50) {
            const { StarSell } = await import("./StarSell.js");
            return new StarSell(player);
        } else if (pick < 75) {
            const { Pig } = await import("./Pig.js");
            return new Pig();
        } else {
            const { Theft } = await import("./Theft.js");
            return new Theft(player);
        }
    }
}