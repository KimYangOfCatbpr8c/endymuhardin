/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcXlsx from 'wijmo/wijmo.xlsx';
import { AfterViewInit } from '@angular/core';
export declare class DrawWorkBookCmp implements AfterViewInit {
    workbook: wjcXlsx.Workbook;
    sheetIndex: number;
    ngAfterViewInit(): void;
    drawSheet(sheetIndex: any): void;
    private _loadWorkbook();
}
export declare class AppModule {
}
