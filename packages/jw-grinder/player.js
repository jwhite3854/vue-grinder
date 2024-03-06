import {Strategy} from './strategy.js';

export const Player = class {

    constructor(settings) {
        this.name = settings.name;
        this.strategy = new Strategy(settings.rac, settings.agg);
    
        this.bankroll = 2000000;
        this.gameStats = {
            "games": 0,
            "wins": 0,
            "opportunities": 0,
            "openOpportunities": 0,
            "open": 0,
            "pfraise": 0,
            "pfcall": 0,
            "pffold": 0,
            "raise": 0,
            "call": 0,
            "fold": 0,
            "allin": 0,
        }
    
        this.bbwon = 0;
        this.bblost = 0;
        this.stack = 0;
        this.position = '';
    }

    getVPIP() {
        let pip = this.gameStats.open + this.gameStats.pfcall + this.gameStats.pfraise;
        pip += this.gameStats.raise + this.gameStats.call + this.gameStats.allin;
        let vpipDivisor = Math.max((this.gameStats.opportunities+this.gameStats.openOpportunities), 1);

        return Math.floor(pip/vpipDivisor*10000)/100;;
    }

    getPFR() {
        return Math.floor(this.gameStats.pfraise/this.gameStats.opportunities*10000)/100;
    }

    getStatsString() {
        let VPIP, PFOR, PF3B, WINR, BB100;

        let oppsDivisor = Math.max(this.gameStats.opportunities, 1);
        let openOppsDivisor = Math.max(this.gameStats.openOpportunities, 1);

        VPIP = this.getVPIP();
        WINR = Math.floor(this.gameStats.wins/this.gameStats.games*10000)/100;
        PFOR = Math.floor(this.gameStats.open/openOppsDivisor*10000)/100;
        PF3B = Math.floor(this.gameStats.pfraise/oppsDivisor*10000)/100;
        BB100 = Math.abs((this.bbwon-this.bblost)/100);

        let results = "VPIP: " + VPIP.toFixed(2).padStart(5, '0') + ", PFR: " + PFOR.toFixed(2).padStart(5, '0') + ", PF3: ";
        results += PF3B.toFixed(2).padStart(5, '0') + ", WR: " + WINR.toFixed(2).padStart(5, '0') + ", BB/100: ";
        results += ((this.bbwon-this.bblost) >= 0 ? "+" : "-" ) + BB100.toFixed(2).padStart(5, '00');

        return results;
    }

    logBBWon(bb, logWin = true) {
        if (logWin) {
            this.gameStats.wins++;
        }
        this.bbwon += bb;
    }

    logBBLost(bb) {
        this.bblost += bb;
    }

    doOpen(pos, combo) {
        this.gameStats.openOpportunities++;
        let action = this.strategy.isInOpenRange(pos, combo);

        if (action > 0) {
            this.gameStats.open++;
        } else if (action < 0) {
            this.gameStats.pffold++;
        }

        return (action >= 0);
    }

    getOpenAmount(pos, bigBlind) {
        let raise = this.strategy.getOpenRaise(pos, bigBlind);
        if (raise > this.stack) {
            raise = this.stack;
        }

        return raise;
    }

    getRaiseAmount(lastRaise, effectiveStackSize) {
        let raise =  this.strategy.getRaise(lastRaise)
        if (raise > effectiveStackSize) {
            raise = effectiveStackSize;
        }

        return raise;
    }

    doPrefloAllin(pos, combo) {
        this.gameStats.opportunities++;

        if (this.strategy.isInAllinRange(pos, combo) > 0) {
            this.gameStats.allin++;

            return true;
        }

        this.gameStats.pffold++;
        return false;
    }

    doPreflopAction(pos, seat, villain, betCt) {
        this.gameStats.opportunities++;
        let action = this.strategy.isInRangeVsPosition(pos, seat.combo, villain, betCt);

        if (action > 0) {
            this.gameStats.pfraise++;
        } else if (action < 0) {
            this.gameStats.pffold++;
        } else {
            this.gameStats.pfcall++;
        }

        return action;
    }
}