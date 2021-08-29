import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../services/DataSvc';
export declare class TrendLinesCmp {
    dataSvc: DataSvc;
    data: any[];
    header: string;
    movingAverageName: string;
    movingAveragePeriod: number;
    movingAverageType: string;
    constructor(dataSvc: DataSvc);
    changeType(maMenu: any): void;
    periodChanged: (input: wjcInput.InputNumber) => void;
    private setDataSource();
}
