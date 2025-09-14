import { Wonder } from "../card/Wonder.js";
import { BoardEvent } from "./BoardEvent.js";
export class Crown extends BoardEvent {
    constructor(player, name, tx) {
        const w = Wonder.getWonder(name, false);
        if (w === undefined) {
            super([BoardEvent.generateTextBox("Cette merveille a déjà été achetée...")], BoardEvent.okSetup(true, undefined, () => tx.send()), BoardEvent.denySetup(false));
        }
        else {
            super([
                BoardEvent.generateTextBox("Acheter cette merveille ?"),
                w.neutralHtml
            ], BoardEvent.okSetup(player.coins >= w.coins && player.ribbons >= w.ribbons && player.stars >= w.stars, undefined, () => {
                Promise.all([
                    player.progressiveCoinChange(-w.coins),
                    player.progressiveRibbonChange(-w.ribbons),
                    player.progressiveStarChange(-w.stars)
                ]).then(() => tx.send());
                player.addWonder(w);
            }), BoardEvent.denySetup(true, undefined, () => {
                Wonder.returnWonder(w);
                tx.send();
            }));
        }
    }
}
