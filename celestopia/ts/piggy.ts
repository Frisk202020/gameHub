export class Piggy {
    content: number;

    constructor() {
        this.content = 0;
    }

    feed(cash: number) {
        this.content += cash;
    }

    break() {
        const content = this.content;
        this.content = 0;
        return content;
    }
}