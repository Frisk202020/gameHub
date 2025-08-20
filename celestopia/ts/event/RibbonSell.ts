import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";
import { Happening } from "./Happening.js";

export class RibbonSell extends Happening {
    #target: Player;
    #coins: number;
    #ribbons: number;

    constructor(player: Player, tx: Sender<void>) {
        const ribbons = [50, 110, 170, 300, 500];
        const coins = [75, 150, 200, 400, 650];
        const index = Math.floor(Math.random() * 5);

        super(
            "Acheteur de rubans !",
            "Un artisan peu prévoyant vous achète des rubans à bon prix !",
            player.ribbons < ribbons[index],
            true,
            tx,
            BoardEvent.generateTextBox(`Vendre ${ribbons[index]} rubans pour ${coins[index]} pièces ?`)
        );
        this.#target = player;
        this.#coins = coins[index];
        this.#ribbons = ribbons[index];
    }

    protected event(): void {
        const promises = Array();
        promises.push(this.#target.progressiveCoinChange(this.#coins));
        promises.push(this.#target.progressiveRibbonChange(-this.#ribbons));
        Promise.all(promises).then(()=>this.tx.send());
    }
}