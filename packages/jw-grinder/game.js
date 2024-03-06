import Outs from './outs.js';
import Card from './card.js';
import Hand from './hand.js';

class Game
{
    constructor(smallBlind, bigBlind) {
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.seats = {};
        this.dealtCards = [];
        this.streets = [];
        this.pot = 0;
        this.effectiveStackSize = 0

        this.currentRaise = 0;
        this.bets = [];
        this.raisers = [];
        this.actions = [];
        this.results = [];
        this.allin = {
            "seats": [],
            "stack": 0
        };

        this.showdowns = [];
        this.winners = [];
        this.outcome = null;

        this.numbers = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
        this.suits = ['s','h','d','c'];
    }

    deal = (size) => {
        let cards = [];

        while ( cards.length < size ) {
            let card = this.numbers[Math.floor(Math.random() * this.numbers.length)];
            card += this.suits[Math.floor(Math.random() * this.suits.length)];

            if (!cards.includes(card) && !this.dealtCards.includes(card)) {
                cards.push(card);
            }
        }

        this.dealtCards = this.dealtCards.concat(cards);

        return cards;
    }

    #orderCards = (card1Value, card2Value) => {
        let card1ValueIdx = this.numbers.indexOf(card1Value);
        let card2ValueIdx = this.numbers.indexOf(card2Value);

        if (card1ValueIdx < card2ValueIdx) {
            return card2Value + card1Value;
        } else {
            return card1Value + card2Value
        }
    }

    getCardsCombo = (cards) => {
        let combo = this.#orderCards(cards[0][0], cards[1][0]) + 'o';
        if (cards[0][0] === cards[1][0]) {
            combo = cards[0][0] + cards[0][0];
        } else if ( cards[0][1] === cards[1][1] ) {
            combo = this.#orderCards(cards[0][0], cards[1][0]) + 's';
        }

        return combo;
    }

    #prepareBets(seats) {
        this.seats = seats;
        this.pot = this.bigBlind + this.smallBlind;
        this.seats["BB"].player.stack -= this.bigBlind;
        this.seats["SB"].player.stack -= this.smallBlind;
        this.seats["BB"].player.logBBLost(this.bigBlind);
        this.seats["SB"].player.logBBLost(this.smallBlind);
        this.bets.push({"BB": this.bigBlind, "SB": this.smallBlind});
    }

    #distributePot() {
        if (this.winners.length > 0) {
            let remainder = this.pot % this.winners.length;
            this.pot -= remainder;
            let potAmount = (this.pot/this.winners.length);
            for (let ii = 0; ii < this.winners.length; ii++) {
                this.seats[this.winners[ii]].player.stack += potAmount;
                this.seats[this.winners[ii]].player.logBBWon(potAmount);
            }
            let firstSeat = Object.keys(this.seats)[0];
            this.seats[firstSeat].player.stack += remainder;
            this.seats[firstSeat].player.logBBWon(remainder, false);
        }
    }



    play(seats) {
        this.#prepareBets(seats);
        Preflop.play(this);

        if (Object.keys(this.seats).length > 1) {
            Postflop.play(this);
        }
        this.#distributePot();
    }

    doContinue() {
        let remainingPlayerCt = Object.keys(this.seats).length;
        if (remainingPlayerCt < 2) {
            return false;
        }

        if (this.allin.seats.length > 0) {
            return (this.allin.seats.length !== remainingPlayerCt);
        }

        if (this.raisers.length > 0) {
            let lastRaise = this.bets[this.raisers.length];
            return (Object.keys(lastRaise).length !== remainingPlayerCt);
        }

        return true;
    }

    doRaise(pos, amount) {
        if (amount === this.currentRaise) {
            this.doCall(pos);
        }

        let betCt = Object.keys(this.bets).length;
        this.raisers.push(pos);
        this.bets[betCt] = {};
        this.bets[betCt][pos] = amount;
        this.pot += amount;
        this.currentRaise = amount;
        this.seats[pos].player.stack -= amount;
        this.seats[pos].player.logBBLost(amount);
        this.actions.push({"pos": pos, action: "raise", "raise": amount});
    }

    doCall(pos) {
        let betCt = (Object.keys(this.bets).length - 1);
        this.actions.push({"pos": pos, "action": 'call', "raise": this.currentRaise});
        this.bets[betCt][pos] = this.currentRaise;
        this.pot += this.currentRaise;
        this.seats[pos].player.stack -= this.currentRaise;
        this.seats[pos].player.logBBLost(this.currentRaise);
    }

    calcEffectiveStackSize() {
        let stacks = Object.values(this.seats).sort((a, b) => {
            return (
                b.stack - a.stack
            );
        });

        this.effectiveStackSize = stacks[0].player.stack;
    }
}

