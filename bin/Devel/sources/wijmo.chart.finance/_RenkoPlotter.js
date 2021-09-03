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
            // Plotter for Renko FinancialChartType
            var _RenkoPlotter = (function (_super) {
                __extends(_RenkoPlotter, _super);
                function _RenkoPlotter() {
                    _super.call(this);
                }
                _RenkoPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._boxSize = null;
                    this._rangeMode = null;
                };
                _RenkoPlotter.prototype._calculate = function (series) {
                    this._init();
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;
                    this._calculator = new finance._RenkoCalculator(highs, lows, opens, closes, xs, this._boxSize, this._rangeMode, this._fields, this._rounding);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }
                    // always regenerate x-axis labels at the end of each calculation cycle
                    this._generateXLabels(series);
                };
                _RenkoPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);
                    // BoxSize
                    this._boxSize = this.getNumOption("boxSize", "renko") || 14;
                    // RangeMode
                    this._rangeMode = this.getOption("rangeMode", "renko") || finance.RangeMode.Fixed;
                    this._rangeMode = wijmo.asEnum(this._rangeMode, finance.RangeMode, true);
                    wijmo.assert(this._rangeMode !== finance.RangeMode.Percentage, "RangeMode.Percentage is not supported");
                    // DataFields
                    this._fields = this.getOption("fields", "renko") || finance.DataFields.Close;
                    this._fields = wijmo.asEnum(this._fields, finance.DataFields, true);
                    // todo: figure out HighLow
                    wijmo.assert(this._fields !== finance.DataFields.HighLow, "DataFields.HighLow is not supported");
                    // rounding - internal only
                    this._rounding = wijmo.asBoolean(this.getOption("rounding", "renko"), true);
                };
                _RenkoPlotter.prototype._generateXLabels = function (series) {
                    var _this = this;
                    _super.prototype._generateXLabels.call(this, series);
                    // bricks may have duplicate x-labels - prevent that behavior
                    this._rangeXLabels.forEach(function (value, index) {
                        // compare current item's text property to the previous item's _text property (backup for text)
                        if (index > 0 && _this._rangeXLabels[index - 1]._text === value.text) {
                            value.text = "";
                        }
                    }, this);
                };
                return _RenkoPlotter;
            }(finance._BaseRangePlotter));
            finance._RenkoPlotter = _RenkoPlotter;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_RenkoPlotter.js.map