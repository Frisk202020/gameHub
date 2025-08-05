import { Aquisition } from "../card/Aquisition.js";
import { Player } from "../Player.js";
import { BoardEvent } from "./BoardEvent.js";

export class Chest extends BoardEvent {
    constructor(player: Player) {
        const pick = Aquisition.getRandomAquisition();

        if (pick === undefined) {
            super(
                [BoardEvent.generateTextBox("Malheuresement, toutes les aquisitions ont été achetées. Repassez quand il y aura eu des ventes !")],
                false,
                false
            )
        } else {
            super(
                [BoardEvent.generateTextBox("Voulez vous acheter une aquisition ?")],
                false,
                true,
                () => {
                    document.body.removeChild(this.menu);
                    new ChestAccept(pick, player);
                }
            )
        }
    }
}

class ChestAccept extends BoardEvent {
    constructor(aq: Aquisition, player: Player) {
        super(
            [
                BoardEvent.generateTextBox("Vous obtenez une aquisition !"),
                BoardEvent.generateImage(aq.src),
            ],
            false,
            false,
            () => {
                document.body.removeChild(this.menu);
                player.progressiveCoinChange(player.coins - aq.price);
                player.addAquisition(aq);
            }
        )
    }
}