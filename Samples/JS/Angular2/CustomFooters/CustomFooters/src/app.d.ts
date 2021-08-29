/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    protected dataSvc: DataSvc;
    data: wjcCore.CollectionView;
    constructor(dataSvc: DataSvc);
    groupBy(groupBy: string): void;
    initGrid(s: wjcGrid.FlexGrid): void;
}
export declare class AppModule {
}
