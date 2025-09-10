import { fileLoadButtonHandler, filterAction } from "./menus.js";
import { loadLogs } from "./shared.js";

const BTN_BOX = document.getElementById("buttons")!;
const BUTTONS: Button[] = [
    {name: "Filtrer", action: filterAction},
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
        .then((x) => loadLogs(x));
}

main();