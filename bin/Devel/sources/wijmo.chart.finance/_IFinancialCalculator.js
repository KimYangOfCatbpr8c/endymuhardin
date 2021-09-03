var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var finance;
        (function (finance) {
            "use strict";
            // abstract base class for range based calculators
            var _BaseCalculator = (function () {
                function _BaseCalculator(highs, lows, opens, closes) {
                    this.highs = highs;
                    this.lows = lows;
                    this.opens = opens;
                    this.closes = closes;
                }
                _BaseCalculator.prototype.calculate = function () { };
                return _BaseCalculator;
            }());
            finance._BaseCalculator = _BaseCalculator;
            // calculator for Heikin-Ashi plotter - http://bit.ly/1BY55tc
            var _HeikinAshiCalculator = (function (_super) {
                __extends(_HeikinAshiCalculator, _super);
                function _HeikinAshiCalculator(highs, lows, opens, closes) {
                    _super.call(this, highs, lows, opens, closes);
                }
                _HeikinAshiCalculator.prototype.calculate = function () {
                    var len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), haHigh, haLow, haOpen, haClose, retvals = [];
                    if (len <= 0) {
                        return retvals;
                    }
                    for (var i = 0; i < len; i++) {
                        haClose = finance._average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]);
                        if (i === 0) {
                            haOpen = finance._average(this.opens[i], this.closes[i]);
                            haHigh = this.highs[i];
                            haLow = this.lows[i];
                        }
                        else {
                            haOpen = finance._average(retvals[i - 1].open, retvals[i - 1].close);
                            haHigh = Math.max(this.highs[i], haOpen, haClose);
                            haLow = Math.min(this.lows[i], haOpen, haClose);
                        }
                        retvals.push({
                            high: haHigh,
                            low: haLow,
                            close: haClose,
                            open: haOpen,
                            pointIndex: i,
                            x: null
                        });
                    }
                    return retvals;
                };
                return _HeikinAshiCalculator;
            }(_BaseCalculator));
            finance._HeikinAshiCalculator = _HeikinAshiCalculator;
            // abstract base class for range based calculators
            var _BaseRangeCalculator = (function (_super) {
                __extends(_BaseRangeCalculator, _super);
                function _BaseRangeCalculator(highs, lows, opens, closes, xs, size, unit, fields) {
                    _super.call(this, highs, lows, opens, closes);
                    this.xs = xs;
                    this.size = size;
                    this.unit = unit;
                    this.fields = fields;
                }
                // based on "fields" member, return the values to be used for calculations
                //  DataFields.HighLow must be handled in the calculate() method
                _BaseRangeCalculator.prototype._getValues = function () {
                    var values = [], len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), i;
                    switch (this.fields) {
                        case finance.DataFields.High: {
                            values = this.highs;
                            break;
                        }
                        case finance.DataFields.Low: {
                            values = this.lows;
                            break;
                        }
                        case finance.DataFields.Open: {
                            values = this.opens;
                            break;
                        }
                        case finance.DataFields.HL2: {
                            for (i = 0; i < len; i++) {
                                values.push(finance._average(this.highs[i], this.lows[i]));
                            }
                            break;
                        }
                        case finance.DataFields.HLC3: {
                            for (i = 0; i < len; i++) {
                                values.push(finance._average(this.highs[i], this.lows[i], this.closes[i]));
                            }
                            break;
                        }
                        case finance.DataFields.HLOC4: {
                            for (i = 0; i < len; i++) {
                                values.push(finance._average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]));
                            }
                            break;
                        }
                        case finance.DataFields.Close:
                        default: {
                            values = this.closes;
                            break;
                        }
                    }
                    return values;
                };
                _BaseRangeCalculator.prototype._getSize = function () {
                    var atrs = this.unit === finance.RangeMode.ATR ? finance._avgTrueRng(this.highs, this.lows, this.closes, this.size) : null;
                    return this.unit === finance.RangeMode.ATR ? atrs[atrs.length - 1] : this.size;
                };
                return _BaseRangeCalculator;
            }(_BaseCalculator));
            finance._BaseRangeCalculator = _BaseRangeCalculator;
            // calculator for Line Break plotter
            var _LineBreakCalculator = (function (_super) {
                __extends(_LineBreakCalculator, _super);
                function _LineBreakCalculator(highs, lows, opens, closes, xs, size) {
                    _super.call(this, highs, lows, opens, closes, xs, size);
                }
                _LineBreakCalculator.prototype.calculate = function () {
                    var hasXs = this.xs !== null && this.xs.length > 0, len = this.closes.length, retvals = [], rangeValues = [[], []];
                    if (len <= 0) {
                        return retvals;
                    }
                    var tempRngs = [], basePrice, x, close, lbLen, lbIdx, max, min;
                    // start at index of one
                    for (var i = 1; i < len; i++) {
                        lbLen = retvals.length;
                        lbIdx = lbLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        close = this.closes[i];
                        if (lbIdx === -1) {
                            basePrice = this.closes[0];
                            if (basePrice === close) {
                                continue;
                            }
                        }
                        else {
                            if (this._trendExists(rangeValues) || this.size === 1) {
                                tempRngs = rangeValues[0].slice(-this.size).concat(rangeValues[1].slice(-this.size));
                            }
                            else {
                                tempRngs = rangeValues[0].slice(1 - this.size).concat(rangeValues[1].slice(1 - this.size));
                            }
                            max = Math.max.apply(null, tempRngs);
                            min = Math.min.apply(null, tempRngs);
                            if (close > max) {
                                basePrice = Math.max(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                            }
                            else if (close < min) {
                                basePrice = Math.min(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                            }
                            else {
                                continue;
                            }
                        }
                        rangeValues[0].push(basePrice);
                        rangeValues[1].push(close);
                        retvals.push({
                            high: Math.max(basePrice, close),
                            low: Math.min(basePrice, close),
                            open: basePrice,
                            close: close,
                            x: x,
                            pointIndex: i
                        });
                    }
                    return retvals;
                };
                _LineBreakCalculator.prototype._trendExists = function (vals) {
                    if (vals[1].length < this.size) {
                        return false;
                    }
                    var retval = false, t, temp = vals[1].slice(-this.size); // get subset of "current" values based on _newLineBreaks
                    // detect rising trend
                    for (t = 1; t < this.size; t++) {
                        retval = temp[t] > temp[t - 1];
                        if (!retval) {
                            break;
                        }
                    }
                    // detect falling trend
                    if (!retval) {
                        for (t = 1; t < this.size; t++) {
                            retval = temp[t] < temp[t - 1];
                            if (!retval) {
                                break;
                            }
                        }
                    }
                    return retval;
                };
                return _LineBreakCalculator;
            }(_BaseRangeCalculator));
            finance._LineBreakCalculator = _LineBreakCalculator;
            // calculator for Kagi plotter
            var _KagiCalculator = (function (_super) {
                __extends(_KagiCalculator, _super);
                function _KagiCalculator(highs, lows, opens, closes, xs, size, unit, field) {
                    _super.call(this, highs, lows, opens, closes, xs, size, unit, field);
                }
                _KagiCalculator.prototype.calculate = function () {
                    var reversal = this._getSize(), len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), values = this._getValues(), hasXs = this.xs !== null && this.xs.length > 0, retvals = [], rangeValues = [[], []];
                    if (len <= 0) {
                        return retvals;
                    }
                    var basePrice, x, current, rLen, rIdx, min, max, diff, extend, pointIndex;
                    for (var i = 1; i < len; i++) {
                        rLen = retvals.length;
                        rIdx = rLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        pointIndex = i;
                        extend = false;
                        // set current value
                        if (this.fields === finance.DataFields.HighLow) {
                            if (rIdx === -1) {
                                if (this.highs[i] > this.highs[0]) {
                                    current = this.highs[i];
                                }
                                else if (this.lows[i] < this.lows[0]) {
                                    current = this.lows[i];
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                                if (diff > 0) {
                                    if (this.highs[i] > rangeValues[1][rIdx]) {
                                        current = this.highs[i];
                                    }
                                    else if (this.lows[i] < rangeValues[1][rIdx]) {
                                        current = this.lows[i];
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                else {
                                    if (this.lows[i] < rangeValues[1][rIdx]) {
                                        current = this.lows[i];
                                    }
                                    else if (this.highs[i] > rangeValues[1][rIdx]) {
                                        current = this.highs[i];
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                        }
                        else {
                            current = values[i];
                        }
                        // set reversal for percentage-based charts
                        if (this.unit === finance.RangeMode.Percentage) {
                            reversal = current * this.size;
                        }
                        // set base price value
                        if (rIdx === -1) {
                            x = hasXs ? this.xs[0] : 0;
                            pointIndex = 0;
                            if (this.fields === finance.DataFields.HighLow) {
                                basePrice = this.highs[0];
                            }
                            else {
                                basePrice = values[0];
                            }
                            diff = Math.abs(basePrice - current);
                            if (diff < reversal) {
                                continue;
                            }
                        }
                        else {
                            diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                            max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                            min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                            if (diff > 0) {
                                if (current > max) {
                                    extend = true;
                                }
                                else {
                                    diff = max - current;
                                    if (diff >= reversal) {
                                        basePrice = max;
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                            else {
                                if (current < min) {
                                    extend = true;
                                }
                                else {
                                    diff = current - min;
                                    if (diff >= reversal) {
                                        basePrice = min;
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                        }
                        if (extend) {
                            rangeValues[1][rIdx] = current;
                            retvals[rIdx].close = current;
                            retvals[rIdx].high = Math.max(retvals[rIdx].open, retvals[rIdx].close);
                            retvals[rIdx].low = Math.min(retvals[rIdx].open, retvals[rIdx].close);
                        }
                        else {
                            rangeValues[0].push(basePrice);
                            rangeValues[1].push(current);
                            retvals.push({
                                high: Math.max(basePrice, current),
                                low: Math.min(basePrice, current),
                                open: basePrice,
                                close: current,
                                x: x,
                                pointIndex: pointIndex
                            });
                        }
                    }
                    return retvals;
                };
                return _KagiCalculator;
            }(_BaseRangeCalculator));
            finance._KagiCalculator = _KagiCalculator;
            // calculator for Renko plotter
            var _RenkoCalculator = (function (_super) {
                __extends(_RenkoCalculator, _super);
                function _RenkoCalculator(highs, lows, opens, closes, xs, size, unit, field, rounding) {
                    if (rounding === void 0) { rounding = false; }
                    _super.call(this, highs, lows, opens, closes, xs, size, unit, field);
                    // internal only
                    this.rounding = rounding;
                }
                _RenkoCalculator.prototype.calculate = function () {
                    var size = this._getSize(), len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), hasXs = this.xs !== null && this.xs.length > 0, values = this._getValues(), retvals = [], rangeValues = [[], []];
                    if (len <= 0) {
                        return retvals;
                    }
                    var basePrice, x, current, rLen, rIdx, min, max, diff;
                    // start at index of one
                    for (var i = 1; i < len; i++) {
                        rLen = retvals.length;
                        rIdx = rLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        // todo: not working correctly, figure out
                        // set basePrice and current for DataFields == HighLow
                        if (this.fields === finance.DataFields.HighLow) {
                            if (rIdx === -1) {
                                if (this.highs[i] - this.highs[0] > size) {
                                    basePrice = this.highs[0];
                                    current = this.highs[i];
                                }
                                else if (this.lows[0] - this.lows[i] > size) {
                                    basePrice = this.lows[0];
                                    current = this.lows[i];
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                if ((this.highs[i] - max) > size) {
                                    basePrice = max;
                                    current = this.highs[i];
                                }
                                else if ((min - this.lows[i]) > size) {
                                    basePrice = min;
                                    current = this.lows[i];
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                        else {
                            // DataFields != HighLow
                            // current price
                            current = values[i];
                            // set "base price"
                            if (rIdx === -1) {
                                basePrice = values[0];
                            }
                            else {
                                min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                if (current > max) {
                                    basePrice = max;
                                }
                                else if (current < min) {
                                    basePrice = min;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                        diff = current - basePrice;
                        if (Math.abs(diff) < size) {
                            continue;
                        }
                        // determine number of boxes to add
                        diff = finance._trunc(diff / size);
                        // append ranges and x's
                        for (var j = 0; j < Math.abs(diff); j++) {
                            var rng = {};
                            // note StockCharts adjusts based on size
                            if (this.rounding) {
                                basePrice = this._round(basePrice, size);
                            }
                            rangeValues[0].push(basePrice);
                            rng.open = basePrice;
                            basePrice = diff > 0 ? basePrice + size : basePrice - size;
                            rangeValues[1].push(basePrice);
                            rng.close = basePrice;
                            rng.x = x;
                            rng.pointIndex = i;
                            rng.high = Math.max(rng.open, rng.close);
                            rng.low = Math.min(rng.open, rng.close);
                            retvals.push(rng);
                        }
                    }
                    return retvals;
                };
                // internal only - for StockCharts rounding
                _RenkoCalculator.prototype._round = function (value, size) {
                    return Math.round(value / size) * size;
                };
                return _RenkoCalculator;
            }(_BaseRangeCalculator));
            finance._RenkoCalculator = _RenkoCalculator;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_IFinancialCalculator.js.map