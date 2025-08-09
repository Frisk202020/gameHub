import { Player } from "../Player.js";
import { Item } from "./Item.js";

export class DiceItem extends Item {
    constructor(p: Player) {
        super(
            p,
            "Dé supplémentaire",
            "Vous donne un tour supplémentaire jusqu'à atteindre la fin du plateau.", 
            "dice", 
            ()=>{p.diceNumber++;}, 
            true
        );
    }
}