import { Player } from "../Player.js";
import { Sender } from "../util/channel.js";
import { pig } from "../util/variables.js";
import { BoardEvent } from "./BoardEvent.js";

export class PigEvent extends BoardEvent {
    constructor(p: Player, tx: Sender<void>) {
        super(
            [
                BoardEvent.generateTextBox("Vous obtenez l'accès à la cagnotte !"),
                BoardEvent.generateTextBox("Vous avez le choix entre briser la tirelire (et récupérer son contenu), ou doubler la somme actuelle (vous ne récupérez rien). Notez que le plafond est à 10000"),
                BoardEvent.generateTextBox("Que souhaitez vous faire ?")
            ],
            BoardEvent.okSetup(true, "Doubler", ()=>pig.multiply(2).then(()=>tx.send())),
            BoardEvent.denySetup(true, "Briser", ()=>p.progressiveCoinChange(pig.break()).then(()=>tx.send()))
        )
    }
}