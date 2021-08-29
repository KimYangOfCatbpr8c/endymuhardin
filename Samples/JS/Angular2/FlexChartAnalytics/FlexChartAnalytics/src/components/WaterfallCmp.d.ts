import * as wjcCore from 'wijmo/wijmo';
import * as wjcChartAnalytics from 'wijmo/wijmo.chart.analytics';
import * as wjcChart from 'wijmo/wijmo.chart';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './../services/DataSvc';
export declare class WaterfallCmp implements AfterViewInit {
    itemsSource: wjcCore.ObservableArray;
    title: string;
    relativeData: Boolean;
    connectorLines: Boolean;
    showTotal: Boolean;
    showIntermediateTotal: Boolean;
    styles: any;
    waterfall: wjcChartAnalytics.Waterfall;
    waterfallChart: wjcChart.FlexChart;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
}
export declare class WaterfallModule {
}
