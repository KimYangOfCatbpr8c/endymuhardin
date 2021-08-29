import * as wjcCore from 'wijmo/wijmo';
import * as wjcChartAnalytics from 'wijmo/wijmo.chart.analytics';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../services/DataSvc';
export declare class ErrorBarCmp {
    itemsSource: wjcCore.ObservableArray;
    title: string;
    rotated: boolean;
    chartType: wjcChart.ChartType;
    errorAmount: wjcChartAnalytics.ErrorAmount;
    endStyle: wjcChartAnalytics.ErrorBarEndStyle;
    direction: wjcChartAnalytics.ErrorBarDirection;
    value: any;
    errorbar: wjcChartAnalytics.ErrorBar;
    errorbarChart: wjcChart.FlexChart;
    constructor(dataSvc: DataSvc);
    errorAmountChanged(menu: wjcInput.Menu): void;
}
export declare class ErrorBarModule {
}
