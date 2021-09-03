module wijmo.chart.radar {
    'use strict';

    /**
     * Represents a series of data points to display in the chart.
     *
     * The @see:FlexRadarSeries class supports all basic chart types. You may define
     * a different chart type on each @see:FlexRadarSeries object that you add to the
     * @see:FlexRadar series collection. This overrides the @see:chartType
     * property set on the chart that is the default for all @see:FlexRadarSeries objects
     * in its collection.
     */
    export class FlexRadarSeries extends SeriesBase {
        private _finChartType;

        /**
         * Gets or sets the chart type for a specific series, overriding the chart type
         * set on the overall chart. Please note that ColumnVolume, EquiVolume,
         * CandleVolume and ArmsCandleVolume chart types are not supported and should be
         * set on the @see:FinancialChart.
         */
        get chartType(): RadarChartType {
            return this._finChartType;
        }
        set chartType(value: RadarChartType) {
            if (value != this._finChartType) {
                this._finChartType = asEnum(value, RadarChartType, true);
                this._invalidate();
            }
        }

        _getChartType(): chart.ChartType {
            var ct;
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
        }

        _getLabelPoint(dataPoint: _DataPoint): Point {
            var ax = this._getAxisX(),
                ay = this._getAxisY(),
                angle = ax.convert(dataPoint.dataX),
                radius = ay.convert(dataPoint.dataY);

            return (<any>this.chart)._convertPoint(radius, angle);
        }
    }
}