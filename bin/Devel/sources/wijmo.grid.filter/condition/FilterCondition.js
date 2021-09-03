var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var filter;
        (function (filter) {
            'use strict';
            /**
             * Defines a filter condition.
             *
             * This class is used by the @see:FlexGridFilter class; you will rarely have to use it directly.
             */
            var FilterCondition = (function () {
                function FilterCondition() {
                    this._op = null;
                }
                Object.defineProperty(FilterCondition.prototype, "operator", {
                    /**
                     * Gets or sets the operator used by this @see:FilterCondition.
                     */
                    get: function () {
                        return this._op;
                    },
                    set: function (value) {
                        this._op = wijmo.asEnum(value, Operator, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FilterCondition.prototype, "value", {
                    /**
                     * Gets or sets the value used by this @see:FilterCondition.
                     */
                    get: function () {
                        return this._val;
                    },
                    set: function (value) {
                        this._val = value;
                        this._strVal = wijmo.isString(value) ? value.toString().toLowerCase() : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FilterCondition.prototype, "isActive", {
                    /**
                     * Gets a value that indicates whether the condition is active.
                     */
                    get: function () {
                        switch (this._op) {
                            // no operator
                            case null:
                                return false;
                            // equals/does not equal do not require a value (can compare to null)
                            case Operator.EQ:
                            case Operator.NE:
                                return true;
                            // other operators require a value
                            default:
                                return this._val != null || this._strVal != null;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Clears the condition.
                 */
                FilterCondition.prototype.clear = function () {
                    this.operator = null;
                    this.value = null;
                };
                /**
                 * Returns a value that determines whether the given value passes this
                 * @see:FilterCondition.
                 *
                 * @param value The value to test.
                 */
                FilterCondition.prototype.apply = function (value) {
                    // use lower-case strings for all operations
                    var val = this._strVal || this._val;
                    if (wijmo.isString(value)) {
                        value = value.toLowerCase();
                    }
                    // apply operator
                    switch (this._op) {
                        case null:
                            return true;
                        case Operator.EQ:
                            return wijmo.isDate(value) && wijmo.isDate(val) ? wijmo.DateTime.sameDate(value, val) : value == val;
                        case Operator.NE:
                            return value != val;
                        case Operator.GT:
                            return value > val;
                        case Operator.GE:
                            return value >= val;
                        case Operator.LT:
                            return value < val;
                        case Operator.LE:
                            return value <= val;
                        case Operator.BW:
                            return this._strVal && wijmo.isString(value)
                                ? value.indexOf(this._strVal) == 0
                                : false;
                        case Operator.EW:
                            return this._strVal && wijmo.isString(value) && value.length >= this._strVal.length
                                ? value.substr(value.length - this._strVal.length) == val
                                : false;
                        case Operator.CT:
                            return this._strVal && wijmo.isString(value)
                                ? value.indexOf(this._strVal) > -1
                                : false;
                        case Operator.NC:
                            return this._strVal && wijmo.isString(value)
                                ? value.indexOf(this._strVal) < 0
                                : false;
                    }
                    throw 'Unknown operator';
                };
                return FilterCondition;
            }());
            filter.FilterCondition = FilterCondition;
            /**
             * Specifies filter condition operators.
             */
            (function (Operator) {
                /** Equals. */
                Operator[Operator["EQ"] = 0] = "EQ";
                /** Does not equal. */
                Operator[Operator["NE"] = 1] = "NE";
                /** Greater than. */
                Operator[Operator["GT"] = 2] = "GT";
                /** Greater than or equal to. */
                Operator[Operator["GE"] = 3] = "GE";
                /** Less than. */
                Operator[Operator["LT"] = 4] = "LT";
                /** Less than or equal to. */
                Operator[Operator["LE"] = 5] = "LE";
                /** Begins with. */
                Operator[Operator["BW"] = 6] = "BW";
                /** Ends with. */
                Operator[Operator["EW"] = 7] = "EW";
                /** Contains. */
                Operator[Operator["CT"] = 8] = "CT";
                /** Does not contain. */
                Operator[Operator["NC"] = 9] = "NC";
            })(filter.Operator || (filter.Operator = {}));
            var Operator = filter.Operator;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FilterCondition.js.map