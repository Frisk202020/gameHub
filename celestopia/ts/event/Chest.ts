import { Aquisition } from "../card/Aquisition.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export class Chest extends BoardEvent {
    constructor(player: Player, tx: Sender<void>) {
        const pick = Aquisition.getRandomAquisition();

        if (pick === undefined) {
            super(
                [BoardEvent.generateTextBox("Malheuresement, toutes les aquisitions ont été achetées. Repassez quand il y aura eu des ventes !")],
                BoardEvent.okSetup(true, undefined, ()=>tx.send()),
                BoardEvent.denySetup(false, undefined, ()=>tx.send())
            )
        } else {
            super(
                [BoardEvent.generateTextBox("Voulez vous acheter une aquisition ?")],
                BoardEvent.okSetup(true, undefined, () => new ChestAccept(pick, player, false, tx)),
                BoardEvent.denySetup(true, undefined, ()=>tx.send())
            )
        }
    }
}

export class ChestAccept extends BoardEvent {
    constructor(aq: Aquisition, player: Player, free: boolean, tx?: Sender<void>) {
        super(
            [
                BoardEvent.generateTextBox("Vous obtenez une aquisition !"),
                aq.neutralHtml
            ],
            BoardEvent.okSetup(true, undefined, tx === undefined ? () => {
                if (!free) { player.progressiveCoinChange(-aq.price); }
                player.addAquisition(aq);
                
            } : () => {
                if (!free) { player.progressiveCoinChange(-aq.price).then(()=>tx.send()); }
                player.addAquisition(aq);
            }),
            BoardEvent.denySetup(false, undefined, tx === undefined ? undefined : ()=>tx.send())
        )
    }
}