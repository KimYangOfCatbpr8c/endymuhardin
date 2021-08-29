import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../services/DataSvc';
export declare class MovingAverageCmp {
    itemsSource: wjcCore.ObservableArray;
    title: string;
    period: number;
    type: string;
    name: string;
    constructor(dataSvc: DataSvc);
    periodChanged: (input: wjcInput.InputNumber) => void;
}
export declare class MovingAverageModule {
}
