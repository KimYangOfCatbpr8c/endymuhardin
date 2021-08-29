/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    data: wjcCore.CollectionView;
    countryMap: wjcGrid.DataMap;
    protected dataSvc: DataSvc;
    private _downloadsColumnFilterType;
    private _culture;
    filter: wjcGridFilter.FlexGridFilter;
    constructor(dataSvc: DataSvc);
    downloadsColumnFilterType: wjcGridFilter.FilterType;
    culture: string;
    saveFilter(): void;
    restoreFilter(): void;
    initialized(s: wjcGrid.FlexGrid, e: any): void;
}
export declare class AppModule {
}
