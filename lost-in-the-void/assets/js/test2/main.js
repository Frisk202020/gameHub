import { arrayContains, arrayWithoutElement, playAudioUntilEnd, readFile, readFileWithoutSplit, wait, fade, absoluteAssetsPath, fullScreenHandler } from "../utilities.js";
import { ComputerFile } from "./ComputerFile.js";
import { Directory } from "./Directory.js";
import { ThemeManager } from "./ThemeManager.js";

/* Shered values and constants */
let cpmList = Array("000.000.000.000", "192.145.687.652", "210.254.585.887", "325.478.222.000", "214.000.256.888");
let web = {"www.google.com":"https://www.google.com", "www.NikolasKey.com":"computers/325.478.222.000/key.html"};
let themeManager = new ThemeManager();

let sx = 0;
let sy = 0;
const SOUL = document.getElementById("SOUL");
const COMMANDS = document.getElementById("commands");
let selectDiv;
let parentDirectories = Array();
let selectDirectory;
let selectDirectoryIndex;

let root;
let terminalState = false;
let lockTerminal = false;
let freeText;
let gaster = new Audio(absoluteAssetsPath("sound/gaster.mp3"));

let changingCpm = false;
let currentTheme = "default";
let fragments = 0;
let fileBlackList = Array();

let bgMusic = new Audio(absoluteAssetsPath("sound/payload.mp3"));
bgMusic.loop = true;
bgMusic.volume = 0.5;
let bgMusicPlaying = false;

/* Keyboard listener */
document.addEventListener("keydown", (event) => {
    if (event.key === " "){
        event.preventDefault();
    }

    if (event.key === "Enter"){
        if (!bgMusicPlaying){
            bgMusic.play();
            bgMusicPlaying = true;
        }
        if (terminalState){
            let prompt = freeText.textContent;
            if (lockTerminal){
                if (prompt === selectDirectory.password){
                    selectDirectory.password = "";
                    enterDirectory();
                }
                else{
                    command("ACCESS DENIED", "error");
                    new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
                }
                changeTerminalState("", false);
                lockTerminal = false;
            }
            else if (prompt  !== ""){
                commandPrompt(prompt);
                if (!changingCpm && !lockTerminal){
                    changeTerminalState("", false);
                }   
            }
        }
        else{
            if (selectDirectory instanceof ComputerFile){
                execute();
            }
            else{
                enterDirectory();
            }
        }
    }
    else if (event.key === "Backspace"){
        if (terminalState){
            freeText.textContent = freeText.textContent.substring(0, freeText.textContent.length - 1);
        }
        else{
            back();
        }
    }
    else if (event.key === "ArrowDown"){
        if (!terminalState){
            moveDown();
        }
    }
    else if (event.key === "ArrowUp"){
        if (!terminalState){
            moveUp();
        }
    }
    else if (event.key === "<" && !lockTerminal){
        changeTerminalState();
    }
    else{
        updateTerminalPrompt(event);
    }
})

let CONNECT = document.getElementById("connect");
let CONNECT_TEXT = document.getElementById("connectText");
let CONNECT_IMG = document.getElementById("connectImg");

CONNECT.addEventListener("mouseenter", () => {
    if (!terminalState){
        new Audio(absoluteAssetsPath("sound/menumove.wav")).play();
        CONNECT_IMG.src = absoluteAssetsPath("img/soul.png");
        SOUL.style.opacity = 0;

        CONNECT.style.borderColor = document.documentElement.style.getPropertyValue("--select-color");
        CONNECT_TEXT.style.color = document.documentElement.style.getPropertyValue("--select-color");   
    }
})
CONNECT.addEventListener("mouseleave", () => {
    if (!terminalState){
        CONNECT_IMG.src = themeManager.connect;
        SOUL.style.opacity = 1;

        CONNECT.style.borderColor = document.documentElement.style.getPropertyValue("--directory-color");
        CONNECT_TEXT.style.color = document.documentElement.style.getPropertyValue("--directory-color");
    }
})
CONNECT.addEventListener("click", () => {
    if (!terminalState){
        new Audio(absoluteAssetsPath("sound/select.wav")).play();
        CONNECT_IMG.src = themeManager.connect;
        SOUL.style.opacity = 1;

        CONNECT.style.borderColor = document.documentElement.style.getPropertyValue("--directory-color");
        CONNECT_TEXT.style.color = document.documentElement.style.getPropertyValue("--directory-color");
        changeTerminalState("connect", false);
    }
})

