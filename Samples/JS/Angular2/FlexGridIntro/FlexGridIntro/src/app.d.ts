/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    protected dataSvc: DataSvc;
    data: wjcCore.CollectionView;
    cvGroup: wjcCore.CollectionView;
    cvFilter: wjcCore.CollectionView;
    cvPaging: wjcCore.CollectionView;
    cvMaster: wjcCore.CollectionView;
    selectionMode: string;
    treeData: [{}];
    private _groupBy;
    private _filter;
    private _toFilter;
    constructor(dataSvc: DataSvc);
    groupBy: string;
    filter: string;
    toggleFreeze(flex: wjcGrid.FlexGrid): void;
    getAmountColor(amount: number): string;
    sortedColumn(flex: wjcGrid.FlexGrid): void;
    private _applyGroupBy();
    private _filterFunction(item);
    private _sortItem(item, view, childItemsPath);
}
export declare class AppModule {
}
