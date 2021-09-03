/**
 * Defines the @see:FlexChart control and its associated classes.
 *
 * The example below creates a @see:FlexChart control and binds it to a data array.
 * The chart has three series, each corresponding to a property in the objects 
 * contained in the source array.
 *
 * The last series in the example uses the @see:Series.chartType property to
 * override the default chart type used
 * by the other series.
 *
 * @fiddle:6GB66
 */
module wijmo.chart {
    'use strict';

    /**
     * Specifies the chart type.
     */
    export enum ChartType {
        /** Shows vertical bars and allows you to compare values of items across categories. */
        Column,
        /** Shows horizontal bars. */
        Bar,
        /** Shows patterns within the data using X and Y coordinates. */
        Scatter,
        /** Shows trends over a period of time or across categories. */
        Line,
        /** Shows line chart with a symbol on each data point. */
        LineSymbols,
        /** Shows line chart with the area below the line filled with color. */
        Area,
        /** Shows Scatter chart with a third data value that determines the 
         * size of the symbol. The data for this chart type can be defined using the 
         *  @see:FlexChart or @see:Series <b>binding</b> property as a comma separated value in the 
         * following format: "yProperty, bubbleSizeProperty".*/
        Bubble,
        /** Presents items with high, low, open, and close values.
         * The size of the wick line is determined by the High and Low values, 
         * while the size of the bar is determined by the Open and Close values. 
         * The bar is displayed using different colors, depending on 
         * whether the close value is higher or lower than the open value. 
         * The data for this chart type can be defined using the 
         *  @see:FlexChart or @see:Series <b>binding</b> property as a comma separated value in the 
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        Candlestick,
        /** Displays the same information as a candlestick chart, except that opening 
         * values are displayed using lines to the left, while lines to the right
         * indicate closing values.  The data for this chart type can be defined using the 
         *  @see:FlexChart or @see:Series <b>binding</b> property as a comma separated value in the 
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        HighLowOpenClose,
        /** Displays line chart that plots curves rather than angled lines through the
        * data points. */
        Spline,
        /** Displays spline chart with symbols on each data point. */
        SplineSymbols,
        /** Displays spline chart with the area below the line filled with color. */
        SplineArea,
        /** Displays funnel chart.*/
        Funnel,
        /** Displays Box & Whisker chart.*/
        BoxPlot
    }

    /**
     * The @see:FlexChart control provides a powerful and flexible way to visualize
     * data.
     *
     * You can use the @see:FlexChart control to create charts that display data in
     * several formats, including bar, line, symbol, bubble, and others.
     *
     * To use the @see:FlexChart control, set the @see:FlexChart.itemsSource property
     * to an array containing the data objects, then add one or more @see:Series objects
     * to the @see:FlexChart.series property.
     *
     * Use the @see:FlexChart.chartType property to define the @see:ChartType used as
     * a default for all series. You may override the chart type for each series by
     * setting the @see:Series.chartType property on the members of the
     * @see:FlexChart.series array.
     */
    export class FlexChart extends FlexChartCore {

        private _chartType = ChartType.Column;

        /**
         * Initializes a new instance of the @see:FlexChart class.
         *
         * @param element The DOM element that will host the control, 
         * or a selector for the host element (e.g. '#theCtrl').
         * @param options A JavaScript object containing initialization data
         * for the control.
         */
        constructor(element: any, options?) {
            super(element, null);
            this.initialize(options);
        }

        _getChartType(): ChartType {
            return this._chartType;
        }

        /**
         * Gets or sets the type of chart to create.
         */
        get chartType(): ChartType {
            return this._chartType;
        }
        set chartType(value: ChartType) {
            if (value != this._chartType) {
                this._chartType = asEnum(value, ChartType);
                this.invalidate();
            }
        }

        /**
         * Gets or sets a value indicating whether to flip the axes so that 
         * X is vertical and Y is horizontal.
         */
        get rotated(): boolean {
            return this._rotated;
        }
        set rotated(value: boolean) {
            if (value != this._rotated) {
                this._rotated = asBoolean(value);
                this.invalidate();
            }
        }

        /**
         * Gets or sets a value that determines whether and how the series objects are stacked.
         */
        get stacking(): Stacking {
            return this._stacking;
        }
        set stacking(value: Stacking) {
            if (value != this._stacking) {
                this._stacking = asEnum(value, Stacking);
                this.invalidate();
            }
        }

        /**
         * Gets or sets various chart options.
         *
         * The following options are supported:
         *
         * <b>bubble.maxSize</b>: Specifies the maximum size
         * of symbols in the Bubble chart. The default value is 30 pixels.
         *
         * <b>bubble.minSize</b>: Specifies the minimum size
         * of symbols in the Bubble chart. The default value is 5 pixels.
         *
         * <pre>chart.options = {
         *   bubble: { minSize: 5, maxSize: 30 }
         * }</pre>
         *
         *
         * <b>funnel.neckWidth</b>: Specifies the neck width as a percentage for the Funnel chart.
         * The default value is 0.2.
         *
         * <b>funnel.neckHeight</b>: Specifies the neck height as a percentage for the Funnel chart.
         * The default value is 0.
         *
         * <b>funnel.type</b>: Specifies the type of Funnel chart. It should be 'rectangle' or 'default'.
         * neckWidth and neckHeight don't work if type is set to rectangle.
         *
         * <pre>chart.options = {
         *   funnel: { neckWidth: 0.3, neckHeight: 0.3, type: 'rectangle' }
         * }</pre>

         * <b>boxPlot.groupWidth</b>: Specifies the group width as a percentage for the Box&Whisker chart.
         * The default value is 0.8.
         *
         * <b>boxPlot.gapWidth</b>: Specifies the gap width as a percentage for the Box&Whisker chart.
         * The default value is 0.1.
         *
         * <b>boxPlot.showMeanLine</b>: Specifies whether to show the mean line for the Box&Whisker chart.
         * The default value is false.
         *
         * <b>boxPlot.meanLineStyle</b>: Specifies the style for the mean line.
         *
         * <b>boxPlot.showMeanMarker</b>: Specifies whether to show the mean marker for the Box&Whisker chart.
         * The default value is false.
         *
         * <b>boxPlot.showInnerPoints</b>: Specifies whether to show the inner points for the Box&Whisker chart.
         * The default value is false.
         *
         * <b>boxPlot.showOutliers</b>: Specifies whether to show the outliers for the Box&Whisker chart.
         * The default value is false.
         *
         * <b>boxPlot.meanMarkerStyle</b>: Specifies the style for the mean marker.

         * <b>boxPlot.quartileCalculation</b>: Specifies the quartile calculation for the Box&Whisker chart.
         *  It should be 'include' or 'exclude' for Inclusive Median and Exclusive Median.
         *
         * <pre>chart.options = {
         *   boxPlot: { groupWidth: 0.5, neckHeight: 0.3, showMeanMarker: true, showMeanLine: true }
         * }</pre>

         * <b>groupWidth</b>: Specifies the group width for the Column charts, 
         * or the group height for the Bar charts. The group width can be specified
         * in pixels or as percentage of the available space. The default value is '70%'.
         *
         * <pre>chart.options = {
         *   groupWidth : 50; // 50 pixels
         * }
         * chart.options = {
         *   groupWidth : '100%'; // 100% pixels
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
    }
}