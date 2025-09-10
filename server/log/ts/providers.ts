import { disableFilterBtn, enableFilterBtn } from "./shared.js";

const PROVIDERS: Map<string, boolean> = new Map();
const ENABLE_COLOR = "#a4ffb6da";

export function isProviderEnabled(provider: string) {
    if (!PROVIDERS.has(provider)) {
        console.log("ERROR: asked if a non-registered provider is enabled");
        return false;
    }

    return PROVIDERS.get(provider)!;
}
export function recordNewProviders(providers: string[]) {
    PROVIDERS.clear();
    providers.forEach((x)=>PROVIDERS.set(x, true));
}
export function buildFilterButtons() {
    const buttons: HTMLElement[] = [];
    for (const [provider, enabled] of PROVIDERS) {
        const btn = document.createElement("div");
        btn.className = "filter-btn";
        btn.textContent = provider;
        if (enabled) {
            enableFilterBtn(btn, ENABLE_COLOR);
        } else {
            disableFilterBtn(btn);
        }

        btn.addEventListener("click", ()=>{
            const enabled = PROVIDERS.get(provider);
            if (enabled === undefined) {
                console.log(`ERROR: ${provider} provider was removed`);
                return;
            }

            if (enabled) {
                disableFilterBtn(btn);
            } else {
                enableFilterBtn(btn, ENABLE_COLOR);
            }
            PROVIDERS.set(provider, !enabled);
        });
        buttons.push(btn);
    }

    return buttons;
}

