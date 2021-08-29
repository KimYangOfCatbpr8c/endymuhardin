/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    data: wjcCore.CollectionView;
    columnsAvailable: wjcCore.CollectionView;
    columns: wjcCore.CollectionView;
    flex: wjcGrid.FlexGrid;
    constructor(dataSvc: DataSvc);
    addColumn(): void;
    removeColumn(): void;
    moveColumn(offset: any): void;
    draggedColumn(s: wjcGrid.FlexGrid): void;
}
export declare class AppModule {
}
