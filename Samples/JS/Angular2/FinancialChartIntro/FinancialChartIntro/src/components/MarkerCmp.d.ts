import * as wjcCore from 'wijmo/wijmo';
import * as wjcChartFinance from 'wijmo/wijmo.chart.finance';
import { DataSvc } from './../services/DataSvc';
export declare class MarkerCmp {
    dataSvc: DataSvc;
    data: any[];
    header: string;
    changeContent: Function;
    changeYContent: Function;
    changeXContent: Function;
    pt: wjcCore.Point;
    markcontents: any;
    pOffset: wjcCore.Rect;
    chart: wjcChartFinance.FinancialChart;
    constructor(dataSvc: DataSvc);
    midPosChanged(event: any): void;
    chartRendered(): void;
    private _markershowing(lineMarkers, visible);
    private _getMarkerContents(pt);
    private setDataSource();
}
