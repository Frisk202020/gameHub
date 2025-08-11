import { Item } from "./Item.js";
import { Player } from "../Player.js";
import { BoardEvent } from "../event/BoardEvent.js";
import { Sender } from "../util/channel.js";

interface OverflowConfig<T> {
    item: Item<T>,
    tx: Sender<void>
}

export class ItemMenu<T=void> extends BoardEvent {
    player: Player;
    selectItem?: Item;

    constructor(p: Player, overflow?: OverflowConfig<T>) {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";

        if (!p.hasItems()) {
            super(
                [BoardEvent.generateTextBox("Vous n'avez pas d'objets...")],
                BoardEvent.okSetup(true),
                BoardEvent.denySetup(false)
            );
            this.player = p;
            return;
        }
        
        for (const i of p.itemIterator()) {
            box.appendChild(i.getImg(() => {
                if (this.selectItem === undefined) {
                    this.enableOk(()=>{
                        document.body.removeChild(this.menu);
                        if (this.selectItem === undefined) {
                            console.log("ERROR: ok button is enabled but no item is selected");
                        } else {
                            if (overflow === undefined) {
                                this.selectItem.event();
                            } else {
                                p.replaceItem(this.selectItem, overflow.item);
                                overflow.tx.send();
                            }
                        }
                    });
                } else {
                    this.selectItem.removeBorder();
                }
                this.selectItem = i;
                this.selectItem.setBorder();
            }));
        }

        if (overflow === undefined) {
            super(
                [BoardEvent.generateTextBox("Utiliser un objet ?"), box],
                BoardEvent.okSetup(false),
                BoardEvent.denySetup(true, "Retour")
            );
        } else {
            super(
                [BoardEvent.generateTextBox(`Remplacer un objet par un ${overflow.item.name} ?`), box],
                BoardEvent.okSetup(false, "Remplacer"),
                BoardEvent.denySetup(true, "Jeter", ()=>{
                    document.body.removeChild(this.menu);
                    overflow.tx.send();
                })
            );
        }

        this.player = p;
        for (const i of p.itemIterator()) {
            i.addHelpButton(box);
        }
    }
}