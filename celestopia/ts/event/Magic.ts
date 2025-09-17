import type { Money } from "../util/variables.js";
import { Sender } from "../util/channel.js";
import { Tuple } from "../util/tuple.js";
import { BoardEvent } from "./BoardEvent.js";

export class Magic extends BoardEvent {
    #tx: Sender<Money> ;

    constructor(tx: Sender<Money>) {
        super(
            [BoardEvent.generateTextBox("Quelle récompence choisissez vous ?")],
            BoardEvent.unappendedOkSetup(),
            BoardEvent.denySetup(false),
        );
        this.#tx = tx;

        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.flexDirection = "center";
        this.box.appendChild(box);

        for (const x of [new Tuple<string, Money>("Pièces", "coin"), new Tuple<string, Money>("Rubans", "ribbon"), new Tuple<string, Money>("Etoiles", "star")]) {
            const button = BoardEvent.generateButton(x.first, "#ffd700", ()=>{ document.body.removeChild(this.menu); this.#tx.send(x.second)}, "#000000" );
            button.style.margin = "5vw";
            box.appendChild(button);
        }
    }
}