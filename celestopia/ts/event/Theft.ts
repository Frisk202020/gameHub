import { Player } from "../Player.js";
import { Money, players } from "../util/variables.js";
import { Happening } from "./Happening.js";

export class Theft extends Happening {
    #target: Player;
    #victim: Player;
    #ammount: number;
    #event: ()=>void; 
    #currency: Money;

    constructor(player: Player, victim?: Player, m?: Money) {
        if (victim === undefined) {
            const playerIndex = players.indexOf(player);
            let index = Math.floor(Math.random() * (players.length - 1));
            if (index === playerIndex) {
                index++;
            }

            victim = players[index];
        }

        let text: string;
        
        switch(m){
            case "ribbon": text = `Volez entre 1 et 500 rubans à ${victim.name}`; break;
            case "star": text = `Volez entre 1 et 500 étoiles à ${victim.name}`; break;
            default: text = `Volez entre 1 et 1000 pièces à ${victim.name}`;
        }
        super(
            "Extorsion de fonds !",
            text,
            false,
            false
        )

        this.#target = player;
        this.#victim = victim;
        this.#currency = m === undefined ? "coin" : m;
        switch(this.#currency) {
            // can't steal more than what the victim has
            case "coin": this.#ammount = Math.min(1 + Math.floor(Math.random() * 1000), victim.coins); this.#event = ()=>this.#coinEvent(); break;
            case "ribbon": this.#ammount = Math.min(1 + Math.floor(Math.random() * 500), victim.ribbons); this.#event = ()=>this.#ribbonEvent(); break;
            case "star": this.#ammount = Math.min(1 + Math.floor(Math.random() * 500), victim.stars); this.#event = ()=>this.#starEvent();
        }
    }

    protected event(): void {
        this.#event();
    }

    #coinEvent() {
        this.#target.progressiveCoinChange(this.#target.coins + this.#ammount);
        this.#victim.progressiveCoinChange(this.#victim.coins - this.#ammount);
    }

    #ribbonEvent() {
        this.#target.progressiveRibbonChange(this.#target.ribbons + this.#ammount);
        this.#victim.progressiveRibbonChange(this.#victim.ribbons - this.#ammount);
    }

    #starEvent() {
        this.#target.progressiveStarChange(this.#target.stars + this.#ammount);
        this.#victim.progressiveStarChange(this.#victim.stars - this.#ammount);
    }
}