/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcChartInteraction from 'wijmo/wijmo.chart.interaction';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    data: any[];
    mouseAction: string;
    interactiveAxes: string;
    disabled: boolean;
    isTouch: boolean;
    zoomChart: wjcChart.FlexChart;
    chartGestures: wjcChartInteraction.ChartGestures;
    constructor(dataSvc: DataSvc);
    resetAxes(): void;
    rangeChanged(): void;
}
export declare class AppModule {
}
