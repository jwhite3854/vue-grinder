import {RangeParser} from './parser.js';

export const Strategy = class {
    constructor(ra, ag) {
        this.ag = ag;
        this.ra = (ra-3)*3;

        this.combos = ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s","QQ","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s","JJ","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s","TT","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s","99","98s","97s","96s","95s","94s","93s","92s","88","87s","86s","85s","84s","83s","82s","77","76s","75s","74s","73s","72s","66","65s","64s","63s","62s","55","54s","53s","52s","44","43s","42s","33","32s","22","AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o","KQo","KJo","KTo","K9o","K8o","K7o","K6o","K5o","K4o","K3o","K2o","QJo","QTo","Q9o","Q8o","Q7o","Q6o","Q5o","Q4o","Q3o","Q2o","JTo","J9o","J8o","J7o","J6o","J5o","J4o","J3o","J2o","T9o","T8o","T7o","T6o","T5o","T4o","T3o","T2o","98o","97o","96o","95o","94o","93o","92o","87o","86o","85o","84o","83o","82o","76o","75o","74o","73o","72o","65o","64o","63o","62o","54o","53o","52o","43o","42o","32o"];

        this.preFlopRanges = {
            2: {
                "UG":9, "HJ":15, "CO":24, "BT":30, "SB":21, "BB":27
            },
            3: {
                "UG":{},
                "HJ":{"UG":"6|12"},
                "CO":{"UG":"6|12","HJ":"9|15"},
                "BT":{"UG":"6|12","HJ":"9|15","CO":"12|18"},
                "SB":{"UG":"6|12","HJ":"9|15","CO":"12|18","BT":"15|21"},
                "BB":{"UG":"6|12","HJ":"9|15","CO":"12|18","BT":"15|21","SB":"18|24"}
            },
            4: {
                "UG":{"HJ":"3|6","CO":"3|6","BT":"3|6","SB":"3|9","BB":"3|9"},
                "HJ":{"UG":"3|6","CO":"3|6","BT":"3|6","SB":"3|9","BB":"3|9"},
                "CO":{"UG":"3|6","HJ":"3|6","BT":"6|9","SB":"6|9","BB":"6|9"},
                "BT":{"UG":"3|6","HJ":"3|6","CO":"6|9","SB":"6|9","BB":"6|9"},
                "SB":{"UG":"3|6","HJ":"3|6","CO":"3|6","BT":"3|6","BB":"3|6"},
                "BB":{"UG":"3|6","HJ":"3|6","CO":"3|6","BT":"3|6","SB":"3|6"}
            },
            5: {
                "UG":[3], "HJ":[3], "CO":[3], "BT":[3], "SB":[3], "BB":[3]
            }
        };

        this.ranges = {};
        let base = {
            "3": "AA-QQ,AKo,AKs-AQs",
            "6": "AA-99,AKo-AQo,AKs-AJs,KQs,QJs",
            "9": "AA-88,AKo-AJo,KQo,AKs-ATs,KQs-KJs,QJs,JTs",
            "12": "AA-66,AKo-ATo,KQo,AKs-ATs,KQs-KTs,QJs-QTs,JTs,T9s",
            "15": "AA-33,AKo-ATo,KQo,QJo,AKs-ATs,KQs-KJs,QJs-QTs,JTs-J9s,T9s-T8s,98s,87s",
            "18": "AA-22,AKo-ATo,KQo,QJo,JTo,AKs-A9s,KQs-KTs,QJs-QTs,JTs-J9s,T9s-T8s,98s-97s,87s,76s,65s",
            "21": "AA-22,AKo-ATo,KQo,QJo,JTo,AKs-A2s,KQs-KTs,QJs-QTs,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s,54s",
            "24": "AA-22,AKo-ATo,KQo-KTo,QJo,JTo,AKs-A2s,KQs-K8s,QJs-QTs,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s,54s,43s,32s",
            "27": "AA-22,AKo-A7o,KQo-KTo,QJo,JTo,AKs-A2s,KQs-K8s,QJs-QTs,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s-64s,54s,43s,32s",
            "30": "AA-22,AKo-A7o,KQo-KTo,QJo-Q9o,JTo-J9o,T9o,AKs-A2s,KQs-K7s,QJs-Q9s,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s,54s",
            "33": "AA-22,AKo-A7o,KQo-KTo,QJo-Q9o,JTo-J9o,T9o,98o,87o,AKs-A2s,KQs-K7s,QJs-Q8s,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s-64s,54s,43s",
            "36": "AA-22,AKo-A7o,KQo-KTo,QJo-Q9o,JTo-J9o,T9o,98o,87o,AKs-A2s,KQs-K7s,QJs-Q8s,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s-64s,54s,43s"
        };

        for (let [size, string] of Object.entries(base)) {
            let parser = new RangeParser(string);
            this.ranges[size] = parser.range;
        }
    }

    setupRanges() {

    }

    getOpenRaise(pos, bigBlind) {
        return bigBlind * this.ag;
    }

    getRaise(amount) {
        return amount * this.ag;
    }

    isInOpenRange(pos, combo) {
        let rangeSize = this.preFlopRanges[2][pos];

        rangeSize = parseInt(rangeSize) + this.ra;
        if (rangeSize < 3) {
            rangeSize = 3;
        }

        if (rangeSize > 36) {
            rangeSize = 36;
        }

        let raiseRange = this.ranges[rangeSize];
        if (raiseRange.indexOf(combo) >= 0) {
            return 1;
        }

        // possibility of limp ranges here

        return -1;
    }

    isInAllinRange(pos, combo) {
        let raiseRange = this.ranges[3];
        if (raiseRange.indexOf(combo) >= 0) {
            return 1;
        }

        return -1;
    }

    isInRangeVsPosition(pos, combo, villain, bet) {
        let rangeSizes = this.preFlopRanges[bet][pos][villain].split('|');

        let rangeSize = parseInt(rangeSizes[0]) + this.ra;
        if (rangeSize < 3) {
            rangeSize = 3;
        }

        if (rangeSize > 36) {
            rangeSize = 36;
        }

        let raiseRange = this.ranges[rangeSize];
        if (raiseRange.indexOf(combo) >= 0) {
            return 1;
        }

        let callSize = parseInt(rangeSizes[1]) + this.ra;
        if (callSize < 3) {
            callSize = 3;
        }

        if (callSize > 36) {
            callSize = 36;
        }

        let callRange = this.ranges[callSize];
        if (callRange.indexOf(combo) >= 0) {
            return 0;
        }

        return -1;
    }


}