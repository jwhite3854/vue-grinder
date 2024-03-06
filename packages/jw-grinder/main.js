import {Player} from './player.js';
import Table from './table.js';

class JWPokerGrinder {
    constructor() {
        console.log("Loading...")
        this.playButton = document.getElementById("playButton");
        this.cardSets = document.getElementsByClassName('cardset');
        this.toggleVisibilityButton = document.getElementById('toggleCardVisibility');
        this.hideCards = false;
        this.resetTable();
        this.setupListeners();
    }

    resetTable = () => {
        this.gameCount = 0;
        let bigBlind = parseInt(document.getElementById("bbInput").value) ?? 2;
        let smallBlind = parseInt(document.getElementById("sbInput").value) ?? 1;
        let settings = {};

        let playerSettings = document.querySelectorAll('[name^="ps"][type="range"]');
        Array.from(playerSettings).forEach((setting) => {
            let regPattern = /ps\[(\w{4})\]\[(\w{3})\]/i;
            let playerName = regPattern.exec(setting.name)[1];
            let attributeName = regPattern.exec(setting.name)[2];

            if (!Object.hasOwn(settings,playerName)) {
                settings[playerName] = {};
                settings[playerName].name = playerName;
            }

            settings[playerName][attributeName] = parseInt(setting.value);
        });

        this.Andy = new Player(settings['Andy']);
        this.Brad = new Player(settings['Brad']);
        this.Chad = new Player(settings['Chad']);
        this.Dave = new Player(settings['Dave']);
        this.Eric = new Player(settings['Eric']);
        this.Fred = new Player(settings['Fred']);
     
        this.table = new Table(smallBlind, bigBlind, [this.Andy, this.Brad, this.Chad, this.Dave, this.Eric, this.Fred]);

        this.updateGameCount();
        console.log(this.table);
        this.playButton.removeAttribute("disabled");
    }

    setupListeners = () => {
        this.playButton.addEventListener("click", (event) => {
            this.playGame();
        });

        this.toggleVisibilityButton.addEventListener("click", () => {
            let icon = this.toggleVisibilityButton.querySelector('i');
            this.hideCards = !icon.classList.contains("bi-eye-slash-fill");
            if (this.hideCards) {
                this.toggleCardsVisibility(true);
                icon.classList.add("bi-eye-slash-fill");
                icon.classList.remove("bi-eye-fill");
            } else {
                this.toggleCardsVisibility(false);
                icon.classList.add("bi-eye-fill");
                icon.classList.remove("bi-eye-slash-fill");
            }
        });

        Array.from(this.cardSets).forEach((element) => {
            element.addEventListener("click", () => {
                if (this.hideCards) {
                    if (element.classList.contains("showdown")) {
                        element.classList.remove("showdown");
                    } else {
                        element.classList.add("showdown");
                    }
                }
            });
        });
    }

    toggleCardsVisibility = (state) => {
        Array.from(this.cardSets).forEach((element) => {
            if (state) {
                element.classList.add("hide-cards");
            } else {
                element.classList.remove("hide-cards");
            }
        });
    }

    updateGameCount = () => {
        let gameCtElements = document.getElementsByClassName('gameCt');
        Array.from(gameCtElements).forEach((element) => {
            element.innerText = this.gameCount.toLocaleString();
        });
    }

    playGame = () => {
        let playCt = parseInt(document.querySelector('input[name="playCount"]').value) ?? 1;

        let game = null;
        
        for (let ii = 0; ii < playCt; ii++) {
            try {
         //       game = this.table.play();
                this.gameCount++;
            } catch (game) {
                this.playButton.setAttribute("disabled","disabled");
                break;
            }
        }
   
        this.updateGameCount();

        game = this.table.play();

        if (game !== null) {
            this.table.renderDivResults(game);
        }
    }

    toggleCards = () => {
        let checkbox = document.getElementById("checkboxToggle");
        let cardSets = document.getElementsByClassName("cardset");
        Array.from(cardSets).forEach(element => {
            if (checkbox.checked) {
                element.className += " hide-cards";
            } else {
                element.className = element.className.replace(" hide-cards", "");
            }
            this.viewCardsListener(element);
        });
    }

    viewCardsListener = (element) => {
        let checkbox = document.getElementById("checkboxToggle");
        element.addEventListener("click", function(e) {
            if (checkbox.checked) {
                if (element.className === "cardset hide-cards") {
                    element.className = "cardset";
                } else {
                    element.className = "cardset hide-cards";
                }
            }
        });
    }
}

export default JWPokerGrinder;