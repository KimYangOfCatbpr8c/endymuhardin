/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcViewer from 'wijmo/wijmo.viewer';
import { AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
export declare class AppCmp implements AfterViewInit {
    reportView: wjcViewer.ReportViewer;
    flexReportsCombo: any;
    ssrsReportsCombo: any;
    _reportInfo: string;
    _ssrsReportInfo: string;
    _serviceUrl: string;
    _initReport: string;
    reportItems: any;
    ssrsItems: any;
    filePath: string;
    reportName: string;
    serviceUrl: string;
    paginated: boolean;
    constructor(http: Http);
    ngAfterViewInit(): void;
    reportInfo: string;
    ssrsReportInfo: string;
    private _initializeReport(flexReports);
    private _loadFlexReport();
    private _loadSsrsReport();
}
export declare class AppModule {
}
