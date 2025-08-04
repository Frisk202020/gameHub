import { Player } from "../Player.js";
import { players } from "../util/variables.js";
import { GreenEvent } from "./Event.js";

export class Theft extends GreenEvent {
    target: Player;
    victim: Player;
    ammount: number;

    constructor(player: Player) {
        const victim = players[Math.floor(Math.random() * players.length)];

        super(
            "Extorsion de fonds !",
            `Volez des pièces à ${victim.name}`,
            false
        )

        this.target = player;
        this.victim = victim;
        this.ammount = 1 + Math.floor(Math.random() * 1000);
    }

    protected generateSpecificUIElements(): void {
        this.appendButtons(false);
    }

    protected event(): void {
        this.target.progressiveCoinChange(this.target.coins + this.ammount).then(() => this.target.infoBox.classList.remove("visible"));
        this.victim.progressiveCoinChange(this.victim.coins - this.ammount).then(() => this.victim.infoBox.classList.remove("visible"));
    }
}