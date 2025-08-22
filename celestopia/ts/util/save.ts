import type { AquisitionName } from "../card/Aquisition.js"
import type { WonderName } from "../card/Wonder.js"
import type { ItemName } from "../item/Item.js";
import type { Avatar, PlayerId } from "../Player.js"
import { pig, players } from "./variables.js";

let registeredKey = "";

export async function sendSaveRequest(name: string) {
    try {
        const {players, turnHolder} = getPlayersData();

        const body: GameData = {
            name,
            key: registeredKey,
            players,
            pig: pig.content,
            turnHolder
        }
        const res = await fetch(
            "celestopia/save", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }
        )
       
        const result: Response = await res.json();
        if (result.authentification.length > 0) {
            registeredKey = result.authentification;
        }
        console.log(result);
    } catch(err) {
        console.error("Save request failed:", err);
    }
}

function getPlayersData(): {players: PlayerData[], turnHolder: PlayerId } {
    let turnHolder: PlayerId = 1;
    const playersData = players.map((p) => {
        if (p.enabled) { turnHolder = p.id; }
        return {
            name: p.name,
            icon: p.avatar,
            coins: p.coins,
            ribbons: p.ribbons,
            stars: p.stars,
            aquisitions: p.listAquisitions(),
            wonders: p.listWonders(),
            items: p.stringifyItems(),
            caseId: p.caseId
        }
    });

    return { players: playersData, turnHolder }
}

interface PlayerData {
    name: string,
    icon: Avatar,
    coins: number,
    ribbons: number,
    stars: number,
    aquisitions: AquisitionName[],
    wonders: WonderName[],
    items: ItemName[],
    caseId: number,
}

interface GameData {
    name: string,
    key: string,
    players: PlayerData[],
    pig: number,
    turnHolder: PlayerId
}
interface Response {
    message: string,
    authentification: string,
    errors: string[]
}