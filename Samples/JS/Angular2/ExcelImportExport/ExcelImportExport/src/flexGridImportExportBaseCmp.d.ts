/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DataSvc } from './services/DataSvc';
export declare abstract class FlexGridImportExportBaseCmp {
    protected dataSvc: DataSvc;
    data: any[];
    includeColumnHeader: boolean;
    constructor(dataSvc: DataSvc);
    flexGrid: wjcGrid.FlexGrid;
    updateGroup(flex: wjcGrid.FlexGrid): void;
}