let WEB = document.getElementById("web");
let WEB_TEXT = document.getElementById("webText");
let WEB_IMG = document.getElementById("webImg");

WEB.addEventListener("mouseenter", () => {
    if (!terminalState){
        new Audio(absoluteAssetsPath("sound/menumove.wav")).play();
        WEB.style.borderColor = document.documentElement.style.getPropertyValue("--select-color");
        WEB_TEXT.style.color = document.documentElement.style.getPropertyValue("--select-color"); 
        WEB_IMG.src = absoluteAssetsPath("img/soul.png");
        SOUL.style.opacity = 0;
    }
})
WEB.addEventListener("mouseleave", () => {
    if (!terminalState){
        placeSOUL(sx,sy,false)
        WEB.style.borderColor = document.documentElement.style.getPropertyValue("--directory-color");
        WEB_TEXT.style.color = document.documentElement.style.getPropertyValue("--directory-color");
        WEB_IMG.src = themeManager.web;
        SOUL.style.opacity = 1;
    }
})
WEB.addEventListener("click", () => {
    if (!terminalState){
        new Audio(absoluteAssetsPath("sound/select.wav")).play();
        WEB_IMG.src = themeManager.web;
        SOUL.style.opacity = 1;

        WEB.style.borderColor = document.documentElement.style.getPropertyValue("--directory-color");
        WEB_TEXT.style.color = document.documentElement.style.getPropertyValue("--directory-color");
        changeTerminalState("web", false);
    }
})

