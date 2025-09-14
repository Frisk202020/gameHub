import { Item } from "./Item.js";
export class Seller extends Item {
    constructor(p) {
        super(p, "Vendeur particulier", "Lancez une action de vente en urgence (aucun bonus n'est appliqué).", "seller", () => p.generateSellMenu(), false);
    }
}
