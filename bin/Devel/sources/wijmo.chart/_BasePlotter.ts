module wijmo.chart {
    'use strict';

    /**
     * Plots data series.
     */
    export interface _IPlotter {
        chart: FlexChartCore;
        dataInfo: _DataInfo;
        hitTester: _HitTester;
        seriesIndex: number;
        seriesCount: number;
        clipping: boolean;

        stacking: Stacking;
        rotated: boolean;
        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect;
        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number);

        load();
        unload();
    }

    /**
     * Base class for chart plotters of all types (bar, line, area).
     */
    export class _BasePlotter {
        _DEFAULT_WIDTH = 2;
        _DEFAULT_SYM_SIZE = 10;

        clipping = true;
        chart: FlexChart;
        hitTester: _HitTester;
        dataInfo: _DataInfo;
        seriesIndex: number;
        seriesCount: number;

        clear() {
            this.seriesCount = 0;
            this.seriesIndex = 0;
        }

        getNumOption(name: string, parent?: string): number {
            var options = this.chart.options;
            if (parent) {
                options = options ? options[parent] : null;
            }
            if (options && options[name]) {
                return asNumber(options[name], true);
            }
            return undefined;
        }

        static cloneStyle(style: any, ignore: string[]): any {
            if (!style) {
                return style;
            }
            var newStyle = {};

            for (var key in style) {
                if (ignore && ignore.indexOf(key) >= 0) {
                    continue;
                }
                newStyle[key] = style[key];
            }

            return newStyle;
        }

        isValid(datax: number, datay: number, ax: _IAxis, ay: _IAxis): boolean {
            return _DataInfo.isValid(datax) && _DataInfo.isValid(datay) &&
                FlexChart._contains(this.chart._plotRect, new Point(datax, datay))
        }

        load() {
        }

        unload() {
        }
    }
} 