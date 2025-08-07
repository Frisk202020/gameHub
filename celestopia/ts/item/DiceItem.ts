import { Player } from "../Player.js";
import { Item } from "./Item.js";

export class DiceItem extends Item {
    constructor(p: Player) {
        super(p, 250, "dice", ()=>p.diceNumber++);
    }
}