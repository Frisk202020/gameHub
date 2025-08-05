import { appendBlurryBackground, createHelperBox } from "../util/functions.js";

export abstract class BoardEvent {
    protected menu: HTMLDivElement;
    protected box: HTMLDivElement;

    constructor(elements: HTMLElement[],disableOk: boolean, deny: boolean, okHandler?: ()=>void, denyHandler?: ()=>void) {
        const menu = appendBlurryBackground();
        const flex = document.createElement("div");
        flex.style.display = "flex";
        flex.style.justifyContent = "center";
        flex.style.alignItems = "center";
        flex.style.height = "100%";
        flex.style.flexDirection = "column";
        menu.appendChild(flex);
        this.box = flex;

        for (const e of elements) {
            this.box.appendChild(e);
        }

        this.#appendButtons(disableOk, deny, okHandler, denyHandler);
        this.menu = menu;
        document.body.appendChild(menu);
    }

    protected static generateTextBox(text: string) {
        const description = document.createElement("div");
        description.textContent = text;
        description.style.fontSize = "30px";
        description.style.margin = "50px";
        description.style.textAlign = "center";
        
        return description;
    }

    protected static generateImage(src: string) {
        const img = document.createElement("img");
        img.src = src;
        img.style.width = "30%";

        return img;
    }

    #appendButtons(disableOk: boolean, deny: boolean, okHandler?: ()=>void, denyHandler?: ()=>void) {
        const buttons = document.createElement("div");
        buttons.style.display = "flex";
        buttons.style.justifyContent = "center";

        buttons.appendChild(this.#okButton(disableOk, okHandler));
        if (deny) {
            buttons.appendChild(this.#denyButton(denyHandler));
        }

        this.box.appendChild(buttons);
    }

    #okButton(disable: boolean, handler?: ()=>void) {
        const button = document.createElement("div");
        button.textContent = "Ok";
        button.style.fontSize = "30px";
        button.style.margin = "50px";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.border = "3px solid #ffd700";
        button.style.backgroundColor = disable ? "#aba7a7ff" : "#03a316";

        if (!disable) {
            button.addEventListener("click", handler === undefined ? () => {
                document.body.removeChild(this.menu);
            } : handler);
            button.className = "pointerHover";
        }

        return button;
    }

    #denyButton(handler?: ()=>void) {
        const button = document.createElement("div");
        button.textContent = "Refuser";
        button.style.fontSize = "30px";
        button.style.margin = "50px";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.border = "3px solid #ffd700";
        button.style.backgroundColor = "#c10a19ff";
        button.className = "pointerHover";

        button.addEventListener("click", handler === undefined ? () => {
            document.body.removeChild(this.menu);
        } : handler);
        return button;
    }
}