var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var finance;
        (function (finance) {
            "use strict";
            // simplified version of experimental Math.trunc()
            // Math.trunc() on MDN: http://mzl.la/1BY3vHE
            function _trunc(value) {
                wijmo.asNumber(value, true, false);
                return value > 0 ? Math.floor(value) : Math.ceil(value);
            }
            finance._trunc = _trunc;
            function _sum(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return values.reduce(function (prev, curr) { return prev + wijmo.asNumber(curr); }, 0);
            }
            finance._sum = _sum;
            function _average(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return _sum(values) / values.length;
            }
            finance._average = _average;
            function _minimum(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return Math.min.apply(null, values);
            }
            finance._minimum = _minimum;
            function _maximum(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return Math.max.apply(null, values);
            }
            finance._maximum = _maximum;
            function _variance(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                var mean = _average(values), diffs = values.map(function (value) { return Math.pow(value - mean, 2); });
                return _average(diffs);
            }
            finance._variance = _variance;
            function _stdDeviation(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return Math.sqrt(_variance(values));
            }
            finance._stdDeviation = _stdDeviation;
            // calculate Average True Range for a set of financial data
            function _avgTrueRng(highs, lows, closes, period) {
                if (period === void 0) { period = 14; }
                wijmo.asArray(highs, false);
                wijmo.asArray(lows, false);
                wijmo.asArray(closes, false);
                wijmo.asInt(period, false, true);
                var trs = _trueRng(highs, lows, closes, period), len = Math.min(highs.length, lows.length, closes.length, trs.length), atrs = [];
                wijmo.assert(len > period && period > 1, "Average True Range period must be an integer less than the length of the data and greater than one.");
                for (var i = 0; i < len; i++) {
                    wijmo.asNumber(highs[i], false);
                    wijmo.asNumber(lows[i], false);
                    wijmo.asNumber(closes[i], false);
                    wijmo.asNumber(trs[i], false);
                    if ((i + 1) === period) {
                        atrs.push(_average(trs.slice(0, period)));
                    }
                    else if ((i + 1) > period) {
                        atrs.push(((period - 1) * atrs[atrs.length - 1] + trs[i]) / period);
                    }
                }
                return atrs;
            }
            finance._avgTrueRng = _avgTrueRng;
            // calculate True Range for a set of financial data
            function _trueRng(highs, lows, closes, period) {
                if (period === void 0) { period = 14; }
                wijmo.asArray(highs, false);
                wijmo.asArray(lows, false);
                wijmo.asArray(closes, false);
                wijmo.asInt(period, false, true);
                var len = Math.min(highs.length, lows.length, closes.length), trs = [];
                wijmo.assert(len > period && period > 1, "True Range period must be an integer less than the length of the data and greater than one.");
                for (var i = 0; i < len; i++) {
                    wijmo.asNumber(highs[i], false);
                    wijmo.asNumber(lows[i], false);
                    wijmo.asNumber(closes[i], false);
                    if (i === 0) {
                        trs.push(highs[i] - lows[i]);
                    }
                    else {
                        trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
                    }
                }
                return trs;
            }
            finance._trueRng = _trueRng;
            // simple moving average
            function _sma(values, period) {
                wijmo.asArray(values, false);
                wijmo.asNumber(period, false, true);
                wijmo.assert(values.length > period && period > 1, "Simple Moving Average period must be an integer less than the length of the data and greater than one.");
                var retval = [];
                for (var i = period; i <= values.length; i++) {
                    retval.push(_average(values.slice(i - period, i)));
                }
                return retval;
            }
            finance._sma = _sma;
            // exponential moving average
            function _ema(values, period) {
                wijmo.asArray(values, false);
                wijmo.asNumber(period, false, true);
                wijmo.assert(values.length > period && period > 1, "Exponential Moving Average period must be an integer less than the length of the data and greater than one.");
                var retval = [], multiplier = 2 / (period + 1), smas = _sma(values, period);
                values = values.slice(period - 1);
                for (var i = 0; i < values.length; i++) {
                    if (i === 0) {
                        retval.push(smas[0]);
                    }
                    else {
                        retval.push((values[i] - retval[i - 1]) * multiplier + retval[i - 1]);
                    }
                }
                return retval;
            }
            finance._ema = _ema;
            // generate a range of numbers
            function _range(begin, end, step) {
                if (step === void 0) { step = 1; }
                wijmo.asNumber(begin, false);
                wijmo.asNumber(end, false);
                wijmo.asNumber(step, false);
                wijmo.assert(begin < end, "begin argument must be less than end argument.");
                var retval = [];
                for (var i = begin; i <= end; i += step) {
                    retval.push(i);
                }
                return retval;
            }
            finance._range = _range;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Utils.js.map