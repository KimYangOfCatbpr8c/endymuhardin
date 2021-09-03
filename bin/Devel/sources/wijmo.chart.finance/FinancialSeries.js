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
            var FinancialSeries = (function (_super) {
                __extends(FinancialSeries, _super);
                function FinancialSeries() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(FinancialSeries.prototype, "chartType", {
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
                            this._finChartType = wijmo.asEnum(value, finance.FinancialChartType, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                FinancialSeries.prototype._getChartType = function () {
                    var ct = null;
                    switch (this.chartType) {
                        case finance.FinancialChartType.Area:
                            ct = chart.ChartType.Area;
                            break;
                        case finance.FinancialChartType.Line:
                        case finance.FinancialChartType.Kagi:
                            ct = chart.ChartType.Line;
                            break;
                        case finance.FinancialChartType.Column:
                        case finance.FinancialChartType.ColumnVolume:
                            ct = chart.ChartType.Column;
                            break;
                        case finance.FinancialChartType.LineSymbols:
                            ct = chart.ChartType.LineSymbols;
                            break;
                        case finance.FinancialChartType.Scatter:
                            ct = chart.ChartType.Scatter;
                            break;
                        case finance.FinancialChartType.Candlestick:
                        case finance.FinancialChartType.Renko:
                        case finance.FinancialChartType.HeikinAshi:
                        case finance.FinancialChartType.LineBreak:
                        case finance.FinancialChartType.EquiVolume:
                        case finance.FinancialChartType.CandleVolume:
                        case finance.FinancialChartType.ArmsCandleVolume:
                            ct = chart.ChartType.Candlestick;
                            break;
                        case finance.FinancialChartType.HighLowOpenClose:
                            ct = chart.ChartType.HighLowOpenClose;
                            break;
                    }
                    return ct;
                };
                return FinancialSeries;
            }(chart.SeriesBase));
            finance.FinancialSeries = FinancialSeries;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FinancialSeries.js.map