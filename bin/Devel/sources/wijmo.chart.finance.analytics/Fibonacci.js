var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Analytics extensions for @see:FinancialChart.
 */
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var finance;
        (function (finance) {
            var analytics;
            (function (analytics) {
                'use strict';
                // internal helper function to validate that a number is truly a number (and not Infinity, NaN, etc.)
                function isValid(value) {
                    return isFinite(value) && !isNaN(value) && wijmo.isNumber(value);
                }
                /**
                 * Represents a Fibonacci Retracements tool for the @see:FinancialChart.
            
                 * The tool enables the calculation and plotting of various alert levels that are
                 * useful in financial charts.
                 *
                 * To add Fibonacci tool to a @see:FinancialChart control, create an instance
                 * of the @see:Fibonacci and add it to the <b>series</b> collection of the chart.
                 * For example:
                 *
                 * <pre>
                 * // create chart
                 * var chart = new wijmo.chart.finance.FinancialChart('#chartElement');
                 * // create Fibonacci tool
                 * var ftool = new wijmo.chart.finance.analytics.Fibonacci();
                 * chart.series.push(ftool);
                 * </pre>
                  */
                var Fibonacci = (function (_super) {
                    __extends(Fibonacci, _super);
                    /**
                     * Initializes a new instance of the @see:Fibonacci class.
                     *
                     * @param options A JavaScript object containing initialization data.
                     */
                    function Fibonacci(options) {
                        _super.call(this);
                        this._levels = [0, 23.6, 38.2, 50, 61.8, 100];
                        this._uptrend = true;
                        this._labelPosition = chart.LabelPosition.Left;
                        if (options) {
                            wijmo.copy(this, options);
                        }
                        this.rendering.addHandler(this._render);
                    }
                    Object.defineProperty(Fibonacci.prototype, "low", {
                        /**
                         * Gets or sets the low value of @see:Fibonacci tool.
                         *
                         * If not specified, the low value is calculated based on data values provided by <b>itemsSource</b>.
                         */
                        get: function () {
                            return this._low;
                        },
                        set: function (value) {
                            if (value != this._low) {
                                this._low = wijmo.asNumber(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Fibonacci.prototype, "high", {
                        /**
                         * Gets or sets the high value of @see:Fibonacci tool.
                         *
                         * If not specified, the high value is caclulated based on
                         * data values provided by the <b>itemsSource</b>.
                         */
                        get: function () {
                            return this._high;
                        },
                        set: function (value) {
                            if (value != this._high) {
                                this._high = wijmo.asNumber(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Fibonacci.prototype, "labelPosition", {
                        /**
                         * Gets or sets the label position for levels in @see:Fibonacci tool.
                         */
                        get: function () {
                            return this._labelPosition;
                        },
                        set: function (value) {
                            if (value != this._labelPosition) {
                                this._labelPosition = wijmo.asEnum(value, chart.LabelPosition, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Fibonacci.prototype, "uptrend", {
                        /**
                         * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
                         *
                         * Default value is true(uptrend). If the value is false, the downtrending levels are plotted.
                         */
                        get: function () {
                            return this._uptrend;
                        },
                        set: function (value) {
                            if (value != this._uptrend) {
                                this._uptrend = wijmo.asBoolean(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Fibonacci.prototype, "levels", {
                        /**
                         * Gets or sets the array of levels for plotting.
                         *
                         * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
                         */
                        get: function () {
                            return this._levels;
                        },
                        set: function (value) {
                            if (value != this._levels) {
                                this._levels = wijmo.asArray(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Fibonacci.prototype, "minX", {
                        /**
                         * Gets or sets the x minimal value of the @see:Fibonacci tool.
                         *
                         * If not specified, current minimum of x-axis is used.
                         * The value can be specified as a number or Date object.
                         */
                        get: function () {
                            return this._minX;
                        },
                        set: function (value) {
                            if (value != this._minX) {
                                this._minX = value;
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Fibonacci.prototype, "maxX", {
                        /**
                         * Gets or sets the x maximum value of the @see:Fibonacci tool.
                         *
                         * If not specified, current maximum of x-axis is used.
                         * The value can be specified as a number or Date object.
                         */
                        get: function () {
                            return this._maxX;
                        },
                        set: function (value) {
                            if (value != this._maxX) {
                                this._maxX = value;
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Fibonacci.prototype._getMinX = function () {
                        if (wijmo.isNumber(this._minX)) {
                            return this._minX;
                        }
                        else if (wijmo.isDate(this._minX)) {
                            return wijmo.asDate(this._minX).valueOf();
                        }
                        else {
                            return this._getAxisX().actualMin;
                        }
                    };
                    Fibonacci.prototype._getMaxX = function () {
                        if (wijmo.isNumber(this._maxX)) {
                            return this._maxX;
                        }
                        else if (wijmo.isDate(this._maxX)) {
                            return wijmo.asDate(this._maxX).valueOf();
                        }
                        else {
                            return this._getAxisX().actualMax;
                        }
                    };
                    Fibonacci.prototype._updateLevels = function () {
                        var min = undefined, max = undefined;
                        if (this._low === undefined || this._high === undefined) {
                            var vals = _super.prototype.getValues.call(this, 0);
                            var xvals = _super.prototype.getValues.call(this, 1);
                            if (vals) {
                                var len = vals.length;
                                var xmin = this._getMinX(), xmax = this._getMaxX();
                                for (var i = 0; i < len; i++) {
                                    var val = vals[i];
                                    var xval = xvals ? xvals[i] : i;
                                    if (xval < xmin || xval > xmax) {
                                        continue;
                                    }
                                    if (!isNaN(val)) {
                                        if (min === undefined || min > val) {
                                            min = val;
                                        }
                                        if (max === undefined || max < val) {
                                            max = val;
                                        }
                                    }
                                }
                            }
                        }
                        if (this._low === undefined && min !== undefined) {
                            this._actualLow = min;
                        }
                        else {
                            this._actualLow = this._low;
                        }
                        if (this._high === undefined && max !== undefined) {
                            this._actualHigh = max;
                        }
                        else {
                            this._actualHigh = this._high;
                        }
                    };
                    Fibonacci.prototype._render = function (sender, args) {
                        var ser = sender;
                        ser._updateLevels();
                        var ax = ser._getAxisX();
                        var ay = ser._getAxisY();
                        var eng = args.engine;
                        var swidth = 2, stroke = ser._getSymbolStroke(ser._chart.series.indexOf(ser));
                        var lstyle = chart._BasePlotter.cloneStyle(ser.style, ['fill']);
                        var tstyle = chart._BasePlotter.cloneStyle(ser.style, ['stroke']);
                        var clipPath = ser.chart._plotrectId;
                        eng.stroke = stroke;
                        eng.strokeWidth = swidth;
                        eng.textFill = stroke;
                        var xmin = ser._getMinX(), xmax = ser._getMaxX();
                        if (xmin < ax.actualMin) {
                            xmin = ax.actualMin;
                        }
                        if (xmax > ax.actualMax) {
                            xmax = ax.actualMax;
                        }
                        // start group clipping
                        eng.startGroup(null, clipPath);
                        var llen = ser._levels ? ser._levels.length : 0;
                        for (var i = 0; i < llen; i++) {
                            var lvl = ser._levels[i];
                            var x1 = ax.convert(xmin), x2 = ax.convert(xmax);
                            var y = ser.uptrend ?
                                ay.convert(ser._actualLow + 0.01 * lvl * (ser._actualHigh - ser._actualLow)) :
                                ay.convert(ser._actualHigh - 0.01 * lvl * (ser._actualHigh - ser._actualLow));
                            if (chart._DataInfo.isValid(x1) && chart._DataInfo.isValid(x2) && chart._DataInfo.isValid(y)) {
                                eng.drawLine(x1, y, x2, y, null, lstyle);
                                if (ser.labelPosition != chart.LabelPosition.None) {
                                    var s = lvl.toFixed(1) + '%';
                                    var va = 0;
                                    if ((ser.uptrend && i == 0) || (!ser.uptrend && i == llen - 1)) {
                                        va = 2;
                                    }
                                    switch (ser.labelPosition) {
                                        case chart.LabelPosition.Left:
                                            chart.FlexChartCore._renderText(eng, s, new wijmo.Point(x1, y), 0, va, null, null, tstyle);
                                            break;
                                        case chart.LabelPosition.Center:
                                            chart.FlexChartCore._renderText(eng, s, new wijmo.Point(0.5 * (x1 + x2), y), 1, va, null, null, tstyle);
                                            break;
                                        case chart.LabelPosition.Right:
                                            chart.FlexChartCore._renderText(eng, s, new wijmo.Point(x2, y), 2, va, null, null, tstyle);
                                            break;
                                    }
                                }
                            }
                        }
                        eng.stroke = null;
                        eng.strokeWidth = null;
                        eng.textFill = null;
                        // end group
                        eng.endGroup();
                    };
                    Fibonacci.prototype._getChartType = function () {
                        return chart.ChartType.Line;
                    };
                    return Fibonacci;
                }(chart.SeriesBase));
                analytics.Fibonacci = Fibonacci;
                /**
                 * Represents a Fibonacci Arcs tool for the @see:FinancialChart.
                 */
                var FibonacciArcs = (function (_super) {
                    __extends(FibonacciArcs, _super);
                    /**
                     * Initializes a new instance of the @see:FibonacciArcs class.
                     *
                     * @param options A JavaScript object containing initialization data.
                     */
                    function FibonacciArcs(options) {
                        _super.call(this);
                        this._levels = [38.2, 50, 61.8];
                        this._labelPosition = chart.LabelPosition.Top;
                        // copy options
                        if (options) {
                            wijmo.copy(this, options);
                        }
                        this.rendering.addHandler(this._render, this);
                    }
                    Object.defineProperty(FibonacciArcs.prototype, "start", {
                        /**
                         * Gets or sets the starting @see:DataPoint for the base line.
                         *
                         * The @see:DataPoint x value can be a number or a Date object
                         * (for time-based data).
                         *
                         * Unlike some of the other Fibonacci tools, the starting
                         * @see:DataPoint is <b>not</b> calculated automatically if
                         * undefined.
                         */
                        get: function () {
                            return this._start;
                        },
                        set: function (value) {
                            if (value !== this.start) {
                                this._start = wijmo.asType(value, chart.DataPoint);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciArcs.prototype, "end", {
                        /**
                         * Gets or sets the ending @see:DataPoint for the base line.
                         *
                         * The @see:DataPoint x value can be a number or a Date object
                         * (for time-based data).
                         *
                         * Unlike some of the other Fibonacci tools, the ending
                         * @see:DataPoint is <b>not</b> calculated automatically if
                         * undefined.
                         */
                        get: function () {
                            return this._end;
                        },
                        set: function (value) {
                            if (value !== this.end) {
                                this._end = wijmo.asType(value, chart.DataPoint);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciArcs.prototype, "levels", {
                        /**
                         * Gets or sets the array of levels for plotting.
                         *
                         * Default value is [38.2, 50, 61.8].
                         */
                        get: function () {
                            return this._levels;
                        },
                        set: function (value) {
                            if (value !== this._levels) {
                                this._levels = wijmo.asArray(value, false);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciArcs.prototype, "labelPosition", {
                        /**
                         * Gets or sets the @see:LabelPosition for levels in @see:FibonacciArcs tool.
                         */
                        get: function () {
                            return this._labelPosition;
                        },
                        set: function (value) {
                            if (value !== this.labelPosition) {
                                this._labelPosition = wijmo.asEnum(value, chart.LabelPosition);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    FibonacciArcs.prototype._render = function (sender, args) {
                        var startX = this._getX(0), startY = this._getY(0), endX = this._getX(1), endY = this._getY(1);
                        if (_super.prototype._getLength.call(this) <= 1 || !isValid(startX) || !isValid(startY) || !isValid(endX) || !isValid(endY)) {
                            return;
                        }
                        var ax = this._getAxisX(), ay = this._getAxisY(), engine = args.engine, swidth = 2, group, si = this.chart.series.indexOf(this), stroke = this._getSymbolStroke(si), lstyle = chart._BasePlotter.cloneStyle(this.style, ["fill"]), tstyle = chart._BasePlotter.cloneStyle(this.style, ["stroke"]);
                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        engine.textFill = stroke;
                        var clipPath = this.chart._plotrectId, yDiff = endY - startY, cx, cy, acy, baseLen, radius, center, lvl, size, lbl;
                        // start group for clipping
                        group = engine.startGroup(null, clipPath);
                        wijmo.addClass(group, 'fibonacci-arcs');
                        // draw base line
                        if (isValid(startX) && isValid(startY) && isValid(endX) && isValid(endY)) {
                            engine.drawLines([ax.convert(startX), ax.convert(endX)], [ay.convert(startY), ay.convert(endY)], null, lstyle);
                        }
                        // get length of base line
                        baseLen = Math.sqrt(Math.pow(ax.convert(endX) - ax.convert(startX), 2) + Math.pow(ay.convert(endY) - ay.convert(startY), 2));
                        // center point for arcs
                        center = new wijmo.Point(endX, endY);
                        // handle level arcs
                        for (var i = 0; i < this.levels.length; i++) {
                            // get level as decimal
                            lvl = this.levels[i] * 0.01;
                            // get the radius of the arc
                            radius = Math.abs(baseLen * lvl);
                            // draw the arc
                            if (isValid(center.x) && isValid(center.y) && isValid(radius)) {
                                cx = ax.convert(center.x);
                                cy = ay.convert(center.y);
                                // draw arc
                                engine.drawDonutSegment(cx, cy, radius, radius, yDiff > 0 ? 0 : Math.PI, Math.PI, null, lstyle);
                                // draw labels
                                if (this.labelPosition !== chart.LabelPosition.None && lvl !== 0) {
                                    // get label and determine its size
                                    lbl = wijmo.Globalize.format(lvl, "p1");
                                    size = engine.measureString(lbl, null, null, tstyle);
                                    // get label's y position
                                    acy = yDiff <= 0 ? cy - radius : cy + radius;
                                    switch (this.labelPosition) {
                                        case chart.LabelPosition.Center:
                                            acy += (size.height * 0.5);
                                            break;
                                        case chart.LabelPosition.Bottom:
                                            acy += yDiff <= 0 ? size.height : 0;
                                            break;
                                        default:
                                            acy += yDiff <= 0 ? 0 : size.height;
                                            break;
                                    }
                                    engine.drawString(lbl, new wijmo.Point(cx - size.width * .5, acy), null, tstyle);
                                }
                            }
                        }
                        engine.stroke = null;
                        engine.strokeWidth = null;
                        engine.textFill = null;
                        // end group
                        engine.endGroup();
                    };
                    FibonacciArcs.prototype._getX = function (dim) {
                        var retval = null;
                        if (dim === 0 && this.start) {
                            retval = this.start.x;
                        }
                        else if (dim === 1 && this.end) {
                            retval = this.end.x;
                        }
                        if (wijmo.isDate(retval)) {
                            retval = wijmo.asDate(retval).valueOf();
                        }
                        return retval;
                    };
                    FibonacciArcs.prototype._getY = function (dim) {
                        var retval = null;
                        if (dim === 0 && this.start) {
                            retval = this.start.y;
                        }
                        else if (dim === 1 && this.end) {
                            retval = this.end.y;
                        }
                        return retval;
                    };
                    FibonacciArcs.prototype._getChartType = function () {
                        return chart.ChartType.Line;
                    };
                    return FibonacciArcs;
                }(chart.SeriesBase));
                analytics.FibonacciArcs = FibonacciArcs;
                /**
                 * Represents a Fibonacci Fans tool for the @see:FinancialChart.
                 */
                var FibonacciFans = (function (_super) {
                    __extends(FibonacciFans, _super);
                    /**
                     * Initializes a new instance of the @see:FibonacciFans class.
                     *
                     * @param options A JavaScript object containing initialization data.
                     */
                    function FibonacciFans(options) {
                        _super.call(this);
                        this._levels = [0, 23.6, 38.2, 50, 61.8, 100];
                        this._labelPosition = chart.LabelPosition.Top;
                        // copy options
                        if (options) {
                            wijmo.copy(this, options);
                        }
                        this.rendering.addHandler(this._render, this);
                    }
                    Object.defineProperty(FibonacciFans.prototype, "start", {
                        /**
                         * Gets or sets the starting @see:DataPoint for the base line.
                         *
                         * If not set, the starting @see:DataPoint is calculated automatically.
                         * The @see:DataPoint x value can be a number or a Date object (for
                         * time-based data).
                         */
                        get: function () {
                            return this._start;
                        },
                        set: function (value) {
                            if (value !== this.start) {
                                this._start = wijmo.asType(value, chart.DataPoint);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciFans.prototype, "end", {
                        /**
                         * Gets or sets the ending @see:DataPoint for the base line.
                         *
                         * If not set, the starting @see:DataPoint is calculated automatically.
                         * The @see:DataPoint x value can be a number or a Date object (for
                         * time-based data).
                         */
                        get: function () {
                            return this._end;
                        },
                        set: function (value) {
                            if (value !== this.end) {
                                this._end = wijmo.asType(value, chart.DataPoint);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciFans.prototype, "levels", {
                        /**
                         * Gets or sets the array of levels for plotting.
                         *
                         * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
                         */
                        get: function () {
                            return this._levels;
                        },
                        set: function (value) {
                            if (value !== this._levels) {
                                this._levels = wijmo.asArray(value, false);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciFans.prototype, "labelPosition", {
                        /**
                         * Gets or sets the @see:LabelPosition for levels in @see:FibonacciFans tool.
                         */
                        get: function () {
                            return this._labelPosition;
                        },
                        set: function (value) {
                            if (value !== this.labelPosition) {
                                this._labelPosition = wijmo.asEnum(value, chart.LabelPosition);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    FibonacciFans.prototype._updateLevels = function () {
                        // both must be defined, otherwise we calulate start/end automatically
                        if (!this.start || !this.end) {
                            var plotter = this.chart._getPlotter(this), ax = this._getAxisX(), yvals = _super.prototype.getValues.call(this, 0), xvals = _super.prototype.getValues.call(this, 1) || plotter.dataInfo.getXVals(), xmin, xmax, ymin, ymax;
                            // use yvals only - no axisY.[actualMin|actualMax]
                            if (yvals && yvals.length > 0) {
                                ymin = finance._minimum(yvals);
                                ymax = finance._maximum(yvals);
                            }
                            if (xvals && xvals.length > 0) {
                                xmin = finance._minimum(xvals);
                                xmax = finance._maximum(xvals);
                            }
                            else {
                                xmin = ax.actualMin;
                                xmax = ax.actualMax;
                            }
                            if (isValid(xmin) && isValid(ymin) && isValid(xmax) && isValid(ymax)) {
                                this.start = new chart.DataPoint(xmin, ymin);
                                this.end = new chart.DataPoint(xmax, ymax);
                            }
                        }
                    };
                    FibonacciFans.prototype._render = function (sender, args) {
                        this._updateLevels();
                        var startX = this._getX(0), startY = this._getY(0), endX = this._getX(1), endY = this._getY(1);
                        if (_super.prototype._getLength.call(this) <= 1 || !isValid(startX) || !isValid(startY) || !isValid(endX) || !isValid(endY)) {
                            return;
                        }
                        var ax = this._getAxisX(), ay = this._getAxisY(), si = this.chart.series.indexOf(this), engine = args.engine, swidth = 2, stroke = this._getSymbolStroke(si), lstyle = chart._BasePlotter.cloneStyle(this.style, ["fill"]), tstyle = chart._BasePlotter.cloneStyle(this.style, ["stroke"]);
                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        engine.textFill = stroke;
                        var yDiff = endY - startY, xDiff = endX - startX, clipPath = this.chart._plotrectId, x1, x2, y1, y2, pt1, pt2, cp, m, b, lvl, lbl, size, angle;
                        // init local vars for start/end values
                        x1 = startX;
                        y1 = startY;
                        x2 = endX;
                        y2 = endY;
                        // maintain original x2 & set new x2
                        var x = x2;
                        // start group for clipping
                        engine.startGroup(null, clipPath);
                        // handle level lines
                        for (var i = 0; i < this.levels.length; i++) {
                            x2 = xDiff < 0 ? ax.actualMin : ax.actualMax;
                            // get level as decimal
                            lvl = this.levels[i] * 0.01;
                            // get level y2
                            y2 = y1 + lvl * yDiff;
                            // slope and y-intercept for (endX, new y2)
                            m = (y2 - y1) / (x - x1);
                            b = y2 - (m * x);
                            // update y2 for (ax.[actualMin||actualMax], new y2)
                            y2 = m * x2 + b;
                            // keep end point within plot area's bounds for labels
                            if (yDiff > 0 && y2 > ay.actualMax) {
                                y2 = ay.actualMax;
                                x2 = (y2 - b) / m;
                            }
                            else if (yDiff < 0 && y2 < ay.actualMin) {
                                y2 = ay.actualMin;
                                x2 = (y2 - b) / m;
                            }
                            if (isValid(x1) && isValid(y1) && isValid(x2) && isValid(y2)) {
                                // convert once per fan line & associated label
                                pt1 = new wijmo.Point(ax.convert(x1), ay.convert(y1));
                                pt2 = new wijmo.Point(ax.convert(x2), ay.convert(y2));
                                // draw fan line
                                engine.drawLines([pt1.x, pt2.x], [pt1.y, pt2.y], null, lstyle);
                                // draw fan label
                                if (this.labelPosition != chart.LabelPosition.None) {
                                    // get label and determine its size
                                    lbl = wijmo.Globalize.format(lvl, "p1");
                                    size = engine.measureString(lbl, null, null, tstyle);
                                    // find angle for label
                                    angle = Math.atan((pt2.y - pt1.y) / (pt2.x - pt1.x)) * 180 / Math.PI;
                                    // get center point by cloning the label point
                                    cp = pt2.clone();
                                    // update label point for axis boundx
                                    pt2.x = xDiff > 0 ? pt2.x - size.width : pt2.x;
                                    var a = angle * Math.PI / 180, tl = new wijmo.Point(), bl = new wijmo.Point(), tr = new wijmo.Point(), br = new wijmo.Point(), ymin = ay.convert(ay.actualMin), ymax = ay.convert(ay.actualMax), xmin = ax.convert(ax.actualMin), xmax = ax.convert(ax.actualMax), limit, acp = cp.clone();
                                    // adjust pt2.y based on label position property
                                    switch (this.labelPosition) {
                                        // top is the default by nature
                                        case chart.LabelPosition.Center:
                                            pt2.y += size.height * 0.5;
                                            // todo: this works okay, but corners should be calculated in this case
                                            acp.y += size.height * 0.5;
                                            break;
                                        case chart.LabelPosition.Bottom:
                                            pt2.y += size.height;
                                            break;
                                    }
                                    // http://math.stackexchange.com/questions/170650/how-to-get-upper-left-upper-right-lower-left-and-lower-right-corners-xy-coordi
                                    // attempt to keep labels in bounds
                                    if (xDiff > 0) {
                                        // todo: center is slightly off because the corners aren't correct
                                        // calculate coordinates of label's corners
                                        if (this.labelPosition === chart.LabelPosition.Top || this.labelPosition === chart.LabelPosition.Center) {
                                            br = acp.clone();
                                            tr.x = br.x + size.height * Math.sin(a);
                                            tr.y = br.y - size.height * Math.cos(a);
                                            tl.x = br.x - size.width * Math.cos(a) + size.height * Math.sin(a);
                                            tl.y = br.y - size.width * Math.sin(a) - size.height * Math.cos(a);
                                            bl.x = br.x - size.width * Math.cos(a);
                                            bl.y = br.y - size.width * Math.sin(a);
                                        }
                                        else if (this.labelPosition === chart.LabelPosition.Bottom) {
                                            tr = acp.clone();
                                            tl.x = tr.x - size.width * Math.cos(a);
                                            tl.y = tr.y - size.width * Math.sin(a);
                                            bl.x = tl.x - size.height * Math.sin(a);
                                            bl.y = tl.y + size.height * Math.cos(a);
                                            br.x = tl.x + size.width * Math.cos(a) - size.height * Math.sin(a);
                                            br.y = tl.y + size.width * Math.sin(a) + size.height * Math.cos(a);
                                        }
                                        // shift the label under certain conditions
                                        if (yDiff > 0) {
                                            if (tr.y < ymax) {
                                                m = (ay.convertBack(tr.y) - ay.convertBack(tl.y)) / (ax.convertBack(tr.x) - ax.convertBack(tl.x));
                                                b = ay.convertBack(tr.y) - (m * ax.convertBack(tr.x));
                                                limit = ax.convert((ay.actualMax - b) / m);
                                                pt2.x -= Math.abs(tr.x - limit);
                                            }
                                            if (br.x > xmax) {
                                                pt2.x -= Math.abs(xmax - br.x);
                                            }
                                        }
                                        else if (yDiff < 0) {
                                            if (br.y > ymin) {
                                                m = (ay.convertBack(bl.y) - ay.convertBack(br.y)) / (ax.convertBack(bl.x) - ax.convertBack(br.x));
                                                b = ay.convertBack(br.y) - (m * ax.convertBack(br.x));
                                                limit = ax.convert((ay.actualMin - b) / m);
                                                pt2.x -= Math.max(Math.abs(limit - br.x), Math.abs(ymin - br.y));
                                            }
                                            if (tr.x > xmax) {
                                                pt2.x -= Math.abs(xmax - tr.x);
                                            }
                                        }
                                    }
                                    else if (xDiff < 0) {
                                        // todo: center is slightly off because the corners aren't correct
                                        if (this.labelPosition === chart.LabelPosition.Top || this.labelPosition === chart.LabelPosition.Center) {
                                            bl = acp.clone();
                                            tl.x = bl.x + size.height * Math.sin(a);
                                            tl.y = bl.y - size.height * Math.cos(a);
                                            br.x = bl.x + size.width * Math.cos(a);
                                            br.y = bl.y + size.width * Math.sin(a);
                                            tr.x = tl.x + size.width * Math.cos(a);
                                            tr.y = tl.y + size.width * Math.sin(a);
                                        }
                                        else if (this.labelPosition === chart.LabelPosition.Bottom) {
                                            tl = acp.clone();
                                            tr.x = tl.x + size.width * Math.cos(a);
                                            tr.y = tl.y + size.width * Math.sin(a);
                                            bl.x = tl.x - size.height * Math.sin(a);
                                            bl.y = tl.y + size.height * Math.cos(a);
                                            br.x = tl.x + size.width * Math.cos(a) - size.height * Math.sin(a);
                                            br.y = tl.y + size.width * Math.sin(a) + size.height * Math.cos(a);
                                        }
                                        if (yDiff > 0) {
                                            if (tl.y < ymax) {
                                                m = (ay.convertBack(tl.y) - ay.convertBack(tr.y)) / (ax.convertBack(tl.x) - ax.convertBack(tr.x));
                                                b = ay.convertBack(tl.y) - (m * ax.convertBack(tl.x));
                                                limit = ax.convert((ay.actualMax - b) / m);
                                                pt2.x += Math.abs(tl.x - limit);
                                            }
                                            if (bl.x < xmin) {
                                                pt2.x += Math.abs(xmin - bl.x);
                                            }
                                        }
                                        else if (yDiff < 0) {
                                            if (bl.y > ymin) {
                                                m = (ay.convertBack(br.y) - ay.convertBack(bl.y)) / (ax.convertBack(br.x) - ax.convertBack(bl.x));
                                                b = ay.convertBack(bl.y) - (m * ax.convertBack(bl.x));
                                                limit = ax.convert((ay.actualMin - b) / m);
                                                pt2.x += Math.max(Math.abs(limit - bl.x), Math.abs(ymin - bl.y));
                                            }
                                            if (tl.x < xmin) {
                                                pt2.x += Math.abs(xmin - tl.x);
                                            }
                                        }
                                    }
                                    // draw the label
                                    if (angle === 0) {
                                        engine.drawString(lbl, pt2, null, tstyle);
                                    }
                                    else {
                                        engine.drawStringRotated(lbl, pt2, cp, angle, null, tstyle);
                                    }
                                }
                            }
                        }
                        engine.stroke = null;
                        engine.strokeWidth = null;
                        engine.textFill = null;
                        // end group
                        engine.endGroup();
                    };
                    FibonacciFans.prototype._getX = function (dim) {
                        var retval = null;
                        if (dim === 0 && this.start) {
                            retval = this.start.x;
                        }
                        else if (dim === 1 && this.end) {
                            retval = this.end.x;
                        }
                        if (wijmo.isDate(retval)) {
                            retval = wijmo.asDate(retval).valueOf();
                        }
                        return retval;
                    };
                    FibonacciFans.prototype._getY = function (dim) {
                        var retval = null;
                        if (dim === 0 && this.start) {
                            retval = this.start.y;
                        }
                        else if (dim === 1 && this.end) {
                            retval = this.end.y;
                        }
                        return retval;
                    };
                    FibonacciFans.prototype._getChartType = function () {
                        return chart.ChartType.Line;
                    };
                    return FibonacciFans;
                }(chart.SeriesBase));
                analytics.FibonacciFans = FibonacciFans;
                /**
                 * Represents a Fibonacci Time Zones tool for the @see:FinancialChart.
                 */
                var FibonacciTimeZones = (function (_super) {
                    __extends(FibonacciTimeZones, _super);
                    /**
                     * Initializes a new instance of the @see:FibonacciTimeZones class.
                     *
                     * @param options A JavaScript object containing initialization data.
                     */
                    function FibonacciTimeZones(options) {
                        _super.call(this);
                        this._levels = [0, 1, 2, 3, 5, 8, 13, 21, 34];
                        this._labelPosition = chart.LabelPosition.Right;
                        // copy options
                        if (options) {
                            wijmo.copy(this, options);
                        }
                        this.rendering.addHandler(this._render, this);
                    }
                    Object.defineProperty(FibonacciTimeZones.prototype, "startX", {
                        /**
                         * Gets or sets the starting X data point for the time zones.
                         *
                         * If not set, the starting X data point is calculated automatically. The
                         * value can be a number or a Date object (for time-based data).
                         */
                        get: function () {
                            return this._startX;
                        },
                        set: function (value) {
                            if (value !== this.startX) {
                                if (wijmo.isDate(value)) {
                                    this._startX = wijmo.asDate(value);
                                }
                                else {
                                    this._startX = wijmo.asNumber(value);
                                }
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciTimeZones.prototype, "endX", {
                        /**
                         * Gets or sets the ending X data point for the time zones.
                         *
                         * If not set, the ending X data point is calculated automatically. The
                         * value can be a number or a Date object (for time-based data).
                         */
                        get: function () {
                            return this._endX;
                        },
                        set: function (value) {
                            if (value !== this.endX) {
                                if (wijmo.isDate(value)) {
                                    this._endX = wijmo.asDate(value);
                                }
                                else {
                                    this._endX = wijmo.asNumber(value);
                                }
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciTimeZones.prototype, "levels", {
                        /**
                         * Gets or sets the array of levels for plotting.
                         *
                         * Default value is [0, 1, 2, 3, 5, 8, 13, 21, 34].
                         */
                        get: function () {
                            return this._levels;
                        },
                        set: function (value) {
                            if (value !== this._levels) {
                                this._levels = wijmo.asArray(value, false);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FibonacciTimeZones.prototype, "labelPosition", {
                        /**
                         * Gets or sets the @see:LabelPosition for levels in @see:FibonacciTimeZones tool.
                         */
                        get: function () {
                            return this._labelPosition;
                        },
                        set: function (value) {
                            if (value !== this.labelPosition) {
                                this._labelPosition = wijmo.asEnum(value, chart.LabelPosition);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    FibonacciTimeZones.prototype._render = function (sender, args) {
                        this._updateLevels();
                        var start = this._getX(0), end = this._getX(1);
                        if (_super.prototype._getLength.call(this) <= 1 || !isValid(start) || !isValid(end)) {
                            return;
                        }
                        var diff = end - start, ax = this._getAxisX(), ay = this._getAxisY(), si = this._chart.series.indexOf(this), engine = args.engine, swidth = 2, stroke = this._getSymbolStroke(si), lstyle = chart._BasePlotter.cloneStyle(this.style, ["fill"]), tstyle = chart._BasePlotter.cloneStyle(this.style, ["stroke"]), ymin = ay.convert(ay.actualMin), ymax = ay.convert(ay.actualMax), lvl, x, size, lbl, clipPath = this.chart._plotrectId;
                        // render engine style settings
                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        engine.textFill = stroke;
                        // start and end cannot be equal
                        if (diff === 0) {
                            return;
                        }
                        // start group for clipping
                        engine.startGroup(null, clipPath);
                        // draw the time zones
                        for (var i = 0; i < this.levels.length; i++) {
                            lvl = this.levels[i];
                            x = diff * lvl + start;
                            if (x < ax.actualMin || ax.actualMax < x || !isValid(x)) {
                                continue;
                            }
                            // convert one time
                            x = ax.convert(x);
                            // draw line
                            engine.drawLine(x, ymin, x, ymax, null, lstyle);
                            // draw labels
                            if (this.labelPosition !== chart.LabelPosition.None) {
                                // get label and determine its size
                                lbl = wijmo.Globalize.format(lvl, "n0");
                                size = engine.measureString(lbl, null, null, tstyle);
                                // get label's x position
                                switch (this.labelPosition) {
                                    case chart.LabelPosition.Left:
                                        x -= size.width + swidth;
                                        break;
                                    case chart.LabelPosition.Center:
                                        x -= size.width / 2;
                                        break;
                                    case chart.LabelPosition.Right:
                                        x += swidth;
                                        break;
                                    default:
                                        x = diff < 0 ? x - size.width - swidth : x + swidth;
                                        break;
                                }
                                engine.drawString(lbl, new wijmo.Point(x, ymin), null, tstyle);
                            }
                        }
                        engine.stroke = null;
                        engine.strokeWidth = null;
                        engine.textFill = null;
                        // end group
                        engine.endGroup();
                    };
                    FibonacciTimeZones.prototype._updateLevels = function () {
                        var plotter = this.chart._getPlotter(this), xvals = _super.prototype.getValues.call(this, 1) || plotter.dataInfo.getXVals();
                        if (_super.prototype._getLength.call(this) <= 1) {
                            return;
                        }
                        // get startX & endX as numbers; both must be define or both are ignored
                        var start = this._getX(0), end = this._getX(1), defined = wijmo.isNumber(start) && wijmo.isNumber(end);
                        // automatically init startX & endX if not defined
                        if (!defined && !xvals) {
                            this._startX = 0;
                            this._endX = 1;
                        }
                        else if (!defined && xvals) {
                            this._startX = xvals[0];
                            this._endX = xvals[1];
                        }
                    };
                    FibonacciTimeZones.prototype._getX = function (dim) {
                        var retval = null;
                        if (dim === 0) {
                            retval = this.startX;
                        }
                        else if (dim === 1) {
                            retval = this.endX;
                        }
                        if (wijmo.isDate(retval)) {
                            retval = wijmo.asDate(retval).valueOf();
                        }
                        return retval;
                    };
                    FibonacciTimeZones.prototype._getChartType = function () {
                        return chart.ChartType.Line;
                    };
                    return FibonacciTimeZones;
                }(chart.SeriesBase));
                analytics.FibonacciTimeZones = FibonacciTimeZones;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Fibonacci.js.map