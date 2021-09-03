var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
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
        var Series = (function (_super) {
            __extends(Series, _super);
            function Series() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Series.prototype, "chartType", {
                /**
                 * Gets or sets the chart type for a specific series, overriding the chart type
                 * set on the overall chart.
                 */
                get: function () {
                    return this._chartType;
                },
                set: function (value) {
                    if (value != this._chartType) {
                        this._chartType = wijmo.asEnum(value, chart.ChartType, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            return Series;
        }(chart.SeriesBase));
        chart.Series = Series;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Series.js.map