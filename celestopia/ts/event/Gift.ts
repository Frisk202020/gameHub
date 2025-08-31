import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { Happening } from "./Happening.js";

export class GiftEvent extends Happening {
    #target: Player;
    
    constructor(player: Player, tx: Sender<void>) {
        super(
            "Un petit cadeau !", 
            "Des citoyens croisent votre chemin et espère vous voir gagner. Ils vous donnent une partie de leur économies !",
            false,
            false,
            tx
        );
        this.#target = player;
    }

    protected event(): void {
        const choices = [700, 1500, 2500, 4000];
        const chosen = choices[Math.floor(Math.random() * 4)];

        this.#target.progressiveCoinChange(chosen).then(() => this.tx.send());
    }
}