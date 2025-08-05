import { Wonder, WonderName } from "../card/Wonder.js";
import { Player } from "../Player.js";
import { BoardEvent } from "./BoardEvent.js";

export class Crown extends BoardEvent {
    constructor(player: Player, name: WonderName) {
        const w = Wonder.getWonder(name);
        if (w === undefined) {
            super(
                [BoardEvent.generateTextBox("Cette merveille a déjà été achetée...")],
                false,
                false
            )
        } else {
            super(
                [
                    BoardEvent.generateTextBox("Acheter cette merveille ?"),
                    BoardEvent.generateImage(w.src)
                ],
                player.coins < w.coins || player.ribbons < w.ribbons || player.stars < w.stars,
                true,
                () => {
                    document.body.removeChild(this.menu);
                    player.progressiveCoinChange(player.coins - w.coins);
                    player.progressiveRibbonChange(player.ribbons - w.ribbons);
                    player.progressiveStarChange(player.stars - w.stars);
                    player.addWonder(w);
                },
                () => {
                    document.body.removeChild(this.menu);
                    Wonder.returnWonder(w);
                }
            )
        }
    }
}