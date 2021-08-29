import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../../services/DataSvc';
import { TooltipSvc } from './../../services/TooltipSvc';
export declare class IndicatorsCmp {
    dataSvc: DataSvc;
    tooltipSvc: TooltipSvc;
    dataList: any[];
    item: string;
    data: any[];
    title: string;
    selectedSymbol: string;
    indicators: any[];
    selectedIndicator: string;
    properties: any;
    chart: wjcChartFinance.FinancialChart;
    indicatorChart: wjcChartFinance.FinancialChart;
    constructor(dataSvc: DataSvc, tooltipSvc: TooltipSvc);
    selectedSymbolChanged(s: any, e: any): void;
    chartRendered(s: any, e: any): void;
    fastSlowPeriodChanged(): void;
    smoothingPeriodChanged(): void;
    stochKPeriodChanged(): void;
    stochDPeriodChanged(): void;
    stochSmoothingPeriodChanged(input: wjcInput.InputNumber): void;
    private setDataSource();
    atrPeriodChanged(input: wjcInput.InputNumber): void;
    rsiPeriodChanged(input: wjcInput.InputNumber): void;
    cciPeriodChanged(input: wjcInput.InputNumber): void;
    wrPeriodChanged(input: wjcInput.InputNumber): void;
}
export declare class IndicatorsModule {
}
