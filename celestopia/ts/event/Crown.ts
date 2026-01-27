import { Wonder, type WonderName } from "../card/Wonder.js";
import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { assets_link } from "../util/functions.js";
import { BoardEvent } from "./BoardEvent.js";

class Crown extends BoardEvent {
    constructor(player: Player, name: WonderName, tx: Sender<void>, wonder?: Wonder) {
        const w = wonder === undefined ? Wonder.getWonder(name, false) : wonder;
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
                    w.neutralHtml
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

export async function callCrownEvent(player: Player, name: WonderName, tx: Sender<void>): Promise<Crown> {
    const w  = Wonder.getWonder(name, false);
    if (w !== undefined && w.name === "golden") {
        const audio = new Audio(assets_link("golden.mp3"));
        audio.play();
        await new Promise((r)=>setTimeout(r, 8400));
        return new Crown(player, name, tx, w);
    }

    return new Crown(player, name, tx, w);
}