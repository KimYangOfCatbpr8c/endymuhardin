module wijmo.chart.analytics {
    'use strict';

    /**
     * Represents a Fibonacci tool for @see:FlexChart and @see:FinancialChart.
     */ 
    export class Fibonacci extends SeriesBase {
        private _high: number;
        private _low: number;
        private _actualHigh: number;
        private _actualLow: number;
        private _levels: number[] = [0, 23.6, 38.2, 50, 61.8, 100];
        private _uptrend = true;
        private _labelPosition: LabelPosition = LabelPosition.Left;

        /**
         * Initializes a new instance of the @see:Fibonacci class.
         */ 
        constructor() {
            super();
            this.rendering.addHandler(this._render);
        }

        /**
         * Gets or sets the low value of @see:Fibonacci tool.
         */
        get low(): number {
            return this._low;
        }
        set low(value: number) {
            if (value != this._low) {
                this._low = asNumber(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the high value of @see:Fibonacci tool.
         */
        get high(): number {
            return this._high;
        }
        set high(value: number) {
            if (value != this._high) {
                this._high = asNumber(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the label position of @see:Fibonacci tool.
         */
        get labelPosition(): LabelPosition {
            return this._labelPosition;
        }
        set labelPosition(value: LabelPosition) {
            if (value != this._labelPosition) {
                this._labelPosition= asEnum(value, LabelPosition, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
         *
         * Default value is true(uptrend). If value is false the downtrending levels are plotted.
         */
        get uptrend(): boolean {
            return this._uptrend;
        }
        set uptrend(value: boolean) {
            if (value != this._uptrend) {
                this._uptrend = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the array of levels for plotting.
         *
         * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
         */
        get levels(): number[] {
            return this._levels;
        }
        set levels(value: number[]) {
            if (value != this._levels) {
                this._levels = asArray(value, true);
                this._invalidate();
            }
        }

        getValues(dim: number): number[]{
            return null;
        }

        private _updateLevels() {
            var min = undefined,
                max = undefined;
            if (this._low === undefined || this._high === undefined) {
                var vals = super.getValues(0);
                if (vals) {
                    var len = vals.length;
                    
                    for (var i = 0; i < len; i++) {
                        var val = vals[i];
                        if (!isNaN(val)) {
                            if (min === undefined || min > val) {
                                min = val;
                            }
                            if (max === undefined || max < val) {
                                max = val;
                            }
                        }
                    }
                }
            }

            if (this._low === undefined && min !== undefined) {
                this._actualLow = min;
            } else {
                this._actualLow = this._low;
            }

            if (this._high === undefined && max !== undefined) {
                this._actualHigh = max;
            } else {
                this._actualHigh = this._high;
            }
        }

        private _render(sender, args: RenderEventArgs) {
            var ser = <Fibonacci>sender;
            ser._updateLevels();

            var ax = ser._getAxisX();
            var ay = ser._getAxisY();
            var eng = args.engine;

            var swidth = 2,
                stroke = ser._getSymbolStroke(ser._chart.series.indexOf(ser));

            var lstyle = _BasePlotter.cloneStyle(ser.style, ['fill']);
            var tstyle = _BasePlotter.cloneStyle(ser.style, ['stroke']);

            eng.stroke = stroke;
            eng.strokeWidth = swidth;
            eng.textFill = stroke;

            var llen = ser._levels ? ser._levels.length : 0;
            for (var i = 0; i < llen; i++) {
                var lvl = ser._levels[i];
                var x1 = ax.convert(ax.actualMin),
                    x2 = ax.convert(ax.actualMax);
                var y = ser.uptrend ?
                    ay.convert(ser._actualLow + 0.01 * lvl * (ser._actualHigh - ser._actualLow)):
                    ay.convert(ser._actualHigh - 0.01 * lvl * (ser._actualHigh - ser._actualLow));

                if (_DataInfo.isValid(x1) && _DataInfo.isValid(x2) && _DataInfo.isValid(y)) {
                    eng.drawLine(x1, y, x2, y, null, lstyle);

                    if (ser.labelPosition!= LabelPosition.None) {
                        var s = lvl.toFixed(1) + '%';
                        var va = 0;
                        if ((ser.uptrend && i == 0) || (!ser.uptrend && i == llen - 1)) {
                            va = 2;
                        } 

                        switch (ser.labelPosition) {
                            case LabelPosition.Left:
                                FlexChartCore._renderText(eng, s, new Point(x1, y), 0, va, null, null, tstyle);
                                break;
                            case LabelPosition.Center:
                                FlexChartCore._renderText(eng, s, new Point( 0.5*(x1+x2), y), 1, va, null, null, tstyle);
                                break;
                            case LabelPosition.Right:
                                FlexChartCore._renderText(eng, s, new Point(x2, y), 2, va, null, null, tstyle);
                                break;
                        }
                    }
                }
            }

            eng.stroke = null;
            eng.strokeWidth = null;
            eng.textFill = null;
        }
    }
} 