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
        var _BubblePlotter = (function (_super) {
            __extends(_BubblePlotter, _super);
            function _BubblePlotter() {
                _super.call(this);
                this._MIN_SIZE = 5;
                this._MAX_SIZE = 30;
                this.hasLines = false;
                this.hasSymbols = true;
                this.clipping = true;
            }
            _BubblePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                var minSize = this.getNumOption('minSize', 'bubble');
                this._minSize = minSize ? minSize : this._MIN_SIZE;
                var maxSize = this.getNumOption('maxSize', 'bubble');
                this._maxSize = maxSize ? maxSize : this._MAX_SIZE;
                var series = this.chart.series;
                var len = series.length;
                var min = NaN;
                var max = NaN;
                for (var i = 0; i < len; i++) {
                    var ser = series[i];
                    var vals = ser._getBindingValues(1);
                    if (vals) {
                        var vlen = vals.length;
                        for (var j = 0; j < vlen; j++) {
                            if (chart._DataInfo.isValid(vals[j])) {
                                if (isNaN(min) || vals[j] < min) {
                                    min = vals[j];
                                }
                                if (isNaN(max) || vals[j] > max) {
                                    max = vals[j];
                                }
                            }
                        }
                    }
                }
                this._minValue = min;
                this._maxValue = max;
                var rect = _super.prototype.adjustLimits.call(this, dataInfo, plotRect);
                var ax = this.chart.axisX, ay = this.chart.axisY;
                // adjust only for non-log axes
                if (ax.logBase <= 0) {
                    var w = plotRect.width - this._maxSize;
                    var kw = w / rect.width;
                    rect.left -= this._maxSize * 0.5 / kw;
                    rect.width += this._maxSize / kw;
                }
                if (ay.logBase <= 0) {
                    var h = plotRect.height - this._maxSize;
                    var kh = h / rect.height;
                    rect.top -= this._maxSize * 0.5 / kh;
                    rect.height += this._maxSize / kh;
                }
                return rect;
            };
            _BubblePlotter.prototype._drawSymbol = function (engine, x, y, sz, series, pointIndex) {
                var _this = this;
                var item = series._getItem(pointIndex);
                if (item) {
                    var szBinding = series._getBinding(1);
                    if (szBinding) {
                        var sz = item[szBinding];
                        if (chart._DataInfo.isValid(sz)) {
                            var k = this._minValue == this._maxValue ? 1 :
                                Math.sqrt((sz - this._minValue) / (this._maxValue - this._minValue));
                            sz = this._minSize + (this._maxSize - this._minSize) * k;
                            if (this.chart.itemFormatter) {
                                var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(x, y), chart.ChartElement.SeriesSymbol);
                                hti._setData(series, pointIndex);
                                engine.startGroup();
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                                });
                                engine.endGroup();
                            }
                            else {
                                this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                            }
                            var areas = this.hitTester._map[this.chart.series.indexOf(series)];
                            if (areas != null) {
                                var len = areas.length;
                                for (var i = len - 1; i >= 0; i--) {
                                    var area = areas[i];
                                    if (area.tag && area.tag.pointIndex == pointIndex) {
                                        var ca = wijmo.tryCast(area, chart._CircleArea);
                                        if (ca)
                                            ca.setRadius(0.5 * sz);
                                    }
                                }
                            }
                        }
                    }
                }
            };
            return _BubblePlotter;
        }(chart._LinePlotter));
        chart._BubblePlotter = _BubblePlotter;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_BubblePlotter.js.map