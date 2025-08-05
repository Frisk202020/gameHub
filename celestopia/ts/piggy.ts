const MAX = 10000;

export class Piggy {
    content: number;
    counter!: HTMLParagraphElement;
    counterRevealed: boolean;

    constructor() {
        this.content = 0;
        this.counterRevealed = false;

        this.#generateUI();
    }

    feed(cash: number) {
        if (this.content >= MAX) {
            return;
        }
        if (this.content + cash > MAX) {
            cash = MAX - this.content;
        }
        this.#progressiveCounterIncrement(cash);
    }

    multiply(factor: 2 | 3) {
        if (this.content >= MAX) {
            return;
        }
        if (this.content * factor >= MAX) {
            this.#progressiveCounterIncrement(MAX - this.content);
        } else {
            this.#progressiveCounterIncrement((factor - 1) * this.content);
        }
    }

    break() {
        const content = this.content;
        this.content = 0;
        return content;
    }

    //gold: 255,215,0
    setColor() {
        const ratio = this.content / MAX;
        this.counter.style.backgroundColor = `rgb(255, ${255 - Math.round(40*ratio)}, ${255 - Math.round(255*ratio)})`;

        if (this.content === MAX) {
            this.counter.style.color = "#ab0c0c";
        }
    }

    #generateUI() {
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.bottom = "1vh";
        box.style.right = "1vw";
        box.style.display = "flex";
        box.style.alignItems = "center";

        const counter = document.createElement("p");
        counter.id = "bankCounter";
        counter.classList.add("reveal-horizontal")
        counter.textContent = "0";
        counter.style.fontSize = "2vw";
        counter.style.backgroundColor = "#ffffff";
        counter.style.padding = "0.5vw";
        counter.style.margin = "0px";
        counter.style.height = "3vw";
        counter.style.width = "6vw";
        counter.style.borderRadius = "10px";
        counter.style.textAlign = "right";
        this.counter = counter;
        box.appendChild(counter);

        const icon = document.createElement("img");
        icon.src = "get_file/celestopia/assets/icons/pig.png";
        icon.style.height = "8vw";
        icon.style.width = "8vw";
        icon.className = "pointerHover";
        box.appendChild(icon);

        icon.addEventListener("click", () => {
            icon.src = "get_file/celestopia/assets/icons/pigHappy.png";
            new Promise(r => setTimeout(r, 500)).then(() => icon.src = "get_file/celestopia/assets/icons/pig.png");
            if (this.counterRevealed) {
                counter.classList.remove("visible");
            } else {
                counter.classList.add("visible");
            }

            this.counterRevealed = !this.counterRevealed;
        })

        document.body.appendChild(box);
    }

    async #progressiveCounterIncrement(increment: number) {
        if (!this.counterRevealed) {
            this.counter.classList.add("visible");
        }
        const dN = increment / 120;
        const current = this.content;
        const target = current + increment;

        this.content = increment;
        this.counter.style.color = "#009220";
        await new Promise(r => setTimeout(r, 2000));
        this.content = current;
        this.counter.style.color = "black";

        for (let i = 0; i < 120; i++) {
            this.content += dN;
            await new Promise(r => setTimeout(r, 100/6));
        }

        this.content = target;
    }
}