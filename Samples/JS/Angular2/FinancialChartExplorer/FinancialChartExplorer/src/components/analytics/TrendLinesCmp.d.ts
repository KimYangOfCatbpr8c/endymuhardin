import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../../services/DataSvc';
import { TooltipSvc } from './../../services/TooltipSvc';
export declare class TrendLinesCmp {
    dataSvc: DataSvc;
    tooltipSvc: TooltipSvc;
    dataList: any[];
    item: string;
    data: any[];
    selectedSymbol: string;
    title: string;
    properties: any;
    chart: wjcChartFinance.FinancialChart;
    constructor(dataSvc: DataSvc, tooltipSvc: TooltipSvc);
    chartRendered(): void;
    private setDataSource();
    orderChanged: (input: wjcInput.InputNumber) => void;
    sampleCountChanged: (input: wjcInput.InputNumber) => void;
}
export declare class TrendLinesModule {
}
