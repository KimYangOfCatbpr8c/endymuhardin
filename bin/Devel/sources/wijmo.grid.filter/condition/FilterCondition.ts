module wijmo.grid.filter {
    'use strict';

    /**
     * Defines a filter condition.
     *
     * This class is used by the @see:FlexGridFilter class; you will rarely have to use it directly.
     */
    export class FilterCondition {
        private _op: Operator = null;
        private _val: any;
        private _strVal: string;

        /**
         * Gets or sets the operator used by this @see:FilterCondition.
         */
        get operator(): Operator {
            return this._op;
        }
        set operator(value: Operator) {
            this._op = asEnum(value, Operator, true);
        }
        /**
         * Gets or sets the value used by this @see:FilterCondition.
         */
        get value(): any {
            return this._val;
        }
        set value(value: any) {
            this._val = value;
            this._strVal = isString(value) ? value.toString().toLowerCase() : null;
        }
        /**
         * Gets a value that indicates whether the condition is active.
         */
        get isActive(): boolean {
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
        }
        /**
         * Clears the condition.
         */
        clear() {
            this.operator = null;
            this.value = null;
        }
        /**
         * Returns a value that determines whether the given value passes this
         * @see:FilterCondition.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            
            // use lower-case strings for all operations
            var val = this._strVal || this._val;
            if (isString(value)) {
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
                    return this._strVal && isString(value)
                        ? value.indexOf(this._strVal) == 0 
                        : false;
                case Operator.EW:
                    return this._strVal && isString(value) && value.length >= this._strVal.length 
                        ? value.substr(value.length - this._strVal.length) == val
                        : false;
                case Operator.CT:
                    return this._strVal && isString(value)
                        ? value.indexOf(this._strVal) > -1
                        : false;
                case Operator.NC:
                    return this._strVal && isString(value)
                        ? value.indexOf(this._strVal) < 0
                        : false;
            }
            throw 'Unknown operator';
        }
    }
    /**
     * Specifies filter condition operators.
     */
    export enum Operator {
        /** Equals. */
        EQ = 0, 
        /** Does not equal. */
        NE = 1, 
        /** Greater than. */
        GT = 2, 
        /** Greater than or equal to. */
        GE = 3, 
        /** Less than. */
        LT = 4, 
        /** Less than or equal to. */
        LE = 5, 
        /** Begins with. */
        BW = 6, 
        /** Ends with. */
        EW = 7, 
        /** Contains. */
        CT = 8, 
        /** Does not contain. */
        NC = 9 
    }
}