/* Command-line interpreter */
function commandPrompt(prompt){
    let arr = buildPath(prompt);
    let instruction = arr[0];
    let path = arr[1];
    
    if (instruction === "cd"){
        cd(path)
    }
    else if (instruction === "connect"){
        let found = false;
        for (let s of cpmList){
            if (s === path[0]){
                reset(path[0]);
                found = true;
            }
        }
        if (!found){
            death()
        }
    }
    else if (instruction === "web"){
        let found = false;
        for (let s in web){
            if (s === path[0]){
                window.open(web[s]);
                found = true;
                new Audio(absoluteAssetsPath("sound/select.wav")).play();
            }
        }
        if (!found){
            command("Can't find the webpage", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        }
    }
    else if (prompt === "fullscreen") {
        fullScreenHandler();
    }
    else{
        console.log(instruction)
        executeFileFromFile(prompt);
    }
}

/* Execute file functions */
function execute(path=selectDirectory, instruction=""){
    /*
        Executes the file "path" with a given instruction
        If the file is executed from UI, the instruction is ignored
        Otherwise, the file executes only if the instruction is correct regarding file type
        Correct instructions are :
            - text files : cat
            - images, videos, pdf : open
            - executable file : nothing
    */
    new Audio(absoluteAssetsPath("sound/select.wav")).play();
    let action = path.executeFile();
    let name = root.name;
    if (root.name === "Home"){
        name = "000.000.000.000";
    }
    if (action === "OPEN"){
        if (instruction === "" || instruction === "cat"){
            command("> cat " + path.name);
            if (path.name.split(".")[1] === "c"){
                readFileWithoutSplit(absoluteAssetsPath("computers/" + name + "/" + path.name + ".txt")).then((textData) => {
                    command(textData, "text");
                    }
                );
            }
            else{
                readFileWithoutSplit(absoluteAssetsPath("computers/" + name + "/" + path.name)).then((textData) => {
                    command(textData, "text");
                    }
                );
            }
        }
        else{
            command("ERROR", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        }
    }
    else if (action === "WEB"){
        if (instruction === "" || instruction === "open"){
            command("> opened file [" + path.name + "] in another window");
            open(absoluteAssetsPath("computers/" + name + "/" + path.name));
        }
        else{
            command("ERROR", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        }
    }
    else if (action === "EXECUTE"){
        if (instruction === "" || instruction === "*"){
            if (path.type === "k"){
                death()
            }
            else if (path.type.substring(0, 1) === "c"){
                currentTheme = path.type.split(":")[1];
                themeManager.interpreter(currentTheme);
            }
            else if (path.type === "*"){
                collectFragment();   
                if (fileBlackList.length === 4){
                    playAudioUntilEnd(new Audio(absoluteAssetsPath("sound/exit.wav"))).then(() => {
                        window.location.href = absoluteAssetsPath("html/memory.html");
                    })
                    fade(bgMusic, 5000);
                    let end = document.createElement("div");
                    end.className = "activeWhiteScreen";
                    end.style.zIndex = 10;
                    end.id = "end";
                    end.style.width = "100vw";
                    end.style.height = "100vh";
                    document.body.prepend(end);
                    document.getElementById("terminal").classList.add("disappear");
                } 
            }
        }
        else{
            command("ERROR", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        }
    }
    else{
        command("ERROR - can't load this file !", "error");
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
    }
}

function executeFileFromFile(prompt){
    /*
        Interpret the prompt into instruction/path command
        Find the target file
        If the path is correct, execute the file (task throwed at execute(path, instruction))
        Else, ignore the command and indicate tu user the command is wrong
        Note : .. and . are only supported if at the beginning of prompt
    */
    let arr = buildPath(prompt);
    let instruction = arr[0];
    let path = arr[1];
    let targetFile = path.pop();

    let current;
    let parent;
    if (selectDirectory.order === 0){
        if (path.shift() !== "os"){
            command("WRONG PATH", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
            return;
        }
        parent = selectDirectory;
        current = selectDirectory.directories[0];
    }
    else{
        current = selectDirectory;
        parent = parentDirectories[current.order - 1];
    }
    while (path[0] === ".."){
        path.shift();
        if (current.order < 1){
            command("CAN'T ACCESS ABOVE ROOT DIRECTORY", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
            return
        }
        current = parent;
        parent = parentDirectories[current.order - 1]
    }
    while (path.length > 0){
        let done = false;    
        let targetDir = path.shift();
        for (let d of parent.directories){
            if (d.name === targetDir){
                parent = current
                current = d;
                done = true;
            }
        }

        if (!done){
            command("WRONG PATH", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
            return;
        }
    }

    let done = false;
    for (let f of parent.files){
        if (f.name === targetFile){
            execute(f, instruction);
            done = true;
        }
    }
    if (!done){
        command("WRONG PATH", "error");
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        return;
    }
}

/* Move between directories */
function cd(path){
    /*
        Move current location to path location
        Entering directory  task is throwed at MoveDirectoryForward()
        Going back in the arborescence is throwed at back()
        Throw error if path is wrong
    */
    let target = path.shift();
    while (target === ".."){
        if (selectDirectory.order > 0){
            back(true);
            target = path.shift();
        }
        else{
            command("ERROR: CAN'T MOVE ABOVE ROOT DIRECTORY", "error");
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
            return;
        }
    }
    if (target !== undefined){
        moveDirectoryForward(target);
    }
    
    while (path.length > 0){
        target = path.shift();
        moveDirectoryForward(target);      
    }
}

function moveDirectoryForward(target){
    let done = false;
    if (selectDirectory.order === 0){
        if (target === selectDirectory.name){
            enterDirectory();
            done = true
        }
    }
    else{
        for (let d of parentDirectories[selectDirectory.order - 1].directories){
            if (d.name === target){
                selectDirectory = d;
                enterDirectory();
                done = true;
            }
        }
    }
    if (!done){
        command("WRONG PATH", "error");
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        return;
    }
}

function enterDirectory(){
    /*
        Enter in directory
        Reveal directory content
    */
    let place = true;
    if (selectDirectory.directories.length + selectDirectory.files.length > 0){
        if (selectDirectory.password !== ""){
            if (!terminalState){
                changeTerminalState();
            }
            command("Please enter directory password bellow")
            newCommandLine();
            place = false;
            lockTerminal = true;
            return;
        }
        command("> cd " + selectDirectory.name);
        revealDirectory(selectDirectory);
        parentDirectories.push(selectDirectory);
        if (selectDirectory.directories.length > 0){
            selectDirectory = selectDirectory.directories[0];
        }
        else{
            selectDirectory = selectDirectory.files[0]
        }
        selectDirectoryIndex = 0;
        selectDiv.classList.remove("selected");
        selectDiv = document.getElementById(selectDirectory.name);
        selectDiv.classList.add("selected");
        new Audio(absoluteAssetsPath("sound/select.wav")).play();
        if (place){
            window.scrollBy(0, window.innerHeight * 0.2);
            placeSOUL((1 + selectDirectory.order) * 5 - 3, selectDiv.getBoundingClientRect().top + window.scrollY - 10);   
        }
    }
    else if (selectDirectory.password === "GASTER"){
        gaster.play();
        
        wait(1000).then(() => gaster.pause())
    }
    else{
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
    }
}

function back(commandLine=false){
    /*
        Going back in the arborescence
        Hide past directory content
    */
    if (parentDirectories.length > 0){
        selectDirectory = parentDirectories.pop();
        hideDirectory(selectDirectory);
        if (parentDirectories.length > 0){
            selectDirectoryIndex = parentDirectories[parentDirectories.length - 1].getChildPosition(selectDirectory);
        }
        else{
            selectDirectoryIndex = 0;
        }
        selectDiv.classList.remove("selected");
        selectDiv = document.getElementById(selectDirectory.name);
        selectDiv.classList.add("selected");
        new Audio(absoluteAssetsPath("sound/select.wav")).play();
        if (!commandLine){
            command("> cd ..");
            placeSOUL((1 + selectDirectory.order) * 5 - 3, selectDiv.getBoundingClientRect().top + window.scrollY - 10);
        }
        else{
            sx = (1 + selectDirectory.order) * 5 - 3;
            sy = selectDiv.getBoundingClientRect().top + window.scrollY - 10
        }
    }
    else{
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
    }
}

function moveDown(){
    /*
        Manage ArrowDown event key
    */
    if (parentDirectories.length > 0){
        let parentDirectory = parentDirectories[parentDirectories.length - 1];
        if (selectDirectoryIndex + 1 < parentDirectory.directories.length){
            selectDirectory = parentDirectory.directories[selectDirectoryIndex + 1];
            selectDirectoryIndex++;
            selectDiv.classList.remove("selected");
            selectDiv = document.getElementById(selectDirectory.name);
            selectDiv.classList.add("selected");
            new Audio(absoluteAssetsPath("sound/menumove.wav")).play();

            placeSOUL((1 + selectDirectory.order) * 5 - 3, selectDirectory.top - 10);
        }
        else if (selectDirectoryIndex + 1 - parentDirectory.directories.length < parentDirectory.files.length){
            selectDirectory = parentDirectory.files[selectDirectoryIndex - parentDirectory.directories.length + 1];
            selectDirectoryIndex++;
            selectDiv.classList.remove("selected");
            selectDiv = document.getElementById(selectDirectory.name);
            selectDiv.classList.add("selected");
            new Audio(absoluteAssetsPath("sound/menumove.wav")).play();

            placeSOUL((1 + selectDirectory.order) * 5 - 3, selectDirectory.top - 10);
        }
        else{
            new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
        }
    }
    else{
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
    }
}

function moveUp(){
    /*
        Manage ArrowUp event key
    */
    let parentDirectory = parentDirectories[parentDirectories.length - 1];
    if (selectDirectoryIndex > 0){
        if (selectDirectoryIndex - 1 < parentDirectory.directories.length){
            selectDirectory = parentDirectory.directories[selectDirectoryIndex - 1];
            selectDirectoryIndex--;
            selectDiv.classList.remove("selected");
            selectDiv = document.getElementById(selectDirectory.name);
            selectDiv.classList.add("selected");
            new Audio(absoluteAssetsPath("sound/menumove.wav")).play();

            placeSOUL((1 + selectDirectory.order) * 5 - 3, selectDirectory.top - 10);
        }
        else{
            selectDirectory = parentDirectory.files[selectDirectoryIndex - parentDirectory.directories.length - 1];
            selectDirectoryIndex--;
            selectDiv.classList.remove("selected");
            selectDiv = document.getElementById(selectDirectory.name);
            selectDiv.classList.add("selected");
            new Audio(absoluteAssetsPath("sound/menumove.wav")).play();

            placeSOUL((1 + selectDirectory.order) * 5 - 3, selectDirectory.top - 10);
        }
    }
    else{
        new Audio(absoluteAssetsPath("sound/hurt.mp3")).play();
    }
}

/* Manage terminal */
function newCommandLine(text=""){
    /*
        Add a new div block to terminal for a command line to be prompted
    */
    freeText = document.createElement("pre");
    freeText.className = "command";
    freeText.style.marginLeft = "3vw";
    if (text !== ""){
        freeText.textContent = text + " ";
    }
    COMMANDS.appendChild(freeText);
    let offsets = freeText.getBoundingClientRect();
    placeSOUL(100*offsets.left/document.documentElement.clientWidth - 2.5, offsets.top, false);
    SOUL.style.width = "30px";
}

function changeTerminalState(text, playSound=true){
    /*
        Switch between UI state / Terminal state (manage < event key)
    */
    if (playSound){
        new Audio(absoluteAssetsPath("sound/terminal.wav")).play();
    }
    if (terminalState){
        document.getElementById("terminal").className = "terminal";
        document.getElementById("title").className = "terminal";
        SOUL.style.width = "50px";
        placeSOUL(sx, sy);
    }
    else{
        document.getElementById("terminal").className = "activeTerminal";
        document.getElementById("title").className = "activeTerminal";

        window.scrollTo(0, 0);
        newCommandLine(text);
    }
    terminalState = !terminalState;
}

function updateTerminalPrompt(event){
    /*
        Update new command line textcontent dynamically as user types the command
        Ignore some keys 
    */
    if (terminalState && "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN./$^ù&é#@àç_-è()*0123456789+-<>,; ".includes(event.key)){
        freeText.textContent += event.key;
    }
}

/* Layout managment */
function revealDirectory(directory){
    /*
        Create div blocks to reveal directory content in the UI
    */
    if (directory instanceof Directory){
        for (let d of directory.directories){
            let dir = document.createElement("div");
            dir.className = "directory";
            dir.id = d.name;
            dir.style.marginLeft = "5vw";
            let p = document.createElement("pre");
            p.textContent = d.name;
            dir.appendChild(p);
            document.getElementById(directory.name).appendChild(dir);

            let offsets = dir.getBoundingClientRect();
            d.top = offsets.top; 
        }
        for (let f of directory.files){
            if (!arrayContains(fileBlackList, f.name)){
                let file = document.createElement("div");
                file.className = "file";
                file.id = f.name;
                file.style.marginLeft = "5vw";
                let p = document.createElement("pre");
                p.textContent = f.name;
                file.appendChild(p);
                document.getElementById(directory.name).appendChild(file);

                
                let offsets = file.getBoundingClientRect();
                f.top = offsets.top;
            }
            else{
                directory.files = arrayWithoutElement(directory.files, f);
            }
        }
    }
}

function hideDirectory(directory){
    /*
        Remove div blocks to hide directory content in the UI
    */
    let idList = Array();
    for (let d of directory.directories){
        idList.push(document.getElementById(d.name));
    }
    for (let f of directory.files){
        idList.push(document.getElementById(f.name));
    }
    for (let id of idList){
        document.getElementById(directory.name).removeChild(id);
    }
}

function placeSOUL(x, y, changeS=true){
    /*
        Update SOUL location as user is navigating between directories
    */
    if (changeS){
        sx = x;
        sy = y;
    }
    SOUL.style.left = x + "vw";
    SOUL.style.top = y + "px";
}

function command(text, cssClass="command"){
    /*
        Add terminal commands not prompted by the user (errors or command done by navigating in UI)
    */
    let p = document.createElement("p");
    p.className = cssClass;
    p.textContent = text;
    p.style.fontSize = "20px";
    COMMANDS.appendChild(p);
    
    let offsets = p.getBoundingClientRect();
    let terminalOffset = document.getElementById("terminal").getBoundingClientRect();
    if (offsets.bottom > terminalOffset.bottom){
        COMMANDS.innerHTML = "";
        COMMANDS.appendChild(p);
    }

    // following code prevents too large text to overflow in the terminal
    while (offsets.bottom > terminalOffset.bottom){
        let n = p.style.fontSize.split("px")[0];
        p.style.fontSize = (n - 2) + "px";
        offsets = p.getBoundingClientRect();
    }
}

/* Utilities */
function buildPath(prompt){
    /*
        Build path from command prompt
        Same syntax as bach language 
    */
    let arr = prompt.split(" ");
    let instruction;
    let path;
    if (arr.length == 1){
        instruction = "*";
        path = arr[0].split("/");
    }
    else{
        instruction = arr[0];
        path = arr[1].split("/");
    }
    if (path[path.length - 1] === ""){
        path.pop();
    }

    while (path[0] === "."){
        path.shift();
    }

    return Array(instruction, path);
}

function reset(id){
    /*
        Reset UI layout to change computer
            => Erase the content from past computer
            => Generate content for new computer
    */
    let end;
    changingCpm = true;
    playAudioUntilEnd(new Audio(absoluteAssetsPath("sound/exit.wav"))).then(() => {
        let toRemove = Array();
        for (let x of document.body.children){
            if (x.classList.contains("directory") || x.classList.contains("file")){
                toRemove.push(x)
            }
        }
        for (let x of toRemove){
            document.body.removeChild(x);
        }
        document.getElementById("commands").innerHTML = "";

        let filepath = absoluteAssetsPath(`computers/${id}/data.md`);
        readFile(filepath).then(
            data => {
                root = buildDir(data);
                initializeLayout(root);
                document.body.removeChild(end);
                changeTerminalState("", false);
                changingCpm = false;
            }
        )          
    })
    end = document.createElement("div");
    end.className = "activeWhiteScreen";
    end.style.zIndex = 10;
    end.id = "end";
    end.style.width = "100vw";
    end.style.height = "100vh";
    document.body.prepend(end);
    document.getElementById("terminal").classList.add("disappear");
}

function death(){
    /*
        Death animation
    */
   bgMusic.pause();
    document.body.removeChild(SOUL);
    let death = document.createElement("video");
    death.src = absoluteAssetsPath("vid/death.mp4");
    death.id = "death";
    document.body.appendChild(death);
    playAudioUntilEnd(death).then(() => playAudioUntilEnd(new Audio(absoluteAssetsPath("sound/disappear.mp3")))).then(() => window.location.href = "./test2.html")
}

function collectFragment(){
    new Audio(absoluteAssetsPath("sound/fragment.wav")).play();
    fragments++;
    fileBlackList.push(selectDirectory.name);
    rebootLayout(root);
}

/* Computer initializer */ 
function initializeLayout(root){
    /*
        Initiate UI layout from newly generate computer object (root Dierectory)
    */
    let dir = document.createElement("div");
    dir.className = "directory selected";
    dir.id = root.name;
    let p = document.createElement("p");
    p.textContent = root.name;
    dir.style.marginLeft = "5vw";
    dir.appendChild(p);
    document.body.appendChild(dir);
    let offsets = dir.getBoundingClientRect();
    root.top = offsets.top; 

    placeSOUL(2,root.top - 5);

    selectDiv = document.getElementById(root.name);
    selectDirectory = root;
    selectDirectoryIndex = 0;
    selectDiv.classList.add("selected");
    root.top = selectDiv.getBoundingClientRect().top;
    placeSOUL(2, selectDirectory.top - 10)
    themeManager.interpreter(currentTheme);
}

function rebootLayout(root){
    document.body.removeChild(document.getElementById(root.name));
    initializeLayout(root);
    selectDirectory = root;
    selectDirectoryIndex = 0;
    parentDirectories = Array();
}

function buildDir(data){
    /*
        Build a computer from data file (exists for each computer accessible)
    */
    let dir = new Directory(data[0], 0);
    dir.buildDirectory(data, 1);

    return dir;
}

/* main */
async function main(){
    let filepath = absoluteAssetsPath(`computers/000.000.000.000/data.md`);
    let data = await readFile(filepath);

    root = buildDir(data);
    initializeLayout(root);
    
    return root;
    
}
main();