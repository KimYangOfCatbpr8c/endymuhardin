/**
 * Defines the @see:FinancialChart control and its associated classes.
 *
 */
module wijmo.chart.finance {
    'use strict';

    /**
     * Specifies the type of financial chart.
     */
    export enum FinancialChartType {
        /** Shows vertical bars and allows you to compare values of items across categories. */
        Column,
        /** Uses X and Y coordinates to show patterns within the data. */
        Scatter,
        /** Shows trends over a period of time or across categories. */
        Line,
        /** Shows line chart with a symbol on each data point. */
        LineSymbols,
        /** Shows line chart with area below the line filled with color. */
        Area,
        /** Presents items with high, low, open, and close values.
         * The size of the wick line is determined by the High and Low values, while
         * the size of the bar is determined by the Open and Close values. The bar is
         * displayed using different colors, depending on whether the close value is
         * higher or lower than the open value. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty".  */
        Candlestick,
        /** Displays the same information as a candlestick chart, except that opening
         * values are displayed using lines to the left, while lines to the right
         * indicate closing values. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        HighLowOpenClose,
        /** Derived from the candlestick chart and uses information from the current and
         * prior period in order to filter out the noise. These charts cannot be combined
         * with any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        HeikinAshi,
        /** Filters out noise by focusing exclusively on price changes. These charts cannot
         * be combined with any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        LineBreak,
        /** Ignores time and focuses on price changes that meet a specified amount. These
         * charts cannot be combined with any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        Renko,
        /** Ignores time and focuses on price action. These charts cannot be combined with
         * any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        Kagi,
        /** Identical to the standard Column chart, except that the width of each bar is
         * determined by the Volume value. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "yProperty, volumeProperty".  This chart type can only be used at
         * the @see:FinancialChart level, and should not be applied on
         * @see:FinancialSeries objects. Only one set of volume data is currently supported
         * per @see:FinancialChart. */
        ColumnVolume,
        /** Similar to the Candlestick chart, but shows the high and low values only.
         * In addition, the width of each bar is determined by Volume value. The data for
         * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
         * <b>binding</b> property as a comma separated value in the following format:
         * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
         * This chart type can only be used at the @see:FinancialChart level, and should not
         * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
         * supported per @see:FinancialChart. */
        EquiVolume,
        /** Identical to the standard Candlestick chart, except that the width of each
         * bar is determined by Volume value. The data for
         * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
         * <b>binding</b> property as a comma separated value in the following format:
         * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
         * This chart type can only be used at the @see:FinancialChart level, and should not
         * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
         * supported per @see:FinancialChart. */
        CandleVolume,
        /** Created by Richard Arms, this chart is a combination of EquiVolume and
         * CandleVolume chart types. The data for
         * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
         * <b>binding</b> property as a comma separated value in the following format:
         * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
         * This chart type can only be used at the @see:FinancialChart level, and should not
         * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
         * supported per @see:FinancialChart. */
        ArmsCandleVolume

    }

    /**
     * Financial charting control.
     */
    export class FinancialChart extends FlexChartCore {

        private _chartType = FinancialChartType.Line;

        private __heikinAshiPlotter = null;
        private __lineBreakPlotter = null;
        private __renkoPlotter = null;
        private __kagiPlotter = null;

        /**
         * Initializes a new instance of the @see:FlexChart class.
         *
         * @param element The DOM element that hosts the control, or a selector for the
         * host element (e.g. '#theCtrl').
         * @param options A JavaScript object containing initialization data for the
         * control.
         */
        constructor(element: any, options?) {
            super(element, options);
        }

        /**
         * Gets or sets the type of financial chart to create.
         */
        get chartType(): FinancialChartType {
            return this._chartType;
        }
        set chartType(value: FinancialChartType) {
            if (value != this._chartType) {
                this._chartType = asEnum(value, FinancialChartType);
                this.invalidate();
            }
        }

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
        get options(): any {
            return this._options;
        }
        set options(value: any) {
            if (value != this._options) {
                this._options = value;
                this.invalidate();
            }
        }

        private get _heikinAshiPlotter(): _IPlotter {
            if (this.__heikinAshiPlotter === null) {
                this.__heikinAshiPlotter = new _HeikinAshiPlotter();
                this._initPlotter(this.__heikinAshiPlotter);
            }
            return this.__heikinAshiPlotter;
        }

        private get _lineBreakPlotter(): _IPlotter {
            if (this.__lineBreakPlotter === null) {
                this.__lineBreakPlotter = new _LineBreakPlotter();
                this._initPlotter(this.__lineBreakPlotter);
            }
            return this.__lineBreakPlotter;
        }

        private get _renkoPlotter(): _IPlotter {
            if (this.__renkoPlotter === null) {
                this.__renkoPlotter = new _RenkoPlotter();
                this._initPlotter(this.__renkoPlotter);
            }
            return this.__renkoPlotter;
        }

        private get _kagiPlotter(): _IPlotter {
            if (this.__kagiPlotter === null) {
                this.__kagiPlotter = new _KagiPlotter();
                this._initPlotter(this.__kagiPlotter);
            }
            return this.__kagiPlotter;
        }

        _getChartType(): chart.ChartType {
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
        }

        _getPlotter(series: FinancialSeries): _IPlotter {
            var chartType = this.chartType,
                plotter: any = null,
                isSeries = false;

            if (series) {
                var stype = series.chartType;
                if (stype && !isUndefined(stype) && stype != chartType) {
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
                    plotter = super._getPlotter(series);
                    plotter.isVolume = true;
                    plotter.width = 1;
                    break;
                case FinancialChartType.EquiVolume:
                    plotter = super._getPlotter(series);
                    plotter.isEqui = true;
                    plotter.isCandle = false;
                    plotter.isArms = false;
                    plotter.isVolume = true;
                    plotter.symbolWidth = "100%";
                    break;
                case FinancialChartType.CandleVolume:
                    plotter = super._getPlotter(series);
                    plotter.isEqui = false;
                    plotter.isCandle = true;
                    plotter.isArms = false;
                    plotter.isVolume = true;
                    plotter.symbolWidth = "100%";
                    break;
                case FinancialChartType.ArmsCandleVolume:
                    plotter = super._getPlotter(series);
                    plotter.isEqui = false;
                    plotter.isCandle = false;
                    plotter.isArms = true;
                    plotter.isVolume = true;
                    plotter.symbolWidth = "100%";
                    break;
                // no plotter found for FinancialChartType - try based on ChartType
                default:
                    plotter = super._getPlotter(series);
                    break;
            }

            return plotter;
        }

        _createSeries(): SeriesBase {
            return new FinancialSeries();
        }
    }
}