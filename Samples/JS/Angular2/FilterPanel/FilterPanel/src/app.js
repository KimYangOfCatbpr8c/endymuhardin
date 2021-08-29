"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Angular
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var wijmo_angular2_grid_filter_1 = require('wijmo/wijmo.angular2.grid.filter');
var WjFilterPanel_1 = require('./components/WjFilterPanel');
'use strict';
// The FilterPanel application root component.
var AppCmp = (function () {
    function AppCmp() {
        this.initData();
    }
    AppCmp.prototype.initData = function () {
        var countries = 'Spain,Portugal,England,France,Ireland'.split(',');
        this.data = [];
        for (var i = 0; i < 100; i++) {
            this.data.push({
                id: i,
                active: i % 2 == 0,
                country: countries[i % countries.length],
                name: 'Item ' + i,
                date: new Date(),
            });
        }
    };
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
            imports: [wijmo_angular2_grid_1.WjGridModule, wijmo_angular2_grid_filter_1.WjGridFilterModule, platform_browser_1.BrowserModule],
            declarations: [WjFilterPanel_1.WjFilterPanel, AppCmp],
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