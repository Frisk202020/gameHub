import { Player } from "../Player.js";
import { GreenEvent } from "./Event.js";

export class RibbonSale extends GreenEvent {
    target: Player;
    coins: number;
    ribbons: number;

    constructor(player: Player) {
        super(
            "Vente de rubans !",
            "Un artisan en herbe vous vend des rubans à prix coutant !",
            true,
        );
        this.target = player;

        const coins = [100, 150, 225, 325, 450];
        const ribbons = [200, 300, 500, 700, 1000];
        const index = Math.floor(Math.random() * 5);

        this.coins = coins[index];
        this.ribbons = ribbons[index];

        this.generateSpecificUIElements();
    }

    protected generateSpecificUIElements(): void {
        this.appendTextBox(`Acheter ${this.ribbons} rubans pour ${this.coins} pièces ?`);
        this.appendButtons(true);
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.target.progressiveCoinChange(this.target.coins - this.coins));
        promises.push(this.target.progressiveRibbonChange(this.target.ribbons + this.ribbons));

        Promise.all(promises).then(() => this.target.infoBox.classList.remove("visible"));
    }
}