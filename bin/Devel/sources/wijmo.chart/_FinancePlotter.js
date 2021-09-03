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
        var _FinancePlotter = (function (_super) {
            __extends(_FinancePlotter, _super);
            function _FinancePlotter() {
                _super.apply(this, arguments);
                this.isCandle = true;
                this.isArms = false;
                this.isEqui = false;
                this.isVolume = false;
                this._volHelper = null;
                this._symWidth = 0.7;
            }
            _FinancePlotter.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this._volHelper = null;
            };
            _FinancePlotter.prototype.load = function () {
                _super.prototype.load.call(this);
                if (!this.isVolume) {
                    return;
                }
                var series, ax, ct, vols, dt, i, xvals, itemsSource, xmin = null, xmax = null;
                // loop through series collection
                for (i = 0; i < this.chart.series.length; i++) {
                    series = this.chart.series[i];
                    dt = series.getDataType(1) || series.chart._xDataType;
                    ax = series._getAxisX();
                    // get volume data based on chart type
                    ct = series._getChartType();
                    ct = ct === null || wijmo.isUndefined(ct) ? this.chart._getChartType() : ct;
                    if (ct === chart.ChartType.Column) {
                        vols = series._getBindingValues(1);
                    }
                    else if (ct === chart.ChartType.Candlestick) {
                        vols = series._getBindingValues(4);
                    }
                    else {
                        vols = null;
                    }
                    // get x values directly for dates, otherwise get from dataInfo
                    if (dt === wijmo.DataType.Date) {
                        var date;
                        xvals = [];
                        itemsSource = [];
                        for (i = 0; i < series._getLength(); i++) {
                            date = series._getItem(i)[series.bindingX].valueOf();
                            xvals.push(date);
                            itemsSource.push({
                                value: date,
                                text: wijmo.Globalize.format(new Date(date), ax.format || "d")
                            });
                        }
                    }
                    else {
                        xvals = this.dataInfo.getXVals();
                    }
                    xmin = this.dataInfo.getMinX();
                    xmax = this.dataInfo.getMaxX();
                    if (vols && vols.length > 0) {
                        this._volHelper = new chart._VolumeHelper(vols, xvals, xmin, xmax, dt);
                        ax._customConvert = this._volHelper.convert.bind(this._volHelper);
                        ax._customConvertBack = this._volHelper.convertBack.bind(this._volHelper);
                        if (itemsSource && itemsSource.length > 0) {
                            this._itemsSource = ax.itemsSource = itemsSource;
                        }
                        break; // only one set of volume data is supported per chart
                    }
                }
            };
            _FinancePlotter.prototype.unload = function () {
                _super.prototype.unload.call(this);
                var series, ax;
                for (var i = 0; i < this.chart.series.length; i++) {
                    series = this.chart.series[i];
                    ax = series._getAxisX();
                    if (ax) {
                        ax._customConvert = null;
                        ax._customConvertBack = null;
                        if (ax.itemsSource && ax.itemsSource == this._itemsSource) {
                            this._itemsSource = ax.itemsSource = null;
                        }
                    }
                }
            };
            _FinancePlotter.prototype.parseSymbolWidth = function (val) {
                this._isPixel = undefined;
                if (val) {
                    if (wijmo.isNumber(val)) {
                        // px
                        var wpix = wijmo.asNumber(val);
                        if (isFinite(wpix) && wpix > 0) {
                            this._symWidth = wpix;
                            this._isPixel = true;
                        }
                    }
                    else if (wijmo.isString(val)) {
                        var ws = wijmo.asString(val);
                        // %
                        if (ws && ws.indexOf('%') >= 0) {
                            ws = ws.replace('%', '');
                            var wn = parseFloat(ws);
                            if (isFinite(wn)) {
                                if (wn < 0) {
                                    wn = 0;
                                }
                                else if (wn > 100) {
                                    wn = 100;
                                }
                                this._symWidth = wn / 100;
                                this._isPixel = false;
                            }
                        }
                        else {
                            // px
                            var wn = parseFloat(val);
                            if (isFinite(wn) && wn > 0) {
                                this._symWidth = wn;
                                this._isPixel = true;
                            }
                        }
                    }
                }
            };
            _FinancePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;
                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();
                var dx = dataInfo.getDeltaX();
                var dt = this.chart._xDataType;
                if (dx <= 0) {
                    dx = 1;
                }
                var series = this.chart.series;
                var len = series.length;
                var swmax = 0;
                this.parseSymbolWidth(this.symbolWidth);
                // init/cleanup volume conversions for x-axis based on ChartType/FinancialChartType mappings
                if (this.isVolume && (this.chart._getChartType() === chart.ChartType.Column || this.chart._getChartType() === chart.ChartType.Candlestick)) {
                    this.load();
                }
                else {
                    this.unload();
                }
                for (var i = 0; i < len; i++) {
                    var ser = series[i];
                    if (ser._isCustomAxisY()) {
                        continue;
                    }
                    var bndLow = ser._getBinding(1), bndOpen = ser._getBinding(2), bndClose = ser._getBinding(3);
                    var slen = ser._getLength();
                    if (slen) {
                        var sw = ser._getSymbolSize();
                        if (sw > swmax) {
                            swmax = sw;
                        }
                        for (var j = 0; j < slen; j++) {
                            var item = ser._getItem(j);
                            if (item) {
                                var yvals = [bndLow ? item[bndLow] : null,
                                    bndOpen ? item[bndOpen] : null,
                                    bndClose ? item[bndClose] : null];
                                yvals.forEach(function (yval) {
                                    if (chart._DataInfo.isValid(yval) && yval !== null) {
                                        if (isNaN(ymin) || yval < ymin) {
                                            ymin = yval;
                                        }
                                        if (isNaN(ymax) || yval > ymax) {
                                            ymax = yval;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                // adjust limits according to symbol size unless volume-based
                var xrng = xmax - xmin;
                var pr = this.chart._plotRect;
                if (pr && pr.width && !this.isVolume) {
                    sw += 2;
                    var xrng1 = pr.width / (pr.width - sw) * xrng;
                    xmin = xmin - 0.5 * (xrng1 - xrng);
                    xrng = xrng1;
                }
                if (dt === wijmo.DataType.Date && this.isVolume && (this.chart._getChartType() === chart.ChartType.Column || this.chart._getChartType() === chart.ChartType.Candlestick)) {
                    return new wijmo.Rect(xmin - 0.5 * dx, ymin, xmax - xmin + dx, ymax - ymin);
                }
                else {
                    return this.chart._isRotated() ? new wijmo.Rect(ymin, xmin, ymax - ymin, xrng) : new wijmo.Rect(xmin, ymin, xrng, ymax - ymin);
                }
            };
            _FinancePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var _this = this;
                var ser = wijmo.asType(series, chart.SeriesBase);
                var si = this.chart.series.indexOf(series);
                var highs = series.getValues(0);
                var xs = series.getValues(1);
                var sw = this._symWidth, rotated = this.chart._isRotated();
                if (!highs) {
                    return;
                }
                if (!xs) {
                    xs = this.dataInfo.getXVals();
                }
                if (xs) {
                    // find minimal distance between point and use it as column width
                    var delta = this.dataInfo.getDeltaX();
                    if (delta > 0 && this._isPixel === false) {
                        sw *= delta;
                    }
                }
                //var style = this.cloneStyle(series.style, null);// ['fill']);
                var len = highs.length;
                var hasXs = true;
                if (!xs) {
                    hasXs = false;
                    xs = new Array(len);
                }
                else {
                    len = Math.min(len, xs.length);
                }
                var swidth = this._DEFAULT_WIDTH, fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || "transparent", stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke, symSize = this._isPixel === undefined ? ser._getSymbolSize() : sw;
                engine.stroke = stroke;
                engine.strokeWidth = swidth;
                engine.fill = fill;
                var bndLow = ser._getBinding(1);
                var bndOpen = ser._getBinding(2);
                var bndClose = ser._getBinding(3);
                var xmin = rotated ? ay.actualMin : ax.actualMin, xmax = rotated ? ay.actualMax : ax.actualMax;
                var itemIndex = 0, currentFill, currentStroke, item = null, prevItem = null;
                for (var i = 0; i < len; i++) {
                    item = ser._getItem(i);
                    if (item) {
                        var x = hasXs ? xs[i] : i;
                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            var hi = highs[i];
                            var lo = bndLow ? item[bndLow] : null;
                            var open = bndOpen ? item[bndOpen] : null;
                            var close = bndClose ? item[bndClose] : null;
                            engine.startGroup();
                            if (this.isEqui && prevItem !== null) {
                                // if price is the same as previous, use previous color for now - possibly introduce a neutral color
                                if (prevItem[bndClose] !== item[bndClose]) {
                                    currentFill = prevItem[bndClose] < item[bndClose] ? altFill : fill;
                                    currentStroke = prevItem[bndClose] < item[bndClose] ? altStroke : stroke;
                                }
                            }
                            else {
                                currentFill = open < close ? altFill : fill;
                                currentStroke = open < close ? altStroke : stroke;
                            }
                            engine.fill = currentFill;
                            engine.stroke = currentStroke;
                            if (this.chart.itemFormatter) {
                                var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(hi)), chart.ChartElement.SeriesSymbol);
                                hti._setData(ser, i);
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close);
                                });
                            }
                            else {
                                this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close);
                            }
                            engine.endGroup();
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                        prevItem = item;
                    }
                }
            };
            _FinancePlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, fill, w, x, hi, lo, open, close) {
                var dpt = new chart._DataPoint(si, pi, x, hi);
                var area;
                var y0 = null, y1 = null, x1 = null, x2 = null, rotated = this.chart._isRotated();
                if (rotated) {
                    var axtmp = ay;
                    ay = ax;
                    ax = axtmp;
                }
                if (this._isPixel === false) {
                    x1 = ax.convert(x - 0.5 * w);
                    x2 = ax.convert(x + 0.5 * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }
                }
                x = ax.convert(x);
                if (this._isPixel !== false) {
                    x1 = x - 0.5 * w;
                    x2 = x + 0.5 * w;
                }
                if (this.isCandle) {
                    if (chart._DataInfo.isValid(open) && chart._DataInfo.isValid(close)) {
                        open = ay.convert(open);
                        close = ay.convert(close);
                        y0 = Math.min(open, close);
                        y1 = y0 + Math.abs(open - close);
                        if (rotated) {
                            engine.drawRect(y0, x1, y1 - y0, x2 - x1);
                            area = new chart._RectArea(new wijmo.Rect(y0, x1, y1 - y0, x2 - x1));
                        }
                        else {
                            engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                            area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        }
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (chart._DataInfo.isValid(hi)) {
                        hi = ay.convert(hi);
                        if (y0 !== null) {
                            if (rotated) {
                                engine.drawLine(y1, x, hi, x);
                            }
                            else {
                                engine.drawLine(x, y0, x, hi);
                            }
                        }
                    }
                    if (chart._DataInfo.isValid(lo)) {
                        lo = ay.convert(lo);
                        if (y1 !== null) {
                            if (rotated) {
                                engine.drawLine(y0, x, lo, x);
                            }
                            else {
                                engine.drawLine(x, y1, x, lo);
                            }
                        }
                    }
                }
                else if (this.isEqui) {
                    if (chart._DataInfo.isValid(hi) && chart._DataInfo.isValid(lo)) {
                        hi = ay.convert(hi);
                        lo = ay.convert(lo);
                        y0 = Math.min(hi, lo);
                        y1 = y0 + Math.abs(hi - lo);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                        area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                }
                else if (this.isArms) {
                    // inner box
                    if (chart._DataInfo.isValid(open) && chart._DataInfo.isValid(close)) {
                        open = ay.convert(open);
                        close = ay.convert(close);
                        y0 = Math.min(open, close);
                        y1 = y0 + Math.abs(open - close);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                    }
                    // high line
                    if (chart._DataInfo.isValid(hi) && y0 !== null) {
                        hi = ay.convert(hi);
                        engine.drawLine(x, y0, x, hi);
                    }
                    // low line
                    if (chart._DataInfo.isValid(lo) && y1 !== null) {
                        lo = ay.convert(lo);
                        engine.drawLine(x, y1, x, lo);
                    }
                    // outer box
                    if (chart._DataInfo.isValid(hi) && chart._DataInfo.isValid(lo)) {
                        engine.fill = "transparent";
                        y0 = Math.min(hi, lo);
                        y1 = y0 + Math.abs(hi - lo);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                        area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                }
                else {
                    if (chart._DataInfo.isValid(hi) && chart._DataInfo.isValid(lo)) {
                        hi = ay.convert(hi);
                        lo = ay.convert(lo);
                        y0 = Math.min(hi, lo);
                        y1 = y0 + Math.abs(hi - lo);
                        if (rotated) {
                            engine.drawLine(lo, x, hi, x);
                            area = new chart._RectArea(new wijmo.Rect(y0, x1, y1 - y0, x2 - x1));
                        }
                        else {
                            engine.drawLine(x, lo, x, hi);
                            area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        }
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (chart._DataInfo.isValid(open)) {
                        open = ay.convert(open);
                        if (rotated) {
                            engine.drawLine(open, x1, open, x);
                        }
                        else {
                            engine.drawLine(x1, open, x, open);
                        }
                    }
                    if (chart._DataInfo.isValid(close)) {
                        close = ay.convert(close);
                        if (rotated) {
                            engine.drawLine(close, x, close, x2);
                        }
                        else {
                            engine.drawLine(x, close, x2, close);
                        }
                    }
                }
            };
            return _FinancePlotter;
        }(chart._BasePlotter));
        chart._FinancePlotter = _FinancePlotter;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FinancePlotter.js.map