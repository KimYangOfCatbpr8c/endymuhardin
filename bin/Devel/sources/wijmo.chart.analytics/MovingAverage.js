var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Specifies the type of MovingAverage Series.
             */
            (function (MovingAverageType) {
                /**
                 * An average of the last n values.
                 */
                MovingAverageType[MovingAverageType["Simple"] = 0] = "Simple";
                /**
                 * Weighted average of the last n values,
                 * where the weightage decreases by 1 with each previous value.
                 */
                MovingAverageType[MovingAverageType["Weighted"] = 1] = "Weighted";
                /**
                 * Weighted average of the last n values,
                 * where the weightage decreases exponentially with each previous value.
                 */
                MovingAverageType[MovingAverageType["Exponential"] = 2] = "Exponential";
                /**
                 * Weighted average of the last n values,
                 * whose result is equivalent to a double smoothed simple moving average.
                 */
                MovingAverageType[MovingAverageType["Triangular"] = 3] = "Triangular";
            })(analytics.MovingAverageType || (analytics.MovingAverageType = {}));
            var MovingAverageType = analytics.MovingAverageType;
            /**
             * Represents a moving average trendline for @see:FlexChart and @see:FinancialChart.
             * It is a calculation to analyze data points by creating a series of averages of
             * different subsets of the full data set. You may define a different type on each
             * @see:MovingAverage object by setting the type property on the MovingAverage itself.
             * The MovingAverage class has a period property that allows you to set the number of
             * periods for computing the average value.
             */
            var MovingAverage = (function (_super) {
                __extends(MovingAverage, _super);
                /**
                 * Initializes a new instance of the @see:MovingAverage class.
                 *
                 * @param options A JavaScript object containing initialization data for the MovingAverage Series.
                 */
                function MovingAverage(options) {
                    _super.call(this, options);
                    this._chartType = chart.ChartType.Line;
                }
                Object.defineProperty(MovingAverage.prototype, "type", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the type of the moving average series.
                     */
                    get: function () {
                        return this._type;
                    },
                    set: function (value) {
                        if (value === this._type) {
                            return;
                        }
                        this._type = wijmo.asEnum(value, MovingAverageType, false);
                        this._invalidate();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MovingAverage.prototype, "period", {
                    /**
                     * Gets or sets the period of the moving average series.
                     * It should be set to integer value greater than 1.
                     */
                    get: function () {
                        return this._period;
                    },
                    set: function (value) {
                        if (value === this._period) {
                            return;
                        }
                        this._period = wijmo.asNumber(value, false, true);
                        this._invalidate();
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                MovingAverage.prototype._initProperties = function (o) {
                    this._period = 2;
                    this._type = MovingAverageType.Simple;
                    _super.prototype._initProperties.call(this, o);
                };
                MovingAverage.prototype._checkPeriod = function () {
                    var period = this.period, oriXVals = this._originXValues;
                    if (period <= 1) {
                        wijmo.assert(false, "period must be greater than 1.");
                    }
                    if (oriXVals && oriXVals.length && period >= oriXVals.length) {
                        wijmo.assert(false, "period must be less than itemSource's length.");
                    }
                };
                MovingAverage.prototype._calculateValues = function () {
                    var self = this, type = self._type, funcName = "_calculate" + MovingAverageType[self._type], x = [], y = [];
                    self._checkPeriod();
                    if (self[funcName]) {
                        self[funcName].call(self, x, y);
                    }
                    self._yValues = y;
                    self._xValues = x;
                };
                MovingAverage.prototype._calculateSimple = function (x, y, forTMA) {
                    if (forTMA === void 0) { forTMA = false; }
                    var self = this, ox = self._originXValues, oy = self._originYValues, len = ox.length, p = self._period, i, total = 0;
                    for (i = 0; i < len; i++) {
                        total += oy[i];
                        if (i >= p) {
                            total -= oy[i - p];
                        }
                        if (i >= p - 1) {
                            x.push(ox[i]);
                            y.push(total / p);
                        }
                        else if (forTMA) {
                            x.push(ox[i]);
                            y.push(total / (i + 1));
                        }
                    }
                };
                MovingAverage.prototype._calculateWeighted = function (x, y) {
                    var self = this, ox = self._originXValues, oy = self._originYValues, len = ox.length, p = self._period, denominator = p * (p + 1) / 2, i, total = 0, numerator = 0;
                    for (i = 0; i < len; i++) {
                        if (i > 0) {
                            total += oy[i - 1];
                        }
                        if (i > p) {
                            total -= oy[i - p - 1];
                        }
                        if (i < p - 1) {
                            numerator += oy[i] * (i + 1);
                        }
                        else {
                            numerator += oy[i] * p;
                            if (i > p - 1) {
                                numerator -= total;
                            }
                            x.push(ox[i]);
                            y.push(numerator / denominator);
                        }
                    }
                };
                MovingAverage.prototype._calculateExponential = function (x, y) {
                    var self = this, ox = self._originXValues, oy = self._originYValues, len = ox.length, p = self._period, i, ema = 0;
                    for (i = 0; i < len; i++) {
                        if (i <= p - 2) {
                            ema += oy[i];
                            if (i === p - 2) {
                                ema /= p - 1;
                            }
                            continue;
                        }
                        ema = ema + (2 / (p + 1)) * (oy[i] - ema);
                        x.push(ox[i]);
                        y.push(ema);
                    }
                };
                MovingAverage.prototype._calculateTriangular = function (x, y) {
                    var self = this, p = self._period, ox = [], oy = [], i, len, total = 0;
                    self._calculateSimple(ox, oy, true);
                    for (i = 0, len = ox.length; i < len; i++) {
                        total += oy[i];
                        if (i >= p) {
                            total -= oy[i - p];
                        }
                        if (i >= p - 1) {
                            x.push(ox[i]);
                            y.push(total / p);
                        }
                    }
                };
                return MovingAverage;
            }(analytics.TrendLineBase));
            analytics.MovingAverage = MovingAverage;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=MovingAverage.js.map