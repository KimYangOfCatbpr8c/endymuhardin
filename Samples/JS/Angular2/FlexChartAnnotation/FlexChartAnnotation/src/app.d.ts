/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcAxisscrollbar from './AxisScrollbar';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcChartAnnotation from 'wijmo/wijmo.chart.annotation';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp implements AfterViewInit {
    data: any[];
    basicData: any[];
    basic: any;
    advanced: any;
    axisXScrollbar: wjcAxisscrollbar.AxisScrollbar;
    volYAxis: wjcChart.Axis;
    advancedChart: wjcChart.FlexChart;
    al: wjcChartAnnotation.AnnotationLayer;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
    _initAxisScrollbar(): void;
    _setQuoteDetailInfo(e: any): void;
    _clearDetail(): void;
    _setAnnotationText(al: any, name: any, text: any): void;
    _updateLastPoint(): void;
    _fromOADate(val: any): Date;
}
export declare class AppModule {
}
