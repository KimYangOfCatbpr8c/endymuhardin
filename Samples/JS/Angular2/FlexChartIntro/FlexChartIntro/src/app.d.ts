/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    countries: string[];
    data: {
        country: string;
        downloads: number;
        sales: number;
        expenses: number;
    }[];
    simpleData: any;
    funnelData: any;
    chartType: string;
    gradientChartType: wjcChart.ChartType;
    stacking: string;
    legendPosition: string;
    rotated: boolean;
    header: string;
    footer: string;
    titleX: string;
    titleY: string;
    tooltipContent: string;
    selectionMode: string;
    trafficData: wjcCore.ObservableArray;
    series1Visible: wjcChart.SeriesVisibility;
    series2Visible: wjcChart.SeriesVisibility;
    series3Visible: wjcChart.SeriesVisibility;
    gradientFill: string;
    funnelChart: wjcChart.FlexChart;
    boxChart: wjcChart.FlexChart;
    gradientColorChart: wjcChart.FlexChart;
    gradientDirectionMenu: wjcInput.Menu;
    gradientTypeMenu: wjcInput.Menu;
    predefinedColorMenu: wjcInput.Menu;
    startColor: wjcInput.InputColor;
    startOffset: wjcInput.InputNumber;
    startOpacity: wjcInput.InputNumber;
    endColor: wjcInput.InputColor;
    endOffset: wjcInput.InputNumber;
    endOpacity: wjcInput.InputNumber;
    predefinedColor: {
        fill: string;
    };
    _toAddData: any;
    _interval: any;
    protected dataSvc: DataSvc;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
    setInterval: (interval: any) => void;
    seriesVisible: (idx: any, checked: any) => void;
    private _addTrafficItem;
    neckWidthChanged: (sender: wjcInput.InputNumber) => void;
    neckHeightChanged: (sender: wjcInput.InputNumber) => void;
    funnelTypeChanged: (sender: wjcInput.Menu) => void;
    gradientChartTypeChanged: (sender: wjcInput.Menu) => void;
    gradientTypeChanged: (sender: wjcInput.Menu) => void;
    gradientDirectionChanged: (sender: wjcInput.Menu) => void;
    startColorChanged: (sender: wjcInput.InputColor) => void;
    startOffsetChanged: (sender: wjcInput.InputNumber) => void;
    startOpacityChanged: (sender: wjcInput.InputNumber) => void;
    endColorChanged: (sender: wjcInput.InputColor) => void;
    endOffsetChanged: (sender: wjcInput.InputNumber) => void;
    endOpacityChanged: (sender: wjcInput.InputNumber) => void;
    private _applyGradientColor;
}
export declare class AppModule {
}
