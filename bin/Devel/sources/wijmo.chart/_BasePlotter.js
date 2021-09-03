var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        'use strict';
        /**
         * Base class for chart plotters of all types (bar, line, area).
         */
        var _BasePlotter = (function () {
            function _BasePlotter() {
                this._DEFAULT_WIDTH = 2;
                this._DEFAULT_SYM_SIZE = 10;
                this.clipping = true;
            }
            _BasePlotter.prototype.clear = function () {
                this.seriesCount = 0;
                this.seriesIndex = 0;
            };
            _BasePlotter.prototype.getNumOption = function (name, parent) {
                var options = this.chart.options;
                if (parent) {
                    options = options ? options[parent] : null;
                }
                if (options && options[name]) {
                    return wijmo.asNumber(options[name], true);
                }
                return undefined;
            };
            _BasePlotter.cloneStyle = function (style, ignore) {
                if (!style) {
                    return style;
                }
                var newStyle = {};
                for (var key in style) {
                    if (ignore && ignore.indexOf(key) >= 0) {
                        continue;
                    }
                    newStyle[key] = style[key];
                }
                return newStyle;
            };
            _BasePlotter.prototype.isValid = function (datax, datay, ax, ay) {
                return chart._DataInfo.isValid(datax) && chart._DataInfo.isValid(datay) &&
                    chart.FlexChart._contains(this.chart._plotRect, new wijmo.Point(datax, datay));
            };
            _BasePlotter.prototype.load = function () {
            };
            _BasePlotter.prototype.unload = function () {
            };
            return _BasePlotter;
        }());
        chart._BasePlotter = _BasePlotter;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_BasePlotter.js.map