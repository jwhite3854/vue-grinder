class jWhitePokerTools
{
    constructor() {
        this.numbers = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
        this.suits = ['s','h','d','c'];
        this.combos = ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QQ","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","JJ","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","TT","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","99","98s","97s","96s","95s","94s","93s","92s","88","87s","86s","85s","84s","83s","82s","77","76s","75s","74s","73s","72s","66","65s","64s","63s","62s","55","54s","53s","52s","44","43s","42s","33","32s","22","AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o","KQo","KJo","KTo","K9o","K8o","K7o","K6o","K5o","K4o","K3o","K2o","QJo","QTo","Q9o","Q8o","Q7o","Q6o","Q5o","Q4o","Q3o","Q2o","JTo","J9o","J8o","J7o","J6o","J5o","J4o","J3o","J2o","T9o","T8o","T7o","T6o","T5o","T4o","T3o","T2o","98o","97o","96o","95o","94o","93o","92o","87o","86o","85o","84o","83o","82o","76o","75o","74o","73o","72o","65o","64o","63o","62o","54o","53o","52o","43o","42o","32o"];
    }

    deal = (size, dealt = []) => {
        let hand = [];

        while ( hand.length < size ) {
            let key = this.numbers[Math.floor(Math.random() * this.numbers.length)];
            key += this.suits[Math.floor(Math.random() * this.suits.length)];

            if (!hand.includes(key) && !dealt.includes(key)) {
                hand.push(key);
            }
        }

        return hand;
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

    parseHoleCombo = (cards) => {
        let combo = this.#orderCards(cards[0], cards[2]) + 'o';
        if (cards[0] === cards[2]) {
            combo = cards[0] + cards[0];
        } else if ( cards[1] === cards[3] ) {
            combo = this.#orderCards(cards[0], cards[2]) + 's';
        }

        return combo;
    }

    decorateCards = (cards) => {
        let output = '';
        for ( let i = 0; i < cards.length; i++ ) {
            output += '<div class="jw-card'+cards[i].substr(1,1)+'">'+cards[i].substr(0,1)+'</div>';
        }

        return output;
    }
}