class Preflop
{
    constructor(game){
        this.game = game;
    }

    static play(game, ct = 0) {
        let pf = new this(game);
        for (let [position, seat] of Object.entries(pf.game.seats)) {
            let cards;

            // DEAL
            if (!seat.hasOwnProperty("cards")) {
                cards = pf.game.deal(2);
                seat.cards = cards;
                seat.combo = pf.game.getCardsCombo(cards);
                seat.player.gameStats.games++;
            }

            if (pf.game.doContinue()) {
                let action = pf.getAction(position, seat);
                if (action === "FOLDS") {
                    delete pf.game.seats[position];
                } else {
                    action += ' +' + pf.game.currentRaise;
                }
                pf.game.results.push({pos: position, cards: seat.cards, action: action});
            } else if (Object.keys(pf.game.bets).length === 1) {
                pf.game.results.push({pos: position, cards: seat.cards, action: "CHECKS"});
            }
        }

        if (pf.game.doContinue() && ct < 5) {
            ct++;
            this.play(pf.game, ct);
        } else {
            pf.setOutcome();

            return pf.game;
        }
    }

    setOutcome() {
        if (Object.keys(this.game.seats).length === 1 ) {
            for (const [position, seat] of Object.entries(this.game.seats)) {
                this.game.winners.push(position);
                this.game.outcome = seat.player.name + ' (' + position + ') takes the pot: '+this.game.pot+'bb';
            }
        }
    }

    getAction(pos, seat) {
        let action, betCt = Object.keys(this.game.bets).length;

        if (betCt < 2) {
            action = this.getOpeningAction(pos, seat);
        } else if (betCt > 3) {
            action = this.getAllInAction(pos, seat);
        } else {
            action = this.getRaiseCallFoldAction(pos, seat, betCt+1);
        }

        return action;
    }

    getOpeningAction(pos, seat) {
        let action = 'FOLDS';
        if (pos === 'BB') {
            action = 'CHECKS';
        } else if (seat.player.doOpen(pos,seat.combo)) {
            let openRaise = seat.player.getOpenAmount(pos, this. game.bigBlind);
            this.game.doRaise(pos, openRaise);
            action = 'R';
        }

        return action;
    }

    getRaiseCallFoldAction(pos, seat, betCt) {
        let villain = this.game.raisers[this.game.raisers.length-1];
        let actionValue = seat.player.doPreflopAction(pos, seat, villain, betCt);

        if (actionValue < 0) {
            return 'FOLDS';
        }

        if (actionValue > 0) {
            this.game.calcEffectiveStackSize();
            let raiseAmount = seat.player.getRaiseAmount(this.game.currentRaise, this.game.effectiveStackSize);
            this.game.doRaise(pos, raiseAmount);

            return 'R';
        }

        this.game.doCall(pos);

        return 'C';
    }

    getAllInAction(pos, seat) {

        let doAllin = seat.player.doPrefloAllin(pos, seat.combo);
        if (!doAllin) {
            return "FOLDS";
        }

        this.game.allin.seats.push(pos);
        if (this.game.allin.stack === 0) {
            this.game.calcEffectiveStackSize();
            this.game.allin.stack = this.game.effectiveStackSize;
            this.game.doRaise(pos, this.game.effectiveStackSize);
        } else {
            this.game.doCall(pos, this.game.allin.stack);
        }

        return "ALLIN";
    }
}

