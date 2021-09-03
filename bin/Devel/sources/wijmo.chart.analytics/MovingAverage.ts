module wijmo.chart.analytics {
    'use strict';

    /**
     * Specifies the type of MovingAverage Series.
     */
    export enum MovingAverageType {
        /** 
         * An average of the last n values.
         */
        Simple,
        /**
         * Weighted average of the last n values, 
         * where the weightage decreases by 1 with each previous value.
         */
        Weighted,
        /**
         * Weighted average of the last n values, 
         * where the weightage decreases exponentially with each previous value.
         */
        Exponential,
        /**
         * Weighted average of the last n values, 
         * whose result is equivalent to a double smoothed simple moving average. 
         */
        Triangular 
    }
    
    /**
     * Represents a moving average trendline for @see:FlexChart and @see:FinancialChart.
     * It is a calculation to analyze data points by creating a series of averages of
     * different subsets of the full data set. You may define a different type on each
     * @see:MovingAverage object by setting the type property on the MovingAverage itself.
     * The MovingAverage class has a period property that allows you to set the number of
     * periods for computing the average value.
     */
    export class MovingAverage extends TrendLineBase {
        //http://daytrading.about.com/od/indicators/a/Triangular.htm
        //http://daytrading.about.com/od/indicators/a/MovingAverages.htm
        //http://en.wikipedia.org/wiki/Moving_average

        private _period: number;
        private _type: MovingAverageType;

        /**
         * Initializes a new instance of the @see:MovingAverage class.
         * 
         * @param options A JavaScript object containing initialization data for the MovingAverage Series.
         */
        constructor(options?) {
            super(options);
            this._chartType = ChartType.Line;
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the type of the moving average series.
         */
        get type(): MovingAverageType {
            return this._type;
        }
        set type(value: MovingAverageType) {
            if (value === this._type) {
                return;
            }
            this._type = asEnum(value, MovingAverageType, false);
            this._invalidate();
        }

        /**
         * Gets or sets the period of the moving average series.
         * It should be set to integer value greater than 1. 
         */
        get period(): number {
            return this._period;
        }
        set period(value: number) {
            if (value === this._period) {
                return;
            }
            this._period = asNumber(value, false, true);
            this._invalidate();
        }

        //--------------------------------------------------------------------------
        //** implementation

        _initProperties(o) {
            this._period = 2;
            this._type = MovingAverageType.Simple;

            super._initProperties(o);
        }

        _checkPeriod() {
            var period = this.period,
                oriXVals = this._originXValues;

            if (period <= 1) {
                assert(false, "period must be greater than 1.");
            }
            if (oriXVals && oriXVals.length && period >= oriXVals.length) {
                assert(false, "period must be less than itemSource's length.");
            }
        }

        _calculateValues() {
            var self = this,
                type = self._type,
                funcName = "_calculate" + MovingAverageType[self._type],
                x = [], y = [];

            self._checkPeriod();
            if (self[funcName]) {
                self[funcName].call(self, x, y);
            }

            self._yValues = y;
            self._xValues = x;
        }

        private _calculateSimple(x, y, forTMA: boolean = false) {
            var self = this,
                ox = self._originXValues,
                oy = self._originYValues,
                len = ox.length,
                p = self._period,
                i, total = 0;

            for (i = 0; i < len; i++) {
                total += oy[i];
                if (i >= p) {
                    total -= oy[i - p];
                }
                if (i >= p - 1) {
                    x.push(ox[i]);
                    y.push(total / p);
                } else if (forTMA) {
                    x.push(ox[i]);
                    y.push(total / (i + 1));
                }
            }
        }

        private _calculateWeighted(x, y) {
            var self = this,
                ox = self._originXValues,
                oy = self._originYValues,
                len = ox.length,
                p = self._period,
                denominator = p * (p + 1) / 2,
                i, total = 0, numerator = 0;

            for (i = 0; i < len; i++) {
                if (i > 0) {
                    total += oy[i - 1];
                }
                if (i > p) {
                    total -= oy[i - p - 1];
                }

                if (i < p - 1) {
                    numerator += oy[i] * (i + 1);
                } else {
                    numerator += oy[i] * p;
                    if (i > p - 1) {
                        numerator -= total;
                    }
                    x.push(ox[i]);
                    y.push(numerator / denominator);
                }
            }
        }

        private _calculateExponential(x, y) {
            var self = this,
                ox = self._originXValues,
                oy = self._originYValues,
                len = ox.length,
                p = self._period,
                i, ema = 0;

            for (i = 0; i < len; i++) {
                if (i <= p - 2) {
                    ema += oy[i];
                    if (i === p - 2) {
                        ema /= p - 1;
                    }
                    continue;
                }

                ema = ema + (2 / (p + 1)) * (oy[i] - ema);
                x.push(ox[i]);
                y.push(ema);
            }
        }

        private _calculateTriangular(x, y) {
            var self = this,
                p = self._period,
                ox = [], oy = [],
                i, len, total = 0;

            self._calculateSimple(ox, oy, true);

            for (i = 0, len = ox.length; i < len; i++) {
                total += oy[i];
                if (i >= p) {
                    total -= oy[i - p];
                }
                if (i >= p - 1) {
                    x.push(ox[i]);
                    y.push(total / p);
                }
            }
        }
    }

}
