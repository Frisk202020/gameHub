import { logLevels } from "./level.js";
import { logInfoMenu } from "./menus.js";
import { isProviderEnabled, recordNewProviders } from "./providers.js";

const TITLE = document.getElementById("title")!;
const ENTRIES_BOX = document.getElementById("entries")!;
const ENTRIES: Map<LogFormat, LogDisplay> = new Map();

export function enableFilterBtn(element: HTMLElement, color: string) {
    element.style.backgroundColor = color;
    element.style.borderColor = "#ffd700";
}
export function disableFilterBtn(element: HTMLElement) {
    element.style.backgroundColor = "#abababda";
    element.style.borderColor = "black";
}

export function buildLogEntry(entry: LogFormat) {
    const p = document.createElement("p");
    p.className = "hover";
    p.textContent = entry.fields.message;
    p.style.display = "grid";
    p.style.alignItems = "center";
    p.style.height = "40px";
    p.style.fontSize = "20px";
    p.style.margin = "0px";
    p.style.margin = "5px";
    p.style.borderRadius = "20px";
    p.style.padding = "10px";
    p.style.whiteSpace = "nowrap";
    p.addEventListener("click", ()=>{
        document.body.appendChild(logInfoMenu(entry));
    })

    switch (entry.level) {
        case "ERROR": p.style.backgroundColor = logLevels.ERROR.color; break;
        case "INFO": p.style.backgroundColor = logLevels.INFO.color; break;
        case "WARN": p.style.backgroundColor = logLevels.WARN.color; break;
        case "DEBUG": p.style.backgroundColor = logLevels.DEBUG.color; break;
        case "TRACE": p.style.backgroundColor = logLevels.TRACE.color; break;
    }

    return p;
}

export function clearLogEntries() {
    ENTRIES.clear();
    ENTRIES_BOX.innerHTML = "";
}

export function loadLogs(data: LogResponse) {
    const newProviders: string[] = [];
    TITLE.textContent = data.file_name;
    data.content.forEach((x)=>{
        const element = buildLogEntry(x);
        ENTRIES.set(x, {display: true, element});
        if (newProviders.indexOf(x.target) === -1) {
            newProviders.push(x.target);
        }

        ENTRIES_BOX.appendChild(element);
    });
    recordNewProviders(newProviders);
}

export function filterLogs(levelFilter: Record<string, boolean>) {
    for (const [entry, value] of ENTRIES) {
        if ((levelFilter[entry.level] && isProviderEnabled(entry.target)) === value.display) {
            continue;
        }

        if (value.display) {
            value.element.style.opacity = "0";
            value.element.style.height = "0px";
            value.element.style.margin = "0px";
            value.element.style.padding = "0px";
        } else {
            value.element.style.opacity = "1";
            value.element.style.height = "40px";
            value.element.style.margin = "5px";
            value.element.style.padding = "10px";
        }
        value.display = !value.display;
    }
}