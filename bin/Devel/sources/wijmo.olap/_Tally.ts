module wijmo.olap {
    'use strict';

    /**
     * Accumulates observations and returns aggregate statistics.
     */
    export class _Tally {
        _cnt = 0;
        _cntn = 0;
        _sum = 0;
        _sum2 = 0;
        _min = null;
        _max = null;

        /**
         * Adds a value to the tally.
         *
         * @param value Value to be added to the tally.
         * @param weight Weight to be attributed to the value.
         */
        add(value: any, weight?: number) {
            if (value instanceof _Tally) {

                // add a tally
                this._sum += value._sum;
                this._sum2 += value._sum2;
                this._max = this._max && value._max ? Math.max(this._max, value._max) : (this._max || value._max);
                this._min = this._min && value._min ? Math.min(this._min, value._min) : (this._min || value._min);
                this._cnt += value._cnt;
                this._cntn += value._cntn;

            } else if (value != null) {

                // add a value
                this._cnt++;
                if (this._min == null || value < this._min) {
                    this._min = value;
                }
                if (this._max == null || value > this._max) {
                    this._max = value;
                }
                if (isNumber(value) && !isNaN(value)) {
                    if (isNumber(weight)) {
                        value *= weight;
                    }
                    this._cntn++;
                    this._sum += value;
                    this._sum2 += value * value;
                } else if (isBoolean(value)) {
                    this._cntn++;
                    if (value == true) {
                        this._sum++;
                        this._sum2++;
                    }
                }
            }
        }
        /**
         * Gets an aggregate statistic from the tally.
         *
         * @param aggregate Type of aggregate statistic to get.
         */
        getAggregate(aggregate: Aggregate): number {

            // for compatibility with Excel PivotTables
            if (this._cnt == 0) {
                return null;
            }

            var avg = this._cntn == 0 ? 0 : this._sum / this._cntn;
            switch (aggregate) {
                case Aggregate.Avg:
                    return avg;
                case Aggregate.Cnt:
                    return this._cnt;
                case Aggregate.Max:
                    return this._max;
                case Aggregate.Min:
                    return this._min;
                case Aggregate.Rng:
                    return this._max - this._min;
                case Aggregate.Sum:
                    return this._sum;
                case Aggregate.VarPop:
                    return this._cntn <= 1 ? 0 : this._sum2 / this._cntn - avg * avg;
                case Aggregate.StdPop:
                    return this._cntn <= 1 ? 0 : Math.sqrt(this._sum2 / this._cntn - avg * avg);
                case Aggregate.Var:
                    return this._cntn <= 1 ? 0 : (this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1);
                case Aggregate.Std:
                    return this._cntn <= 1 ? 0 : Math.sqrt((this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1));
            }

            // should never get here...
            throw 'Invalid aggregate type.';
        }
    }
}