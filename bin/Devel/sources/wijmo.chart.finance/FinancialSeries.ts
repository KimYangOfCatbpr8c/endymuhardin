module wijmo.chart.finance {
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
    export class FinancialSeries extends SeriesBase {
        private _finChartType;

        /**
         * Gets or sets the chart type for a specific series, overriding the chart type
         * set on the overall chart. Please note that ColumnVolume, EquiVolume,
         * CandleVolume and ArmsCandleVolume chart types are not supported and should be
         * set on the @see:FinancialChart.
         */
        get chartType(): FinancialChartType {
            return this._finChartType;
        }
        set chartType(value: FinancialChartType) {
            if (value != this._finChartType) {
                this._finChartType = asEnum(value, FinancialChartType, true);
                this._invalidate();
            }
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
    }
}