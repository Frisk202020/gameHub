import { fileLoadButtonHandler } from "./menus.js";
import { buildLogEntry, ENTRIES, TITLE } from "./shared.js";

const BTN_BOX = document.getElementById("buttons")!;
const BUTTONS: Button[] = [
    {name: "Filtrer", action: ()=>{}},
    {name: "Charger un autre fichier", action: fileLoadButtonHandler}
];

function buildButton(name: string, action: ()=>void) {
    const box = document.createElement("div");
    box.classList.add("centered-p");
    box.classList.add("hover");
    box.textContent = name;
    box.addEventListener("click", action);
    box.style.height = "10vh";
    box.style.fontSize = "5vh";
    box.style.padding = "2vh";
    box.style.backgroundColor = "#fef4bd";
    box.style.borderRadius = "20px";

    return box;
}

async function main() {
    BUTTONS.forEach((x)=>{BTN_BOX.appendChild(buildButton(x.name, x.action))});
    fetch("get-latest-log")
        .then((res) => res.json() as Promise<LogResponse>)
        .then((x) => {TITLE.textContent = x.file_name; x.content.forEach((x)=>ENTRIES.appendChild(buildLogEntry(x)))});
}

main();