import { type Avatar, Player, type PlayerColor, type PlayerId } from "../Player.js";
import { initChannel, Sender } from "../util/channel.js";
import { assets_link, isCharAlphanumeric, removeFromArrayByValue } from "../util/functions.js";
import { KeyboardListener } from "../util/KeyboardListener.js";
import { BoardEvent } from "./BoardEvent.js";

const AVAILABLE_AVATARS: Avatar[] = ["crown", "dice", "hat", "heart", "strawberry"];
const AVATAR_BUTTONS: Map<Avatar, HTMLElement> = new Map();

const AVAILABLE_COLORS = Player.colors();
const COLOR_BUTTONS: Map<PlayerColor, HTMLElement> = new Map();

export async function initPlayersLocal() {
    const {tx, rx} = initChannel<Player[]>();
    new InitEvent(tx);

    return await rx.recv();
}

interface PlayerCreateData {
    name: string,
    avatar: Avatar,
    color: PlayerColor
}

class InitEvent extends BoardEvent {
    #chosen: number | undefined;
    #chosenBtn: HTMLElement | undefined;
    #tx: Sender<Player[]>;
    
    constructor(tx: Sender<Player[]>) {
        const boxes = document.createElement("div");
        boxes.style.display = "flex";
        boxes.style.justifyContent = "space-between";
        boxes.style.width = "80vw";

        for (let i = 2; i < 5; i++) {
            const btn = document.createElement("div");
            btn.textContent = i.toString();
            btn.style.height = "10vh";
            btn.style.backgroundColor = "#ffd700";
            btn.style.border = "5px solid black";
            btn.style.fontSize = "6vh";
            btn.style.textAlign = "center";
            btn.style.display = "grid";
            btn.style.alignItems = "center";
            btn.style.width = "10vw";
            btn.style.borderRadius = "20px";
            btn.addEventListener("click", ()=>{
                if (this.#chosenBtn !== undefined) {
                    this.#chosenBtn.className = "";
                } else {
                    this.enableOk(()=>this.#okHandler());
                }
                this.#chosen = i;
                this.#chosenBtn = btn;
                btn.className = "hue";
            });
            boxes.appendChild(btn);
        }

        super(
            [BoardEvent.generateTextBox("Combien sommes nous à jouer ?"), boxes],
            BoardEvent.okSetup(false),
            BoardEvent.denySetup(false)
        );
        this.#tx = tx;
    }

    async #okHandler() {
        const res: Player[] = [];
        for (let j = 0; j < this.#chosen!; j++) {
            const {tx, rx} = initChannel<PlayerCreateData>();
            new PlayerCreate(tx);
            const data = await rx.recv();

            removeFromArrayByValue(AVAILABLE_AVATARS, data.avatar);
            removeFromArrayByValue(AVAILABLE_COLORS, data.color);
            res.push(new Player(j+1 as PlayerId, data.name, data.avatar, data.color));
        }

        this.#tx.send(res);
    }
}

class PlayerCreate extends BoardEvent {
    #tx: Sender<PlayerCreateData>;
    #textBox: HTMLElement;
    #okEnabled: boolean;
    #prompt: string;
    #chosenColor: PlayerColor | undefined;
    #chosenAvatar: Avatar | undefined;

