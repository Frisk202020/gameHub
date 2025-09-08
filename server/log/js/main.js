const BTN_BOX = document.getElementById("buttons");
const BUTTONS = [
    {name: "Filtrer", action: ()=>{}},
    {name: "Charger un autre fichier", action: ()=>{}}
];

function buildButton(name, action) {
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

async function main() {
    BUTTONS.forEach((x)=>{BTN_BOX.appendChild(buildButton(x.name, x.action))});
    const file = await fetch("get_file/server/log/")
}

main();