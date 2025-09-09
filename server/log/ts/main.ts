const TITLE = document.getElementById("title")!;
const BTN_BOX = document.getElementById("buttons")!;
const ENTRIES = document.getElementById("entries")!;
const infoIconSrc = "get_file/server/log/info.svg";
const BUTTONS: Button[] = [
    {name: "Filtrer", action: ()=>{}},
    {name: "Charger un autre fichier", action: ()=>{}}
];

function buildButton(name: string, action: ()=>void) {
    const box = document.createElement("div");
    box.className = "centered-p";
    box.textContent = name;
    box.addEventListener("click", action);
    box.style.height = "10vh";
    box.style.fontSize = "5vh";
    box.style.padding = "2vh";
    box.style.backgroundColor = "#fef4bd";
    box.style.borderRadius = "20px";

    return box;
}

function detailledInfo(entry: LogFormat) {
    const box = document.createElement("div");
    box.className = "evenly-spaced-column";
    box.style.position = "fixed";
    box.style.height = "100vh";
    box.style.width = "100vw";
    box.style.left = "0px";
    box.style.top = "0px";
    box.style.backgroundColor = "#abababca";

    const messageBox = document.createElement("div");
    messageBox.className = "centered-column";
    messageBox.style.height = "50vh";
    messageBox.style.width = "80vw";
    messageBox.style.backgroundColor = "#c6c5c5";
    messageBox.style.borderRadius = "20px";
    box.appendChild(messageBox);

    const p = document.createElement("p");
    p.textContent = "Détails";
    p.style.fontWeight = "bold";
    p.className = "centered-p";
    p.style.fontSize = "5vh";
    messageBox.appendChild(p);
    [
        `Niveau: ${entry.level}`,
        `Date: ${entry.timestamp}`,
        `Source: ${entry.target}`,
    ].forEach((x)=>{
        const p = document.createElement("p");
        p.textContent = x;
        p.className = "centered-p";
        p.style.fontSize = "4vh";
        messageBox.appendChild(p);
    });

    const close = document.createElement("div");
    close.textContent = "Fermer";
    close.classList.add("centered-p");
    close.classList.add("hover");
    close.style.fontSize = "5vh";
    close.style.padding = "0.25vh";
    close.style.border = "5px solid #ffd700";
    close.style.borderRadius = "20px";
    close.style.backgroundColor = "#c20000";
    close.addEventListener("click", ()=>{
        if (document.body.contains(box)) {
            document.body.removeChild(box);
        }
    });
    box.appendChild(close);

    return box;
}

function buildLogEntry(entry: LogFormat) {
    const p = document.createElement("p");
    p.className = "hover";
    p.textContent = entry.fields.message;
    p.style.display = "grid";
    p.style.alignItems = "center";
    p.style.height = "40px";
    p.style.fontSize = "20px";
    p.style.margin = "0px";
    p.style.overflowX = "scroll";
    p.style.margin = "5px";
    p.style.borderRadius = "20px";
    p.style.padding = "10px";
    p.addEventListener("click", ()=>{
        document.body.appendChild(detailledInfo(entry));
    })

    switch (entry.level) {
        case "ERROR": p.style.backgroundColor = "#fa3838da"; break;
        case "INFO": p.style.backgroundColor = "#5ffb5fda"; break;
        case "WARN": p.style.backgroundColor = "#ffd95ada"; break;
        case "DEBUG": p.style.backgroundColor = "#2cc6feda"; break;
        case "TRACE": p.style.backgroundColor = "#ec49fbda"; break;
    }

    return p;
}

async function main() {
    BUTTONS.forEach((x)=>{BTN_BOX.appendChild(buildButton(x.name, x.action))});
    fetch("get-latest-log")
        .then((res) => res.json() as Promise<LogResponse>)
        .then((x) => {TITLE.textContent = x.file_name; x.content.forEach((x)=>ENTRIES.appendChild(buildLogEntry(x)))});
}

main();