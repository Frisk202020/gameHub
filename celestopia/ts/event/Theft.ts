import { Player } from "../Player.js";
import { players } from "../util/variables.js";
import { Happening } from "./Happening.js";

export class Theft extends Happening {
    #target: Player;
    #victim: Player;
    #ammount: number;

    constructor(player: Player) {
        const playerIndex = players.indexOf(player);
        let index = Math.floor(Math.random() * (players.length - 1));
        if (index === playerIndex) {
            index++;
        }
        const victim = players[index];

        super(
            "Extorsion de fonds !",
            `Volez des pièces à ${victim.name}`,
            false,
            false
        )

        this.#target = player;
        this.#victim = victim;
        this.#ammount = Math.min(1 + Math.floor(Math.random() * 1000), victim.coins); // can't steal more than what the victim has
    }

    protected event(): void {
        this.#target.progressiveCoinChange(this.#target.coins + this.#ammount);
        this.#victim.progressiveCoinChange(this.#victim.coins - this.#ammount);
    }
}