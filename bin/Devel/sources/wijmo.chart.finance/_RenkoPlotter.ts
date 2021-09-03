module wijmo.chart.finance {
    "use strict";

    // Plotter for Renko FinancialChartType
    export class _RenkoPlotter extends _BaseRangePlotter {
        // brick size or period - based on units
        private _boxSize: number;

        // mode for brick size
        private _rangeMode: RangeMode;

        // fields(s) to use in calculations
        private _fields: DataFields;

        // for stockcharts rounding
        private _rounding: boolean;

        constructor() {
            super();
        }

        clear(): void {
            super.clear();
            this._boxSize = null;
            this._rangeMode = null;
        }

        _calculate(series: FinancialSeries): void {
            this._init();

            var highs = series._getBindingValues(0),
                lows = series._getBindingValues(1),
                opens = series._getBindingValues(2),
                closes = series._getBindingValues(3),
                xs = series.getValues(1) || this.chart._xvals;

            this._calculator = new _RenkoCalculator(highs, lows, opens, closes, xs, this._boxSize, this._rangeMode, this._fields, this._rounding);
            this._rangeValues = this._calculator.calculate();
            if (this._rangeValues === null || isUndefined(this._rangeValues)) {
                this._rangeValues = [];
            }

            // always regenerate x-axis labels at the end of each calculation cycle
            this._generateXLabels(series);
        }

        _init(): void {
            super._init();

            // BoxSize
            this._boxSize = this.getNumOption("boxSize", "renko") || 14;

            // RangeMode
            this._rangeMode = this.getOption("rangeMode", "renko") || RangeMode.Fixed;
            this._rangeMode = asEnum(this._rangeMode, RangeMode, true);
            assert(this._rangeMode !== RangeMode.Percentage, "RangeMode.Percentage is not supported");

            // DataFields
            this._fields = this.getOption("fields", "renko") || DataFields.Close;
            this._fields = asEnum(this._fields, DataFields, true);
            // todo: figure out HighLow
            assert(this._fields !== DataFields.HighLow, "DataFields.HighLow is not supported");

            // rounding - internal only
            this._rounding = asBoolean(this.getOption("rounding", "renko"), true);
        }

        _generateXLabels(series: FinancialSeries): void {
            super._generateXLabels(series);

            // bricks may have duplicate x-labels - prevent that behavior
            this._rangeXLabels.forEach((value: any, index: number) => {
                // compare current item's text property to the previous item's _text property (backup for text)
                if (index > 0 && this._rangeXLabels[index - 1]._text === value.text) {
                    value.text = "";
                }
            }, this);
        }
    }
}