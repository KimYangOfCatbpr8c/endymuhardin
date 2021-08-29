import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcChartInteraction from 'wijmo/wijmo.chart.interaction';
import { DataSvc } from './../services/DataSvc';
export declare class RangeSelectorCmp {
    dataSvc: DataSvc;
    data: any[];
    header: string;
    stChart: wjcChartFinance.FinancialChart;
    rsChart: wjcChartFinance.FinancialChart;
    rangeSelector: wjcChartInteraction.RangeSelector;
    constructor(dataSvc: DataSvc);
    stRendered(): void;
    rsRendered(): void;
    rangeChanged(): void;
    private setDataSource();
}
