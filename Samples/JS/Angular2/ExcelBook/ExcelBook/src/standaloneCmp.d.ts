/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcGridSheet from 'wijmo/wijmo.grid.sheet';
import { DataSvc } from './services/DataSvc';
export declare class StandaloneCmp {
    protected dataSvc: DataSvc;
    data: any[];
    sheets: any[];
    selectedSheetIndex: number;
    flexSheet: wjcGridSheet.FlexSheet;
    constructor(dataSvc: DataSvc);
    flexInitialized(flexSheet: wjcGridSheet.FlexSheet): void;
    save(): void;
    load(): void;
    changeSelectedSheet(e: any): void;
    private _initDataMapForBindingSheet(flexSheet);
    private _buildDataMap(items);
}
export declare class AppModule {
}
