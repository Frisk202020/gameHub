import { Player } from "../Player.js";
import { appendBlurryBackground } from "../util/functions.js";

export abstract class GreenEvent {
    name: string;
    description: string;
    menu!: HTMLDivElement;
    box!: HTMLDivElement;

    constructor(name: string, description: string, delayGenerics: boolean) {
        this.name = name;
        this.description = description;

        this.#generateUI(delayGenerics)
    } 

    #generateUI(delayGenerics: boolean) {
        const menu = appendBlurryBackground();
        const flex = document.createElement("div");
        flex.style.width = "100%";
        flex.style.height = "100%";
        flex.style.display = "flex";
        flex.style.justifyContent = "center";
        flex.style.alignItems = "center";
        flex.style.flexDirection = "column";
        menu.appendChild(flex);
        this.box = flex;

        const title = document.createElement("div");
        title.textContent = this.name;
        title.style.fontSize = "50px";
        title.style.margin = "50px";
        flex.appendChild(title);

        this.appendTextBox(this.description);

        this.menu = menu;
        if (!delayGenerics) { this.generateSpecificUIElements(); }
    }

    protected appendTextBox(text: string) {
        const description = document.createElement("div");
        description.textContent = text;
        description.style.fontSize = "30px";
        description.style.margin = "50px";
        description.style.textAlign = "center";
        this.box.appendChild(description);
    }

    protected appendButtons(deny: boolean) {
        const buttons = document.createElement("div");
        buttons.style.display = "flex";
        buttons.style.justifyContent = "center";

        buttons.appendChild(this.#okButton());
        if (deny) {
            buttons.appendChild(this.#denyButton());
        }

        this.box.appendChild(buttons);
    }

    #okButton() {
        const button = document.createElement("div");
        button.textContent = "Ok";
        button.style.fontSize = "30px";
        button.style.margin = "50px";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.border = "3px solid #ffd700";
        button.style.backgroundColor = "#03a316";
        button.className = "pointerHover";

        button.addEventListener("click", () => {
            document.body.removeChild(this.menu);
            this.event();
        });
        return button;
    }

    #denyButton() {
        const button = document.createElement("div");
        button.textContent = "Refuser";
        button.style.fontSize = "30px";
        button.style.margin = "50px";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.border = "3px solid #ffd700";
        button.style.backgroundColor = "#c10a19ff";
        button.className = "pointerHover";

        button.addEventListener("click", () => {
            document.body.removeChild(this.menu);
        });
        return button;
    }


    // Add buttons or additional textboxes
    protected abstract generateSpecificUIElements(): void;
    // Specific event logic
    protected abstract event(): void;

    static async pickRandomEvent(player: Player): Promise<GreenEvent> {
        const pick = Math.floor(Math.random() * 100);
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