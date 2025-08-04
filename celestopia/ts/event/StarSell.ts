import { Player } from "../Player.js";
import { GreenEvent } from "./Event.js";

export class StarSell extends GreenEvent {
    target: Player;
    coins: number;
    stars: number;

    constructor(player: Player) {
        super(
            "Acheteur d'étoiles !",
            "Un astrophysicien vous achète des étoiles à un bon prix !",
            true,
        );
        this.target = player;

        const stars = [50, 110, 170, 300, 500];
        const coins = [75, 150, 200, 400, 650];
        const index = Math.floor(Math.random() * 5);

        this.coins = coins[index];
        this.stars = stars[index];

        this.generateSpecificUIElements();
    }

    protected generateSpecificUIElements(): void {
        this.appendTextBox(`Vendre ${this.stars} étoiles pour ${this.coins} pièces ?`);
        this.appendButtons(true);
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.target.progressiveCoinChange(this.target.coins + this.coins));
        promises.push(this.target.progressiveStarChange(this.target.stars - this.stars));

        Promise.all(promises).then(() => this.target.infoBox.classList.remove("visible"));
    }
}