    constructor(tx: Sender<PlayerCreateData>) {
        const nameBox = document.createElement("p");
        nameBox.textContent = "Entrez un nom: ";
        nameBox.style.height = "10vh";
        nameBox.style.width = "60vw";
        nameBox.style.textAlign = "center";
        nameBox.style.display = "grid";
        nameBox.style.alignItems = "center";
        nameBox.style.fontSize = "4vh";
        nameBox.style.border = "5px solid black";
        nameBox.style.borderRadius = "10px";
        nameBox.style.backgroundColor = "#f9e678";
        nameBox.style.marginTop = "2vh";

        const avatarButtons = document.createElement("div");
        avatarButtons.className = "row-box";
        avatarButtons.style.width = "100vw";
        AVAILABLE_AVATARS.forEach((x) => {
            const box = document.createElement("div");
            box.style.padding = "0.5vw";
            box.style.backgroundColor = "#f9e678";
            box.style.margin = "1vw";
            box.style.borderRadius = "20px";

            box.addEventListener("click", ()=>{
                if (this.#chosenAvatar !== undefined) {
                    disableAvatarButton(this.#chosenAvatar);
                } 
                enableAvatarButton(x, this.#chosenColor);
                this.#chosenAvatar = x;
                this.#updateOk();
            });

            const img = document.createElement("img");
            img.src = assets_link(`icons/${x}.png`);
            img.style.width = "9.5vw";
            box.appendChild(img);
            avatarButtons.appendChild(box);

            AVATAR_BUTTONS.set(x, box);
        });

        const colorButtons = document.createElement("div");
        colorButtons.className = "row-box";
        colorButtons.style.width =  "100vw";
        AVAILABLE_COLORS.forEach((x)=> {
            const box = document.createElement("div");
            box.style.backgroundColor = Player.palette(x).base;
            box.style.width = "10vh";
            box.style.height = "10vh";
            box.style.margin = "1vw";
            box.style.borderRadius = "20px";
            box.addEventListener("click", ()=>{
                if (this.#chosenColor !== undefined) {
                    disableColorButton(this.#chosenColor);
                }

                enableColorButton(x);
                this.#chosenColor = x;

                const color = Player.palette(x);
                nameBox.style.borderColor = color.base;
                this.menu.style.backgroundColor = color.info;
                if (this.#chosenAvatar === undefined) {
                    return;
                }
                
                const elm = AVATAR_BUTTONS.get(this.#chosenAvatar);
                if (elm === undefined) {
                    console.log(`unhandled chosen avatar: ${this.#chosenAvatar}`);
                    return;
                }
                elm.style.borderColor = color.base;
                this.#updateOk();
            });

            colorButtons.appendChild(box);
            COLOR_BUTTONS.set(x, box);
        });

        const avatarText = BoardEvent.generateTextBox("Choisissez un avatar...");
        const colorText = BoardEvent.generateTextBox("... et une couleur.");

        [avatarText, colorText].forEach((x)=>{
            x.style.marginTop = "5vh";
            x.style.marginBottom = "1vh";
        });

        super(
            [
                nameBox,
                avatarText,
                avatarButtons,
                colorText,
                colorButtons
            ],
            BoardEvent.okSetup(false),
            BoardEvent.denySetup(false)
        );
        this.#tx = tx;
        this.#okEnabled = false;
        this.menu.style.overflowY = "scroll";
        
        this.#prompt = "";
        new Listener(nameBox, this);
        this.#textBox = nameBox;
    }

    #updateOk() {
        if (this.#okEnabled) {
            if (this.#prompt.length === 0 || this.#chosenAvatar === undefined || this.#chosenColor === undefined) {
                console.log("disable");
                this.disableOk();
                this.#okEnabled = false;
            }
        } else {
            if (this.#prompt.length > 0 && this.#chosenAvatar !== undefined && this.#chosenColor !== undefined) {
                this.enableOk(()=>this.#okHandler());
                this.#okEnabled = true;
            }
        }
    }

    #okHandler() {
        this.#tx.send({name: this.#prompt, avatar: this.#chosenAvatar!, color: this.#chosenColor!})
    }

    update(text: string) {
        this.#prompt = text;
        this.#textBox.textContent = `Entrez un nom: ${text}`;
        this.#updateOk();
    }
}

class Listener extends KeyboardListener {
    #prompt: string;
    #caller: PlayerCreate;

    constructor(elm: HTMLElement, caller: PlayerCreate) {
        super(elm);
        this.#prompt = "";
        this.#caller = caller;
    }

    eventHandler(event: KeyboardEvent): void {
        if (isCharAlphanumeric(event.key)) {
            this.#prompt = this.#prompt + event.key;
        } else if (event.key === "Backspace") {
            this.#prompt = this.#prompt.substring(0, this.#prompt.length-1);
        } else {
            return;
        }

        this.#caller.update(this.#prompt);
    }
}

function enableAvatarButton(x: Avatar, borderColor?: PlayerColor) {
    const elm = AVATAR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }

    elm.classList.add("hue");
    elm.style.border = `solid 5px ${borderColor === undefined ? "black" : Player.palette(borderColor).base}`;
}

function disableAvatarButton(x: Avatar) {
    const elm = AVATAR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }

    elm.classList.remove("hue");
    elm.style.border = "none";
}

function enableColorButton(x: PlayerColor) {
    const elm = COLOR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }

    elm.style.border = "solid 5px #ffd700";
}

function disableColorButton(x: PlayerColor) {
    const elm = COLOR_BUTTONS.get(x);
    if (elm === undefined) {
        console.log(`ERROR: unhandled avatar: ${x}`);
        return;
    }

    elm.style.border = "none";
}