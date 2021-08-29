/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { AfterViewInit } from '@angular/core';
import { DataSvc } from './services/DataSvc';
import { CountryGroupHeaderTemplate } from './CellTemplates/CountryGroupHeaderTemplate';
import { StatGroupTemplate } from './CellTemplates/StatGroupTemplate';
import { StatHeaderTemplate } from './CellTemplates/StatHeaderTemplate';
export declare class AppCmp implements AfterViewInit {
    countries: string[];
    data1: wjcCore.CollectionView;
    data2: wjcCore.CollectionView;
    data3: wjcCore.CollectionView;
    customTopLeft: boolean;
    customRowHeader: boolean;
    customRowHeaderEdit: boolean;
    customCell: boolean;
    customCellEdit: boolean;
    customColumnHeader: boolean;
    customGroupHeader: boolean;
    customGroup: boolean;
    customColumnFooter: boolean;
    customBottomLeft: boolean;
    statisticsColumns: {
        binding: string;
        header: string;
        width: number;
        align: string;
        format: string;
        columnHeaderTemplate: typeof StatHeaderTemplate;
        groupTemplate: typeof StatGroupTemplate;
        reportType: string;
        isAvailable: boolean;
    }[];
    uiCtx: {
        highlightDownloads: boolean;
        reportType: string;
    };
    countryGroupHeaderTemplate: typeof CountryGroupHeaderTemplate;
    protected dataSvc: DataSvc;
    flex1: wjcGrid.FlexGrid;
    flex2: wjcGrid.FlexGrid;
    flex3: wjcGrid.FlexGrid;
    constructor(dataSvc: DataSvc);
    ngAfterViewInit(): void;
    private _dynaColumnsFlexInit(flex);
}
export declare class AppModule {
}
