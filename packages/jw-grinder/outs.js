class Outs {
    constructor(hand, board) {

        this.values = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
        this.suits = { 's': 0, 'h': 0, 'd': 0, 'c': 0 };

        this.hand = hand;
        this.cardsPool = hand.concat(board);

        for (let ii = 0; ii < this.cardsPool.length; ii++) {
            let suit = this.cardsPool[ii][1];
            this.suits[suit]++;
        }

        this.straightOuts = [];
        this.flushOuts = [];
        this.setOuts = [];
    }

    static solve(hand, board) {
        let Outs = new this(hand, board);

        for ( let i = 0; i < Outs.hand.length; i++ ) {
            Outs.#findFlushDraws(Outs.hand[i]);
            Outs.#findStraightDraws(Outs.hand[i]);
            Outs.#findCardsForSet(Outs.hand[i]);
        }

        let count = Outs.flushOuts.concat(Outs.setOuts).concat(Outs.straightOuts).length;;
        if (board.length < 6) {
            count -= Math.ceil(Outs.straightOuts.length/2);
        }

        return count;
    }

    #findFlushDraws(hand) {
        let card;
        if (this.suits[hand[1]] > 2) {
            for ( let ii = 0; ii < this.values.length; ii++) {
                card = this.values[ii] + hand[1];
                if (!this.cardsPool.includes(card) && !this.flushOuts.includes(card)) {
                    this.flushOuts.push(card);
                }
            }
        }
    }

    #findStraightDraws(hand, countUp = true) {
        let values = [];
        let rank = this.values.indexOf(hand[0]);
        if (countUp) {
            if (rank > 12) {
                rank = -1;
            }
            values = this.values.slice((rank+1), (rank+5));
        } else {
            let addAce = false;
            if (rank < 5) {
                rank = 5;
                addAce = true;
            }
            values = this.values.slice((rank-5), (rank-1));

            if (addAce) {
                values.slice(0,4);
                values.push("A");
            }
        }

        for ( let ii = 0; ii < this.cardsPool.length; ii++) {
           let index = values.indexOf(this.cardsPool[ii][0]);
            if (index > -1) {
                values.splice(index, 1);
            }
        }

        if (values.length < (8 - this.cardsPool.length)) {
            for ( let ii = 0; ii < values.length; ii++) {
                if (values[ii] !== hand[0]) {
                    for (const suit of Object.keys(this.suits)) {
                        let card = values[ii] + suit;
                        if (!this.cardsPool.includes(card) && !this.straightOuts.includes(card)) {
                            this.straightOuts.push(card);
                        }
                    }
                }
            }
        }

        if (countUp) {
            this.#findStraightDraws(hand[0], false);
        }
    }

    #findCardsForSet(hand) {
        for (const suit of Object.keys(this.suits)) {
            let card = hand[0] + suit;
            if (!this.cardsPool.includes(card) && !this.setOuts.includes(card)) {
                this.setOuts.push(card);
            }
        }
    }
}

export default Outs;