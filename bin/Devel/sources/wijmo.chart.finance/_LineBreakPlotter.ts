module wijmo.chart.finance {
    "use strict";

    // Plotter for Line Break FinancialChartType
    export class _LineBreakPlotter extends _BaseRangePlotter {
        // specifies number of lines that need to be broken in order for a reversal to occur
        private _newLineBreaks: number;

        constructor() {
            super();
        }

        clear(): void {
            super.clear();
            this._newLineBreaks = null;
        }

        _calculate(series: FinancialSeries): void {
            this._init();

            var closes = series._getBindingValues(3),
                xs = series.getValues(1) || this.chart._xvals;

            this._calculator = new _LineBreakCalculator(null, null, null, closes, xs, this._newLineBreaks);
            this._rangeValues = this._calculator.calculate();
            if (this._rangeValues === null || isUndefined(this._rangeValues)) {
                this._rangeValues = [];
            }

            // always regenerate x-axis labels at the end of each calculation cycle
            this._generateXLabels(series);
        }

        _init(): void {
            super._init();

            // NewLineBreaks
            this._newLineBreaks = asInt(this.getNumOption("newLineBreaks", "lineBreak"), true, true) || 3;
            assert(this._newLineBreaks >= 1, "Value must be greater than 1");
        }
    }
}