class Postflop
{
    constructor(game) {
        this.game = game;
        this.hands = [];

        if (game.allin.length > 0) {
            this.aggressor = game.allin[0];
        } else {
            this.aggressor = game.raisers.reverse()[0];
        }

        const positionOrder = ['BT', 'CO', 'HJ', 'UG', 'BB', 'SB'];
        let ordered = Object.keys(game.seats).sort((a, b) => {
            return (
                positionOrder.indexOf(a) - positionOrder.indexOf(b)
            );
        });
        this.inPosition = ordered[0];
    }

    static play(game) {
        let pf = new this(game);

        pf.#flop();
        if (Object.keys(pf.game.seats).length > 1) {
            pf.#turn();
        }

        if (Object.keys(pf.game.seats).length > 1) {
            pf.#river();
        }

        if (Object.keys(pf.game.seats).length > 1) {
            pf.#showdown()
        }

        pf.#getOutcome();
    }

    #getOutcome() {
        let hands = Object.values(this.hands);

        this.game.outcome = '';
        if (hands.length > 1) {
            this.game.outcome = 'Split pot / ';
        }

        let outcome = [];
        for (let ii = 0; ii < hands.length; ii++) {
            let winnerSeat = hands[ii].pos;
            this.game.winners.push(winnerSeat);
            let player = this.game.seats[winnerSeat].player.name;
            let hand = '';
            for (let jj = 0; jj < hands[ii].hand.length; jj++) {
                hand += hands[ii].hand[jj].value;
                hand += hands[ii].hand[jj].suit;
            }
            outcome.push(player + ' (' + winnerSeat + ') takes the pot: '+(this.game.pot)+'bb with ' + hands[ii].best + ' [' + hand + ']');
        }

        this.game.outcome += outcome.join(' / ');
    }

    #flop() {
        let cards = this.game.deal(3);
        this.game.streets = this.game.streets.concat(cards);

        for (let [position, player] of Object.entries(this.game.seats)) {
            let outs = Outs.solve( player.cards, this.game.streets);
            //console.log(seat, outs);
        }
    }

    #turn() {
        let cards = this.game.deal(1);
        this.game.streets = this.game.streets.concat(cards);

        for (let [position, player] of Object.entries(this.game.seats)) {
            let outs = Outs.solve( player.cards, this.game.streets);
            //console.log(seat, outs);
        }
    }

    #river() {
        let cards = this.game.deal(1);
        this.game.streets = this.game.streets.concat(cards);
        for (let [seat, player] of Object.entries(this.game.seats)) {
            let cards = player.cards.concat(this.game.streets);
            let cardsPool = [];
            for (let ii = 0; ii < cards.length; ii++) {
                let card = new Card(cards[ii][0], cards[ii][1]);
                cardsPool.push(card);
            }

            this.game.seats[seat].hand = new Hand(cardsPool);
        }
    }

    #showdown() {
        let handRank = 0;
        let cardRank = 0;
        let hands = [];
        let showdownPositions = [];
        for (let [position, player] of Object.entries(this.game.seats)) {
            this.game.showdowns.push(position);
            if (player.hand.handRank >= handRank) {
                if (player.hand.handRank > handRank) {
                    hands = [];
                    cardRank = 0;
                }
                if (player.hand.highCard.rank >= cardRank) {
                    if (player.hand.highCard.rank > cardRank) {
                        hands = [];
                    }
                    hands.push({pos: position, best: player.hand.best, cards: player.cards, hand: player.hand.cards});
                    cardRank = player.hand.highCard.rank;
                }
                handRank = player.hand.handRank;
            }
        }

        if (hands.length > 1) {
            hands = Hand.compare(hands);
        }

        for (let ii = 0; ii < hands.length; ii++) {
            showdownPositions.push(hands[ii].pos);
            this.game.results.push({pos: hands[ii].pos, cards: hands[ii].cards, action: "Wins at showdown"})
        }

        for (let position of Object.keys(this.game.seats)) {
            if (showdownPositions.indexOf(position) < 0) {
                delete this.game.seats[position];
            }
        }

        this.hands = hands;
    }
}

export default Game;