var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Accumulates observations and returns aggregate statistics.
         */
        var _Tally = (function () {
            function _Tally() {
                this._cnt = 0;
                this._cntn = 0;
                this._sum = 0;
                this._sum2 = 0;
                this._min = null;
                this._max = null;
            }
            /**
             * Adds a value to the tally.
             *
             * @param value Value to be added to the tally.
             * @param weight Weight to be attributed to the value.
             */
            _Tally.prototype.add = function (value, weight) {
                if (value instanceof _Tally) {
                    // add a tally
                    this._sum += value._sum;
                    this._sum2 += value._sum2;
                    this._max = this._max && value._max ? Math.max(this._max, value._max) : (this._max || value._max);
                    this._min = this._min && value._min ? Math.min(this._min, value._min) : (this._min || value._min);
                    this._cnt += value._cnt;
                    this._cntn += value._cntn;
                }
                else if (value != null) {
                    // add a value
                    this._cnt++;
                    if (this._min == null || value < this._min) {
                        this._min = value;
                    }
                    if (this._max == null || value > this._max) {
                        this._max = value;
                    }
                    if (wijmo.isNumber(value) && !isNaN(value)) {
                        if (wijmo.isNumber(weight)) {
                            value *= weight;
                        }
                        this._cntn++;
                        this._sum += value;
                        this._sum2 += value * value;
                    }
                    else if (wijmo.isBoolean(value)) {
                        this._cntn++;
                        if (value == true) {
                            this._sum++;
                            this._sum2++;
                        }
                    }
                }
            };
            /**
             * Gets an aggregate statistic from the tally.
             *
             * @param aggregate Type of aggregate statistic to get.
             */
            _Tally.prototype.getAggregate = function (aggregate) {
                // for compatibility with Excel PivotTables
                if (this._cnt == 0) {
                    return null;
                }
                var avg = this._cntn == 0 ? 0 : this._sum / this._cntn;
                switch (aggregate) {
                    case wijmo.Aggregate.Avg:
                        return avg;
                    case wijmo.Aggregate.Cnt:
                        return this._cnt;
                    case wijmo.Aggregate.Max:
                        return this._max;
                    case wijmo.Aggregate.Min:
                        return this._min;
                    case wijmo.Aggregate.Rng:
                        return this._max - this._min;
                    case wijmo.Aggregate.Sum:
                        return this._sum;
                    case wijmo.Aggregate.VarPop:
                        return this._cntn <= 1 ? 0 : this._sum2 / this._cntn - avg * avg;
                    case wijmo.Aggregate.StdPop:
                        return this._cntn <= 1 ? 0 : Math.sqrt(this._sum2 / this._cntn - avg * avg);
                    case wijmo.Aggregate.Var:
                        return this._cntn <= 1 ? 0 : (this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1);
                    case wijmo.Aggregate.Std:
                        return this._cntn <= 1 ? 0 : Math.sqrt((this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1));
                }
                // should never get here...
                throw 'Invalid aggregate type.';
            };
            return _Tally;
        }());
        olap._Tally = _Tally;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Tally.js.map