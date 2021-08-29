"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<reference path="../typings/globals/core-js/index.d.ts"/>
var wjcViewer = require('wijmo/wijmo.viewer');
// Angular
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_viewer_1 = require('wijmo/wijmo.angular2.viewer');
var AppTab_1 = require('./components/AppTab');
'use strict';
// The Explorer application root component.
var AppCmp = (function () {
    function AppCmp() {
        this.serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/report';
        this.filePath = 'ReportsRoot/Formatting/AlternateBackground.flxr';
        this.reportName = 'AlternateBackground';
        this.ssrsFilePath = 'c1ssrs/AdventureWorks/Company Sales';
        this.chgReportName = '';
        this.chgFilePath = '';
        this.fullScreen = false;
        this.selectMouseMode = true;
        this.zoomFactor = 1;
        this.reports = [
            { name: 'Alternating Background', path: 'ReportsRoot/Formatting/AlternateBackground.flxr/AlternateBackground' },
            { name: 'All Charts', path: 'ReportsRoot/Controls/AllCharts.flxr/AllCharts' },
            { name: 'Check Box', path: 'ReportsRoot/Controls/CheckBox.flxr/CheckBox' },
            { name: 'Shapes', path: 'ReportsRoot/Controls/Shapes.flxr/Shapes' }
        ];
        this._continuousViewMode = false;
    }
    Object.defineProperty(AppCmp.prototype, "continuousViewMode", {
        get: function () {
            return this._continuousViewMode;
        },
        set: function (value) {
            if (this._continuousViewMode != value) {
                this._continuousViewMode = value;
                this.reportViewer.viewMode = value ? wjcViewer.ViewMode.Continuous : wjcViewer.ViewMode.Single;
            }
        },
        enumerable: true,
        configurable: true
    });
    AppCmp.prototype.changeReportPath = function (path) {
        var index = path.lastIndexOf('/');
        var filePath = path.substr(0, index);
        var reportName = path.substr(index + 1);
        this.chgFilePath = filePath;
        this.chgReportName = reportName;
    };
    __decorate([
        core_1.ViewChild('reportViewer')
    ], AppCmp.prototype, "reportViewer", void 0);
    AppCmp = __decorate([
        core_1.Component({
            selector: 'app-cmp',
            templateUrl: 'src/app.html'
        })
    ], AppCmp);
    return AppCmp;
}());
exports.AppCmp = AppCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [wijmo_angular2_input_1.WjInputModule, wijmo_angular2_grid_1.WjGridModule, wijmo_angular2_viewer_1.WjViewerModule, platform_browser_1.BrowserModule, forms_1.FormsModule, AppTab_1.TabsModule],
            declarations: [AppCmp],
            bootstrap: [AppCmp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
core_1.enableProdMode();
// Bootstrap application with hash style navigation and global services.
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=app.js.map