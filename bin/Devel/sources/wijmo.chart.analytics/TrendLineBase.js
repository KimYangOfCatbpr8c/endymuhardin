var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines classes that add analytics features to charts including @see:TrendLine,
 * @see:MovingAverage and @see:FunctionSeries.
 */
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Represents base class for various trend lines.
             */
            var TrendLineBase = (function (_super) {
                __extends(TrendLineBase, _super);
                /**
                 * Initializes a new instance of the @see:TrendLineBase class.
                 *
                 * @param options A JavaScript object containing initialization data for the TrendLineBase Series.
                 */
                function TrendLineBase(options) {
                    _super.call(this);
                    this._chartType = chart.ChartType.Line;
                    this._initProperties(options || {});
                }
                Object.defineProperty(TrendLineBase.prototype, "sampleCount", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the sample count for function calculation.
                     * The property doesn't apply for MovingAverage.
                     */
                    get: function () {
                        return this._sampleCount;
                    },
                    set: function (value) {
                        if (value === this._sampleCount) {
                            return;
                        }
                        this._sampleCount = wijmo.asNumber(value, false, true);
                        this._invalidate();
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                /**
                 * Gets the approximate y value from the given x value.
                 *
                 * @param x The x value to be used for calculating the Y value.
                 */
                TrendLineBase.prototype.approximate = function (x) {
                    return 0;
                };
                TrendLineBase.prototype.getValues = function (dim) {
                    var self = this, bind = self.binding, bindX = self.bindingX;
                    //reset binding and bindingX to trendline base.
                    if (bind !== self._bind) {
                        self._bind = bind;
                        self.binding = bind;
                    }
                    if (bindX !== self._bindX) {
                        self._bindX = bindX;
                        self.bindingX = bindX;
                    }
                    if (self._originYValues == null) {
                        self._originYValues = _super.prototype.getValues.call(this, 0);
                    }
                    if (self._originXValues == null) {
                        self._originXValues = _super.prototype.getValues.call(this, 1);
                    }
                    if (self._originXValues == null || self._originYValues == null) {
                        return null;
                    }
                    _super.prototype.getValues.call(this, dim);
                    if (self._xValues == null || self._yValues == null) {
                        self._calculateValues();
                    }
                    if (dim === 0) {
                        //y
                        return self._yValues || null;
                    }
                    else if (dim === 1) {
                        //x
                        return self._xValues || null;
                    }
                };
                TrendLineBase.prototype._calculateValues = function () {
                };
                TrendLineBase.prototype._initProperties = function (o) {
                    var self = this, key;
                    self._sampleCount = 100;
                    for (key in o) {
                        if (self[key]) {
                            self[key] = o[key];
                        }
                    }
                };
                TrendLineBase.prototype._invalidate = function () {
                    _super.prototype._invalidate.call(this);
                    this._clearCalculatedValues();
                };
                TrendLineBase.prototype._clearValues = function () {
                    _super.prototype._clearValues.call(this);
                    this._originXValues = null;
                    this._originYValues = null;
                    this._clearCalculatedValues();
                };
                TrendLineBase.prototype._clearCalculatedValues = function () {
                    this._xValues = null;
                    this._yValues = null;
                };
                return TrendLineBase;
            }(chart.SeriesBase));
            analytics.TrendLineBase = TrendLineBase;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=TrendLineBase.js.map