import { Position } from "./Position.js";
import { absoluteAssetsPath, wait } from "./utilities.js";

export async function conclusion(){
    document.querySelectorAll("body > *:not(style)").forEach(el => el.remove());
    let soul = document.createElement("img");
    soul.src = absoluteAssetsPath("img/soul.png");
    soul.style.width = "50px";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.appendChild(soul);
    new Audio(absoluteAssetsPath("sound/slAppear.wav")).play();
    document.body.style.height = "100vh";
    await wait(1000);
    soul.className = "soulGrow"
    let aud = new Audio(absoluteAssetsPath("sound/grow.mp3"));
    aud.volume = 0.7
    aud.play();
    await wait(5000);
    aud.pause();
    aud = new Audio(absoluteAssetsPath("sound/crash.mp3"));
    aud.volume = 0.3;
    document.documentElement.style.filter = "invert(1)";
    aud.play()
    await wait(5000);
    aud.pause();
    let w = 500;

    let brake = new Audio(absoluteAssetsPath("sound/brake.mp3"));
    let playingTraj = false;
    brake.addEventListener("timeupdate", () => {
        if (brake.currentTime >= 1.7 && !playingTraj){
            playingTraj = true;
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "black";
            document.querySelectorAll("body > *:not(style)").forEach(el => el.remove());

            let fragments = Array();
            for (let i = 1; i < 4; i++){
                let f = document.createElement("img");
                f.src = absoluteAssetsPath("img/frag" + i + ".png");
                let x = w/1.7;
                f.style.width = x + "px";
                f.style.position = "absolute";
                document.body.appendChild(f);
                fragments.push(f)
            }

            fragments[0].style.marginRight = "10px";
            fragments[1].style.marginLeft = "10px";
            fragments[2].style.marginTop = "10px";
            document.documentElement.style = "";

            let m0 = Position.getPosFromElem(fragments[0]);
            let traj = buildTraj0(m0, 180);
            playTrajectory(fragments[0], traj);

            traj = buildTraj1(m0, 180);
            playTrajectory(fragments[1], traj);

            traj = buildTraj2(m0, 180);
            playTrajectory(fragments[2], traj);
            wait(10000).then(() => {window.location.href = "credits.html"})
        }
        else if (brake.currentTime >= 1.5){
            document.documentElement.style = "";
        }
        else if (brake.currentTime >= 1.2){
            document.documentElement.style.filter = "invert(1)";
        }
        else if (brake.currentTime >= 0.95){
            document.documentElement.style = "";
        }
        else if (brake.currentTime >= 0.7){
            document.documentElement.style.filter = "invert(1)";
        } 
        else if (brake.currentTime >= 0.5){
            document.documentElement.style = "";
        }
        else if (brake.currentTime >= 0.3){
            document.documentElement.style.filter = "invert(1)";
        }
        else if (brake.currentTime >= 0.1){
            document.documentElement.style = "";
        }
    });
    brake.play();
}

async function playTrajectory(elem, traj) {
    for (let p of traj){
        p.setPosition(elem);
        await wait(3);
    }
}

function buildTraj0(m0, steps){
    let traj = Array();
    let endUp = steps/3;
    let midGoalX = m0.x / 4;
    let goalY = 100;
    let dx = 3 * midGoalX / steps;
    let dy = 3 * goalY / steps;
    let x = m0.x;
    let y = m0.y;
    for (let i = 0; i < endUp; i++){
        x -= dx;
        y += dy;
        traj.push(new Position(x, y));
    }

    goalY = 1000;
    dy = 3 * goalY / steps / 2;
    while (x > -400 && y > -400){
        x -= dx;
        y -= dy;
        traj.push(new Position(x, y));
    }
    return traj;
}

function buildTraj1(m0, steps){
    let traj = Array();
    let endUp = steps/3;
    let midGoalX = m0.x / 4;
    let goalY = 100;
    let dx = 3 * midGoalX / steps;
    let dy = 3 * goalY / steps;
    let x = m0.x;
    let y = m0.y;
    for (let i = 0; i < endUp; i++){
        x += dx;
        y += dy;
        traj.push(new Position(x, y));
    }

    goalY = 1000;
    dy = 3 * goalY / steps / 2;
    while (x > -400 && y > -400){
        x += dx;
        y -= dy;
        traj.push(new Position(x, y));
    }
    return traj;
}

function buildTraj2(m0, steps){
    let traj = Array();
    let endUp = steps/3;
    let goalX = m0.x / 8;
    let goalY = 100;
    let dx = 3 * goalX / steps;
    let dy = 3 * goalY / steps;
    let x = m0.x;
    let y = m0.y;
    for (let i = 0; i < endUp; i++){
        x += dx;
        y += dy;
        traj.push(new Position(x, y));
    }

    goalY = 1000;
    dy = 3 * goalY / steps / 2;
    while (x > -400 && y > -400){
        x += dx;
        y -= dy;
        traj.push(new Position(x, y));
    }
    return traj;
}