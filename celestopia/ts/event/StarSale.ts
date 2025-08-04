import { Player } from "../Player.js";
import { GreenEvent } from "./Event.js";

export class StarSale extends GreenEvent {
    target: Player;
    coins: number;
    stars: number;

    constructor(player: Player) {
        super(
            "Vente d'étoiles !",
            "Un doyen astrophysicien vous vend des étoiles à prix coutant !",
            true,
        );
        this.target = player;

        const coins = [100, 150, 225, 325, 450];
        const stars = [200, 300, 500, 700, 1000];
        const index = Math.floor(Math.random() * 5);

        this.coins = coins[index];
        this.stars = stars[index];

        this.generateSpecificUIElements();
    }

    protected generateSpecificUIElements(): void {
        this.appendTextBox(`Acheter ${this.stars} étoiles pour ${this.coins} pièces ?`);
        this.appendButtons(true);
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.target.progressiveCoinChange(this.target.coins - this.coins));
        promises.push(this.target.progressiveStarChange(this.target.stars + this.stars));

        Promise.all(promises).then(() => this.target.infoBox.classList.remove("visible"));
    }
}