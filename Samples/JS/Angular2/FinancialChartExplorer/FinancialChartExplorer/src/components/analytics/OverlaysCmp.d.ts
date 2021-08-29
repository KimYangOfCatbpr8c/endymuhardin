import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../../services/DataSvc';
import { TooltipSvc } from './../../services/TooltipSvc';
export declare class OverlaysCmp {
    dataSvc: DataSvc;
    tooltipSvc: TooltipSvc;
    dataList: any[];
    overlays: any[];
    item: string;
    data: any[];
    title: string;
    selectedSymbol: string;
    selectedOverlay: string;
    properties: any;
    chart: wjcChartFinance.FinancialChart;
    constructor(dataSvc: DataSvc, tooltipSvc: TooltipSvc);
    selectedSymbolChanged(): void;
    chartRendered(): void;
    private setDataSource();
    bpChanged: (input: wjcInput.InputNumber) => void;
    bmChanged: (input: wjcInput.InputNumber) => void;
    esChanged: (input: wjcInput.InputNumber) => void;
    epChanged: (input: wjcInput.InputNumber) => void;
}
export declare class OverlaysModule {
}
