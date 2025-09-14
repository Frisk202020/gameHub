import { BoardEvent } from "../event/BoardEvent.js";
import { ChestAccept } from "../event/Chest.js";
import { Popup } from "../event/Popup.js";
import { initChannel } from "../util/channel.js";
import { players } from "../util/variables.js";
import { Item } from "./Item.js";
export class AquisitionThief extends Item {
    constructor(p) {
        const { tx, rx } = initChannel();
        super(p, "Voleur d'aquisitions", "Choisissez un joueur à qui vous volerez une aquisition aléatoire.", "aq_thief", () => { new Event(p, tx); }, true);
        rx.recv().then((victim) => {
            const aq = victim.removeRandomAquisition();
            if (aq === undefined) {
                new Popup("Dommage, ce joueur n'a pas d'aquisitions...");
            }
            else {
                new ChestAccept(aq, this.holder, true);
            }
        });
    }
}
class Event extends BoardEvent {
    constructor(holder, tx) {
        super([BoardEvent.generateTextBox("Choisissez le joueur à voler.")], BoardEvent.unappendedOkSetup(), BoardEvent.denySetup(false));
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        for (const p of players) {
            if (p === holder) {
                continue;
            }
            box.appendChild(BoardEvent.generateButton(p.name, p.color.base, true, () => {
                document.body.removeChild(this.menu);
                tx.send(p);
            }));
        }
        this.box.appendChild(box);
        this.box.appendChild(BoardEvent.generateButton("Annuler", "#7c0000", true, () => {
            document.body.removeChild(this.menu);
            holder.addItem(new AquisitionThief(holder));
        }));
    }
}
