import { pig } from "../util/variables.js";
import { GreenEvent } from "./Event.js";

export class Pig extends GreenEvent {
    constructor() {
        super(
            "Le festin de la cagnotte !",
            "Un groupe d'économistes a repéré une faille dans le système bancaire. L'exploiter pourrait ammener à tripler la somme contenue dans la cagnotte. Voulez vous soutenir ce mouvement ?",
            false,
        );
    }

    protected generateSpecificUIElements(): void {
        this.appendButtons(true);
    }

    protected event(): void {
        pig.multiply(3);
    }
}