import { Player } from "../Player.js";
import { GreenEvent } from "./Event.js";

export class RibbonSell extends GreenEvent {
    target: Player;
    coins: number;
    ribbons: number;

    constructor(player: Player) {
        super(
            "Acheteur de rubans !",
            "Un artisan peu prévoyant vous achète des rubans à bon prix !",
            true,
        );
        this.target = player;

        const ribbons = [50, 110, 170, 300, 500];
        const coins = [75, 150, 200, 400, 650];
        const index = Math.floor(Math.random() * 5);

        this.coins = coins[index];
        this.ribbons = ribbons[index];

        this.generateSpecificUIElements();
    }

    protected generateSpecificUIElements(): void {
        this.appendTextBox(`Vendre ${this.ribbons} rubans pour ${this.coins} pièces ?`);
        this.appendButtons(true);
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.target.progressiveCoinChange(this.target.coins + this.coins));
        promises.push(this.target.progressiveRibbonChange(this.target.ribbons - this.ribbons));

        Promise.all(promises).then(() => this.target.infoBox.classList.remove("visible"));
    }
}