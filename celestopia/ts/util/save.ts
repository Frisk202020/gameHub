import type { AquisitionName } from "../card/Aquisition.js"
import type { WonderName } from "../card/Wonder.js"
import type { ItemName } from "../item/Item.js";
import { Player, type Avatar, type PlayerData, type PlayerId } from "../Player.js"
import { boardId, pig, players } from "./variables.js";

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

export async function sendLoadRequest(name: string) {
    const res = await fetch(`celestopia/load/${name}`);
    const result: GameData = await res.json();
    console.log(result);

    for (let i = 0; i < players.length; i++) {
        const p = players[i];
        p.loadData(result.players[i], result.turnHolder === p.id);
    }
    for (let i = players.length; i < result.players.length; i++) {
        const data = result.players[i];
        const p = new Player((i + 1) as PlayerId, data.name, data.icon);
        p.loadData(data, result.turnHolder === p.id);

        players.push(p);
    }
    pig.loadContent(result.pig);
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
            caseId: p.caseId,
            boardId: p.boardId,
            diceNumber: p.diceNumber
        }
    });

    return { players: playersData, turnHolder }
}

interface GameData {
    name: string,
    key?: string,
    players: PlayerData[],
    pig: number,
    turnHolder: PlayerId
}

interface Response {
    message: string,
    authentification: string,
    errors: string[]
}