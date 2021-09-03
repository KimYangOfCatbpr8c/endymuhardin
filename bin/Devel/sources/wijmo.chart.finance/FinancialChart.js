var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines the @see:FinancialChart control and its associated classes.
 *
 */
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var finance;
        (function (finance) {
            'use strict';
            /**
             * Specifies the type of financial chart.
             */
            (function (FinancialChartType) {
                /** Shows vertical bars and allows you to compare values of items across categories. */
                FinancialChartType[FinancialChartType["Column"] = 0] = "Column";
                /** Uses X and Y coordinates to show patterns within the data. */
                FinancialChartType[FinancialChartType["Scatter"] = 1] = "Scatter";
                /** Shows trends over a period of time or across categories. */
                FinancialChartType[FinancialChartType["Line"] = 2] = "Line";
                /** Shows line chart with a symbol on each data point. */
                FinancialChartType[FinancialChartType["LineSymbols"] = 3] = "LineSymbols";
                /** Shows line chart with area below the line filled with color. */
                FinancialChartType[FinancialChartType["Area"] = 4] = "Area";
                /** Presents items with high, low, open, and close values.
                 * The size of the wick line is determined by the High and Low values, while
                 * the size of the bar is determined by the Open and Close values. The bar is
                 * displayed using different colors, depending on whether the close value is
                 * higher or lower than the open value. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "highProperty, lowProperty, openProperty, closeProperty".  */
                FinancialChartType[FinancialChartType["Candlestick"] = 5] = "Candlestick";
                /** Displays the same information as a candlestick chart, except that opening
                 * values are displayed using lines to the left, while lines to the right
                 * indicate closing values. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["HighLowOpenClose"] = 6] = "HighLowOpenClose";
                /** Derived from the candlestick chart and uses information from the current and
                 * prior period in order to filter out the noise. These charts cannot be combined
                 * with any other series objects. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["HeikinAshi"] = 7] = "HeikinAshi";
                /** Filters out noise by focusing exclusively on price changes. These charts cannot
                 * be combined with any other series objects. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["LineBreak"] = 8] = "LineBreak";
                /** Ignores time and focuses on price changes that meet a specified amount. These
                 * charts cannot be combined with any other series objects. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["Renko"] = 9] = "Renko";
                /** Ignores time and focuses on price action. These charts cannot be combined with
                 * any other series objects. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["Kagi"] = 10] = "Kagi";
                /** Identical to the standard Column chart, except that the width of each bar is
                 * determined by the Volume value. The data for this chart type can be defined using the
                 *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                 * following format: "yProperty, volumeProperty".  This chart type can only be used at
                 * the @see:FinancialChart level, and should not be applied on
                 * @see:FinancialSeries objects. Only one set of volume data is currently supported
                 * per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["ColumnVolume"] = 11] = "ColumnVolume";
                /** Similar to the Candlestick chart, but shows the high and low values only.
                 * In addition, the width of each bar is determined by Volume value. The data for
                 * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
                 * <b>binding</b> property as a comma separated value in the following format:
                 * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
                 * This chart type can only be used at the @see:FinancialChart level, and should not
                 * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
                 * supported per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["EquiVolume"] = 12] = "EquiVolume";
                /** Identical to the standard Candlestick chart, except that the width of each
                 * bar is determined by Volume value. The data for
                 * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
                 * <b>binding</b> property as a comma separated value in the following format:
                 * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
                 * This chart type can only be used at the @see:FinancialChart level, and should not
                 * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
                 * supported per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["CandleVolume"] = 13] = "CandleVolume";
                /** Created by Richard Arms, this chart is a combination of EquiVolume and
                 * CandleVolume chart types. The data for
                 * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
                 * <b>binding</b> property as a comma separated value in the following format:
                 * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
                 * This chart type can only be used at the @see:FinancialChart level, and should not
                 * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
                 * supported per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["ArmsCandleVolume"] = 14] = "ArmsCandleVolume";
            })(finance.FinancialChartType || (finance.FinancialChartType = {}));
            var FinancialChartType = finance.FinancialChartType;
            /**
             * Financial charting control.
             */
            var FinancialChart = (function (_super) {
                __extends(FinancialChart, _super);
                /**
                 * Initializes a new instance of the @see:FlexChart class.
                 *
                 * @param element The DOM element that hosts the control, or a selector for the
                 * host element (e.g. '#theCtrl').
                 * @param options A JavaScript object containing initialization data for the
                 * control.
                 */
                function FinancialChart(element, options) {
                    _super.call(this, element, options);
                    this._chartType = FinancialChartType.Line;
                    this.__heikinAshiPlotter = null;
                    this.__lineBreakPlotter = null;
                    this.__renkoPlotter = null;
                    this.__kagiPlotter = null;
                }
                Object.defineProperty(FinancialChart.prototype, "chartType", {
                    /**
                     * Gets or sets the type of financial chart to create.
                     */
                    get: function () {
                        return this._chartType;
                    },
                    set: function (value) {
                        if (value != this._chartType) {
                            this._chartType = wijmo.asEnum(value, FinancialChartType);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "options", {
                    /**
                     * Gets or sets various chart options.
                     *
                     * The following options are supported:
                     *
                     * <b>kagi.fields</b>: Specifies the @see:DataFields used for
                     * the Kagi chart. The default value is DataFields.Close.
                     *
                     * <b>kagi.rangeMode</b>: Specifies the @see:RangeMode for
                     * the Kagi chart. The default value is RangeMode.Fixed.
                     *
                     * <b>kagi.reversalAmount</b>: Specifies the reversal amount for
                     * the Kagi chart. The default value is 14.
                     *
                     * <pre>chart.options = {
                     *   kagi: {
                     *      fields: wijmo.chart.finance.DataFields.Close,
                     *      rangeMode: wijmo.chart.finance.RangeMode.Fixed,
                     *      reversalAmount: 14
                     *   }
                     * }</pre>
                     *
                     * <b>lineBreak.newLineBreaks</b>: Gets or sets the number of previous
                     * boxes that must be compared before a new box is drawn in
                     * Line Break charts. The default value is 3.
                     *
                     * <pre>chart.options = {
                     *   lineBreak: { newLineBreaks: 3 }
                     * }</pre>
                     *
                     * <b>renko.fields</b>: Specifies the @see:DataFields used for
                     * the Renko chart. The default value is DataFields.Close.
                     *
                     * <b>renko.rangeMode</b>: Specifies the @see:RangeMode for
                     * the Renko chart. The default value is RangeMode.Fixed.
                     *
                     * <b>renko.boxSize</b>: Specifies the box size for
                     * the Renko chart. The default value is 14.
                     *
                     * <pre>chart.options = {
                     *   renko: {
                     *      fields: wijmo.chart.finance.DataFields.Close,
                     *      rangeMode: wijmo.chart.finance.RangeMode.Fixed,
                     *      boxSize: 14
                     *   }
                     * }</pre>
                     */
                    get: function () {
                        return this._options;
                    },
                    set: function (value) {
                        if (value != this._options) {
                            this._options = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_heikinAshiPlotter", {
                    get: function () {
                        if (this.__heikinAshiPlotter === null) {
                            this.__heikinAshiPlotter = new finance._HeikinAshiPlotter();
                            this._initPlotter(this.__heikinAshiPlotter);
                        }
                        return this.__heikinAshiPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_lineBreakPlotter", {
                    get: function () {
                        if (this.__lineBreakPlotter === null) {
                            this.__lineBreakPlotter = new finance._LineBreakPlotter();
                            this._initPlotter(this.__lineBreakPlotter);
                        }
                        return this.__lineBreakPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_renkoPlotter", {
                    get: function () {
                        if (this.__renkoPlotter === null) {
                            this.__renkoPlotter = new finance._RenkoPlotter();
                            this._initPlotter(this.__renkoPlotter);
                        }
                        return this.__renkoPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_kagiPlotter", {
                    get: function () {
                        if (this.__kagiPlotter === null) {
                            this.__kagiPlotter = new finance._KagiPlotter();
                            this._initPlotter(this.__kagiPlotter);
                        }
                        return this.__kagiPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                FinancialChart.prototype._getChartType = function () {
                    var ct = null;
                    switch (this.chartType) {
                        case FinancialChartType.Area:
                            ct = chart.ChartType.Area;
                            break;
                        case FinancialChartType.Line:
                        case FinancialChartType.Kagi:
                            ct = chart.ChartType.Line;
                            break;
                        case FinancialChartType.Column:
                        case FinancialChartType.ColumnVolume:
                            ct = chart.ChartType.Column;
                            break;
                        case FinancialChartType.LineSymbols:
                            ct = chart.ChartType.LineSymbols;
                            break;
                        case FinancialChartType.Scatter:
                            ct = chart.ChartType.Scatter;
                            break;
                        case FinancialChartType.Candlestick:
                        case FinancialChartType.Renko:
                        case FinancialChartType.HeikinAshi:
                        case FinancialChartType.LineBreak:
                        case FinancialChartType.EquiVolume:
                        case FinancialChartType.CandleVolume:
                        case FinancialChartType.ArmsCandleVolume:
                            ct = chart.ChartType.Candlestick;
                            break;
                        case FinancialChartType.HighLowOpenClose:
                            ct = chart.ChartType.HighLowOpenClose;
                            break;
                    }
                    return ct;
                };
                FinancialChart.prototype._getPlotter = function (series) {
                    var chartType = this.chartType, plotter = null, isSeries = false;
                    if (series) {
                        var stype = series.chartType;
                        if (stype && !wijmo.isUndefined(stype) && stype != chartType) {
                            chartType = stype;
                            isSeries = true;
                        }
                    }
                    switch (chartType) {
                        case FinancialChartType.HeikinAshi:
                            plotter = this._heikinAshiPlotter;
                            break;
                        case FinancialChartType.LineBreak:
                            plotter = this._lineBreakPlotter;
                            break;
                        case FinancialChartType.Renko:
                            plotter = this._renkoPlotter;
                            break;
                        case FinancialChartType.Kagi:
                            plotter = this._kagiPlotter;
                            break;
                        case FinancialChartType.ColumnVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isVolume = true;
                            plotter.width = 1;
                            break;
                        case FinancialChartType.EquiVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = true;
                            plotter.isCandle = false;
                            plotter.isArms = false;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        case FinancialChartType.CandleVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = false;
                            plotter.isCandle = true;
                            plotter.isArms = false;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        case FinancialChartType.ArmsCandleVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = false;
                            plotter.isCandle = false;
                            plotter.isArms = true;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        // no plotter found for FinancialChartType - try based on ChartType
                        default:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            break;
                    }
                    return plotter;
                };
                FinancialChart.prototype._createSeries = function () {
                    return new finance.FinancialSeries();
                };
                return FinancialChart;
            }(chart.FlexChartCore));
            finance.FinancialChart = FinancialChart;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FinancialChart.js.map