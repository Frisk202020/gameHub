import { Player } from "../Player.js";
import { Item } from "./Item.js";

export class Seller extends Item {
    constructor(p: Player) {
        super(p, 100, "seller", ()=>p.generateSellMenu(), false)
    }
}