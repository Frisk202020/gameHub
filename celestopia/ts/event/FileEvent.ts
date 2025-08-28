import { sendLoadRequest, sendSaveRequest } from "../util/save.js";
import { BoardEvent } from "./BoardEvent.js";

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
        box.addEventListener("mouseenter", ()=>box.classList.add("hue"));
        box.addEventListener("mouseleave", ()=>box.classList.remove("hue"));

        this.#box.appendChild(box);
    }
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

async function loadHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get("name");
    if (name !== null) { 
        const litteralName = name.toString();
        const success = await sendLoadRequest(litteralName); 
        new Message([success ? "Chargement effectué." : "Echec du chargement..."]);
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