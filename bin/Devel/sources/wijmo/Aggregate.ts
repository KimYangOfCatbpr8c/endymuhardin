module wijmo {
    'use strict';

    /**
     * Specifies the type of aggregate to calculate over a group of values.
     */
    export enum Aggregate {
        /**
         * No aggregate.
         */
        None,
        /**
         * Returns the sum of the numeric values in the group.
         */
        Sum,
        /**
         * Returns the count of non-null values in the group.
         */
        Cnt,
        /**
         * Returns the average value of the numeric values in the group.
         */
        Avg,
        /**
         * Returns the maximum value in the group.
         */
        Max,
        /**
         * Returns the minimum value in the group.
         */
        Min,
        /**
         * Returns the difference between the maximum and minimum numeric values in the group.
         */
        Rng,
        /**
         * Returns the sample standard deviation of the numeric values in the group 
         * (uses the formula based on n-1).
         */
        Std,
        /**
         * Returns the sample variance of the numeric values in the group 
         * (uses the formula based on n-1).
         */
        Var,
        /**
         * Returns the population standard deviation of the values in the group 
         * (uses the formula based on n).
         */
        StdPop,
        /**
         * Returns the population variance of the values in the group 
         * (uses the formula based on n).
         */
        VarPop,
        /**
         * Returns the count of all values in the group (including nulls).
         */
        CntAll
    }
    /**
     * Calculates an aggregate value from the values in an array.
     *
     * @param aggType Type of aggregate to calculate.
     * @param items Array with the items to aggregate.
     * @param binding Name of the property to aggregate on (in case the items are not simple values).
     */
    export function getAggregate(aggType: Aggregate, items: any[], binding?: string) {
        var cnt = 0,
            cntn = 0,
            sum = 0,
            sum2 = 0,
            min = null,
            max = null,
            bnd = binding ? new Binding(binding) : null;

        // special case: overall count (including nulls)
        aggType = asEnum(aggType, Aggregate);
        if (aggType == Aggregate.CntAll) {
            return items.length;
        }

        // calculate aggregate
        for (var i = 0; i < items.length; i++) {

            // get item/value
            var val = items[i];
            if (bnd) {
                val = bnd.getValue(val);
                //assert(!isUndefined(val), 'item does not define property "' + binding + '".');
            }

            // aggregate
            if (val != null) {
                cnt++;
                if (min == null || val < min) {
                    min = val;
                }
                if (max == null || val > max) {
                    max = val;
                }
                if (isNumber(val) && !isNaN(val)) {
                    cntn++;
                    sum += val;
                    sum2 += val * val;
                } else if (isBoolean(val)) {
                    cntn++;
                    if (val == true) {
                        sum++;
                        sum2++;
                    }
                }
            }
        }

        // return result
        var avg = cntn == 0 ? 0 : sum / cntn;
        switch (aggType)
        {
            case Aggregate.Avg:
                return avg;
            case Aggregate.Cnt:
                return cnt;
            case Aggregate.Max:
                return max;
            case Aggregate.Min:
                return min;
            case Aggregate.Rng:
                return max - min;
            case Aggregate.Sum:
                return sum;
            case Aggregate.VarPop:
                return cntn <= 1 ? 0 : sum2 / cntn - avg * avg;
            case Aggregate.StdPop:
                return cntn <= 1 ? 0 : Math.sqrt(sum2 / cntn - avg * avg);
            case Aggregate.Var:
                return cntn <= 1 ? 0 : (sum2 / cntn - avg * avg) * cntn / (cntn - 1);
            case Aggregate.Std:
                return cntn <= 1 ? 0 : Math.sqrt((sum2 / cntn - avg * avg) * cntn / (cntn - 1));
        }

        // should never get here...
        throw 'Invalid aggregate type.';
    }
}