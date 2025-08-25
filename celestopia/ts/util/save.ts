import { Player, type PlayerData, type PlayerId } from "../Player.js"
import { pig, players } from "./variables.js";

let registeredKey = "";

export async function sendSaveRequest(name: string, key?: string): Promise<OutputResponse> {
    try {
        const {players, turnHolder} = getPlayersData();

        const body: GameData = {
            name,
            key: key === undefined ? registeredKey : key,
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
       
        const json: Response = await res.json();
        if (!res.ok) {
            if (res.status == 409) {
                if (key === undefined) {
                    return {
                        success: false,
                        authentification_error: true,
                        message: "Erreur d'authentification: veuillez entrer la clé.",
                        key: "",
                        errors: []
                    }
                } else {
                    return {
                        success: false,
                        authentification_error: true,
                        message: "Clé invalide. Réesayez.",
                        key: "",
                        errors: []
                    }
                }
            } else {
                return {
                    success: false,
                    authentification_error: false,
                    message: `Message du serveur: ${json.message}`,
                    key: "",
                    errors: []
                }
            }
        }
        if (json.authentification !== "") { registeredKey = json.authentification; }

        return {
            success: true,
            authentification_error: false,
            message: json.message,
            key: json.authentification,
            errors: json.errors
        };
    } catch(err) {
        return {
            success: false,
            authentification_error: false,
            message: `caught error: ${err}`,
            key: "",
            errors: []
        }
    }
}

export async function sendLoadRequest(name: string): Promise<boolean> {
    try {
        const res = await fetch(`celestopia/load/${name}`);
        const result: GameData = await res.json();

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
        return true;
    } catch(err) {
        console.log(`Load error: ${err}`);
        return false;
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

interface OutputResponse {
    success: boolean,
    authentification_error: boolean
    message: string,
    key: string,
    errors: string[]
}