import * as wjcCore from 'wijmo/wijmo';
import * as wjcChartAnalytics from 'wijmo/wijmo.chart.analytics';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcInput from 'wijmo/wijmo.input';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './../services/DataSvc';
export declare class TrendLineCmp implements AfterViewInit {
    itemsSource: wjcCore.ObservableArray;
    title: string;
    order: number;
    fitType: string;
    name: string;
    showEquation: boolean;
    markerContent: Function;
    trendLine: wjcChartAnalytics.TrendLine;
    trendLineChart: wjcChart.FlexChart;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
    moving: boolean;
    hti: any;
    threshold: number;
    el: any;
    dp: any;
    ptIdx: any;
    mouseMove(e: any): void;
    mouseDown(e: any): void;
    orderChanged: (input: wjcInput.InputNumber) => void;
    update(): void;
}
export declare class TrendLineModule {
}
