class Card {
    constructor(value, suit){
        this.value = value;
        this.suit = suit;

        this.rank = ['X','2','3','4','5','6','7','8','9','T','J','Q','K','A'].indexOf(value);
    }

    static sort(a, b) {
        if (a.rank > b.rank) {
            return -1;
        } else if (a.rank < b.rank) {
            return 1;
        } else {
            return 0;
        }
    }
}

export default Card;