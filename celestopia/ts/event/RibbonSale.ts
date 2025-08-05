import { Player } from "../Player.js";
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";

export class RibbonSale extends Happening {
    target: Player;
    coins: number;
    ribbons: number;

    constructor(player: Player) {
        const coins = [100, 150, 225, 325, 450];
        const ribbons = [200, 300, 500, 700, 1000];
        const index = Math.floor(Math.random() * 5);

        super(
            "Vente de rubans !",
            "Un artisan en herbe vous vend des rubans à prix coutant !",
            false,
            true,
            BoardEvent.generateTextBox(`Acheter ${ribbons[index]} rubans pour ${coins[index]} pièces ?`)
        );

        this.target = player;
        this.coins = coins[index];
        this.ribbons = ribbons[index];
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.target.progressiveCoinChange(this.target.coins - this.coins));
        promises.push(this.target.progressiveRibbonChange(this.target.ribbons + this.ribbons));

        Promise.all(promises).then(() => this.target.infoBox.classList.remove("visible"));
    }
}