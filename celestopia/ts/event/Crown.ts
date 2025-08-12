import { Wonder, WonderName } from "../card/Wonder.js";
import { Player } from "../Player.js";
import { BoardEvent } from "./BoardEvent.js";

export class Crown extends BoardEvent {
    constructor(player: Player, name: WonderName) {
        const w = Wonder.getWonder(name);
        if (w === undefined) {
            super(
                [BoardEvent.generateTextBox("Cette merveille a déjà été achetée...")],
                BoardEvent.okSetup(true),
                BoardEvent.denySetup(false),
            )
        } else {
            super(
                [
                    BoardEvent.generateTextBox("Acheter cette merveille ?"),
                    BoardEvent.generateImage(w.src)
                ],
                BoardEvent.okSetup(
                    player.coins >= w.coins && player.ribbons >= w.ribbons && player.stars >= w.stars,
                    undefined,
                    () => {
                        player.progressiveCoinChange(player.coins - w.coins);
                        player.progressiveRibbonChange(player.ribbons - w.ribbons);
                        player.progressiveStarChange(player.stars - w.stars);
                        player.addWonder(w);
                    }
                ),
                BoardEvent.denySetup(true, undefined, () => Wonder.returnWonder(w)),
            )
        }
    }
}