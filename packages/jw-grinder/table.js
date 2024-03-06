import Game from './game.js';

class Table {

    constructor(smallBlind, bigBlind, players = []){
        this.players = players;
        this.seats = {};
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.buyIn = 100 * bigBlind;
        this.seatOrder = ["UG", "HJ", "CO", "BT", "SB", "BB"];

        this.#setUpDivs();
    }

    #setUpDivs() {
        for (let ii = 0; ii < this.players.length; ii++) {

            let seatDiv = document.getElementById('seat'+(ii+1));

            this.players[ii].bankroll -= this.buyIn;
            this.players[ii].stack = this.buyIn;

            let stackDiv = document.getElementById('stack'+(ii+1));
            stackDiv.innerText = '$'+this.players[ii].stack;
        }
    }

    play() {
        this.#prepareSeats();
        let game = new Game(this.smallBlind, this.bigBlind);
        game.play(this.seats);
        this.#doTopUp(game);

        return game;
    }

    renderDivResults(game) {

        let playerPositions = {};
        for (let ii = 0; ii < this.players.length; ii++) {
            let card = document.getElementById('seat'+(ii+1));
            card.className = "";
            card.classList.add('position' + this.players[ii].position);
            playerPositions[this.players[ii].position] = this.players[ii].name;
        }

        let breakdown = [];
        for (let ii = 0; ii < game.results.length; ii++) {
            let position = game.results[ii].pos;
            let card = document.querySelector(".position" + position);
            
            let cardSet = card.querySelector(".cardset");
            cardSet.classList.remove("showdown");

            if (game.showdowns.indexOf(position) >= 0) {
                cardSet.classList.add("showdown");
            }

            if (Object.hasOwn(game.results[ii], "cards")) {
                this.#renderCards(cardSet, game.results[ii].cards)
            }

            breakdown.push({player: playerPositions[position], position: position, action: game.results[ii].action});
        }

        let handBreakdown = document.getElementById("handBreakdown");
        handBreakdown.innerHTML = '';
        for (let ii = 0; ii < breakdown.length; ii++) {
           this.#renderHandLine(handBreakdown, breakdown[ii])
        }

        let gameResults = document.getElementById("gameResults");
        gameResults.innerHTML = game.outcome;

        let board = document.getElementById('playBoard');
        this.#renderCards(board, game.streets)
    }

    #renderCards(cardSet, cards) {
        cardSet.innerHTML = '';
        for (let ii = 0; ii < cards.length; ii++) {
            let card = document.createElement('div');
            card.className = "jw-card" + cards[ii][1];
            card.appendChild(document.createTextNode(cards[ii][0]));
            cardSet.append(card);
        }
    }

    #renderHandLine(handBreakdown, line) {
        let div = document.createElement('div');
        let icon = document.createElement('i');
        icon.className = 'bi-record-fill plr-' + line.player.toLowerCase();
        div.appendChild(icon);
        let lineText = document.createTextNode(line.player + ' (' + line.position + ') ' + line.action);
        div.appendChild(lineText);
        handBreakdown.appendChild(div);
    }

    renderLog(game, doClear = true) {
        if (doClear) {
            console.clear();
        }

        let logLines = {};
        for (let ii = 0; ii < this.players.length; ii++) {
            let position = this.players[ii].position;
            let stack = ('000000000' + this.players[ii].stack).substr(-8);
            logLines[position] = {};
            logLines[position].name = this.players[ii].name;
            logLines[position].stack = stack;
        }

        for (let ii = 0; ii < game.results.length; ii++) {
            let position = game.results[ii].pos;
            logLines[position].cards = game.results[ii].cards;
            if (logLines[position].actions === undefined) {
                logLines[position].actions = [];
            }
            logLines[position].actions.push(game.results[ii].action);
        }

        for (const [position, player] of Object.entries(logLines)) {
            let line = player.name + ' | ' + player.stack + ' | ' + position + ' | ';
            line += player.cards.join('') + ' | ' + player.actions.join(', ');
            console.log(line);
        }

        if (game.streets.length > 0) {
            console.log(game.streets.join(','));
        }

        console.log(game.outcome);
    }

    #doTopUp(game) {
        for (let ii = 0; ii < this.players.length; ii++) {
            if (this.players[ii].stack < (this.buyIn / 2)) {
                let topUpAmount = this.buyIn - this.players[ii].stack;
                if (this.players[ii].bankroll > topUpAmount) {
                    this.players[ii].bankroll -= topUpAmount;
                    this.players[ii].stack += topUpAmount;
                } else if ( this.players[ii].bankroll > 0) {
                    this.players[ii].stack += this.players[ii].bankroll;
                    this.players[ii].bankroll = 0;
                }
            }

            if (this.players[ii].stack > (this.buyIn * 4)) {
                let investAmount = this.players[ii].stack - this.buyIn;
                this.players[ii].bankroll += investAmount;
                this.players[ii].stack -= investAmount;
            }

            let stackDiv = document.getElementById('stack'+(ii+1));
            stackDiv.innerText = '$'+this.players[ii].stack;

            if (this.players[ii].stack < this.bigBlind) {
                throw game;
            }
        }
    }

    #prepareSeats() {
        let seats = [];
        for (let ii = 0; ii < this.players.length; ii++) {
            this.players[ii].position = this.seatOrder[ii];
            seats.push({position: this.seatOrder[ii], player: this.players[ii]});
        }

        const sortList = ["UG", "HJ", "CO", "BT", "SB", "BB"];
        let sortedSeats = seats.sort((a, b) => {
            return (
                sortList.indexOf(a.position) - sortList.indexOf(b.position)
            );
        });

        this.seats = {};
        for (let ii = 0; ii < sortedSeats.length; ii++) {
            let position = sortedSeats[ii].position;
            this.seats[position] = {};
            this.seats[position].player = sortedSeats[ii].player;
        }

        let seat = this.seatOrder.pop();
        this.seatOrder.unshift(seat);
    }
}

class Seat
{
    constructor(player) {
        this.position = '';
        this.player = player;
        this.stack = 0;
    }

    static sort(a, b) {
        const sortList = ["UG", "HJ", "CO", "BT", "SB", "BB"];
        return (
            sortList.indexOf(a.position) - sortList.indexOf(b.position)
        );
    }
}

export default Table;