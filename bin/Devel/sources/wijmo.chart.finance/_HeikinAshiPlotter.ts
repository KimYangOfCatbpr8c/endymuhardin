module wijmo.chart.finance {
    "use strict";

    // Plotter for Heikin-Ashi FinancialChartType
    export class _HeikinAshiPlotter extends _FinancePlotter {
        private _haValues: _IFinanceItem[];
        private _calculator: _BaseCalculator;
        private _symFactor = 0.7;

        constructor() {
            super();
            this.clear();
        }

        clear(): void {
            super.clear();
            this._haValues = null;
            this._calculator = null;
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: FinancialSeries, palette: _IPalette, iser: number, nser: number): void {
            this._calculate(series);

            var ser: SeriesBase = asType(series, SeriesBase),
                si = this.chart.series.indexOf(series),
                xs = series.getValues(1),
                sw = this._symFactor;

            var len = this._haValues.length,
                hasXs = true;

            if (!xs) {
                xs = this.dataInfo.getXVals();
            } else {
                // find minimal distance between point and use it as column width
                var delta = this.dataInfo.getDeltaX();
                if (delta > 0) {
                    sw *= delta;
                }
            }

            if (!xs) {
                hasXs = false;
                xs = new Array<number>(len);
            } else {
                len = Math.min(len, xs.length);
            }

            var swidth = this._DEFAULT_WIDTH,
                fill = ser._getSymbolFill(si),
                altFill = ser._getAltSymbolFill(si) || "transparent",
                stroke = ser._getSymbolStroke(si),
                altStroke = ser._getAltSymbolStroke(si) || stroke,
                //symSize = ser._getSymbolSize(),
                //symStyle = series.symbolStyle,
                symSize = sw,
                dt = series.getDataType(1) || series.chart._xDataType;

            engine.strokeWidth = swidth;

            var xmin = ax.actualMin,
                xmax = ax.actualMax,
                itemIndex = 0,
                currentFill: string, currentStroke: string,
                x: any, dpt: _DataPoint,
                hi: number, lo: number, open: number, close: number;

            for (var i = 0; i < len; i++) {
                x = hasXs ? xs[i] : i;

                if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                    hi = this._haValues[i].high;
                    lo = this._haValues[i].low;
                    open = this._haValues[i].open;
                    close = this._haValues[i].close;

                    currentFill = open < close ? altFill : fill;
                    currentStroke = open < close ? altStroke : stroke;
                    engine.fill = currentFill;
                    engine.stroke = currentStroke;

                    engine.startGroup();

                    // manually specify values for HitTestInfo
                    dpt = this._getDataPoint(si, i, x, series);

                    if (this.chart.itemFormatter) {
                        var hti = new HitTestInfo(this.chart, new Point(ax.convert(x), ay.convert(hi)), ChartElement.SeriesSymbol);
                        hti._setData(ser, i);
                        hti._setDataPoint(dpt);

                        this.chart.itemFormatter(engine, hti,() => {
                            this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                        });
                    } else {
                        this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                    }
                    engine.endGroup();

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }

        // modified variation of FinancialPlotter's implementation - added optional _DataPoint parameter
        _drawSymbol(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, si: number, pi: number, fill: any, w: number,
                    x: number, hi: number, lo: number, open: number, close: number, dpt?: _DataPoint, dt?: DataType) {
            var area: _RectArea,
                y0 = null, y1 = null,
                x1 = null, x2 = null,
                half = dt === DataType.Date ? 43200000 : 0.5;   // todo: better way?

            x1 = ax.convert(x - half * w);
            x2 = ax.convert(x + half * w);
            if (x1 > x2) {
                var tmp = x1; x1 = x2; x2 = tmp;
            }
            x = ax.convert(x);

            if (_DataInfo.isValid(open) && _DataInfo.isValid(close)) {
                open = ay.convert(open);
                close = ay.convert(close);
                y0 = Math.min(open, close);
                y1 = y0 + Math.abs(open - close);

                engine.drawRect(x1, y0, x2 - x1, y1 - y0);

                area = new _RectArea(new Rect(x1, y0, x2 - x1, y1 - y0));
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
            if (_DataInfo.isValid(hi)) {
                hi = ay.convert(hi);
                if (y0 !== null) {
                    engine.drawLine(x, y0, x, hi);
                }
            }
            if (_DataInfo.isValid(lo)) {
                lo = ay.convert(lo);
                if (y1 !== null) {
                    engine.drawLine(x, y1, x, lo);
                }
            }
        }

        // generates _DataPoint for hit test support
        _getDataPoint(seriesIndex: number, pointIndex: number, x: any, series: SeriesBase): _DataPoint {
            var dpt = new _DataPoint(seriesIndex, pointIndex, x, this._haValues[pointIndex].high),
                item = series._getItem(pointIndex),
                bndHigh = series._getBinding(0),
                bndLow = series._getBinding(1),
                bndOpen = series._getBinding(2),
                bndClose = series._getBinding(3),
                ay = series._getAxisY();

            // set item related data and maintain original binding
            dpt["item"] = _BasePlotter.cloneStyle(item, []);
            dpt["item"][bndHigh] = this._haValues[pointIndex].high;
            dpt["item"][bndLow] = this._haValues[pointIndex].low;
            dpt["item"][bndOpen] = this._haValues[pointIndex].open;
            dpt["item"][bndClose] = this._haValues[pointIndex].close;

            // set y related data
            dpt["y"] = this._haValues[pointIndex].high;
            dpt["yfmt"] = ay._formatValue(this._haValues[pointIndex].high);
            // don't set "x" or "xfmt" values - can use default behavior

            return dpt;
        }

        private _calculate(series: FinancialSeries): void {
            var highs = series._getBindingValues(0),
                lows = series._getBindingValues(1),
                opens = series._getBindingValues(2),
                closes = series._getBindingValues(3);

            this._calculator = new _HeikinAshiCalculator(highs, lows, opens, closes);
            this._haValues = this._calculator.calculate();
            if (this._haValues === null || isUndefined(this._haValues)) {
                this._init();
            }
        }

        private _init(): void {
            this._haValues = [];
        }
    }
}