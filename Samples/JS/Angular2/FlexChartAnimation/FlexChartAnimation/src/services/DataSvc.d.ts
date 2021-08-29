import * as wjcCore from 'wijmo/wijmo';
export declare class DataSvc {
    constructor();
    getData(count: number): wjcCore.ObservableArray;
    getRandomData(idx: any): {
        x: any;
        y: number;
        y1: number;
        y2: number;
        y3: number;
        y4: number;
    };
    getRandomValue(max: any): number;
}
