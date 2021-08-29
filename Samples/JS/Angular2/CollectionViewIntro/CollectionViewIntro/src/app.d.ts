/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    cvGettingStarted: wjcCore.CollectionView;
    cvCRM: wjcCore.CollectionView;
    cvSorting: wjcCore.CollectionView;
    cvFiltering: wjcCore.CollectionView;
    cvGrouping: wjcCore.CollectionView;
    cvEditing: wjcCore.CollectionView;
    cvPaging: wjcCore.CollectionView;
    cvTrackingChanges: wjcCore.CollectionView;
    cvTrackingChangesExtra: wjcCore.CollectionView;
    groupItems: any;
    fieldNames: string[];
    currentItem: any;
    current: any;
    protected dataSvc: DataSvc;
    private _selectedGroupOpt;
    private _toFilter;
    private _thisFilterFunction;
    private _filter;
    constructor(dataSvc: DataSvc);
    filter: string;
    selectedGroupOpt: string;
    isGroupItem(item: any): boolean;
    avgAmount(item: any): string;
    private _addGroup(g);
    stopCurrent(): void;
    reset(): void;
    toggleSort(fieldName: string): void;
    getSort(propName: string): string;
    confirmUpdate(): void;
    cancelUpdate(): void;
    private _applyFilter();
    private _filterFunction(item);
    private _stopCurrentIn4th(sender, e);
    private _applyGrouping();
    private _findGroup(propName);
}
export declare class AppModule {
}
