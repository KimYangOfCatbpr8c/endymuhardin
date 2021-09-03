module wijmo.chart {
    'use strict';

    /**
     * Represents a series of data points to display in the chart.
     *
     * The @see:Series class supports all basic chart types. You may define
     * a different chart type on each @see:Series object that you add to the 
     * @see:FlexChart series collection. This overrides the @see:chartType 
     * property set on the chart that is the default for all @see:Series objects
     * in its collection.
     */
    export class Series extends SeriesBase {
        /**
         * Gets or sets the chart type for a specific series, overriding the chart type 
         * set on the overall chart. 
         */
        get chartType(): ChartType {
            return this._chartType;
        }
        set chartType(value: ChartType) {
            if (value != this._chartType) {
                this._chartType = asEnum(value, ChartType, true);
                this._invalidate();
            }
        }
    }
} 