var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines the @see:FlexRadar control and its associated classes.
 *
 */
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var radar;
        (function (radar) {
            'use strict';
            /**
             * Specifies the type of radar chart.
             */
            (function (RadarChartType) {
                /** Shows vertical bars and allows you to compare values of items across categories. */
                RadarChartType[RadarChartType["Column"] = 0] = "Column";
                /** Shows patterns within the data using X and Y coordinates. */
                RadarChartType[RadarChartType["Scatter"] = 1] = "Scatter";
                /** Shows trends over a period of time or across categories. */
                RadarChartType[RadarChartType["Line"] = 2] = "Line";
                /** Shows line chart with a symbol on each data point. */
                RadarChartType[RadarChartType["LineSymbols"] = 3] = "LineSymbols";
                /** Shows line chart with the area below the line filled with color. */
                RadarChartType[RadarChartType["Area"] = 4] = "Area";
            })(radar.RadarChartType || (radar.RadarChartType = {}));
            var RadarChartType = radar.RadarChartType;
            /**
             * radar chart control.
             */
            var FlexRadar = (function (_super) {
                __extends(FlexRadar, _super);
                /**
                 * Initializes a new instance of the @see:FlexRadar class.
                 *
                 * @param element The DOM element that hosts the control, or a selector for the
                 * host element (e.g. '#theCtrl').
                 * @param options A JavaScript object containing initialization data for the
                 * control.
                 */
                function FlexRadar(element, options) {
                    _super.call(this, element, options);
                    this._chartType = RadarChartType.Line;
                    this._startAngle = 0;
                    this._totalAngle = 360;
                    this._reversed = false;
                    this._areas = [];
                }
                Object.defineProperty(FlexRadar.prototype, "_radarLinePlotter", {
                    get: function () {
                        if (this.__radarLinePlotter == null) {
                            this.__radarLinePlotter = new radar._RadarLinePlotter();
                            this._initPlotter(this.__radarLinePlotter);
                        }
                        return this.__radarLinePlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexRadar.prototype, "_radarColumnPlotter", {
                    get: function () {
                        if (this.__radarColumnPlotter == null) {
                            this.__radarColumnPlotter = new radar._RadarBarPlotter();
                            this._initPlotter(this.__radarColumnPlotter);
                        }
                        return this.__radarColumnPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexRadar.prototype._initAxes = function () {
                    _super.prototype._initAxes.call(this);
                    this.axes.pop();
                    this.axes.pop();
                    this.axisX = new radar.FlexRadarAxis(chart.Position.Bottom);
                    this.axisX.majorGrid = true;
                    this.axisY = new radar.FlexRadarAxis(chart.Position.Left);
                    this.axisY.majorTickMarks = chart.TickMark.Outside;
                    this.axes.push(this.axisX);
                    this.axes.push(this.axisY);
                };
                FlexRadar.prototype._layout = function (rect, size, engine) {
                    _super.prototype._layout.call(this, rect, size, engine);
                    var height = this.axisX._height;
                    this._plotRect.top += height / 2;
                    var pr = this._plotRect;
                    this._radius = Math.min(pr.width, pr.height) / 2;
                    this._center = new wijmo.Point(pr.left + pr.width / 2, pr.top + pr.height / 2);
                };
                Object.defineProperty(FlexRadar.prototype, "chartType", {
                    /**
                     * Gets or sets the type of radar chart to create.
                     */
                    get: function () {
                        return this._chartType;
                    },
                    set: function (value) {
                        if (value != this._chartType) {
                            this._chartType = wijmo.asEnum(value, RadarChartType);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexRadar.prototype, "startAngle", {
                    /**
                     * Gets or sets the starting angle for the radar, in degrees.
                     *
                     * Angles are measured clockwise, starting at the 12 o'clock position.
                     */
                    get: function () {
                        return this._startAngle;
                    },
                    set: function (value) {
                        if (value != this._startAngle) {
                            this._startAngle = wijmo.asNumber(value, true);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexRadar.prototype, "totalAngle", {
                    /**
                     * Gets or sets the total angle for the radar, in degrees.  Its default value is 360.
                     * The value must be greater than 0, or less than or equal to 360.
                     */
                    get: function () {
                        return this._totalAngle;
                    },
                    set: function (value) {
                        if (value != this._totalAngle && value >= 0) {
                            this._totalAngle = wijmo.asNumber(value, true);
                            if (this._totalAngle <= 0) {
                                wijmo.assert(false, "totalAngle must be greater than 0.");
                                this._totalAngle = 0;
                            }
                            if (this._totalAngle > 360) {
                                wijmo.assert(false, "totalAngle must be less than or equal to 360.");
                                this._totalAngle = 360;
                            }
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexRadar.prototype, "reversed", {
                    /**
                     * Gets or sets a value that determines whether angles are reversed
                     * (counter-clockwise).
                     *
                     * The default value is false, which causes angles to be measured in
                     * the clockwise direction.
                     */
                    get: function () {
                        return this._reversed;
                    },
                    set: function (value) {
                        if (value != this._reversed) {
                            this._reversed = wijmo.asBoolean(value, true);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexRadar.prototype, "stacking", {
                    /**
                     * Gets or sets a value that determines whether and how the series objects are stacked.
                     */
                    get: function () {
                        return this._stacking;
                    },
                    set: function (value) {
                        if (value != this._stacking) {
                            this._stacking = wijmo.asEnum(value, chart.Stacking);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexRadar.prototype._getChartType = function () {
                    var ct = chart.ChartType.Line;
                    switch (this.chartType) {
                        case RadarChartType.Area:
                            ct = chart.ChartType.Area;
                            break;
                        case RadarChartType.Line:
                            ct = chart.ChartType.Line;
                            break;
                        case RadarChartType.Column:
                            ct = chart.ChartType.Column;
                            break;
                        case RadarChartType.LineSymbols:
                            ct = chart.ChartType.LineSymbols;
                            break;
                        case RadarChartType.Scatter:
                            ct = chart.ChartType.Scatter;
                            break;
                    }
                    return ct;
                };
                FlexRadar.prototype._getPlotter = function (series) {
                    var chartType = this.chartType, plotter = null, isSeries = false;
                    if (series) {
                        var stype = series.chartType;
                        if (stype != null && stype != chartType) {
                            chartType = stype;
                            isSeries = true;
                        }
                    }
                    switch (chartType) {
                        // no plotter found for RadarChartType - try based on ChartType
                        case RadarChartType.Line:
                            this._radarLinePlotter.hasSymbols = false;
                            this._radarLinePlotter.hasLines = true;
                            this._radarLinePlotter.isArea = false;
                            plotter = this._radarLinePlotter;
                            break;
                        case RadarChartType.LineSymbols:
                            this._radarLinePlotter.hasSymbols = true;
                            this._radarLinePlotter.hasLines = true;
                            this._radarLinePlotter.isArea = false;
                            plotter = this._radarLinePlotter;
                            break;
                        case RadarChartType.Area:
                            this._radarLinePlotter.hasSymbols = false;
                            this._radarLinePlotter.hasLines = true;
                            this._radarLinePlotter.isArea = true;
                            plotter = this._radarLinePlotter;
                            break;
                        case RadarChartType.Scatter:
                            this._radarLinePlotter.hasSymbols = true;
                            this._radarLinePlotter.hasLines = false;
                            this._radarLinePlotter.isArea = false;
                            plotter = this._radarLinePlotter;
                            break;
                        case RadarChartType.Column:
                            this._radarColumnPlotter.isVolume = false;
                            this._radarColumnPlotter.width = 0.8;
                            plotter = this._radarColumnPlotter;
                            break;
                        default:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            break;
                    }
                    return plotter;
                };
                FlexRadar.prototype._convertPoint = function (radius, angle) {
                    var pt = new wijmo.Point(), center = this._center;
                    pt.x = center.x + radius * Math.sin(angle);
                    pt.y = center.y - radius * Math.cos(angle);
                    return pt;
                };
                FlexRadar.prototype._createSeries = function () {
                    return new radar.FlexRadarSeries();
                };
                FlexRadar.prototype._clearCachedValues = function () {
                    _super.prototype._clearCachedValues.call(this);
                    this._isPolar = false;
                    this._areas = [];
                };
                FlexRadar.prototype._performBind = function () {
                    _super.prototype._performBind.call(this);
                    if (this._xDataType === wijmo.DataType.Number) {
                        this._isPolar = true;
                    }
                };
                FlexRadar.prototype._render = function (engine, applyElement) {
                    if (applyElement === void 0) { applyElement = true; }
                    this._areas = [];
                    _super.prototype._render.call(this, engine, applyElement);
                };
                return FlexRadar;
            }(chart.FlexChartCore));
            radar.FlexRadar = FlexRadar;
        })(radar = chart.radar || (chart.radar = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexRadar.js.map