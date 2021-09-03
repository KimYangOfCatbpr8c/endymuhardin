module wijmo.chart.finance {
    "use strict";

    // simplified version of experimental Math.trunc()
    // Math.trunc() on MDN: http://mzl.la/1BY3vHE
    export function _trunc(value: number): number {
        asNumber(value, true, false);
        return value > 0 ? Math.floor(value) : Math.ceil(value);
    }

    // sum a set of numbers
    export function _sum(...values: number[]): number;
    export function _sum(values: number[]): number;
    export function _sum(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return values.reduce((prev: number, curr: number) => prev + asNumber(curr), 0);
    }

    // average a set of numbers
    export function _average(...values: number[]): number;
    export function _average(values: number[]): number;
    export function _average(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return _sum(values) / values.length;
    }

    // minimum value for a set of numbers
    export function _minimum(...values: number[]): number;
    export function _minimum(values: number[]): number;
    export function _minimum(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return Math.min.apply(null, values);
    }

    // maximum value for a set of numbers
    export function _maximum(...values: number[]): number;
    export function _maximum(values: number[]): number;
    export function _maximum(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return Math.max.apply(null, values);
    }

    // returns variance for a set of numbers
    export function _variance(...values: number[]): number;
    export function _variance(values: number[]): number;
    export function _variance(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        var mean = _average(values),
            diffs = values.map((value: number) => Math.pow(value - mean, 2));
        return _average(diffs);
    }

    // returns standard deviation for a set of numbers
    export function _stdDeviation(...values: number[]): number;
    export function _stdDeviation(values: number[]): number;
    export function _stdDeviation(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return Math.sqrt(_variance(values));
    }

    // calculate Average True Range for a set of financial data
    export function _avgTrueRng(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(period, false, true);

        var trs = _trueRng(highs, lows, closes, period),
            len = Math.min(highs.length, lows.length, closes.length, trs.length),
            atrs: number[] = [];
        assert(len > period && period > 1, "Average True Range period must be an integer less than the length of the data and greater than one.");

        for (var i = 0; i < len; i++) {
            asNumber(highs[i], false); asNumber(lows[i], false); asNumber(closes[i], false); asNumber(trs[i], false);

            if ((i + 1) === period) {
                atrs.push(_average(trs.slice(0, period)));
            } else if ((i + 1) > period) {
                atrs.push(((period - 1) * atrs[atrs.length - 1] + trs[i]) / period);
            }
        }

        return atrs;
    }

    // calculate True Range for a set of financial data
    export function _trueRng(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(period, false, true);

        var len = Math.min(highs.length, lows.length, closes.length),
            trs: number[] = [];
        assert(len > period && period > 1, "True Range period must be an integer less than the length of the data and greater than one.");

        for (var i = 0; i < len; i++) {
            asNumber(highs[i], false); asNumber(lows[i], false); asNumber(closes[i], false);

            if (i === 0) {
                trs.push(highs[i] - lows[i]);
            } else {
                trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
            }
        }

        return trs;
    }

    // simple moving average
    export function _sma(values: number[], period: number): number[] {
        asArray(values, false);
        asNumber(period, false, true);
        assert(values.length > period && period > 1, "Simple Moving Average period must be an integer less than the length of the data and greater than one.");

        var retval: number[] = [];

        for (var i = period; i <= values.length; i++) {
            retval.push(_average(values.slice(i - period, i)));
        }

        return retval;
    }

    // exponential moving average
    export function _ema(values: number[], period: number): number[] {
        asArray(values, false);
        asNumber(period, false, true);
        assert(values.length > period && period > 1, "Exponential Moving Average period must be an integer less than the length of the data and greater than one.");

        var retval: number[] = [],
            multiplier = 2 / (period + 1),
            smas = _sma(values, period);

        values = values.slice(period - 1);

        for (var i = 0; i < values.length; i++) {
            if (i === 0) {
                retval.push(smas[0]);
            } else {
                retval.push((values[i] - retval[i - 1]) * multiplier + retval[i - 1]);
            }
        }

        return retval;
    }

    // generate a range of numbers
    export function _range(begin: number, end: number, step: number = 1): number[] {
        asNumber(begin, false);
        asNumber(end, false);
        asNumber(step, false);
        assert(begin < end, "begin argument must be less than end argument.");

        var retval: number[] = [];

        for (var i = begin; i <= end; i += step) {
            retval.push(i);
        }

        return retval;
    }
}