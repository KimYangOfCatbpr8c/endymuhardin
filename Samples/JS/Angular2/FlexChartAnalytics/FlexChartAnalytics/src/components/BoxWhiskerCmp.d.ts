import * as wjcCore from 'wijmo/wijmo';
import * as wjcChartAnalytics from 'wijmo/wijmo.chart.analytics';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcInput from 'wijmo/wijmo.input';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './../services/DataSvc';
export declare class BoxWhiskerCmp implements AfterViewInit {
    itemsSource: wjcCore.ObservableArray;
    title: string;
    rotated: boolean;
    groupWidth: number;
    gapWidth: number;
    quartileCalculation: wjcChartAnalytics.QuartileCalculation;
    showMeanLine: boolean;
    showMeanMarker: boolean;
    showInnerpoints: boolean;
    showOutliers: boolean;
    showLabel: boolean;
    boxwhisker: wjcChartAnalytics.BoxWhisker;
    boxwhisker2: wjcChartAnalytics.BoxWhisker;
    boxwhisker3: wjcChartAnalytics.BoxWhisker;
    boxwhiskerChart: wjcChart.FlexChart;
    constructor(dataSvc: DataSvc);
    groupWidthChanged: (input: wjcInput.InputNumber) => void;
    gapWidthChanged: (input: wjcInput.InputNumber) => void;
    showLabelChanged: (input: HTMLInputElement) => void;
    ngAfterViewInit(): void;
}
export declare class BoxWhiskerModule {
}
