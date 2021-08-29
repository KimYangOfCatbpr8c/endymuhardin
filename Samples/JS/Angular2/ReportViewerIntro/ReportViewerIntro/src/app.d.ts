/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcViewer from 'wijmo/wijmo.viewer';
export declare class AppCmp {
    serviceUrl: string;
    filePath: string;
    reportName: string;
    ssrsFilePath: string;
    chgReportName: string;
    chgFilePath: string;
    fullScreen: boolean;
    selectMouseMode: boolean;
    zoomFactor: number;
    reports: {
        name: string;
        path: string;
    }[];
    reportViewer: wjcViewer.ReportViewer;
    private _continuousViewMode;
    constructor();
    continuousViewMode: boolean;
    changeReportPath(path: string): void;
}
export declare class AppModule {
}
