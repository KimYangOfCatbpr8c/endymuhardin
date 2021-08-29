/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp implements AfterViewInit {
    private _dataSvc;
    private _http;
    private _productsCache;
    detailMode: string;
    categories: wjcCore.CollectionView;
    products: wjcCore.CollectionView;
    flex1: wjcGrid.FlexGrid;
    constructor(_dataSvc: DataSvc, _http: Http);
    ngAfterViewInit(): void;
    private _initDetailProvider(grid);
    getData(view: wjcCore.CollectionView, url: string): void;
    getProducts(categoryID: any): any;
}
export declare class AppModule {
}
