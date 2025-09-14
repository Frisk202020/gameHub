import { setGlobalKeyboardListener } from "./variables.js";
export class KeyboardListener {
    constructor(element) {
        this.element = element;
        this.enabled = true;
        setGlobalKeyboardListener(this);
    }
}
