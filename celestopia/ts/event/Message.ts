import { Sender } from "../util/channel.js";
import { BoardEvent } from "./BoardEvent.js";

export class Message extends BoardEvent {
    constructor(messages: string[], externalCaller?: Sender<void>) {
        super(
            messages.map((m)=>BoardEvent.generateTextBox(m)),
            BoardEvent.okSetup(true, undefined, externalCaller === undefined ? undefined : ()=>externalCaller.send()),
            BoardEvent.denySetup(false)
        )
    }
}