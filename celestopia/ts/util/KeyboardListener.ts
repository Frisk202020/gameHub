import { setGlobalKeyboardListener } from "./variables.js";

export abstract class KeyboardListener {
    element: HTMLElement;
    protected enabled: boolean;

    constructor(element: HTMLElement) {
        this.element = element;
        this.enabled = true;

        setGlobalKeyboardListener(this);
    }

    abstract eventHandler(event: KeyboardEvent): void;
}