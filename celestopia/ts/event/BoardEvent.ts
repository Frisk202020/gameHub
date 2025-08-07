import { appendBlurryBackground, createHelperBox } from "../util/functions.js";

interface OkSetup {
    append: boolean;
    enable: boolean;
    customLabel?: string;
    customHandler?: ()=>void;
}

interface DenySetup {
    append: boolean;
    customLabel?: string;
    customHandler?: ()=>void;
}

export abstract class BoardEvent {
    protected menu: HTMLDivElement;
    protected box: HTMLDivElement;

    constructor(elements: HTMLElement[], ok: OkSetup, deny: DenySetup) {
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

        this.#appendButtons(ok, deny);
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

    protected static generateButton(label: string, color: string, enabled: boolean, event: ()=>void, borderColor?: string) {
        const button = document.createElement("div");
        if (enabled) {
            button.className = "pointerHover"
        }
        button.textContent = label;
        button.style.fontSize = "30px";
        button.style.margin = "50px";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.border = `3px solid ${borderColor === undefined ? "#ffd700" : borderColor}`;
        button.style.backgroundColor = color;
        button.addEventListener("click", event);

        return button;
    }

    protected static unappendedOkSetup() {
        return { append: false, enable: false };
    }

    protected static okSetup(enable: boolean, customLabel?: string, customHandler?: ()=>void) {
        return {append: true, enable, customLabel, customHandler};
    }

    protected static denySetup(append: boolean, customLabel?: string, customHandler?: ()=>void) {
        return {append, customLabel, customHandler};
    }

    #appendButtons(ok: OkSetup, deny: DenySetup) {
        if (!ok.append && !deny.append) { return; }

        const buttons = document.createElement("div");
        buttons.style.display = "flex";
        buttons.style.justifyContent = "center";

        if (ok.append) {
            buttons.appendChild(this.#okButton(ok));
        }
        if (deny.append) {
            buttons.appendChild(this.#denyButton(deny.customLabel, deny.customHandler));
        }

        this.box.appendChild(buttons);
    }

    #okButton(config: OkSetup) {
        const button = BoardEvent.generateButton(
            config.customLabel === undefined ? "Ok" : config.customLabel,
            config.enable ? "#03a316" : "#aba7a7",
            config.enable,
            config.enable ? config.customHandler === undefined ? () => {document.body.removeChild(this.menu);} : config.customHandler : ()=>{}
        )
        if (config.enable) {
            button.className = "pointerHover";
        }

        return button;
    }

    #denyButton(label?: string, handler?: ()=>void) {
        return BoardEvent.generateButton(
            label === undefined ? "Refuser" : label,
            "#c10a19ff",
            true,
            handler === undefined ? () => {
                document.body.removeChild(this.menu);
            } : handler
        );
    }
}