import { absoluteAssetsPath } from "../utilities.js";

export function ThemeManager(){
    this.bg = "rbg(0,0,0)";
    this.terminal = "rgb(6,147,6)";
    this.directory = "rgb(6,147,6)";
    this.text = "rgb(240,248,255)";
    this.file = "rgb(12,27,235)";
    this.selected = "rgb(238,186,30)";
    this.web = absoluteAssetsPath("img/webLogo/dark.png");
    this.connect = absoluteAssetsPath("img/connectLogo/dark.png");

    this.interpreter = function(command){
        let input = command.toLowerCase();
        switch(input){
            case "default":
                this.default();
                break;
            case "dark":
                this.default();
                break;
            case "light":
                this.light();
                break;
            case "strawberry":
                this.strawberry();
                break;
            case "chocolate":
                this.chocolate();
                break;
            case "hell":
                this.hell();
            default:
                console.log(input);
        }
    }
    
    this.default = function(){
        this.bg = "rgb(0, 0, 0)";
        this.terminal = "rgb(6,147,6)";
        this.directory = "rgb(6,147,6)";
        this.text = "rgb(240,248,255)";
        this.file = "rgb(12,27,235)";
        this.selected = "rgb(238,186,30)";
        this.web = absoluteAssetsPath("img/webLogo/dark.png");
        this.connect = absoluteAssetsPath("img/connectLogo/dark.png");

        this.applyTheme();
    }
    this.light = function(){
        this.bg = "rbg(240,248,255)";
        this.terminal = "rgb(9, 225, 9)";
        this.directory = "rgb(9,225,9)";
        this.text = "rgb(23, 24, 24)";
        this.file = "rgb(12, 205, 235)";
        this.selected = "rgb(142, 12, 235)";
        this.web = absoluteAssetsPath("img/webLogo/light.png");
        this.connect = absoluteAssetsPath("img/connectLogo/light.png");

        this.applyTheme();
    }

    this.strawberry = function(){
        this.bg = "hsl(0 100% 85%)";
        this.terminal = "hsl(106 100% 29%)";
        this.directory = "hsl(167 100% 82%)";
        this.text = "hsl(2 100% 18%)";
        this.file = "hsl(0 100% 52%)";
        this.selected = "hsl(51 100% 50%)";
        this.web = absoluteAssetsPath("img/webLogo/strawberry.png");
        this.connect = absoluteAssetsPath("img/connectLogo/strawberry.png");

        this.applyTheme();
    }

    this.chocolate = function(){
        this.bg = "hsl(20 63% 35%)";
        this.terminal = "hsl(107 100% 42%)";
        this.directory = "hsl(30 63% 12%)";
        this.text = "hsl(59 79% 62%)";
        this.file = "hsl(27 100% 46%)";
        this.selected = "hsl(27 100% 78%)";
        this.web = absoluteAssetsPath("img/webLogo/chocolate.png");
        this.connect = absoluteAssetsPath("img/connectLogo/chocolate.png");

        this.applyTheme();
    }

    this.hell = function(){
        this.bg = "hsl(360 100% 11%)";
        this.terminal = "hsl(23 100% 37%)";
        this.directory = "hsl(318 100% 33%)";
        this.text = "hsl(23 100% 63%)";
        this.file = "hsl(0 100% 63%)";
        this.selected = "hsl(0 100% 0%)";
        this.web = absoluteAssetsPath("img/webLogo/hell.png");
        this.connect = absoluteAssetsPath("img/connectLogo/hell.png");

        this.applyTheme();
    }

    this.applyTheme = function() {
        document.documentElement.style.setProperty('--bg-color', this.bg);
        document.documentElement.style.setProperty('--terminal-color', this.terminal);
        document.documentElement.style.setProperty('--directory-color', this.directory);
        document.documentElement.style.setProperty('--text-color', this.text);
        document.documentElement.style.setProperty('--file-color', this.file);
        document.documentElement.style.setProperty('--select-color', this.selected);
    }
}