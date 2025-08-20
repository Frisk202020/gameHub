import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";

export class StarSell extends Happening {
    #target: Player;
    #coins: number;
    #stars: number;

    constructor(player: Player, tx: Sender<void>) {
        const stars = [50, 110, 170, 300, 500];
        const coins = [75, 150, 200, 400, 650];
        const index = Math.floor(Math.random() * 5);

        super(
            "Acheteur d'étoiles !",
            "Un astrophysicien vous achète des étoiles à un bon prix !",
            player.stars < stars[index],
            true,
            tx,
            BoardEvent.generateTextBox(`Vendre ${stars[index]} étoiles pour ${coins[index]} pièces ?`)
        );
        this.#target = player;
        this.#coins = coins[index];
        this.#stars = stars[index];
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.#target.progressiveCoinChange(this.#coins));
        promises.push(this.#target.progressiveStarChange(-this.#stars));
        Promise.all(promises).then(()=>this.tx.send());
    }
}