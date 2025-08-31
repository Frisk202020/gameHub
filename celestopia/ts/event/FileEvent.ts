import { BoardEvent } from "./BoardEvent.js";
import { Player, type PlayerData, type PlayerId } from "../Player.js"
import { pig, players } from "../util/variables.js";
import { assets_link } from "../util/functions.js";

export class FileEvent extends BoardEvent {
    constructor() {
        const buttons = [{0: "Sauvegarder",1: ()=>new SaveEvent()}, {0: "Charger", 1: ()=>new LoadEvent()}].map((x)=>{
            const b = BoardEvent.generateButton(x[0], "#ffd700", true, x[1]);
            b.className = "pointerHover";
            b.addEventListener("mouseenter", ()=>b.classList.add("hue"));
            b.addEventListener("mouseleave", ()=>b.classList.remove("hue"));
            return b;
        });
        super(
            buttons,
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(true, "Retour")
        )
    }
}

/* event classes */
class SaveEvent extends BoardEvent {
    constructor() {
        removeOldMenu();

        const form = createForm(
            {
                name: "saveForm",
                entries: [{name: "name", label: "Nom de fichier"}],
                submitLabel: "Ok"
            }
        );
        form.addEventListener("submit", saveHandler);

        super(
            [BoardEvent.generateTextBox("Sauvegarder"), form],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(true, "Retour", ()=>new FileEvent())
        )
    }
}


class SaveKey extends BoardEvent {
    constructor(filename: string) {
        removeOldMenu();

        const p = BoardEvent.generateTextBox("Entrez la clé d'authentification de ce fichier.");
        p.id = "message"; 

        const form = createForm(
            {
                name: "saveForm",
                entries: [{name: "key", label: "Clé", id: "formInput"}],
                submitLabel: "Ok"
            }
        );
        form.addEventListener("submit", (event)=>authentification_handler(filename, event))

        super(
            [p, form],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(true, "Retour", ()=>new FileEvent())
        )
    }
}

class LoadEvent extends BoardEvent {
    constructor() {
        removeOldMenu();

        const form = createForm(
            {
                name: "loadForm",
                entries: [{name: "name", label: "Nom de fichier"}],
                submitLabel: "Ok"
            }
        );
        form.addEventListener("submit", loadHandler);

        super(
            [BoardEvent.generateTextBox("Charger"), form],
            BoardEvent.okSetup(true, "Afficher les fichiers disponibles", ()=>new DataEvent()),
            BoardEvent.denySetup(true, "Retour", ()=>new FileEvent())
        )
    }
}

class DataEvent extends BoardEvent {
    #box: HTMLDivElement;
    constructor() {
        removeOldMenu();
        
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.overflowY = "scroll";
        box.style.width = "60vw";
        box.style.height = "60vh";
        box.style.backgroundColor = "#faf088";
        box.style.borderRadius = "10px";
        box.style.alignItems = "center";

        super(
            [BoardEvent.generateTextBox("Fichiers disponibles"), box],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(true, "Retour", ()=>new LoadEvent())
        )

        this.#box = box;
        this.loadData();
    }

    async loadData() {
        const data = await sendDataRequest();
        if (data.length === 0) {
            this.#box.appendChild(BoardEvent.generateTextBox("Aucun fichier n'a été trouvé..."));
            return;
        }

        data.forEach((x)=>this.#appendFileBox(x));
    }

    #appendFileBox(name: string) {
        const box = document.createElement("div");
        box.textContent = name;
        box.style.width = "50vw";
        box.style.backgroundColor = "#ffd700";
        box.style.borderRadius = "10px";
        box.style.display = "grid";
        box.style.alignItems = "center";
        box.style.textAlign = "center";
        box.style.margin = "1vh";
        box.style.padding = "1vh";
        box.style.fontSize = "x-large";
        box.className = "pointerHover";
        box.addEventListener("click", ()=>new FileLoadEvent(name));
        box.addEventListener("mouseenter", ()=>box.classList.add("hue"));
        box.addEventListener("mouseleave", ()=>box.classList.remove("hue"));

        this.#box.appendChild(box);
    }
}

class FileLoadEvent extends BoardEvent {
    constructor(file: string) {
        removeOldMenu();
        super([], BoardEvent.okSetup(false, "Charger"), BoardEvent.denySetup(true, "Retour", ()=>new DataEvent()))
        sendLoadRequest(file).then((x)=>{
            if (x === undefined) {
                new Message(["Le chargement de ce fichier a échoué..."]);
            } else {
                const oldFirst = this.box.firstChild;
                this.box.insertBefore(createSaveFileBox(x, file), oldFirst);
                this.enableOk(()=>{
                    loadData(x);
                    new Message(["Chargement effectué !"]);
                });
            }
        })
    }
}

