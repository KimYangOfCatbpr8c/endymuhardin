module wijmo.chart.analytics {
    'use strict';

    /**
     * Represents a Waterfall series of @see:wijmo.chart.FlexChart.
     *
     * The @see:Waterfall series is normally used to demonstrate how the starting
     * position either increases or decreases through a series of changes.
     */
    export class Waterfall extends SeriesBase {
        static CSS_CONNECTOR_LINE_GROUP = 'water-fall-connector-lines';
        static CSS_CONNECTOR_LINE = 'water-fall-connector-line';
        static CSS_ENDLABEL = 'water-fall-end-label';
        _barPlotter: _BarPlotter;
        private _start: number;
        private _startLabel: string = 'Start';
        private _relativeData: boolean = true;
        private _connectorLines: boolean = false;
        private _showTotal: boolean;
        private _totalLabel: string = 'Total';
        private _styles: any;
        private _wfstyle: any;
        private _xValues: any[];
        private _getXValues: boolean = false;
        private _yValues: any[];
        private _showIntermediateTotal: boolean = false;
        private _intermediateTotalPositions: number[];
        private _intermediateTotalLabels: any;
        private _intermediateTotalPos: any[] = [];

        /**
         * Initializes a new instance of the @see:Waterfall class.
         * 
         * @param options A JavaScript object containing initialization data for 
         * the Waterfall Series.
         */
        constructor(options?) {
            super();
            this._chartType = ChartType.Bar;
            this._initProperties(options || {});
            this.rendering.addHandler(this._rendering, this);
        }

        private _initProperties(o) {
            for (var key in o) {
                if (this[key]) {
                    this[key] = o[key];
                }
            }
        }

        _clearValues() {
            super._clearValues();
            this._xValues = null;
            this._yValues = null;
            this._wfstyle = null;
            this._getXValues = true;
            this._intermediateTotalPos = [];
            if (this.chart) {
                //clear x labels.
                this.chart._performBind();
            }
        }

        /**
        * Gets or sets a value that determines whether the given data is relative.
         */
        get relativeData(): boolean {
            return !!this._relativeData;
        }
        set relativeData(value: boolean) {
            if (value != this._relativeData) {
                this._relativeData = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
        * Gets or sets a value that determines the value of the start bar.
        * If start is null, start bar will not show.
         */
        get start(): number {
            return this._start;
        }
        set start(value: number) {
            if (value != this._start) {
                this._start = asNumber(value, true);
                this._invalidate();
            }
        }

        /**
        * Gets or sets the label of the start bar.
         */
        get startLabel(): string {
            return this._startLabel;
        }
        set startLabel(value: string) {
            if (value != this._startLabel) {
                this._startLabel = asString(value, false);
                this._invalidate();
            }
        }

        /**
        * Gets or sets a value that determines whether to show the total bar.
         */
        get showTotal(): boolean {
            return !!this._showTotal;
        }
        set showTotal(value: boolean) {
            if (value != this._showTotal) {
                this._showTotal = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
        * Gets or sets the label of the total bar.
         */
        get totalLabel(): string {
            return this._totalLabel;
        }
        set totalLabel(value: string) {
            if (value != this._totalLabel) {
                this._totalLabel = asString(value, false);
                this._invalidate();
            }
        }

        /**
         * Gets or sets a value that determines whether to show the intermediate total bar.
         * The property should work with @see:intermediateTotalPositions and
         * @see:intermediateTotalLabels property.
         */
        get showIntermediateTotal(): boolean {
            return this._showIntermediateTotal;
        }
        set showIntermediateTotal(value: boolean) {
            if (value != this._showIntermediateTotal) {
                this._showIntermediateTotal = asBoolean(value, false);
                this._invalidate();
             }
        }

        /**
         * Gets or sets a value of the property that contains the index for positions
         * of the intermediate total bar. The property should work with
         * @see:showIntermediateTotal and @see:intermediateTotalLabels property.
         */
        get intermediateTotalPositions(): number[] {
            return this._intermediateTotalPositions;
        }
        set intermediateTotalPositions(value: number[]) {
            if (value != this._intermediateTotalPositions) {
                this._intermediateTotalPositions = asArray(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets a value of the property that contains the label of the intermediate
         * total bar; it should be an array or a string. The property should work with
         * @see:showIntermediateTotal and @see:intermediateTotalPositions property.
         */
        get intermediateTotalLabels(): any {
            return this._intermediateTotalLabels;
        }
        set intermediateTotalLabels(value: any) {
            if (value != this._intermediateTotalLabels) {
                assert(value == null || isArray(value) || isString(value), 'intermediateTotalLabels should be an array or a string.');
                this._intermediateTotalLabels = value;
                this._invalidate();
            }
        }

        /**
        * Gets or sets a value that determines whether to show connector lines.
         */
        get connectorLines(): boolean {
            return !!this._connectorLines;
        }
        set connectorLines(value: boolean) {
            if (value != this._connectorLines) {
                this._connectorLines = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the waterfall styles.
         *
         * The following styles are supported:
         *
         * <b>start</b>: Specifies the style of the start column.
         *
         * <b>total</b>: Specifies the style of the total column.
         *
         * <b>intermediateTotal</b>: Specifies the style of the intermediate total column.
         *
         * <b>falling</b>: Specifies the style of the falling columns.
         *
         * <b>rising</b>: Specifies the style of the rising columns.
         *
         * <b>connectorLines</b>: Specifies the style of the connectorLines.
         *
         * <pre>waterfall.styles = {
         *   start: {
         *      fill: 'blue',
         *      stroke: 'blue'
         *   },
         *   total: {
         *      fill: 'yellow',
         *      stroke: 'yellow'
         *   },
         *   falling: {
         *      fill: 'red',
         *      stroke: 'red'
         *   },
         *   rising: {
         *      fill: 'green',
         *      stroke: 'green'
         *   },
         *   connectorLines: {
         *      stroke: 'blue',
         *      'stroke-dasharray': '10, 10'
         *   }
         * }</pre>
         */
        get styles(): any {
            return this._styles;
        }
        set styles(value: any) {
            if (value != this._styles) {
                this._styles = value;
                this._invalidate();
            }
        }

        getValues(dim: number): number[] {
            var val = [],
                original, xVals, yVals, xLabels, maxX, len, offset = 0;

            original = super.getValues(dim);
            if (dim === 0) {
                if (!this._yValues) {
                    if (this.relativeData) {
                        var val = [];
                        if (original) {
                            original.reduce((a, b) => {
                                val.push(a + b);
                                return a + b;
                            }, 0);
                            this._yValues = val;
                        }
                    } else {
                        this._yValues = original && original.slice();
                    }
                    yVals = this._yValues;
                    if (yVals && yVals.length > 0) {
                        if (this.showIntermediateTotal && this.intermediateTotalPositions && this.intermediateTotalPositions.length > 0) {
                            this._intermediateTotalPos = yVals.slice();
                            this.intermediateTotalPositions.reduceRight((prev, curr) => {
                                var val = curr === 0 ? yVals[0] : yVals[curr - 1];
                                if (yVals.length > curr) {
                                    yVals.splice(curr, 0, val);
                                    this._intermediateTotalPos.splice(curr, 0, true);
                                } else if (yVals.length === curr) {
                                    yVals.push(val);
                                    this._intermediateTotalPos.push(true);
                                }
                                return 0;
                            }, 0);
                        }
                        if (this.start != null) {
                            yVals.splice(0, 0, this.start);
                            this._intermediateTotalPos.splice(0, 0, false);
                        }
                        if (this.showTotal && yVals) {
                            yVals.push(yVals[yVals.length - 1]);
                        }
                    }
                }
                return this._yValues;
            } else {
                if (!this._xValues && this._getXValues) {
                    this._xValues = original && original.slice();
                    this._getXValues = false;
                    if (this._xValues && this._xValues.length > 1) {
                        len = this._xValues.length;
                        maxX = this._xValues[len - 1];
                        offset = Math.abs(this._xValues[len - 1] - this._xValues[len - 2]);
                    }
                    if (this.chart && this.chart._xlabels && this.chart._xlabels.length) {
                        xLabels = this.chart._xlabels;
                        if (this.showIntermediateTotal && this.intermediateTotalPositions && this.intermediateTotalPositions.length > 0) {
                            var itLabels = this.intermediateTotalLabels;
                            if (itLabels) {
                                this.intermediateTotalPositions.reduceRight((prev, curr, idx) => {
                                    var lbl = '';
                                    if (wijmo.isString(itLabels)) {
                                        lbl = itLabels;
                                    } else {
                                        lbl = itLabels[idx] || '';
                                    }
                                    if (xLabels.length > curr) {
                                        xLabels.splice(curr, 0, lbl);
                                    } else if (xLabels.length === curr) {
                                        xLabels.push(lbl);
                                    }
                                    if (offset) {
                                        maxX += offset;
                                        this._xValues.push(maxX);
                                    }
                                    return 0;
                                }, 0);
                            }
                        }
                        if (this.start != null) {
                            xLabels.splice(0, 0, this.startLabel);
                            if (offset) {
                                maxX += offset;
                                this._xValues.push(maxX);
                            }
                        }
                        if (this.showTotal) {
                            xLabels.push(this.totalLabel);
                            if (offset) {
                                maxX += offset;
                                this._xValues.push(maxX);
                            }
                        }
                    }
                }
                return this._xValues;
            }
        }

        _invalidate() {
            super._invalidate();
            this._clearValues();
        }

        private _rendering(sender: SeriesBase, args: RenderEventArgs): void {
            this._wfstyle = null;
            var chart = this.chart,
                axisY = this._getAxisY(),
                axisX = this._getAxisX(),
                origin = axisY.origin || 0,
                engine: IRenderEngine = args.engine,
                i, len, rotated, areas, area, falling;
            
            this._barPlotter = <_BarPlotter>chart._getPlotter(this);
            rotated = this._barPlotter.rotated;
            if (!this._barPlotter._getSymbolOrigin) {
                this._barPlotter._getSymbolOrigin = (origin, i, len) => {
                    if (i === 0) {
                        //first
                        return origin;
                    } else if (this._intermediateTotalPos[i] === true) {
                        //intermediateTotal
                        return origin;
                    } else if (i === len - 1 && this.showTotal) {
                        //last
                        return origin;
                    } else {
                        return this._yValues[i - 1];
                    }

                };
            }
            if (!this._barPlotter._getSymbolStyles) {
                this._barPlotter._getSymbolStyles = (i, len) => {
                    var wfStyle = this._getStyles(),
                        style = <any>{};

                    if (i === 0 && this.start != null) {
                        //first
                        style = wfStyle.start;
                    } else if (this._intermediateTotalPos[i] === true) {
                        //intermediateTotal
                        style = wfStyle.intermediateTotal;
                    } else if (i === len - 1 && this.showTotal) {
                        //last
                        style = wfStyle.total;
                    } else {
                        if (this._yValues[i] < this._yValues[i - 1]) {
                            //falling
                            style = wfStyle.falling;
                        } else {
                            //rising
                            style = wfStyle.rising;
                        }
                    }
                    return style;
                };
            }
            this._barPlotter.plotSeries(engine, axisX, axisY, sender, chart, 0, 1);

            if (this.connectorLines) {
                engine.startGroup(Waterfall.CSS_CONNECTOR_LINE_GROUP);
                areas = this._barPlotter.hitTester._map[0];
                falling = this._yValues[0] < origin;
                area = areas[0].rect;
                for (i = 1, len = areas.length; i < len; i++) {
                    if (this._intermediateTotalPos[i] === true && i !== len - 1) {
                        continue;
                    }
                    this._drawConnectorLine(engine, rotated, area, areas[i].rect, falling);
                    area = areas[i].rect;
                    falling = this._yValues[i] < this._yValues[i - 1];
                }
                engine.endGroup();
            }
        }

        private _getStyles() {
            if (this._wfstyle) {
                return this._wfstyle;
            }
            var chart = this._chart,
                index = chart.series.indexOf(this),
                fill = this._getSymbolFill(index),
                stroke = this._getSymbolStroke(index),
                s = this.styles || {},
                style: any = {};

            this._wfstyle = {
                start: this._getStyleByKey(s, 'start', fill, stroke),
                intermediateTotal: this._getStyleByKey(s, 'intermediateTotal', fill, stroke),
                total: this._getStyleByKey(s, 'total', fill, stroke),
                falling: this._getStyleByKey(s, 'falling', 'red', 'red'),
                rising: this._getStyleByKey(s, 'rising', 'green', 'green')
            };

            return this._wfstyle;
        }

        private _getStyleByKey(styles, key, fill, stroke) {
            return {
                fill: styles[key] && styles[key].fill ? styles[key].fill : fill,
                stroke: styles[key] && styles[key].stroke ? styles[key].stroke : stroke
            }
        }

        private _drawConnectorLine(engine: IRenderEngine, rotated: boolean, prevArea: Rect, currArea: Rect, falling) {
            var p1 = new Point(), p2 = new Point();

            if (rotated) {
                if (falling) {
                    p1.x = prevArea.left;
                    p1.y = prevArea.top + prevArea.height;
                    p2.x = prevArea.left;
                    p2.y = currArea.top;
                } else {
                    p1.x = prevArea.left + prevArea.width;
                    p1.y = prevArea.top + prevArea.height;
                    p2.x = prevArea.left + prevArea.width;
                    p2.y = currArea.top;
                }
            } else {
                if (falling) {
                    p1.x = prevArea.left;
                    p1.y = prevArea.top + prevArea.height;
                    p2.x = currArea.left + currArea.width;
                    p2.y = prevArea.top + prevArea.height;
                } else {
                    p1.x = prevArea.left;
                    p1.y = prevArea.top;
                    p2.x = currArea.left + currArea.width;
                    p2.y = prevArea.top;
                }
            }
            engine.drawLine(p1.x, p1.y, p2.x, p2.y, Waterfall.CSS_CONNECTOR_LINE, (this.styles && this.styles.connectorLines) || { stroke: 'black' });
        }

        legendItemLength(): number {
            return (this.showTotal) ? 3 : 2;
        }

        measureLegendItem(engine: IRenderEngine, index: number): Size {
            var name = this._getName(index),
                retval = new Size(0, 0);

            if (name) {
                retval = this._measureLegendItem(engine, this._getName(index));
            }

            return retval;
        }

        drawLegendItem(engine: IRenderEngine, rect: Rect, index: number): void {
            var style = this._getLegendStyles(index),
                name = this._getName(index);

            if (name) {
                this._drawLegendItem(engine, rect, ChartType.Bar, this._getName(index), style, this.symbolStyle);
            }
        }

        // helper for series with multiple styles
        // Returns the appropriate style for the given index, if
        // ones exists; null is returned otherwise.
        private _getLegendStyles(index: number): any {
            if (index < 0 || this.styles === null) {
                return null;
            }

            var styles = this._getStyles();

            if (index === 0) {
                //rising
                return styles.rising;
            } else if (index === 1) {
                //falling
                return styles.falling;
            } else {
                //total
                return styles.total;
            }
        }

        // helper for series with multiple names (csv)
        // Returns undefined or the name.
        private _getName(index: number): string {
            var retval: string = undefined;

            if (this.name) {
                if (this.name.indexOf(",")) {
                    var names = this.name.split(",");
                    if (names && names.length - 1 >= index) {
                        retval = names[index].trim();
                    }
                } else {
                    retval = this.name;
                }
            }

            return retval;
        }
    }
}