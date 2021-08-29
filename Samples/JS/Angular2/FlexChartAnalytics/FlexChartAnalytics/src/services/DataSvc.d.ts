import * as wjcCore from 'wijmo/wijmo';
export declare class DataSvc {
    constructor();
    getData(count: number): wjcCore.ObservableArray;
    getWaterfallData(): wjcCore.ObservableArray;
    getBoxData(): wjcCore.ObservableArray;
    getErrorBarData(): wjcCore.ObservableArray;
}
