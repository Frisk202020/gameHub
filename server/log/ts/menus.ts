import { buildLogEntry, ENTRIES, TITLE } from "./shared.js";

export async function fileLoadButtonHandler() {
    const elements: HTMLElement[] = [];
    try {
        const res = await fetch("get-log-list");
        const content: string[] = await res.json();

        const p = document.createElement("p");
        p.textContent = "Double-clickez sur le fichier à charger";
        p.className = "centered-p";
        p.style.fontSize = "larger";
        elements.push(p);

        const fileBox = menuBoxTemplate();
        content.forEach((x)=>{
            const p = document.createElement("p");
            p.textContent = x;
            p.classList.add("centered-block-p");
            p.classList.add("hover");
            p.style.backgroundColor = "#7b7676a7";
            p.style.padding = "10px";
            p.style.borderRadius = "10px";
            p.addEventListener("dblclick", ()=>{
                try {
                    fetch(`get_log/${x}`).then((res)=>res.json() as Promise<LogResponse>).then((x)=>{
                        TITLE.textContent = x.file_name;
                        ENTRIES.innerHTML = "";
                        x.content.forEach((x)=>ENTRIES.appendChild(buildLogEntry(x)));
                        tryCloseMenu();
                    });
                } catch (e) {
                    tryCloseMenu();
                    const p = document.createElement("p");
                    p.textContent = `Erreur lors du chargement du fichier de log: ${e}`;
                    p.className = "centered-p";
                    menuTemplate([p]);
                }
            });

            fileBox.appendChild(p);
        });

        elements.push(fileBox);
    } catch (e) {
        [
            "Echec du chargement de la base de donnée",
            `Erreur: ${e}`
        ].forEach((x)=>{
            const p = document.createElement("p");
            p.textContent = x;
            p.className = "centered-p";
            elements.push(p);
        })
    } finally {
        document.body.appendChild(menuTemplate(elements));
    }
}

export function logInfoMenu(entry: LogFormat) {
    const messageBox = menuBoxTemplate();
    const p = document.createElement("p");
    p.textContent = "Détails";
    p.style.fontWeight = "bold";
    p.className = "centered-p";
    p.style.fontSize = "larger";
    messageBox.appendChild(p);
    [
        `Niveau: ${entry.level}`,
        `Date: ${entry.timestamp}`,
        `Source: ${entry.target}`,
    ].forEach((x)=>{
        const p = document.createElement("p");
        p.textContent = x;
        p.className = "centered-p";
        messageBox.appendChild(p);
    });

    return menuTemplate([messageBox]);
}

function menuBoxTemplate() {
    const box = document.createElement("div");
    box.className = "evenly-spaced-column";
    box.style.height = "400px";
    box.style.width = "80vw";
    box.style.backgroundColor = "#c6c5c5";
    box.style.borderRadius = "20px";
    box.style.overflowY = "scroll";

    return box;
}

function tryCloseMenu() {
    const menu = document.getElementById("menu");
    if (menu === null) {
        console.log("ERROR: tried to close menu but it is not found in document");
    } else if (!document.body.contains(menu)) {
        console.log("ERROR: body does not contain menu");
    } else {
        document.body.removeChild(menu);
    }
}

function menuTemplate(elements: HTMLElement[]) {
    const box = document.createElement("div");
    box.id = "menu";
    box.className = "evenly-spaced-column";
    box.style.position = "fixed";
    box.style.height = "100vh";
    box.style.width = "100vw";
    box.style.left = "0px";
    box.style.top = "0px";
    box.style.backgroundColor = "#abababca";
    box.style.fontSize = "20px";
    elements.forEach((x)=>box.appendChild(x));

    const close = document.createElement("div");
    close.textContent = "Fermer";
    close.classList.add("centered-p");
    close.classList.add("hover");
    close.style.fontSize = "larger";
    close.style.padding = "5px";
    close.style.border = "5px solid #ffd700";
    close.style.borderRadius = "10px";
    close.style.backgroundColor = "#c20000";
    close.addEventListener("click", ()=>{
        if (document.body.contains(box)) {
            document.body.removeChild(box);
        }
    });
    box.appendChild(close);

    return box;
}