import { Popup } from "../event/Popup.js";
import { Player } from "../Player.js";
import { Item } from "./Item.js";

export class DiceItem extends Item {
    constructor(p: Player) {
        super(
            p,
            "Dé supplémentaire",
            "Vous donne un tour supplémentaire jusqu'à atteindre la fin du plateau.", 
            "dice", 
            ()=>{
                if (p.diceNumber < 3) {
                    p.diceNumber++;
                } else {
                    new Popup("Vous avez déjà le nombre maximum de dés.");
                    p.addItem(new DiceItem(p));
                }
            }, 
            true
        );
    }
}