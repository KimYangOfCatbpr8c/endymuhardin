module wijmo.chart.analytics {
    'use strict';

    /**
     * Represents a base class of function series for @see:wijmo.chart.FlexChart.
     */
    export class FunctionSeries extends TrendLineBase {
        private _min: number;
        private _max: number;

        /**
         * Initializes a new instance of the @see:FunctionSeries class.
         * 
         * @param options A JavaScript object containing initialization data for the 
         * FunctionSeries.
         */
        constructor(options?) {
            super(options);

            if (this.itemsSource == null) {
                this.itemsSource = [new Point(0, 0)];
            }
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the minimum value of the parameter for calculating a function. 
         */
        get min(): number {
            return this._min;
        }
        set min(value: number) {
            if (this._min !== value) {
                this._min = asNumber(value, false);
                this._invalidate();
            }
        }
        
        /**
         * Gets or sets the maximum value of the parameter for calculating a function.
         */
        get max(): number {
            return this._max;
        }
        set max(value: number) {
            if (this._max !== value) {
                this._max = asNumber(value, false);
                this._invalidate();
            }
        }

        //--------------------------------------------------------------------------
        //** implementation

        getValues(dim: number): number[] {
            var self = this;

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

        _initProperties(o) {
            this._min = 0;
            this._max = 1;
            super._initProperties(o);
        }

        _calculateValues() {
            var self = this,
                npts = self.sampleCount,
                x: number[] = [],
                y: number[] = [],
                delta = (self.max - self.min) / (npts - 1),
                t: number;

            for (var i = 0; i < npts; i++) {
                t = i === npts - 1 ? this.max : this.min + delta * i;

                x[i] = self._calculateX(t);
                y[i] = self._calculateY(t);
            }

            self._yValues = y;
            self._xValues = x;
        }

        // performs simple validation of data value
        _validateValue(value: number): number {
            return isFinite(value) ? value : Number.NaN;
        }

        // calculate the value of the function
        _calculateValue(func: Function, parameter: number): number {
            var value: number;

            try {
                value = func(parameter);
            }
            catch (ex) {
                value = Number.NaN;
            }

            return this._validateValue(value);
        }

        _calculateX(value: number): number {
            return 0;
        }

        _calculateY(value: number): number {
            return 0;
        }
    }


    /**
     * Represents a Y function series of @see:wijmo.chart.FlexChart.
     *
     * The @see::YFunctionSeries allows to plot a function defined by formula y=f(x). 
     */
    export class YFunctionSeries extends FunctionSeries {
        private _func: Function;

        /**
         * Initializes a new instance of the @see:YFunctionSeries class.
         * 
         * @param options A JavaScript object containing initialization data for the
         * YFunctionSeries.
         */
        constructor(options?) {
            super(options);
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the function used to calculate Y value. 
         */
        get func(): Function {
            return this._func;
        }
        set func(value: Function) {
            if (value && this._func !== value) {
                this._func = asFunction(value, false);
                this._invalidate();
            }
        }
        
        //--------------------------------------------------------------------------
        //** implementation
        _calculateX(value: number): number {
            return value;
        }

        _calculateY(value: number): number {
            return this._calculateValue(this.func, value);
        }

        /**
         * Gets the approximate y value from the given x value.
         * 
         * @param x The x value to be used for calculating the Y value.
         */
        approximate(x: number): number {
            return this._calculateValue(this.func, x);
        }
    }

    /**
     * Represents a parametric function series for @see:wijmo.chart.FlexChart.
     * 
     * The @see::ParametricFunctionSeries allows to plot a function defined by formulas
     * x=f(t) and y=f(t).
     * The x and y values are calcluated by the given xFunc and yFunc.
     */
    export class ParametricFunctionSeries extends FunctionSeries {
        private _xFunc: Function;
        private _yFunc: Function;

        /**
         * Initializes a new instance of the @see:ParametricFunctionSeries class.
         * 
         * @param options A JavaScript object containing initialization data for the 
         * ParametricFunctionSeries.
         */
        constructor(options?) {
            super(options);
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the function used to calculate the x value. 
         */
        get xFunc(): Function {
            return this._xFunc;
        }
        set xFunc(value: Function) {
            if (value && this._xFunc !== value) {
                this._xFunc = asFunction(value, false);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the function used to calculate the y value. 
         */
        get yFunc(): Function {
            return this._yFunc;
        }
        set yFunc(value: Function) {
            if (value && this._yFunc !== value) {
                this._yFunc = asFunction(value, false);
                this._invalidate();
            }
        }

        //--------------------------------------------------------------------------
        //** implementation
        _calculateX(value: number): number {
            return this._calculateValue(this.xFunc, value);
        }

        _calculateY(value: number): number {
            return this._calculateValue(this.yFunc, value);
        }

        /**
         * Gets the approximate x and y from the given value.
         * 
         * @param value The value to calculate.
         */
        approximate(value: number) {
            var self = this,
                x = this._calculateValue(this.xFunc, value),
                y = this._calculateValue(this.yFunc, value);
            //add <any> for compiling error.
            return <any>new Point(x, y);
        }
    }
}