import { appendBlurryBackground, appendCross } from "../util/functions.js";
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
            BoardEvent.denySetup(false)
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

class SaveEvent {
    constructor() {
        removeOldMenu();

        const menu = appendBlurryBackground();
        menu.style.display = "flex";
        menu.style.flexDirection = "column";
        menu.style.alignItems = "center"
        menu.innerHTML = `
            <p style="font-size: 50px; text-align: center;">Sauvegarder</p>
            <form id="saveForm" action="/celestopia/save" method="post" autocomplete="off">
                <label for="name">Nom du fichier: </label><br>
                <input name="name" type="text"><br><br>
                <input type="submit" value="Ok">
            </form>
        `;
        appendCross(["menu"], menu);
        document.getElementById("saveForm")?.addEventListener("submit", saveHandler)
    }
}

class LoadEvent {
    constructor() {
        removeOldMenu();

        const menu = appendBlurryBackground();
        menu.style.display = "flex";
        menu.style.flexDirection = "column";
        menu.style.alignItems = "center"
        menu.innerHTML = `
            <p style="font-size: 50px; text-align: center;">Charger</p>
            <form id="saveForm" action="/celestopia/save" method="post" autocomplete="off">
                <label for="name">Nom du fichier: </label><br>
                <input name="name" type="text"><br><br>
                <input type="submit" value="Ok">
            </form>
        `;
        appendCross(["menu"], menu);
        document.getElementById("saveForm")?.addEventListener("submit", loadHandler)
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
                const elm = document.getElementById("menu") as HTMLDivElement;
                elm.innerHTML = `
                    <p id="message" style="font-size: 30px; text-align: center;">Entrez la clé d'authentification de ce fichier.</p>
                    <form id="saveForm" action="/celestopia/save" method="post" autocomplete="off">
                        <label for="key">Clé: </label><br>
                        <input name="key" type="text" id="formInput"><br><br>
                        <input type="submit" value="Ok">
                    </form>
                `;
                appendCross(["menu"], elm);
                document.getElementById("saveForm")?.addEventListener("submit", (event)=>authentification_handler(litteralName, event))
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