class Message extends BoardEvent {
    constructor(messages: string[]) {
        removeOldMenu();
        super(
            messages.map((m)=>BoardEvent.generateTextBox(m)),
            BoardEvent.okSetup(true),
            BoardEvent.denySetup(false)
        )
    }
}

/* Request functions */
let registeredKey = "";
async function sendSaveRequest(name: string, key?: string): Promise<OutputResponse> {
    try {
        const {players, turnHolder} = getPlayersData();

        const body: GameData = {
            name,
            key: key === undefined ? registeredKey : key,
            players,
            pig: pig.content,
            turnHolder
        }
        const res = await fetch(
            "celestopia/save", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }
        )
       
        const json: Response = await res.json();
        if (!res.ok) {
            if (res.status == 409) {
                if (key === undefined) {
                    return {
                        success: false,
                        authentification_error: true,
                        message: "Erreur d'authentification: veuillez entrer la clé.",
                        key: "",
                        errors: []
                    }
                } else {
                    return {
                        success: false,
                        authentification_error: true,
                        message: "Clé invalide. Réesayez.",
                        key: "",
                        errors: []
                    }
                }
            } else {
                return {
                    success: false,
                    authentification_error: false,
                    message: `Message du serveur: ${json.message}`,
                    key: "",
                    errors: []
                }
            }
        }
        if (json.authentification !== "") { registeredKey = json.authentification; }

        return {
            success: true,
            authentification_error: false,
            message: json.message,
            key: json.authentification,
            errors: json.errors
        };
    } catch(err) {
        return {
            success: false,
            authentification_error: false,
            message: `caught error: ${err}`,
            key: "",
            errors: []
        }
    }
}

async function sendLoadRequest(name: string): Promise<GameData | undefined> {
    try {
        const res = await fetch(`celestopia/load/${name}`);
        const result: GameData = await res.json();

        return result;
    } catch(err) {
        console.log(`Load error: ${err}`);
        return undefined;
    }
}

function loadData(data: GameData) {
    const playerBox = document.getElementById("players") as HTMLDivElement;
    playerBox.innerHTML = "";

    if (players.length <= data.players.length) {
        for (let i = 0; i < players.length; i++) {
            const pData = data.players[i];
            const p = new Player(i+1 as PlayerId, pData.name, pData.icon, pData.color);
            p.loadData(pData, data.turnHolder === p.id);

            players[i] = p;
        }
        for (let i = players.length; i < data.players.length; i++) {
            const pData = data.players[i];
            const p = new Player((i + 1) as PlayerId, pData.name, pData.icon, pData.color);
            p.loadData(pData, data.turnHolder === p.id);

            players.push(p);
        }
    } else {
        for (let i = 0; i < data.players.length; i++) {
            const pData = data.players[i];
            const p = new Player(i+1 as PlayerId, pData.name, pData.icon, "red");
            p.loadData(pData, data.turnHolder === p.id);

            players[i] = p;
        }
        for (let i = 0; i < (players.length - data.players.length); i++) {
            players.pop();
        }
    }
    
    pig.loadContent(data.pig);
}

async function sendDataRequest() {
    try {
        const res = await fetch("celestopia/database");
        if (!res.ok) {
            console.log(`Request failed: ${res.body}`);
            return [];
        }

        const out: string[] = await res.json();
        return out;
    } catch (err) {
        console.log(`Caught error on data request: ${err}`);
        return [];
    }
}

/* handlers */
async function loadHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get("name");
    if (name !== null) { 
        const litteralName = name.toString();
        const data = await sendLoadRequest(litteralName); 
        if (data === undefined) { new Message(["Echec du chargement..."]); }
        else {
            loadData(data);
            new Message(["Chargement effectué !"]); 
        }
    }
}

async function saveHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get("name");
    if (name !== null) { 
        const litteralName = name.toString();
        const res = await sendSaveRequest(litteralName); 
        if (res.success) {
            const messages = ["Sauvegarde effectuée"];
            if (res.key !== "") { messages.push(`Clé d'authentification: ${res.key}.`); }
            new Message(messages);
        } else {
            if (res.authentification_error) {
                new SaveKey(litteralName);
            } else {
                new Message(["Sauvegarde échouée, veuillez réessayer avec un autre nom."]);
            }
        }
    }
}

