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
///<reference path="../typings/globals/core-js/index.d.ts"/>
var wjcCore = require('wijmo/wijmo');
var wjcGridFilter = require('wijmo/wijmo.grid.filter');
// Angular
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_grid_multirow_1 = require('wijmo/wijmo.angular2.grid.multirow');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var AppTab_1 = require('./components/AppTab');
var DataSvc_1 = require('./services/DataSvc');
'use strict';
// The Explorer application root component.
var AppCmp = (function () {
    function AppCmp(dataSvc) {
        this.dataSvc = dataSvc;
        this.orders = dataSvc.orders;
        this.groupedOrders = dataSvc.groupedOrders;
        this.pagedOrders = dataSvc.pagedOrders;
        // create 'addNewOrders' collection, start with last item selected
        this.addNewOrders = dataSvc.addNewOrders;
        this.addNewOrders.moveCurrentToLast();
        // sample layout definitions
        this.ldOneLine = [
            { cells: [{ binding: 'id', header: 'ID', cssClass: 'id' }] },
            { cells: [{ binding: 'date', header: 'Ordered' }] },
            { cells: [{ binding: 'shippedDate', header: 'Shipped' }] },
            { cells: [{ binding: 'amount', header: 'Amount', format: 'c', cssClass: 'amount' }] },
            { cells: [{ binding: 'customer.name', header: 'Customer' }] },
            { cells: [{ binding: 'customer.address', header: 'Address' }] },
            { cells: [{ binding: 'customer.city', header: 'City', dataMap: dataSvc.cityMap }] },
            { cells: [{ binding: 'customer.state', header: 'State', width: 45 }] },
            { cells: [{ binding: 'customer.zip', header: 'Zip' }] },
            { cells: [{ binding: 'customer.email', header: 'Customer Email', cssClass: 'email' }] },
            { cells: [{ binding: 'customer.phone', header: 'Customer Phone' }] },
            { cells: [{ binding: 'shipper.name', header: 'Shipper' }] },
            { cells: [{ binding: 'shipper.email', header: 'Shipper Email', cssClass: 'email' }] },
            { cells: [{ binding: 'shipper.phone', header: 'Shipper Phone' }] },
            { cells: [{ binding: 'shipper.express', header: 'Express' }] }
        ];
        this.ldTwoLines = [
            {
                header: 'Order', colspan: 2, cells: [
                    { binding: 'id', header: 'ID', cssClass: 'id' },
                    { binding: 'date', header: 'Ordered' },
                    { binding: 'amount', header: 'Amount', format: 'c', cssClass: 'amount' },
                    { binding: 'shippedDate', header: 'Shipped' }
                ]
            },
            {
                header: 'Customer', colspan: 3, cells: [
                    { binding: 'customer.name', header: 'Name' },
                    { binding: 'customer.email', header: 'EMail', colspan: 2, cssClass: 'email' },
                    { binding: 'customer.address', header: 'Address' },
                    { binding: 'customer.city', header: 'City', dataMap: dataSvc.cityMap },
                    { binding: 'customer.state', header: 'State', width: 45 }
                ]
            },
            {
                header: 'Shipper', cells: [
                    { binding: 'shipper.name', header: 'Shipper', colspan: 2 },
                    { binding: 'shipper.email', header: 'EMail', cssClass: 'email' },
                    { binding: 'shipper.express', header: 'Express' }
                ]
            }
        ];
        this.ldThreeLines = [
            {
                header: 'Order', colspan: 2, cells: [
                    { binding: 'id', header: 'ID', colspan: 2, cssClass: 'id' },
                    { binding: 'amount', header: 'Amount', format: 'c', colspan: 2, cssClass: 'amount' },
                    { binding: 'date', header: 'Ordered' },
                    { binding: 'shippedDate', header: 'Shipped' }
                ]
            },
            {
                header: 'Customer', colspan: 3, cells: [
                    { binding: 'customer.name', header: 'Name' },
                    { binding: 'customer.email', header: 'EMail', colspan: 2, cssClass: 'email' },
                    { binding: 'customer.address', header: 'Address', colspan: 2 },
                    { binding: 'customer.phone', header: 'Phone' },
                    { binding: 'customer.city', header: 'City', dataMap: dataSvc.cityMap },
                    { binding: 'customer.state', header: 'State', width: 45 },
                    { binding: 'customer.zip', header: 'Zip' },
                ]
            },
            {
                header: 'Shipper', cells: [
                    { binding: 'shipper.name', header: 'Shipper' },
                    { binding: 'shipper.email', header: 'EMail', cssClass: 'email' },
                    { binding: 'shipper.express', header: 'Express' }
                ]
            }
        ];
        this.layoutDefs = new wjcCore.CollectionView([
            {
                name: 'Traditional',
                description: 'Traditional grid view, with one row per record. The user must scroll horizontally to see the whole record.',
                def: this.ldOneLine
            },
            {
                name: 'Compact',
                description: 'This view uses two rows per record. The layout is divided into three groups: order, customer, and shipper',
                def: this.ldTwoLines
            },
            {
                name: 'Detailed',
                description: 'This view uses three rows per record. The layout is divided into three groups: order, customer, and shipper',
                def: this.ldThreeLines
            }
        ]);
    }
    // toggle frozen rows/columns
    AppCmp.prototype.toggleFreeze = function (rows, cols) {
        var flex = this.frozenGrid;
        if (flex) {
            flex.frozenColumns = flex.frozenColumns ? 0 : cols;
            flex.frozenRows = flex.frozenRows ? 0 : rows;
        }
    };
    AppCmp.prototype.ngAfterViewInit = function () {
        var filter = new wjcGridFilter.FlexGridFilter(this.filterGrid);
    };
    __decorate([
        core_1.ViewChild('frozenGrid')
    ], AppCmp.prototype, "frozenGrid", void 0);
    __decorate([
        core_1.ViewChild('filterGrid')
    ], AppCmp.prototype, "filterGrid", void 0);
    AppCmp = __decorate([
        core_1.Component({
            selector: 'app-cmp',
            templateUrl: 'src/app.html'
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc))
    ], AppCmp);
    return AppCmp;
}());
exports.AppCmp = AppCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [wijmo_angular2_input_1.WjInputModule, wijmo_angular2_grid_multirow_1.WjGridMultirowModule, platform_browser_1.BrowserModule, forms_1.FormsModule, AppTab_1.TabsModule],
            declarations: [AppCmp],
            providers: [DataSvc_1.DataSvc],
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