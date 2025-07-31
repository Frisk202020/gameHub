import { Position } from "./position.js";
import { createHelperBox, DynamicPlacement, KeyboardListener, resizables, setGlobalKeyboardListener, translateAnimation, vwToPx } from "./util.js";

//TODO : add a navbar to the menu

export class Aquisition implements DynamicPlacement {
    name: string;
    price: number;
    coinValue: number;
    ribbonValue: number;
    starValue: number;

    constructor(name: string, price: number, coin: number, ribbon: number, star: number) {
        this.name = name;
        this.price = price;
        this.coinValue = coin;
        this.ribbonValue = ribbon;
        this.starValue = star;

        resizables.push(this);
    }

    static generateMenu(list: Aquisition[]) {
        const blurryBackground = document.createElement("div");
        const bgStyle = blurryBackground.style;
        bgStyle.position = "absolute";
        bgStyle.left = "0px";
        bgStyle.top = "0px";
        bgStyle.backgroundColor = "#d4d4cb6f";
        bgStyle.width = "100vw";
        bgStyle.height = "100vh";
        bgStyle.zIndex = "5";
        document.body.appendChild(blurryBackground);

        // Image is square
        const img = document.createElement("img");
        img.id = "activeCard";
        img.src = `get_file/celestopia/assets/aquisitions/${list[0].name}.png`;

        const imgStyle = img.style;
        imgStyle.width = "40vw";
        imgStyle.height = "auto";
        imgStyle.zIndex = "6";

        const px = vwToPx(40);
        const rect = new Position(document.documentElement.clientWidth, document.documentElement.clientHeight);
        imgStyle.position = "absolute";
        imgStyle.left = `${(rect.x - px)/2}px`;
        imgStyle.top = `${(rect.y - px)/2}px`;
        document.body.appendChild(img);

        let box: HTMLParagraphElement;
        let navBar: HTMLDivElement;
        img.onload = () => {
            const imgRect = img.getBoundingClientRect();
            box = createHelperBox(
                "Utilisez les flèches du clavier pour naviguer entre vos aquisitions",
                false,
                undefined,
                undefined,
                6
            )
            box.id = "aquisitionHelpBox";

            navBar = document.createElement("div");
            navBar.id = "aquisitionNavBar";
            navBar.style.display = "flex";
            navBar.style.justifyContent = "center";
            navBar.style.position = "absolute";
            navBar.style.top = `${imgRect.bottom - 50}px`; 
            navBar.style.zIndex = "6";
            const navSquares: HTMLDivElement[] = Array();

            for (let i = 0; i < list.length; i++) {
                const sq = document.createElement("div");
                sq.style.width = "20px";
                sq.style.height = "20px";
                sq.style.margin = "10px";
                sq.style.borderRadius = "5px";
                sq.style.backgroundColor = "#5e5c5cff";
                navSquares.push(sq);
                navBar.appendChild(sq);
            }
            navSquares[0].style.backgroundColor = "#ffd700";
            navBar.style.opacity = "0";
            document.body.appendChild(navBar);
            const navRect = navBar.getBoundingClientRect();
            const navWidth = navRect.right - navRect.left;
            navBar.style.left = `${(rect.x - navWidth)/2}px`;
            navBar.style.opacity = "1";

            const helpStyle = box.style;
            helpStyle.opacity = "0";
            helpStyle.top = `${imgRect.bottom}px`;
            document.body.appendChild(box);

            const boxRect = box.getBoundingClientRect();
            const boxWidth = boxRect.right - boxRect.left;
            helpStyle.left = `${(rect.x - boxWidth)/2}px`;
            helpStyle.opacity = "1";

            setGlobalKeyboardListener(new AquisitionKeyboardListener(img, navSquares, list));
        }

        const cross = document.createElement("img");
        cross.src = "get_file/celestopia/assets/icons/cross.png";
        cross.style.width = "10vw";
        cross.style.position = "fixed";
        cross.style.right = "0px";
        cross.style.top = "0px";
        cross.style.zIndex = "6";
        cross.addEventListener("click", () => {
            document.body.removeChild(blurryBackground);

            const card = document.getElementById("activeCard");
            card === null ? console.log("WARN: none active card caught while clearing the menu") : document.body.removeChild(card);
            
            const newCard = document.getElementById("newCard");
            if (newCard !== null) {
                document.body.removeChild(newCard);
            }
            document.body.removeChild(navBar);
            document.body.removeChild(box);
            document.body.removeChild(cross);
        });
        document.body.appendChild(cross);
    }

