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
            "use strict";
            // Plotter for Line Break FinancialChartType
            var _LineBreakPlotter = (function (_super) {
                __extends(_LineBreakPlotter, _super);
                function _LineBreakPlotter() {
                    _super.call(this);
                }
                _LineBreakPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._newLineBreaks = null;
                };
                _LineBreakPlotter.prototype._calculate = function (series) {
                    this._init();
                    var closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;
                    this._calculator = new finance._LineBreakCalculator(null, null, null, closes, xs, this._newLineBreaks);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }
                    // always regenerate x-axis labels at the end of each calculation cycle
                    this._generateXLabels(series);
                };
                _LineBreakPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);
                    // NewLineBreaks
                    this._newLineBreaks = wijmo.asInt(this.getNumOption("newLineBreaks", "lineBreak"), true, true) || 3;
                    wijmo.assert(this._newLineBreaks >= 1, "Value must be greater than 1");
                };
                return _LineBreakPlotter;
            }(finance._BaseRangePlotter));
            finance._LineBreakPlotter = _LineBreakPlotter;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_LineBreakPlotter.js.map