/**
 * Defines classes that add analytics features to charts including @see:TrendLine,
 * @see:MovingAverage and @see:FunctionSeries.
 */
module wijmo.chart.analytics {
    'use strict';

    /**
     * Represents base class for various trend lines.
     */
    export class TrendLineBase extends SeriesBase {

        private _sampleCount: number;
        private _bind: string;
        private _bindX: string;
        _xValues: any[];
        _yValues: any[];
        _originXValues: any[];
        _originYValues: any[];
        
        /**
         * Initializes a new instance of the @see:TrendLineBase class.
         * 
         * @param options A JavaScript object containing initialization data for the TrendLineBase Series.
         */
        constructor(options?) {
            super();
            this._chartType = ChartType.Line;
            this._initProperties(options || {});
        }
        
        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the sample count for function calculation. 
         * The property doesn't apply for MovingAverage.
         */
        get sampleCount(): number {
            return this._sampleCount;
        }
        set sampleCount(value: number) {
            if (value === this._sampleCount) {
                return;
            }
            this._sampleCount = asNumber(value, false, true);
            this._invalidate();
        }

        //--------------------------------------------------------------------------
        //** implementation


        /**
         * Gets the approximate y value from the given x value.
         * 
         * @param x The x value to be used for calculating the Y value.
         */
        approximate(x: number): number {
            return 0;
        }

        getValues(dim: number): number[]{
            var self = this,
                bind = self.binding,
                bindX = self.bindingX;

            //reset binding and bindingX to trendline base.
            if (bind !== self._bind) {
                self._bind = bind;
                self.binding = bind;
            }
            if (bindX !== self._bindX) {
                self._bindX = bindX;
                self.bindingX = bindX;
            }

            if (self._originYValues == null) {
                self._originYValues = super.getValues(0);
            }
            if (self._originXValues == null) {
                self._originXValues = super.getValues(1);
            }
            if (self._originXValues == null || self._originYValues == null) {
                return null;
            }
            super.getValues(dim);

            if (self._xValues == null || self._yValues == null) {
                self._calculateValues();
            }

            if (dim === 0) {
                //y
                return self._yValues || null;
            } else if (dim === 1) {
                //x
                return self._xValues || null;
            }
        }

        _calculateValues() {
        }

        _initProperties(o) {
            var self = this,
                key;

            self._sampleCount = 100;

            for (key in o) {
                if (self[key]) {
                    self[key] = o[key];
                }
            }
        }

        _invalidate() {
            super._invalidate();
            this._clearCalculatedValues();
        }

        _clearValues() {
            super._clearValues();

            this._originXValues = null;
            this._originYValues = null;
            this._clearCalculatedValues();
        }

        _clearCalculatedValues() {
            this._xValues = null;
            this._yValues = null;
        }

    }

}