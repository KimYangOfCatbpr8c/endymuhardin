import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcChartInteraction from 'wijmo/wijmo.chart.interaction';
import { DataSvc } from './../../services/DataSvc';
import { TooltipSvc } from './../../services/TooltipSvc';
export declare class EventAnnotationsCmp {
    dataSvc: DataSvc;
    tooltipSvc: TooltipSvc;
    dataList: any[];
    item: string;
    data: any[];
    annotations: any[];
    selectedSymbol: string;
    title: string;
    chart: wjcChartFinance.FinancialChart;
    selectorChart: wjcChartFinance.FinancialChart;
    selector: wjcChartInteraction.RangeSelector;
    constructor(dataSvc: DataSvc, tooltipSvc: TooltipSvc);
    selectedSymbolChanged(): void;
    selectorChartRendered(): void;
    chartRendered(): void;
    rangeChanged(): void;
    private setDataSource();
    private setAnnotations();
}
export declare class EventAnnotationsModule {
}
