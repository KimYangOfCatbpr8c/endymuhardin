/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcGrid from 'wijmo/wijmo.grid';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp implements AfterViewInit {
    protected dataSvc: DataSvc;
    private books;
    private authors;
    private filter;
    private toFilter;
    private cmbTitle;
    private inPrice;
    private cmbAuth;
    flex: wjcGrid.FlexGrid;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
    private updateAuthors();
    private updateFilter(part, value);
    private customFilterComp();
    private stopPropagation(ctl);
    private watchFocus(ctl, binding);
    private itemFormatter(panel, r, c, cell);
    private setHeader(p, r1, c1, r2, c2, hdr);
}
export declare class AppModule {
}
