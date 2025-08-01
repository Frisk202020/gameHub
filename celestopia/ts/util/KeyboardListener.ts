export abstract class KeyboardListener {
    element: HTMLElement;
    enabled: boolean;

    constructor(element: HTMLElement) {
        this.element = element;
        this.enabled = true;
    }

    abstract eventHandler(event: KeyboardEvent): void;
}