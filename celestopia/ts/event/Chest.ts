import { Aquisition } from "../card/Aquisition.js";
import { Player } from "../Player.js";
import { BoardEvent } from "./BoardEvent.js";

export class Chest extends BoardEvent {
    constructor(player: Player) {
        const pick = Aquisition.getRandomAquisition();

        if (pick === undefined) {
            super(
                [BoardEvent.generateTextBox("Malheuresement, toutes les aquisitions ont été achetées. Repassez quand il y aura eu des ventes !")],
                BoardEvent.okSetup(true),
                BoardEvent.denySetup(false)
            )
        } else {
            super(
                [BoardEvent.generateTextBox("Voulez vous acheter une aquisition ?")],
                BoardEvent.okSetup(true, undefined, () => new ChestAccept(pick, player, false)),
                BoardEvent.denySetup(true)
            )
        }
    }
}

export class ChestAccept extends BoardEvent {
    constructor(aq: Aquisition, player: Player, free: boolean) {
        super(
            [
                BoardEvent.generateTextBox("Vous obtenez une aquisition !"),
                BoardEvent.generateImage(aq.src),
            ],
            BoardEvent.okSetup(true, undefined, () => {
                if (!free) { player.progressiveCoinChange(player.coins - aq.price); }
                player.addAquisition(aq);
            }),
            BoardEvent.denySetup(false)
        )
    }
}