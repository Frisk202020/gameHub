import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";

export class StarSale extends Happening {
    #target: Player;
    #coins: number;
    #stars: number;

    constructor(player: Player, tx: Sender<void>) {
        const coins = [100, 150, 225, 325, 450];
        const stars = [200, 300, 500, 700, 1000];
        const index = Math.floor(Math.random() * 5);

        super(
            "Vente d'étoiles !",
            "Un doyen astrophysicien vous vend des étoiles à prix coutant !",
            false,
            true,
            tx,
            BoardEvent.generateTextBox(`Acheter ${stars[index]} étoiles pour ${coins[index]} pièces ?`)
        );
        this.#target = player;
        this.#coins = coins[index];
        this.#stars = stars[index];
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.#target.progressiveCoinChange(-this.#coins));
        promises.push(this.#target.progressiveStarChange(this.#stars));
        Promise.all(promises).then(()=>this.tx.send());
    }
}