import { Item } from "./Item.js";
import { Player } from "../Player.js";
import { BoardEvent } from "../event/BoardEvent.js";

export class ItemMenu extends BoardEvent {
    player: Player;
    selectItem?: Item;

    constructor(p: Player, inventory: boolean) {
        const box = document.createElement("div");
        box.style.display = "flex";
        box.style.justifyContent = "center";
        box.style.alignItems = "center";

        if (inventory) {
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
                                this.selectItem.event();
                            }
                        });
                    } else {
                        this.selectItem.removeBorder();
                    }
                    this.selectItem = i;
                    this.selectItem.setBorder();
                }));
            }
        } else {
            // TODO
        }

        super(
            [BoardEvent.generateTextBox(inventory ? "Utiliser un objet ?" : "Acheter un objet ?"), box],
            BoardEvent.okSetup(false),
            BoardEvent.denySetup(true, "Retour")
        );
        this.player = p;
    }
}