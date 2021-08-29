"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// Angular
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_viewer_1 = require('wijmo/wijmo.angular2.viewer');
'use strict';
// The application root component.
var AppCmp = (function () {
    function AppCmp(http) {
        var _this = this;
        this._ssrsReportInfo = '';
        this._serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/report';
        //loading flex reports
        http.get("flexReport.config.json").subscribe(function (res) {
            var flexReports = res.json();
            _this.reportItems = flexReports.categories;
            _this._initializeReport(flexReports);
        });
        //loading ssrs reports
        http.get("ssrsReport.config.json").subscribe(function (res) {
            var ssrsReports = res.json();
            _this.ssrsItems = ssrsReports.categories;
        });
    }
    AppCmp.prototype.ngAfterViewInit = function () {
        var _this = this;
        window.setTimeout(function () {
            _this.reportInfo = _this._initReport;
        }, 0);
    };
    Object.defineProperty(AppCmp.prototype, "reportInfo", {
        get: function () {
            return this._reportInfo;
        },
        set: function (value) {
            this._reportInfo = value;
            if (value === 'None') {
                return;
            }
            if (this._reportInfo) {
                this._loadFlexReport();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppCmp.prototype, "ssrsReportInfo", {
        get: function () {
            return this._ssrsReportInfo;
        },
        set: function (value) {
            this._ssrsReportInfo = value;
            if (value === 'None') {
                return;
            }
            if (this._ssrsReportInfo) {
                this._loadSsrsReport();
            }
        },
        enumerable: true,
        configurable: true
    });
    AppCmp.prototype._initializeReport = function (flexReports) {
        var selectedReport = flexReports.selectedReport, selectedCategoryName = selectedReport.categoryName, selectedReportName = selectedReport.reportName;
        this._initReport = 'ReportsRoot/' + selectedCategoryName
            + '/' + selectedReportName + '.flxr' + '*' + selectedReportName;
    };
    AppCmp.prototype._loadFlexReport = function () {
        if (this.reportView && this._reportInfo) {
            this.ssrsReportsCombo.nativeElement.value = 'None';
            var reportInfo = this._reportInfo.split('*');
            this.filePath = reportInfo[0];
            this.reportName = reportInfo[1];
            this.serviceUrl = this._serviceUrl;
            this.paginated = true;
        }
    };
    AppCmp.prototype._loadSsrsReport = function () {
        if (this.reportView && this._ssrsReportInfo) {
            this.flexReportsCombo.nativeElement.value = 'None';
            this.filePath = this._ssrsReportInfo;
            this.reportName = '';
            this.serviceUrl = this._serviceUrl;
            this.paginated = false;
        }
    };
    __decorate([
        core_1.ViewChild('reportView')
    ], AppCmp.prototype, "reportView", void 0);
    __decorate([
        core_1.ViewChild('flexReportsCombo')
    ], AppCmp.prototype, "flexReportsCombo", void 0);
    __decorate([
        core_1.ViewChild('ssrsReportsCombo')
    ], AppCmp.prototype, "ssrsReportsCombo", void 0);
    AppCmp = __decorate([
        core_1.Component({
            selector: 'app-cmp',
            templateUrl: 'src/app.html'
        }),
        __param(0, core_1.Inject(http_1.Http))
    ], AppCmp);
    return AppCmp;
}());
exports.AppCmp = AppCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [wijmo_angular2_viewer_1.WjViewerModule, platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule],
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