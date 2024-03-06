export const RangeParser = class {

    constructor(rangeString) {
        this.ranks = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
        this.sets = rangeString.replace(/\s/g,'').split(',');
        this.range = [];
        this.doSets();
    }

    doSets() {

        let rules = {
            pair: /^([2-9TJQKA])\1$/,
            pairPlus: /^([2-9TJQKA])\1\+$/,
            pairMinus: /^([2-9TJQKA])\1-$/,
            pairDash: /^([2-9TJQKA])\1-([2-9TJQKA])\2$/,
            suited: /^[2-9TJQKA]{2}s$/,
            suitedPlus: /^[2-9TJQKA]{2}s\+$/,
            suitedMinus: /^[2-9TJQKA]{2}s-$/,
            suitedDash: /^[2-9TJQKA]{2}s-[2-9TJQKA]{2}s$/,
            offsuited: /^[2-9TJQKA]{2}o$/,
            offsuitedPlus: /^[2-9TJQKA]{2}o\+$/,
            offsuitedMinus: /^[2-9TJQKA]{2}o-$/,
            offsuitedDash: /^[2-9TJQKA]{2}o-[2-9TJQKA]{2}o$/
        };

        for ( let i = 0; i < this.sets.length; i++ ) {
            for (const [method_name, regex] of Object.entries(rules)) {
                if ( regex.test(this.sets[i]) ) {
                    this[method_name](this.sets[i]);
                    break;
                }
            }
        }
    }

    pair(set) {
        this.range.push(set);
    }

    pairPlus(set) {
        let pos = this.ranks.indexOf(set[0]);
        for ( let i = pos; i < this.ranks.length; i++) {
            this.range.push(this.ranks[i]+this.ranks[i]);
        }
    }

    pairMinus(set) {
        let pos = this.ranks.indexOf(set[0]);
        for ( let i = pos; i >= 0; i--) {
            this.range.push(this.ranks[i]+this.ranks[i]);
        }
    }

    pairDash(set) {
        let ends = set.split('-');
        let left = this.ranks.indexOf(ends[0][0]);
        let right = this.ranks.indexOf(ends[1][0]);
        if ( left < right ) {
            for ( let i = left; i <= right; i++) {
                this.range.push(this.ranks[i]+this.ranks[i]);
            }
        } else {
            for ( let i = left; i >= right; i--) {
                this.range.push(this.ranks[i]+this.ranks[i]);
            }
        }
    }

    suited(set) {
        this.range.push(set);
    }

    suitedPlus(set) {
        let pos = this.ranks.indexOf(set[1]);
        for ( let i = pos; i < this.ranks.length; i++) {
            if (set[0] !== this.ranks[i]) {
                this.range.push(set[0]+this.ranks[i]+'s');
            }
        }
    }

    suitedMinus(set) {
        let pos = this.ranks.indexOf(set[1]);
        for ( let i = pos; i >= 0; i--) {
            if (set[0] !== this.ranks[i]) {
                this.range.push(set[0]+this.ranks[i]+'s');
            }
        }
    }

    suitedDash(set) {
        let ends = set.split('-');
        let left = this.ranks.indexOf(ends[0][1]);
        let right = this.ranks.indexOf(ends[1][1]);
        if ( left < right ) {
            for ( let i = left; i <= right; i++) {
                if (set[0] !== this.ranks[i]) {
                    this.range.push(set[0]+this.ranks[i]+'s');
                }
            }
        } else {
            for ( let i = left; i >= right; i--) {
                if (set[0] !== this.ranks[i]) {
                    this.range.push(set[0]+this.ranks[i]+'s');
                }
            }
        }
    }

    offsuited(set) {
        this.range.push(set);
    }

    offsuitedPlus(set) {
        let pos = this.ranks.indexOf(set[1]);
        for ( let i = pos; i < this.ranks.length; i++) {
            if (set[0] !== this.ranks[i]) {
                this.range.push(set[0]+this.ranks[i]+'o');
            }
        }
    }

    offsuitedMinus(set) {
        let pos = this.ranks.indexOf(set[1]);
        for ( let i = pos; i >= 0; i--) {
            if (set[0] !== this.ranks[i]) {
                this.range.push(set[0]+this.ranks[i]+'o');
            }
        }
    }

    offsuitedDash(set) {
        let ends = set.split('-');
        let left = this.ranks.indexOf(ends[0][1]);
        let right = this.ranks.indexOf(ends[1][1]);
        if ( left < right ) {
            for ( let i = left; i <= right; i++) {
                if (set[0] !== this.ranks[i]) {
                    this.range.push(set[0]+this.ranks[i]+'o');
                }
            }
        } else {
            for ( let i = left; i >= right; i--) {
                if (set[0] !== this.ranks[i]) {
                    this.range.push(set[0]+this.ranks[i]+'o');
                }
            }
        }
    }
}