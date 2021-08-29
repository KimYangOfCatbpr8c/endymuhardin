/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    data: wjcCore.CollectionView;
    protected dataSvc: DataSvc;
    flex: wjcGrid.FlexGrid;
    constructor(dataSvc: DataSvc);
}
export declare class AppModule {
}