async function authentification_handler(file: string, event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const key = data.get("key");
    if (key !== null) { 
        const res = await sendSaveRequest(file, key.toString()); 
        if (res.success) {
            new Message(["Sauvegarde effectuée"]);
        } else {
            if (res.authentification_error) {
                (document.getElementById("message") as HTMLElement).textContent = res.message;
                (document.getElementById("formInput") as HTMLInputElement).value = "";
            }
        }
    }
}

/* util */
function removeOldMenu() {
    const old = document.getElementById("menu");
    if (old !== null) { document.body.removeChild(old); }
}

function createForm(builder: FormBuilder) {
    const form = document.createElement("form");
    form.id = builder.name;
    form.method = "post";
    form.autocomplete = "off";

    builder.entries.forEach((x)=>{
        const label = document.createElement("label");
        label.htmlFor = x.name;
        label.textContent = x.label;
        form.appendChild(label);
        form.appendChild(document.createElement("br"));

        const input = document.createElement("input");
        input.name = x.name;
        input.type = "text";
        if (x.id !== undefined) { input.id = x.id; }
        form.appendChild(input);
        for (let i = 0; i < 2; i++) { form.appendChild(document.createElement("br")); }
    });

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = builder.submitLabel;
    form.appendChild(submit);
    return form;
}

interface FormBuilder {
    name: string,
    entries: FormEntryBuilder[],
    submitLabel: string
}

interface FormEntryBuilder {
    name: string,
    label: string,
    id?: string
}

function getPlayersData(): {players: PlayerData[], turnHolder: PlayerId } {
    let turnHolder: PlayerId = 1;
    const playersData = players.map((p) => {
        if (p.enabled) { turnHolder = p.id; }
        return {
            name: p.name,
            icon: p.avatar,
            color: p.color.name,
            coins: p.coins,
            ribbons: p.ribbons,
            stars: p.stars,
            aquisitions: p.listAquisitions(),
            wonders: p.listWonders(),
            items: p.stringifyItems(),
            caseId: p.caseId,
            boardId: p.boardId,
            diceNumber: p.diceNumber
        }
    });

    return { players: playersData, turnHolder }
}

interface GameData {
    name?: string,
    key?: string,
    players: PlayerData[],
    pig: number,
    turnHolder: PlayerId
}

function createSaveFileBox(data: GameData, filename: string) {
    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.overflowY = "scroll";
    box.style.width = "60vw";
    box.style.height = "60vh";
    box.style.backgroundColor = "#faf088";
    box.style.borderRadius = "10px";
    box.style.alignItems = "center";

    box.appendChild(createFileParagraph(filename));
    box.appendChild(createFileParagraph("Joueurs"));
    
    for (let i = 0; i < data.players.length; i++) {
        const p = data.players[i];
        const pBox = document.createElement("div");
        pBox.style.backgroundColor = Player.palette(p.color).base;
        pBox.style.width = "50vw";
        pBox.style.borderRadius = "10px";
        pBox.style.margin = "2vh";

        [
            {img: p.icon, text: p.name},
            {img: "coin", text: p.coins.toString()},
            {img: "ribbon", text: p.ribbons.toString()},
            {img: "star", text: p.stars.toString()},
            {img: "chest", text: p.aquisitions.length.toString()},
            {img: "wonder", text: p.wonders.length.toString()},
            {img: "bag", text: p.items.length.toString()}
        ].forEach((x)=>{
            pBox.appendChild(createSubFileBox(x));
        });
        box.appendChild(pBox);
    }
    box.appendChild(createFileParagraph("Informations complémentaires"));
    box.appendChild(createSubFileBox({img: "pig", text: data.pig.toString()}));

    return box;
}

function createFileParagraph(textContent: string) {
    const p = document.createElement("p");
    p.textContent = textContent;
    p.style.textAlign = "center";
    p.style.display = "grid";
    p.style.alignItems = "center";
    p.style.fontSize = "30px";
    
    return p
}

function createSubFileBox(x: BoxInfo) {
    const subBox = document.createElement("div");
    subBox.style.display = "flex";
    subBox.style.justifyContent = "center";
    subBox.style.alignItems = "center";

    const icon = document.createElement("img");
    icon.src = assets_link(`icons/${x.img}.png`);
    icon.style.height = "5vh";
    icon.style.margin = "1vh";
    subBox.appendChild(icon);

    const name = document.createElement("p");
    name.textContent = x.text;
    name.style.textAlign = "center";
    name.style.fontSize = "y-large";
    name.style.margin = "1vh";
    subBox.appendChild(name);

    return subBox;
}

interface BoxInfo {
    img: string,
    text: string
}

interface Response {
    message: string,
    authentification: string,
    errors: string[]
}

interface OutputResponse {
    success: boolean,
    authentification_error: boolean
    message: string,
    key: string,
    errors: string[]
}