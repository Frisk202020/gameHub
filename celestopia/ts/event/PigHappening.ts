import { Sender } from "../util/channel.js";
import { pig } from "../util/variables.js";
import { Happening } from "./Happening.js";

export class PigHappening extends Happening {
    constructor(tx: Sender<void>) {
        super(
            "Le festin de la cagnotte !",
            "Un groupe d'économistes a repéré une faille dans le système bancaire. L'exploiter pourrait ammener à tripler la somme contenue dans la cagnotte. Voulez vous soutenir ce mouvement ?",
            false,
            true,
            tx
        );
    }

    protected event(): void {
        pig.multiply(3).then(()=>this.tx.send());
    }
}