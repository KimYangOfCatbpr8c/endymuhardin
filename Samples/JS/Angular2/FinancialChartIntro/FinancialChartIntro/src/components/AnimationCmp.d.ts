import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcChartAnimation from 'wijmo/wijmo.chart.animation';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../services/DataSvc';
export declare class AnimationCmp {
    dataSvc: DataSvc;
    data: any[];
    header: string;
    footer: string;
    chartType: string;
    easing: string;
    duration: number;
    bindingY: string;
    bindingYs: any;
    chart: wjcChartFinance.FinancialChart;
    animation: wjcChartAnimation.ChartAnimation;
    constructor(dataSvc: DataSvc);
    private setDataSource();
    ngAfterViewInit(): void;
    typeChanged(menu: any): void;
    refreshChart(): void;
    durationChanged: (input: wjcInput.InputNumber) => void;
}