    static bank = [
        new Aquisition("astropy", 1050, 150, 0, 1800),
        new Aquisition("baloon", 2400, 150, 3600, 0),
        new Aquisition("bd", 600, 50, 1650, 0),
        new Aquisition("beauty", 3300, 4050, 1100, 0),
        new Aquisition("camping", 3300, 5100, 0, 0),
        new Aquisition("car", 2850, 3600, 0, 300),
        new Aquisition("castle", 4500, 2000, 2000, 2000),
        new Aquisition("chest", 450, 1200, 0, 100),
        new Aquisition("horse", 2100, 4200, 0, 200),
        new Aquisition("magic", 3000, 5000, 5000, 5000),
        new Aquisition("moto", 2400, 3600, 0, 150),
        new Aquisition("necklace", 1000, 100, 0, 1800),
        new Aquisition("picasso", 2100, 3250, 1050, 200),
        new Aquisition("pool", 3000, 7500, 300, 0),
        new Aquisition("post", 1050, 150, 1800, 0),
        new Aquisition("tractor", 2850, 3600, 0, 300),
        new Aquisition("vase", 3000, 300, 0, 7500),
        new Aquisition("wine", 3000, 4500, 100, 0),
    ];

    static getRandomAquisition() {
        const i = Math.floor(Math.random() * Aquisition.bank.length);
        const value = Aquisition.bank[i];
        Aquisition.bank[i] = Aquisition.bank[Aquisition.bank.length - 1];
        Aquisition.bank.pop();

        return value;
    }

    static returnAquisitionToBank(aquisition: Aquisition) {
        Aquisition.bank.push(aquisition);
    }

    move(windowWidth: number, windowHeight: number): void {
        const img = document.getElementById("activeCard");
        const px = vwToPx(40);
        if (img != undefined) {
            img.style.left = `${(windowWidth - px)/2}px`;
            img.style.top = `${(windowHeight - px)/2}px`;

            const helpBox = document.getElementById("aquisitionHelpBox");
            if (helpBox != undefined) {
                const rect = helpBox.getBoundingClientRect();
                const width = rect.right - rect.left;
                helpBox.style.left = `${(windowWidth - width)/2}px`;
                helpBox.style.top = `${img.getBoundingClientRect().bottom}px`;
            } else {
                console.log("aquisition.ts | warn: aquisition card is loaded, but not the helper box");
            }

            const nav = document.getElementById("aquisitionNavBar");
            if (nav != undefined) {
                const rect = nav.getBoundingClientRect();
                const width = rect.right - rect.left;
                nav.style.left = `${(windowWidth - width)/2}px`;
                nav.style.top = `${img.getBoundingClientRect().bottom - 50}px`;
            } else {
                console.log("aquisition.ts | warn: aquisition card is loaded, but not the nav bar");
            }
        }
    }
}

class AquisitionKeyboardListener extends KeyboardListener {
    aquisitions: Aquisition[];
    navBar: HTMLDivElement[];
    currentIndex: number;

    constructor(element: HTMLImageElement, nav: HTMLDivElement[], aquisitions: Aquisition[]) {
        super(element)
        this.navBar = nav;
        this.aquisitions = aquisitions;
        this.currentIndex = 0;
    }

    eventHandler(event: KeyboardEvent): void {
        if (!this.enabled) { return; }

        this.enabled = false;
        const rect = this.element.getBoundingClientRect();
        let newCard: HTMLImageElement;
        const leftPos = this.element.getBoundingClientRect().left; // compute it before animation starts

        switch (event.key) {
            case "ArrowRight": 
                translateAnimation(this.element, new Position(vwToPx(-60), rect.top), 60, 0.5);
                newCard = this.#generateNewCard("left");
                break;
            case "ArrowLeft": 
                translateAnimation(this.element, new Position(vwToPx(140), rect.top), 60, 0.5);
                newCard = this.#generateNewCard("right");
                break;
            default: this.enabled = true; return;
        }

        translateAnimation(newCard, new Position(leftPos, rect.top), 60, 0.5).then(() => {
            if (document.body.contains(this.element)) {
                document.body.removeChild(this.element); // can be removed if cross is prompted
            }
            this.element = newCard;
            this.element.id = "activeCard";
            this.enabled = true;
        })        
    }

    #generateNewCard(position: "left" | "right") {
        const card = document.createElement("img");
        card.style.position = "absolute";
        card.style.top = this.element.style.top;
        card.style.width = "40vw";
        card.style.zIndex = "6";

        this.navBar[this.currentIndex].style.backgroundColor = "#5e5c5cff";
        if (position === "right") {
            card.style.left = "-60vw";
            if (this.currentIndex === 0) {
                this.currentIndex = this.aquisitions.length - 1;
            } else {
                this.currentIndex--;
            }
        } else {
            card.style.left = "140vw";
            if (this.currentIndex === this.aquisitions.length - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
        }
        this.navBar[this.currentIndex].style.backgroundColor = "#ffd700";

        card.src = `get_file/celestopia/assets/aquisitions/${this.aquisitions[this.currentIndex].name}.png`;
        card.id = "newCard";
        document.body.appendChild(card);
        return card;
    }
}
