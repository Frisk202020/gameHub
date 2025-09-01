import { Wonder, type WonderName } from "../card/Wonder.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export class Crown extends BoardEvent {
    constructor(player: Player, name: WonderName, tx: Sender<void>) {
        const w = Wonder.getWonder(name, false);
        if (w === undefined) {
            super(
                [BoardEvent.generateTextBox("Cette merveille a déjà été achetée...")],
                BoardEvent.okSetup(true, undefined, ()=>tx.send()),
                BoardEvent.denySetup(false),
            )
        } else {
            super(
                [
                    BoardEvent.generateTextBox("Acheter cette merveille ?"),
                    BoardEvent.generateImage(w.imgSrc)
                ],
                BoardEvent.okSetup(
                    player.coins >= w.coins && player.ribbons >= w.ribbons && player.stars >= w.stars,
                    undefined,
                    () => {
                        Promise.all([
                            player.progressiveCoinChange(-w.coins),
                            player.progressiveRibbonChange(-w.ribbons),
                            player.progressiveStarChange(-w.stars)
                        ]).then(()=>tx.send());
                        player.addWonder(w);
                    }
                ),
                BoardEvent.denySetup(true, undefined, () => {
                    Wonder.returnWonder(w);
                    tx.send();
                }),
            )
        }
    }
}