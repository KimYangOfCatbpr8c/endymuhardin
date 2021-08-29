"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var wjcGridXlsx = require('wijmo/wijmo.grid.xlsx');
// Angular
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var AppTab_1 = require('./components/AppTab');
var DataSvc_1 = require('./services/DataSvc');
var FlexGridImportExportBaseCmp_1 = require('./FlexGridImportExportBaseCmp');
'use strict';
// The Explorer application root component.
var FlexGridImportExportCmp = (function (_super) {
    __extends(FlexGridImportExportCmp, _super);
    function FlexGridImportExportCmp() {
        _super.apply(this, arguments);
    }
    FlexGridImportExportCmp.prototype.exportExcel = function () {
        wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'FlexGrid.xlsx');
    };
    FlexGridImportExportCmp.prototype.importExcel = function () {
        var fileInput = document.getElementById('importFile');
        if (fileInput.files[0]) {
            wjcGridXlsx.FlexGridXlsxConverter.load(this.flexGrid, fileInput.files[0], { includeColumnHeaders: this.includeColumnHeader });
        }
    };
    FlexGridImportExportCmp = __decorate([
        core_1.Component({
            selector: 'flex-grid-import-export-cmp',
            templateUrl: 'src/flexGridImportExportCmp.html'
        })
    ], FlexGridImportExportCmp);
    return FlexGridImportExportCmp;
}(FlexGridImportExportBaseCmp_1.FlexGridImportExportBaseCmp));
exports.FlexGridImportExportCmp = FlexGridImportExportCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [wijmo_angular2_grid_1.WjGridModule, platform_browser_1.BrowserModule, forms_1.FormsModule, AppTab_1.TabsModule],
            declarations: [FlexGridImportExportCmp],
            providers: [DataSvc_1.DataSvc],
            bootstrap: [FlexGridImportExportCmp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
core_1.enableProdMode();
// Bootstrap application with hash style navigation and global services.
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=FlexGridImportExportCmp.js.map