import type { AquisitionName } from "../card/Aquisition"
import type { WonderName } from "../card/Wonder"
import type { ItemName } from "../item/Item";
import type { Avatar } from "../Player"
import { pig, players } from "./variables";

export async function sendSaveRequest() {
    try {
        const body: GameData = {
            players: getPlayersData(),
            pig: pig.content
        }
        const res = await fetch(
            "celestopia/save", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }
        )

        const result = await res.blob();
    } catch(err) {
        console.error("Save request failed:", err);
    }
}

function getPlayersData(): PlayerData[] {
    return players.map((p) => {
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
    })
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
    players: PlayerData[],
    pig: number,
}