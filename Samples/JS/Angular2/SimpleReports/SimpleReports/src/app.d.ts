/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcCore from 'wijmo/wijmo';
import { AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp implements AfterViewInit {
    private router;
    private ngZone;
    reports: wjcCore.CollectionView;
    zoomLevels: wjcCore.CollectionView;
    viewsLoaded: number;
    private _dataSvc;
    zoomEle: ElementRef;
    constructor(router: Router, dataSvc: DataSvc, ngZone: NgZone);
    ngAfterViewInit(): void;
    print(): void;
    _viewsLoadedChanged(): void;
}
export declare class AppModule {
}
