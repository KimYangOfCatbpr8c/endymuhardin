///<reference path="../typings/globals/core-js/index.d.ts"/>
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Angular
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_chart_1 = require('wijmo/wijmo.angular2.chart');
var wijmo_angular2_chart_animation_1 = require('wijmo/wijmo.angular2.chart.animation');
var wijmo_angular2_chart_finance_1 = require('wijmo/wijmo.angular2.chart.finance');
var wijmo_angular2_chart_annotation_1 = require('wijmo/wijmo.angular2.chart.annotation');
var wijmo_angular2_chart_interaction_1 = require('wijmo/wijmo.angular2.chart.interaction');
var wijmo_angular2_chart_analytics_1 = require('wijmo/wijmo.angular2.chart.analytics');
var AppTab_1 = require('./components/AppTab');
var DataSvc_1 = require('./services/DataSvc');
// Sample components
var GettingStartedCmp_1 = require('./components/GettingStartedCmp');
var ChartTypesCmp_1 = require('./components/ChartTypesCmp');
var MarkerCmp_1 = require('./components/MarkerCmp');
var RangeSelectorCmp_1 = require('./components/RangeSelectorCmp');
var TrendLinesCmp_1 = require('./components/TrendLinesCmp');
var EventAnnotationCmp_1 = require('./components/EventAnnotationCmp');
var AnimationCmp_1 = require('./components/AnimationCmp');
'use strict';
// The FinancialChartIntro application root component.
var AppCmp = (function () {
    function AppCmp() {
    }
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
            imports: [wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_1.WjChartModule, wijmo_angular2_chart_animation_1.WjChartAnimationModule, wijmo_angular2_chart_finance_1.WjChartFinanceModule,
                wijmo_angular2_chart_annotation_1.WjChartAnnotationModule, wijmo_angular2_chart_interaction_1.WjChartInteractionModule, wijmo_angular2_chart_analytics_1.WjChartAnalyticsModule,
                http_1.HttpModule, platform_browser_1.BrowserModule, forms_1.FormsModule, AppTab_1.TabsModule],
            declarations: [GettingStartedCmp_1.GettingStartedCmp, ChartTypesCmp_1.ChartTypesCmp, MarkerCmp_1.MarkerCmp, RangeSelectorCmp_1.RangeSelectorCmp, TrendLinesCmp_1.TrendLinesCmp,
                EventAnnotationCmp_1.EventAnnotationCmp, AnimationCmp_1.AnimationCmp, AppCmp],
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