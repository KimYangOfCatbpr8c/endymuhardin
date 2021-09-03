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
            var analytics;
            (function (analytics) {
                "use strict";
                /**
                 * Base class for overlay and indicator series (abstract).
                 */
                var OverlayIndicatorBase = (function (_super) {
                    __extends(OverlayIndicatorBase, _super);
                    function OverlayIndicatorBase() {
                        _super.call(this);
                        // internal field for series that need multiple legend entries
                        // in that case, set value to number of legend entries in ctor
                        this._seriesCount = 1;
                    }
                    Object.defineProperty(OverlayIndicatorBase.prototype, "_plotter", {
                        // access _IPlotter instance
                        get: function () {
                            if (this.chart && !this.__plotter) {
                                this.__plotter = this.chart._getPlotter(this);
                            }
                            return this.__plotter;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(OverlayIndicatorBase.prototype, "_hitTester", {
                        // access _HitTester instance
                        get: function () {
                            if (this._plotter && !this.__hitTester) {
                                this.__hitTester = this._plotter.hitTester;
                            }
                            return this.__hitTester;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    // return ChartType
                    OverlayIndicatorBase.prototype._getChartType = function () {
                        return chart.ChartType.Line;
                    };
                    // return original X-Values, if available
                    OverlayIndicatorBase.prototype._getXValues = function () {
                        return (_super.prototype.getValues.call(this, 1) || this._plotter.dataInfo.getXVals());
                    };
                    // helper method to get a _DataPoint object for hit testing
                    OverlayIndicatorBase.prototype._getDataPoint = function (dataX, dataY, seriesIndex, pointIndex, ax, ay) {
                        var dpt = new chart._DataPoint(seriesIndex, pointIndex, dataX, dataY);
                        // set x & y related data
                        dpt["y"] = dataY;
                        dpt["yfmt"] = ay._formatValue(dataY);
                        dpt["x"] = dataX;
                        dpt["xfmt"] = ax._formatValue(dataX);
                        return dpt;
                    };
                    // abstract method that determines whether or not calculations need to be ran
                    OverlayIndicatorBase.prototype._shouldCalculate = function () { return true; };
                    // initialize internal collections
                    OverlayIndicatorBase.prototype._init = function () { };
                    // responsible for calculating values
                    OverlayIndicatorBase.prototype._calculate = function () { };
                    OverlayIndicatorBase.prototype._clearValues = function () {
                        _super.prototype._clearValues.call(this);
                        this.__plotter = null;
                        this.__hitTester = null;
                    };
                    // helper for series with multiple names (csv)
                    // Returns undefined or the name.
                    OverlayIndicatorBase.prototype._getName = function (dim) {
                        var retval = undefined;
                        if (this.name) {
                            if (this.name.indexOf(",")) {
                                var names = this.name.split(",");
                                if (names && names.length - 1 >= dim) {
                                    retval = names[dim].trim();
                                }
                            }
                            else {
                                retval = this.name;
                            }
                        }
                        return retval;
                    };
                    // helper for series with multiple styles
                    // Returns the appropriate style for the given index, if
                    // ones exists; null is returned otherwise.
                    OverlayIndicatorBase.prototype._getStyles = function (dim) {
                        var retval = null;
                        if (dim < 0 || this._styles === null) {
                            return retval;
                        }
                        var i = 0;
                        for (var key in this._styles) {
                            if (i === dim && this._styles.hasOwnProperty(key)) {
                                retval = this._styles[key];
                                break;
                            }
                            i++;
                        }
                        return retval;
                    };
                    /* overrides for multiple legend items */
                    OverlayIndicatorBase.prototype.legendItemLength = function () {
                        return this._seriesCount;
                    };
                    OverlayIndicatorBase.prototype.measureLegendItem = function (engine, index) {
                        var name = this._getName(index), retval = new wijmo.Size(0, 0);
                        if (name) {
                            retval = this._measureLegendItem(engine, this._getName(index));
                        }
                        return retval;
                    };
                    OverlayIndicatorBase.prototype.drawLegendItem = function (engine, rect, index) {
                        var style = this._getStyles(index) || this.style, name = this._getName(index);
                        if (name) {
                            this._drawLegendItem(engine, rect, this._getChartType(), this._getName(index), style, this.symbolStyle);
                        }
                    };
                    return OverlayIndicatorBase;
                }(chart.SeriesBase));
                analytics.OverlayIndicatorBase = OverlayIndicatorBase;
                /**
                 * Base class for overlay and indicator series that render a single series (abstract).
                 */
                var SingleOverlayIndicatorBase = (function (_super) {
                    __extends(SingleOverlayIndicatorBase, _super);
                    function SingleOverlayIndicatorBase() {
                        _super.call(this);
                        this._period = 14;
                    }
                    Object.defineProperty(SingleOverlayIndicatorBase.prototype, "period", {
                        /**
                         * Gets or sets the period for the calculation as an integer value.
                         */
                        get: function () {
                            return this._period;
                        },
                        set: function (value) {
                            if (value !== this._period) {
                                this._period = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    // return the derived values
                    SingleOverlayIndicatorBase.prototype.getValues = function (dim) {
                        var retval = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return retval;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        if (dim === 0) {
                            retval = this._yvals;
                        }
                        else if (dim === 1) {
                            retval = this._xvals;
                        }
                        return retval;
                    };
                    // return limits for the derived values
                    SingleOverlayIndicatorBase.prototype.getDataRect = function () {
                        var rect = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return rect;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var xmin = finance._minimum(this._xvals), xmax = finance._maximum(this._xvals), ymin = finance._minimum(this._yvals), ymax = finance._maximum(this._yvals);
                        if (chart._DataInfo.isValid(xmin) && chart._DataInfo.isValid(xmax) && chart._DataInfo.isValid(ymin) && chart._DataInfo.isValid(ymax)) {
                            rect = new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                        return rect;
                    };
                    // clear the internal collections for the derived values
                    SingleOverlayIndicatorBase.prototype._clearValues = function () {
                        _super.prototype._clearValues.call(this);
                        this._xvals = null;
                        this._yvals = null;
                    };
                    // determine if the derived values need to be calculated
                    SingleOverlayIndicatorBase.prototype._shouldCalculate = function () {
                        return !this._yvals || !this._xvals;
                    };
                    // initialize internal collections for the derived values
                    SingleOverlayIndicatorBase.prototype._init = function () {
                        _super.prototype._init.call(this);
                        this._yvals = [];
                        this._xvals = [];
                    };
                    // override to get correct item for hit testing
                    SingleOverlayIndicatorBase.prototype._getItem = function (pointIndex) {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return _super.prototype._getItem.call(this, pointIndex);
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var originalLen = _super.prototype._getLength.call(this), len = finance._minimum(this._yvals.length, this._xvals.length);
                        // data index
                        pointIndex = originalLen - len + pointIndex;
                        return _super.prototype._getItem.call(this, pointIndex);
                    };
                    return SingleOverlayIndicatorBase;
                }(OverlayIndicatorBase));
                analytics.SingleOverlayIndicatorBase = SingleOverlayIndicatorBase;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=OverlayIndicatorBase.js.map