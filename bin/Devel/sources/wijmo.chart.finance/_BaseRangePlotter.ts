module wijmo.chart.finance {
    "use strict";

    // Abstract plotter for range based FinancialChartTypes
    export class _BaseRangePlotter extends _BasePlotter {
        private _symFactor = 0.7;

        // used for calculating derived data set
        _calculator: _BaseRangeCalculator;

        // storage for derived data set
        _rangeValues: _IFinanceItem[];

        // acts as itemsSource for X-Axis based on derived data set
        _rangeXLabels: any[];

        constructor() {
            super();
            this.clear();
        }

        clear(): void {
            super.clear();
            this._rangeValues = null;
            this._rangeXLabels = null;
            this._calculator = null;
        }

        unload(): void {
            super.unload();

            var series: SeriesBase,
                ax: Axis;

            for (var i = 0; i < this.chart.series.length; i++) {
                series = this.chart.series[i];
                if (!series) { continue; }
                ax = series._getAxisX();

                // reset AxisX.itemsSource
                if (ax && ax.itemsSource) {
                    ax.itemsSource = null;
                }
            }
        }

        // todo: possibly add support for multiple series *later* (i.e. overlays/indicators)
        // todo: better way to adjust x limits?
        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
            var series: FinancialSeries,
                arrTemp: number[], xTemp: number[],
                xmin = 0, xmax = 0,
                ymin = 0, ymax = 0,
                ax: Axis,
                padding = this.chart._xDataType === DataType.Date ? 0.5 : 0;

            // only one supported at the moment - possibly remove later for overlays & indicators
            assert(this.chart.series.length <= 1, "Current FinancialChartType only supports a single series");

            // looping for future - will need adjusted (see above)
            for (var i = 0; i < this.chart.series.length; i++) {
                series = this.chart.series[i];
                this._calculate(series);

                if (this._rangeValues.length <= 0 || this._rangeXLabels.length <= 0) { continue; }

                // create temporary array for calculating ymin & ymax
                arrTemp = this._rangeValues.map((value: _IFinanceItem) => value.open);
                arrTemp.push.apply(arrTemp, this._rangeValues.map((value: _IFinanceItem) => value.close));

                // create temp array for xmin & xmax
                xTemp = this._rangeXLabels.map((current) => current.value);

                // update y-axis
                ymin = Math.min.apply(null, arrTemp);
                ymax = Math.max.apply(null, arrTemp);

                // update x-axis and set itemsSource
                xmin = Math.min.apply(null, xTemp);
                xmax = Math.max.apply(null, xTemp);
                ax = series._getAxisX();
                ax.itemsSource = this._rangeXLabels;
            }

            xmin -= padding;
            return new Rect(xmin, ymin, xmax - xmin + padding, ymax - ymin);
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: FinancialSeries, palette: _IPalette, iser: number, nser: number): void {
            this._calculate(series);

            var si = this.chart.series.indexOf(series),
                len = this._rangeValues.length,
                xmin = ax.actualMin,
                xmax = ax.actualMax,
                strWidth = this._DEFAULT_WIDTH,
                symSize = this._symFactor,
                fill = series._getSymbolFill(si),
                altFill = series._getAltSymbolFill(si) || "transparent",
                stroke = series._getSymbolStroke(si),
                altStroke = series._getAltSymbolStroke(si) || stroke;

            engine.strokeWidth = strWidth;

            var itemIndex = 0,
                x: number, start: number, end: number,
                dpt: _DataPoint;

            for (var i = 0; i < len; i++) {
                x = i;
                if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                    start = this._rangeValues[i].open;
                    end = this._rangeValues[i].close;

                    // symbol fill and stroke
                    engine.fill = start > end ? fill : altFill;
                    engine.stroke = start > end ? stroke : altStroke;

                    // manually specify values for HitTestInfo
                    // for Bars - dataY should be the top of the bar
                    dpt = this._getDataPoint(si, i, series, Math.max(start, end));

                    engine.startGroup();

                    if (this.chart.itemFormatter) {
                        var hti = new HitTestInfo(this.chart, new Point(ax.convert(x), ay.convert(end)), ChartElement.SeriesSymbol);
                        hti._setData(series, i);
                        hti._setDataPoint(dpt);

                        this.chart.itemFormatter(engine, hti, () => {
                            this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                        });
                    } else {
                        this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                    }

                    engine.endGroup();

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }

        _drawSymbol(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, si: number, pi: number, w: number, x: number, start: number, end: number, dpt: _DataPoint): void {
            var y0: number, y1: number,
                x1: number, x2: number,
                area: _IHitArea;

            x1 = ax.convert(x - 0.5 * w);
            x2 = ax.convert(x + 0.5 * w);
            if (x1 > x2) {
                var tmp = x1; x1 = x2; x2 = tmp;
            }
            //x = ax.convert(x);

            if (_DataInfo.isValid(start) && _DataInfo.isValid(end)) {
                start = ay.convert(start);
                end = ay.convert(end);
                y0 = Math.min(start, end);
                y1 = y0 + Math.abs(start - end);

                engine.drawRect(x1, y0, x2 - x1, y1 - y0);

                area = new _RectArea(new Rect(x1, y0, x2 - x1, y1 - y0));
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
        }

        // generates _DataPoint for hit test support
        _getDataPoint(seriesIndex: number, pointIndex: number, series: SeriesBase, dataY: number): _DataPoint {
            var x = pointIndex,
                dpt = new _DataPoint(seriesIndex, pointIndex, x, dataY),
                item = series._getItem(this._rangeValues[pointIndex].pointIndex),
                bndX = series.bindingX || this.chart.bindingX,
                bndHigh = series._getBinding(0),
                bndLow = series._getBinding(1),
                bndOpen = series._getBinding(2),
                bndClose = series._getBinding(3),
                ay = series._getAxisY();

            // set item related data and maintain original bindings
            dpt["item"] = _BasePlotter.cloneStyle(item, []);
            dpt["item"][bndHigh] = this._rangeValues[pointIndex].high;
            dpt["item"][bndLow] = this._rangeValues[pointIndex].low;
            dpt["item"][bndOpen] = this._rangeValues[pointIndex].open;
            dpt["item"][bndClose] = this._rangeValues[pointIndex].close;

            // set x & y related data
            dpt["y"] = this._rangeValues[pointIndex].close;
            dpt["yfmt"] = ay._formatValue(this._rangeValues[pointIndex].close);
            dpt["x"] = dpt["item"][bndX];
            dpt["xfmt"] = this._rangeXLabels[pointIndex]._text;

            return dpt;
        }

        // initialize variables for calculations
        _init(): void {
            this._rangeValues = [];
            this._rangeXLabels = [];
        }

        // abstract method
        _calculate(series: FinancialSeries): void { }

        // generates new labels for the x-axis based on derived data
        _generateXLabels(series: FinancialSeries): void {
            var textVal: string,
                ax = series._getAxisX(),
                dataType = series.getDataType(1) || this.chart._xDataType;

            // todo: find a better way and/or separate
            this._rangeValues.forEach((value: _IFinanceItem, index: number) => {
                var val = value.x;
                if (dataType === DataType.Date) {
                    textVal = Globalize.format(FlexChart._fromOADate(val), ax.format || "d");
                } else if (dataType === DataType.Number) {
                    textVal = ax._formatValue(val);
                } else if ((dataType === null || dataType === DataType.String) && this.chart._xlabels) {
                    textVal = this.chart._xlabels[val];
                } else {
                    textVal = val.toString();
                }

                // _text property will be used as a backup for the text property
                // there could be cases, like Renko, where text is cleared
                this._rangeXLabels.push({ value: index, text: textVal, _text: textVal });
            }, this);
        }

        // provides access to any value within FlexChartCore's "options" property
        getOption(name: string, parent?: string): any {
            var options = this.chart.options;
            if (parent) {
                options = options ? options[parent] : null;
            }
            if (options && !isUndefined(options[name]) && options[name] !== null) {
                return options[name];
            }
            return undefined;
        }
    }

    /**
     * Specifies which fields are to be used for calculation. Applies to Renko and Kagi chart types.
     */
    export enum DataFields {
        /** Close values are used for calculations. */
        Close,
        /** High values are used for calculations. */
        High,
        /** Low values are used for calculations. */
        Low,
        /** Open values are used for calculations. */
        Open,
        /** High-Low method is used for calculations. DataFields.HighLow is currently not
         * supported with Renko chart types. */
        HighLow,
        /** Average of high and low values is used for calculations. */
        HL2,
        /** Average of high, low, and close values is used for calculations. */
        HLC3,
        /** Average of high, low, open, and close values is used for calculations. */
        HLOC4
    }

    /**
     * Specifies the unit for Kagi and Renko chart types.
     */
    export enum RangeMode {
        /** Uses a fixed, positive number for the Kagi chart's reversal amount
         * or Renko chart's box size. */
        Fixed,
        /** Uses the current Average True Range value for Kagi chart's reversal amount
         * or Renko chart's box size. When ATR is used, the reversal amount or box size
         * option of these charts must be an integer and will be used as the period for 
         * the ATR calculation. */
        ATR,
        /** Uses a percentage for the Kagi chart's reversal amount. RangeMode.Percentage
         * is currently not supported with Renko chart types. */
        Percentage
    }
}