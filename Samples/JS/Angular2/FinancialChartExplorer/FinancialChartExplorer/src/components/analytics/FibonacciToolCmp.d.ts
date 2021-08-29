import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcChartInteraction from 'wijmo/wijmo.chart.interaction';
import { DataSvc } from './../../services/DataSvc';
import { TooltipSvc } from './../../services/TooltipSvc';
export declare class FibonacciToolCmp {
    dataSvc: DataSvc;
    tooltipSvc: TooltipSvc;
    dataList: any[];
    item: string;
    data: any[];
    selectedSymbol: string;
    title: string;
    selectedFib: string;
    properties: any;
    chart: wjcChartFinance.FinancialChart;
    selector: wjcChartInteraction.RangeSelector;
    constructor(dataSvc: DataSvc, tooltipSvc: TooltipSvc);
    selectedSymbolChanged(): void;
    rangeChanged(): void;
    valueChanged(): void;
    fibTypeClicked(type: any): void;
    private setDataSource();
}
export declare class FibonacciToolModule {
}
