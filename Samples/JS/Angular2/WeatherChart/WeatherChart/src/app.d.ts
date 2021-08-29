/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcChartInteraction from 'wijmo/wijmo.chart.interaction';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp implements AfterViewInit {
    isViewInitialized: boolean;
    data: any[];
    palette: any[];
    pt: wjcCore.Point;
    props: any[];
    markerContent: Function;
    chart1: wjcChart.FlexChart;
    chart2: wjcChart.FlexChart;
    chart3: wjcChart.FlexChart;
    selector: wjcChartInteraction.RangeSelector;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
    rangeChanged(): void;
    update(min: any, max: any): void;
    markerPositionChanged(chart: any, marker: any, point: any): void;
    changeMarker(curChart: any, marker: any): void;
    getMarkercontent(pt: any): string;
}
export declare class AppModule {
}
