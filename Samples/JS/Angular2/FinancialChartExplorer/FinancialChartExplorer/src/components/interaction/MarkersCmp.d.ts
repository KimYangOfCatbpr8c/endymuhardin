import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import * as wjcChart from 'wijmo/wijmo.chart';
import { DataSvc } from './../../services/DataSvc';
export declare class MarkersCmp {
    dataSvc: DataSvc;
    dataList: any[];
    item: string;
    data: any[];
    selectedSymbol: string;
    isTouch: boolean;
    title: string;
    properties: any;
    snapping: boolean;
    pt: any;
    chart: wjcChartFinance.FinancialChart;
    marker: wjcChart.LineMarker;
    constructor(dataSvc: DataSvc);
    chartRendered(): void;
    positionChanged(event: any): void;
    snappingChanged(): void;
    private setDataSource();
    private snappingHandler(e);
}
export declare class MarkersModule {
}
