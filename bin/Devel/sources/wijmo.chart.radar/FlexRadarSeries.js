var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var radar;
        (function (radar) {
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
            var FlexRadarSeries = (function (_super) {
                __extends(FlexRadarSeries, _super);
                function FlexRadarSeries() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(FlexRadarSeries.prototype, "chartType", {
                    /**
                     * Gets or sets the chart type for a specific series, overriding the chart type
                     * set on the overall chart. Please note that ColumnVolume, EquiVolume,
                     * CandleVolume and ArmsCandleVolume chart types are not supported and should be
                     * set on the @see:FinancialChart.
                     */
                    get: function () {
                        return this._finChartType;
                    },
                    set: function (value) {
                        if (value != this._finChartType) {
                            this._finChartType = wijmo.asEnum(value, radar.RadarChartType, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexRadarSeries.prototype._getChartType = function () {
                    var ct;
                    switch (this.chartType) {
                        case radar.RadarChartType.Area:
                            ct = chart.ChartType.Area;
                            break;
                        case radar.RadarChartType.Line:
                            ct = chart.ChartType.Line;
                            break;
                        case radar.RadarChartType.Column:
                            ct = chart.ChartType.Column;
                            break;
                        case radar.RadarChartType.LineSymbols:
                            ct = chart.ChartType.LineSymbols;
                            break;
                        case radar.RadarChartType.Scatter:
                            ct = chart.ChartType.Scatter;
                            break;
                    }
                    return ct;
                };
                FlexRadarSeries.prototype._getLabelPoint = function (dataPoint) {
                    var ax = this._getAxisX(), ay = this._getAxisY(), angle = ax.convert(dataPoint.dataX), radius = ay.convert(dataPoint.dataY);
                    return this.chart._convertPoint(radius, angle);
                };
                return FlexRadarSeries;
            }(chart.SeriesBase));
            radar.FlexRadarSeries = FlexRadarSeries;
        })(radar = chart.radar || (chart.radar = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexRadarSeries.js.map