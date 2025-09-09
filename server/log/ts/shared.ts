import { logInfoMenu } from "./menus.js";

export const TITLE = document.getElementById("title")!;
export const ENTRIES = document.getElementById("entries")!;

export function buildLogEntry(entry: LogFormat) {
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
        document.body.appendChild(logInfoMenu(entry));
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