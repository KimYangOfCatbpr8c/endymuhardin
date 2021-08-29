/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp implements AfterViewInit {
    protected dataSvc: DataSvc;
    orders: any[];
    groupedOrders: wjcCore.CollectionView;
    pagedOrders: wjcCore.CollectionView;
    addNewOrders: wjcCore.CollectionView;
    layoutDefs: wjcCore.CollectionView;
    ldOneLine: any[];
    ldTwoLines: any[];
    ldThreeLines: any[];
    frozenGrid: wjcGrid.FlexGrid;
    filterGrid: wjcGrid.FlexGrid;
    constructor(dataSvc: DataSvc);
    toggleFreeze(rows: number, cols: number): void;
    ngAfterViewInit(): void;
}
export declare class AppModule {
}
