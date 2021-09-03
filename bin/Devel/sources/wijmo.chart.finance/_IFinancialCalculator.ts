module wijmo.chart.finance {
    "use strict";

    // represents a common return value for calculator implementations
    //  no need for concrete type
    export interface _IFinanceItem {
        high: number;   // max value of start/end
        low: number;    // min value of start/end
        open: number;   // i.e. range start
        close: number;  // i.e. range end
        x: number;
        pointIndex: number; // serves as the original (current) point index
    }

    // common interface for all calculators
    export interface _IFinancialCalculator {
        highs: number[];
        lows: number[];
        opens: number[];
        closes: number[];
        xs?: number[];  // all but heikin-ashi
        size?: number;  // all but heikin-ashi
        unit?: RangeMode; // renko and kagi
        fields?: DataFields; // renko and kagi
        calculate(): any;
    }

    // abstract base class for range based calculators
    export class _BaseCalculator implements _IFinancialCalculator {
        highs: number[];
        lows: number[];
        opens: number[];
        closes: number[];

        constructor(highs: number[], lows: number[], opens: number[], closes: number[]) {
            this.highs = highs;
            this.lows = lows;
            this.opens = opens;
            this.closes = closes;
        }

        calculate(): any { }
    }

    // calculator for Heikin-Ashi plotter - http://bit.ly/1BY55tc
    export class _HeikinAshiCalculator extends _BaseCalculator {
        constructor(highs: number[], lows: number[], opens: number[], closes: number[]) {
            super(highs, lows, opens, closes);
        }

        calculate(): _IFinanceItem[] {
            var len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                haHigh: number, haLow: number, haOpen: number, haClose: number,
                retvals: _IFinanceItem[] = [];

            if (len <= 0) { return retvals; }

            for (var i = 0; i < len; i++) {
                haClose = _average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]);

                if (i === 0) {
                    haOpen = _average(this.opens[i], this.closes[i]);
                    haHigh = this.highs[i];
                    haLow = this.lows[i];
                } else {
                    haOpen = _average(retvals[i - 1].open, retvals[i - 1].close);
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
        }
    }

    // abstract base class for range based calculators
    export class _BaseRangeCalculator extends _BaseCalculator {
        xs: number[];
        size: number;
        unit: RangeMode;
        fields: DataFields;

        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit?: RangeMode, fields?: DataFields) {
            super(highs, lows, opens, closes);
            this.xs = xs;
            this.size = size;
            this.unit = unit;
            this.fields = fields;
        }

        // based on "fields" member, return the values to be used for calculations
        //  DataFields.HighLow must be handled in the calculate() method
        _getValues(): number[] {
            var values: number[] = [],
                len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                i: number;

            switch (this.fields) {
                case DataFields.High: {
                    values = this.highs;
                    break;
                }
                case DataFields.Low: {
                    values = this.lows;
                    break;
                }
                case DataFields.Open: {
                    values = this.opens;
                    break;
                }
                case DataFields.HL2: {
                    for (i = 0; i < len; i++) {
                        values.push(_average(this.highs[i], this.lows[i]));
                    }
                    break;
                }
                case DataFields.HLC3: {
                    for (i = 0; i < len; i++) {
                        values.push(_average(this.highs[i], this.lows[i], this.closes[i]));
                    }
                    break;
                }
                case DataFields.HLOC4: {
                    for (i = 0; i < len; i++) {
                        values.push(_average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]));
                    }
                    break;
                }
                case DataFields.Close:
                default: {
                    values = this.closes;
                    break;
                }
            }

            return values;
        }

        _getSize(): number {
            var atrs = this.unit === RangeMode.ATR ? _avgTrueRng(this.highs, this.lows, this.closes, this.size) : null;
            return this.unit === RangeMode.ATR ? atrs[atrs.length - 1] : this.size;
        }
    }

    // calculator for Line Break plotter
    export class _LineBreakCalculator extends _BaseRangeCalculator {
        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number) {
            super(highs, lows, opens, closes, xs, size);
        }

        calculate(): _IFinanceItem[] {
            var hasXs = this.xs !== null && this.xs.length > 0,
                len = this.closes.length,
                retvals: _IFinanceItem[] = [],
                rangeValues: number[][] = [[], []];

            if (len <= 0) { return retvals; }

            var tempRngs: number[] = [],
                basePrice: number,
                x: number, close: number,
                lbLen: number, lbIdx: number,
                max: number, min: number;

            // start at index of one
            for (var i = 1; i < len; i++) {
                lbLen = retvals.length;
                lbIdx = lbLen - 1;
                x = hasXs ? this.xs[i] : i;
                close = this.closes[i];

                if (lbIdx === -1) {
                    basePrice = this.closes[0];
                    if (basePrice === close) { continue; }
                } else {
                    if (this._trendExists(rangeValues) || this.size === 1) {
                        tempRngs = rangeValues[0].slice(-this.size).concat(rangeValues[1].slice(-this.size));
                    } else {
                        tempRngs = rangeValues[0].slice(1 - this.size).concat(rangeValues[1].slice(1 - this.size));
                    }

                    max = Math.max.apply(null, tempRngs);
                    min = Math.min.apply(null, tempRngs);

                    if (close > max) {
                        basePrice = Math.max(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                    } else if (close < min) {
                        basePrice = Math.min(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                    } else {
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
        }

        private _trendExists(vals: number[][]) {
            if (vals[1].length < this.size) { return false; }

            var retval = false,
                t: number,
                temp = vals[1].slice(-this.size);   // get subset of "current" values based on _newLineBreaks

            // detect rising trend
            for (t = 1; t < this.size; t++) {
                retval = temp[t] > temp[t - 1];
                if (!retval) { break; }
            }
            // detect falling trend
            if (!retval) {
                for (t = 1; t < this.size; t++) {
                    retval = temp[t] < temp[t - 1];
                    if (!retval) { break; }
                }
            }

            return retval;
        }
    }

    // calculator for Kagi plotter
    export class _KagiCalculator extends _BaseRangeCalculator {
        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit: RangeMode, field: DataFields) {
            super(highs, lows, opens, closes, xs, size, unit, field);
        }

        calculate(): _IFinanceItem[] {
            var reversal = this._getSize(),
                len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                values = this._getValues(),
                hasXs = this.xs !== null && this.xs.length > 0,
                retvals: _IFinanceItem[] = [],
                rangeValues: number[][] = [[], []];

            if (len <= 0) { return retvals; }

            var basePrice: number,
                x: number, current: number,
                rLen: number, rIdx: number,
                min: number, max: number,
                diff: number, extend: boolean,
                pointIndex: number;

            for (var i = 1; i < len; i++) {
                rLen = retvals.length;
                rIdx = rLen - 1;
                x = hasXs ? this.xs[i] : i;
                pointIndex = i;
                extend = false;

                // set current value
                if (this.fields === DataFields.HighLow) {
                    if (rIdx === -1) {
                        if (this.highs[i] > this.highs[0]) {
                            current = this.highs[i];
                        } else if (this.lows[i] < this.lows[0]) {
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    } else {
                        diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                        if (diff > 0) {
                            if (this.highs[i] > rangeValues[1][rIdx]) {
                                current = this.highs[i];
                            } else if (this.lows[i] < rangeValues[1][rIdx]) {
                                current = this.lows[i];
                            } else {
                                continue;
                            }
                        } else {
                            if (this.lows[i] < rangeValues[1][rIdx]) {
                                current = this.lows[i];
                            } else if (this.highs[i] > rangeValues[1][rIdx]) {
                                current = this.highs[i];
                            } else {
                                continue;
                            }
                        }
                    }
                } else {
                    current = values[i];
                }

                // set reversal for percentage-based charts
                if (this.unit === RangeMode.Percentage) {
                    reversal = current * this.size;
                }

                // set base price value
                if (rIdx === -1) {
                    x = hasXs ? this.xs[0] : 0;
                    pointIndex = 0;
                    if (this.fields === DataFields.HighLow) {
                        basePrice = this.highs[0];
                    } else {
                        basePrice = values[0];
                    }
                    diff = Math.abs(basePrice - current);
                    if (diff < reversal) { continue; }
                } else {
                    diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                    max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                    min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);

                    if (diff > 0) { // up
                        if (current > max) {
                            extend = true;
                        } else {
                            diff = max - current;
                            if (diff >= reversal) { // back down
                                basePrice = max;
                            } else {
                                continue;
                            }
                        }
                    } else {    // down
                        if (current < min) {
                            extend = true;
                        } else {
                            diff = current - min;
                            if (diff >= reversal) { // back up
                                basePrice = min;
                            } else {
                                continue;
                            }
                        }
                    }
                }

                if (extend) {   // extend the current range
                    rangeValues[1][rIdx] = current;

                    retvals[rIdx].close = current;
                    retvals[rIdx].high = Math.max(retvals[rIdx].open, retvals[rIdx].close);
                    retvals[rIdx].low = Math.min(retvals[rIdx].open, retvals[rIdx].close);
                } else {    // new range
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
        }
    }

    // calculator for Renko plotter
    export class _RenkoCalculator extends _BaseRangeCalculator {
        rounding: boolean;
        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit: RangeMode, field: DataFields, rounding: boolean = false) {
            super(highs, lows, opens, closes, xs, size, unit, field);

            // internal only
            this.rounding = rounding;
        }

        calculate(): _IFinanceItem[] {
            var size = this._getSize(),
                len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                hasXs = this.xs !== null && this.xs.length > 0,
                values = this._getValues(),
                retvals: _IFinanceItem[] = [],
                rangeValues: number[][] = [[], []];

            if (len <= 0) { return retvals; }

            var basePrice: number,
                x: number, current: number,
                rLen: number, rIdx: number,
                min: number, max: number,
                diff: number;

            // start at index of one
            for (var i = 1; i < len; i++) {
                rLen = retvals.length;
                rIdx = rLen - 1;
                x = hasXs ? this.xs[i] : i;

                // todo: not working correctly, figure out
                // set basePrice and current for DataFields == HighLow
                if (this.fields === DataFields.HighLow) {
                    if (rIdx === -1) {
                        if (this.highs[i] - this.highs[0] > size) {
                            basePrice = this.highs[0];
                            current = this.highs[i];
                        } else if (this.lows[0] - this.lows[i] > size) {
                            basePrice = this.lows[0];
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    } else {
                        min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        if ((this.highs[i] - max) > size) {
                            basePrice = max;
                            current = this.highs[i];
                        } else if ((min - this.lows[i]) > size) {
                            basePrice = min;
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    }
                } else {    // set basePrice & current for
                            // DataFields != HighLow
                    // current price
                    current = values[i];

                    // set "base price"
                    if (rIdx === -1) {
                        basePrice = values[0];
                    } else {
                        min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        if (current > max) {
                            basePrice = max;
                        } else if (current < min) {
                            basePrice = min;
                        } else {
                            continue;
                        }
                    }
                }

                diff = current - basePrice;
                if (Math.abs(diff) < size) { continue; }

                // determine number of boxes to add
                diff = _trunc(diff / size);

                // append ranges and x's
                for (var j = 0; j < Math.abs(diff); j++) {
                    var rng: any = {};

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
        }

        // internal only - for StockCharts rounding
        _round(value: number, size: number): number {
            return Math.round(value / size) * size;
        }
    }
}