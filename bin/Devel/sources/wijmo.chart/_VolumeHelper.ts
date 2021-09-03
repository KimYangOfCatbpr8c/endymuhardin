module wijmo.chart {
    "use strict";

    export class _VolumeHelper {
        private _volumes: number[];
        private _xVals: number[];
        private _xDataMin: number;
        private _xDataMax: number;
        private _xDataType: DataType;
        private _hasXs: boolean;
        private _calcData: any[];

        constructor(volumes: number[], xVals: number[], xDataMin: number, xDataMax: number, xDataType?: DataType) {
            this._volumes = asArray(volumes);
            this._xVals = asArray(xVals);
            this._xDataMin = asNumber(xDataMin, true, false);
            this._xDataMax = asNumber(xDataMax, true, false);
            this._xDataType = asEnum(xDataType, DataType, true);
            this._calcData = [];

            // initialize
            this._init();
        }

        // converts the specified value from data to pixel coordinates
        // for volume based x-axis (customConvert)
        convert(x: number, min: number, max: number): number {
            var retval = undefined,
                len = this._calcData.length,
                i = -1;

            if (this._hasXs && this._xDataType === DataType.Date) {
                // find directly
                i = this._xVals.indexOf(x);

                // loop through and attempt to find index
                if (i === -1) {
                    for (var j = 0; j < this._xVals.length; j++) {
                        if (j < (this._xVals.length - 1) && this._xVals[j] <= x && x <= this._xVals[j + 1])  {
                            i = j;
                            break;
                        } else if (j === 0 && x <= this._xVals[j]) {
                            i = j;
                            break;
                        } else if (j === (this._xVals.length - 1) && this._xVals[j] <= x) {
                            i = j;
                            break;
                        }
                    }
                }

                // last resort - force
                if (i === -1) {
                    i = this._xVals.indexOf(Math.floor(x));
                    i = clamp(i, 0, len - 1);
                }
            } else if (this._hasXs) {
                i = this._xVals.indexOf(x);
                if (i === -1) {
                    i = this._xVals.indexOf(Math.floor(x));
                    i = clamp(i, 0, len - 1);
                }
            } else {
                i = clamp(Math.round(x), 0, len - 1);
            }

            if (0 <= i && i < len) {
                if (this._hasXs) {  // change range from something like 5-9 to 0-4
                    x = _VolumeHelper.convertToRange(x, 0,(len - 1), this._xDataMin, this._xDataMax);
                }

                retval = this._calcData[i].value + ((x - i) * this._calcData[i].width) - (0.5 * this._calcData[i].width);

                // tranform to the actual data range
                min = this._getXVolume(min);
                max = this._getXVolume(max);
                retval = (retval - min) / (max - min);
            }

            return retval;
        }

        // converts the specified value from pixel to data coordinates
        // for volume based x-axis (customConvertBack)
        convertBack(x: number, min: number, max: number): number {
            var retval = undefined,
                len = this._calcData.length, idx = -1, i: number;

            // try to find correct index based on ranges (x1 = start & x2 = end)
            for (i = 0; i < len; i++) {
                if ((this._calcData[i].x1 <= x && x <= this._calcData[i].x2) ||
                    (i === 0 && x <= this._calcData[i].x2) ||
                    (i === (len - 1) && this._calcData[i].x1 <= x)) {
                    idx = i;
                    break;
                }
            }

            if (0 <= idx && idx < len) {
                retval = (x / this._calcData[idx].width) - (this._calcData[idx].value / this._calcData[idx].width) + .5 + i;

                if (this._hasXs) {  // change range from something like 0-4 to 5-9
                    retval = _VolumeHelper.convertToRange(retval, this._xDataMin, this._xDataMax, 0,(len - 1));
                }
            }

            return retval;
        }

        // initialize volume data
        private _init(): void {
            // xVals, xDataMin, and xDataMax must all be set for _hasXs to be true
            this._hasXs = this._xVals !== null && this._xVals.length > 0;
            if (this._hasXs && !isNumber(this._xDataMin)) {
                this._xDataMin = Math.min.apply(null, this._xVals);
            }
            if (this._hasXs && !isNumber(this._xDataMax)) {
                this._xDataMax = Math.max.apply(null, this._xVals);
            }
            if (this._hasXs) {
                this._hasXs = isNumber(this._xDataMin) && isNumber(this._xDataMax);
            }
            if (this._hasXs && this._xDataType === DataType.Date) {
                // try fill gaps for dates
                this._fillGaps();
            }

            // calculate total volume
            var totalVolume = 0, i = 0,
                len = this._volumes !== null && this._volumes.length > 0 ? this._volumes.length : 0;
            for (i = 0; i < len; i++) {
                totalVolume += this._volumes[i];
            }

            // calculate width and position (range = 0 to 1)
            var val: number, width: number, pos = 0;
            for (i = 0; i < len; i++) {
                width = this._volumes[i] / totalVolume;
                val = pos + width;
                this._calcData.push({
                    value: val,
                    width: width,
                    x1: pos,
                    x2: val
                });
                pos = this._calcData[i].value;
            }
        }

        // for converting min/max
        private _getXVolume(x: number): number {
            var len = this._calcData.length, i = -1;

            if (this._hasXs) {
                i = this._xVals.indexOf(x);

                // loop through and attempt to find index
                for (var j = 0; j < this._xVals.length; j++) {
                    if (j < (this._xVals.length - 1) && this._xVals[j] <= x && x <= this._xVals[j + 1]) {
                        i = j;
                        break;
                    } else if (j === 0 && x <= this._xVals[j]) {
                        i = j;
                        break;
                    } else if (j === (this._xVals.length - 1) && this._xVals[j] <= x) {
                        i = j;
                        break;
                    }
                }
            }

            // change range from something like 5-9 to 0-4
            if (this._hasXs) {
                x = _VolumeHelper.convertToRange(x, 0, (len - 1), this._xDataMin, this._xDataMax);
            }

            if (i === -1) {
                i = clamp(Math.round(x), 0, len - 1);
            }

            return this._calcData[i].value + ((x - i) * this._calcData[i].width) - (0.5 * this._calcData[i].width);
        }

        // converts a value from one range to another
        // ex. converts a number within range 0-10 to a number within range 0-100 (5 becomes 50)
        static convertToRange(value: number, newMin: number, newMax: number, oldMin: number, oldMax: number): number {
            if (newMin === newMax || oldMin === oldMax) {
                return 0;
            }

            // newValue = (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
            return (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
        }

        // fill gaps in volume and x data when x-axis is using dates
        // there could potentially be gaps for weekends and/or holidays
        private _fillGaps(): void {
            if (this._xDataType !== DataType.Date || this._xVals === null || this._xVals.length <= 0) {
                return;
            }

            var xmin: any = this._xDataMin,
                xmax: any = this._xDataMax,
                i: number;

            for (i = 1; xmin < xmax; i++) {
                xmin = new Date(xmin);
                xmin.setDate(xmin.getDate() + 1);
                xmin = xmin.valueOf();

                if (xmin !== this._xVals[i]) {
                    this._xVals.splice(i, 0, xmin);
                    this._volumes.splice(i, 0, 0);
                }
            }
        }
    }
}