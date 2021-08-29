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
var wjcChartAnalytics = require('wijmo/wijmo.chart.analytics');
var wjcChart = require('wijmo/wijmo.chart');
'use strict';
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var wijmo_angular2_chart_1 = require('wijmo/wijmo.angular2.chart');
var wijmo_angular2_chart_analytics_1 = require('wijmo/wijmo.angular2.chart.analytics');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var DataSvc_1 = require('./../services/DataSvc');
//Box & Whisker sample component
var ErrorBarCmp = (function () {
    function ErrorBarCmp(dataSvc) {
        this.itemsSource = dataSvc.getErrorBarData();
        this.title = 'ErrorBar';
        this.rotated = false;
        this.chartType = wjcChart.ChartType.Column;
        this.errorAmount = wjcChartAnalytics.ErrorAmount.FixedValue;
        this.endStyle = wjcChartAnalytics.ErrorBarEndStyle.Cap;
        this.direction = wjcChartAnalytics.ErrorBarDirection.Both;
        this.value = 10;
    }
    ErrorBarCmp.prototype.errorAmountChanged = function (menu) {
        var val = menu.selectedValue;
        switch (val) {
            case 'FixedValue':
                this.value = 10;
                break;
            case 'Percentage':
                this.value = 0.1;
                break;
            case 'StandardDeviation':
                this.value = 1;
                break;
            case 'Custom':
                this.value = {
                    minus: 5,
                    plus: 10
                };
                break;
        }
    };
    __decorate([
        core_1.ViewChild('errorbar')
    ], ErrorBarCmp.prototype, "errorbar", void 0);
    __decorate([
        core_1.ViewChild('errorbarChart')
    ], ErrorBarCmp.prototype, "errorbarChart", void 0);
    ErrorBarCmp = __decorate([
        core_1.Component({
            selector: 'error-bar-cmp',
            templateUrl: 'src/components/ErrorBarCmp.html'
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc))
    ], ErrorBarCmp);
    return ErrorBarCmp;
}());
exports.ErrorBarCmp = ErrorBarCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: ErrorBarCmp }
]);
var ErrorBarModule = (function () {
    function ErrorBarModule() {
    }
    ErrorBarModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, forms_1.FormsModule, wijmo_angular2_chart_1.WjChartModule, wijmo_angular2_chart_analytics_1.WjChartAnalyticsModule, wijmo_angular2_input_1.WjInputModule],
            declarations: [ErrorBarCmp],
        })
    ], ErrorBarModule);
    return ErrorBarModule;
}());
exports.ErrorBarModule = ErrorBarModule;
//# sourceMappingURL=ErrorBarCmp.js.map