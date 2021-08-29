import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import { DataSvc } from './../services/DataSvc';
export declare class ChartTypesCmp {
    dataSvc: DataSvc;
    data: any[];
    header: string;
    chartType: string;
    bindingY: string;
    bindingYs: any;
    chart: wjcChartFinance.FinancialChart;
    constructor(dataSvc: DataSvc);
    private setDataSource();
    chartRendered(): void;
    changeType(type: any): void;
}
