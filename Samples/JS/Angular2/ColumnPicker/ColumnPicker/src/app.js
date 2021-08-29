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
var ColumnPickerDctv_1 = require('./components/ColumnPickerDctv');
'use strict';
// The application root component.
var AppCmp = (function () {
    function AppCmp() {
        this.data = this.getData(100);
    }
    // some random data
    AppCmp.prototype.getData = function (count) {
        var data = [], countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'], products = ['Widget', 'Gadget', 'Doohickey'], colors = ['Black', 'White', 'Red', 'Green', 'Blue'], dt = new Date();
        for (var i = 0; i < count; i++) {
            var date = new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60), countryId = Math.floor(Math.random() * countries.length), productId = Math.floor(Math.random() * products.length), colorId = Math.floor(Math.random() * colors.length);
            var item = {
                id: i,
                start: date,
                end: date,
                country: countries[countryId],
                product: products[productId],
                color: colors[colorId],
                countryId: countryId,
                productId: productId,
                colorId: colorId,
                amount: Math.random() * 10000 - 5000,
                amount2: Math.random() * 10000 - 5000,
                discount: Math.random() / 4,
                active: i % 4 == 0,
            };
            data.push(item);
        }
        return data;
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
            imports: [wijmo_angular2_grid_1.WjGridModule, platform_browser_1.BrowserModule],
            declarations: [ColumnPickerDctv_1.ColumnPicker, AppCmp],
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