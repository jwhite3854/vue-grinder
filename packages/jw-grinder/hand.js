import Card from './card.js';

class Hand {
    constructor(cardsPool, best = '') {
        this.cards = [];
        this.cardsPool = cardsPool.sort(Card.sort);
        this.suits = {"s":[], "h":[], "d":[], "c":[]};
        this.ranks = {};

        this.sfLength = 0;
        this.best = best;
        this.highCard = null;

        this.handRankings = [
            StraightFlush,
            FourOfAKind,
            FullHouse,
            Flush,
            Straight,
            ThreeOfAKind,
            TwoPair,
            OnePair,
            HighCard
        ];

        this.handRank = this.handRankings.length;

        let card;
        for (let i = 0; i < this.cardsPool.length; i++) {
            card = this.cardsPool[i];
            this.suits[card.suit].push(card);
            if (this.ranks[(13-card.rank)] === undefined) {
                this.ranks[(13-card.rank)] = []
            }
            this.ranks[(13-card.rank)].push(card);
        }

        this.isPossible = false;
        this.solve();
    }

    /**
     * Highest card comparison.
     * @return {Array} Highest cards
     */
    nextHighest() {
        let excluding = this.cards;
        return this.cardsPool.filter(function (card) {
            if (excluding.indexOf(card) < 0) {
                return true;
            }
        });
    }

    /**
     * Build and return the best hand.
     * @return {Hand}       Best hand.
     */
    solve() {

        let result = null;
        for (let i = 0; i < this.handRankings.length; i++) {
            let evaluation = this.handRankings[i];
            result = new evaluation(this.cardsPool);
            if (result.isPossible) {
                this.best = result.best;
                this.cards = result.cards;
                this.highCard = result.cards[0];
                break;
            }
            this.handRank--;
        }

        return result;
    }

    static compare(hands) {

        if (hands.length < 2) {
            return hands;
        }

        for (let ii = 0; ii < 5; ii++) {
            let rank = 0;
            for (let jj = 0; jj < hands.length; jj++) {
                let card = hands[jj].hand[ii];
                if (card.rank < rank) {
                    hands.splice(jj, 1);
                    hands = Hand.compare(hands);
                }
                rank = card.rank;
            }
        }

        return hands;
    }
}

class StraightFlush extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Straight Flush');
    }

    solve() {
        let flush = null
        for (const [suit, cards] of Object.entries(this.suits)) {
            if (cards.length > 4) {
                flush = cards.sort(Card.sort);
            }
        }

        if (flush) {
            let straight = new Straight(flush);
            if (straight.isPossible) {
                this.cards = straight.cards;
                this.sfLength = straight.sfLength;
            }
        }

        this.isPossible = (this.cards.length >= 5);

        return this;
    }
}

class FourOfAKind extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Four of a Kind');
    }

    solve() {
        for (const [rank, cards] of Object.entries(this.ranks)) {
            if (cards.length === 4) {
                this.cards = this.cards.concat(cards || []);
                this.cards = this.cards.concat(this.nextHighest().slice(0, 1));
            }
        }

        this.isPossible = (this.cards.length >= 4);

        return this;
    }
}

class FullHouse extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Full House');
    }

    solve() {

        let bigSet = '';
        for (const [rank, cards] of Object.entries(this.ranks)) {
            if (cards.length === 3) {
                this.cards = this.cards.concat(cards || []);
                bigSet = rank;
                break;
            }
        }

        if (this.cards.length === 3) {
            for (const [rank, cards] of Object.entries(this.ranks)) {
                if (cards.length > 1 && rank !== bigSet ) {
                    this.cards = this.cards.concat(cards || []);
                    break;
                }
            }
        }

        this.isPossible = (this.cards.length >= 5);

        return this;
    }
}

class Flush extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Flush');
    }

    solve() {
        this.sfLength = 0;

        for (const [suit, cards] of Object.entries(this.suits)) {
            if (cards.length > 4) {
                this.cards = cards.sort(Card.sort);
            }
        }

        this.isPossible = (this.cards.length > 4);

        return this;
    }
}

class Straight extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Straight');
    }

    solve() {
        this.cards = this.getWheel();

        if (this.cards.length >= 5) {
            this.name += ', Wheel';
            this.sfLength = 5;
            if (this.cards[0].value === 'A') {
                this.cards = this.cards.concat(this.nextHighest().slice(1, 6-this.cards.length));
            } else {
                this.cards = this.cards.concat(this.nextHighest().slice(0, 5-this.cards.length));
            }

            this.isPossible = true;

            return this;
        }

        this.cards = this.getRun(this.cardsPool);

        if (this.cards.length >= 5) {
            this.cards = this.cards.slice(0, 5);
        }

        this.isPossible = (this.cards.length >= 5);

        return this;
    }

    getRun(cards) {
        for (let i = 0; i < 3; i++) {
            let topRank = cards[i].rank;
            let run = [];
            outer_loop:
                for (let j = topRank; j >= 0; j--) {
                    for (let k = 0; k < cards.length; k++) {
                        if (cards[k].rank > j) {
                            continue;
                        }
                        if (cards[k].rank < j) {
                            break outer_loop;
                        }
                        run.push(cards[k]);
                        break;
                    }
                }

            if (run.length >= 5) {
                return run;
            }
        }

        return [];
    }

    getWheel() {

        let cards = JSON.parse(JSON.stringify(this.cardsPool));
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].value === 'A') {
                cards[i].rank = 0;
            }
        }

        cards.sort(Card.sort);

        let wheelCards = [];
        for (let i = 4; i >= 0; i--) {
            for (let j = 0; j < cards.length; j++) {
                if (cards[j].rank > i) {
                    continue;
                }
                if (cards[j].rank < i) {
                    break;
                }
                wheelCards.push(cards[j]);
                break;
            }
        }

        return wheelCards;
    }
}

class ThreeOfAKind extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Three of a Kind');
    }

    solve() {
        for (const cards of Object.values(this.ranks)) {
            if (cards.length === 3) {
                this.cards = this.cards.concat(cards || []);
                this.cards = this.cards.concat(this.nextHighest().slice(0, 2));
                break;
            }
        }

        this.isPossible = (this.cards.length >= 3);

        return this;
    }
}

class TwoPair extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'Two Pair');
    }

    solve() {
        for (const cards of Object.values(this.ranks)) {
            if (this.cards.length > 0 && cards.length === 2) {
                this.cards = this.cards.concat(cards || []);
                this.cards = this.cards.concat(this.nextHighest().slice(0, 1));
                break;
            } else if (cards.length === 2) {
                this.cards = this.cards.concat(cards);
            }
        }

        this.isPossible = (this.cards.length >= 4);

        return this;
    }
}

class OnePair extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'One Pair');
    }

    solve() {
        for (const cards of Object.values(this.ranks)) {
            if (cards.length === 2) {
                this.cards = this.cards.concat(cards || []);
                this.cards = this.cards.concat(this.nextHighest().slice(0, 3));
                break;
            }
        }

        this.isPossible = (this.cards.length >= 2);

        return this;
    }
}

class HighCard extends Hand {
    constructor(cardsPool) {
        super(cardsPool, 'High Card');
    }

    solve() {
        this.cards = this.cardsPool.slice(0, 5);
        this.isPossible = true;

        return this;
    }
}

export default Hand;