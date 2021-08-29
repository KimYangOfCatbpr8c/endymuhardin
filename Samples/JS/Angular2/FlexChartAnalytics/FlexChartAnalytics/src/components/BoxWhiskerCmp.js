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
var BoxWhiskerCmp = (function () {
    function BoxWhiskerCmp(dataSvc) {
        var _this = this;
        this.groupWidthChanged = function (input) {
            if (input.value < input.min || input.value > input.max) {
                return;
            }
            _this.groupWidth = input.value;
        };
        this.gapWidthChanged = function (input) {
            if (input.value < input.min || input.value > input.max) {
                return;
            }
            _this.gapWidth = input.value;
        };
        this.showLabelChanged = function (input) {
            _this.boxwhiskerChart.dataLabel.content = input.checked ? '{y}' : '';
        };
        this.itemsSource = dataSvc.getBoxData();
        this.title = 'Box & Whisker';
        this.rotated = false;
        this.groupWidth = 0.8;
        this.gapWidth = 0.1;
        this.quartileCalculation = wjcChartAnalytics.QuartileCalculation.InclusiveMedian;
        this.showMeanLine = false;
        this.showMeanMarker = false;
        this.showInnerpoints = false;
        this.showOutliers = false;
        this.showLabel = false;
    }
    BoxWhiskerCmp.prototype.ngAfterViewInit = function () {
        this.boxwhiskerChart.tooltip.content = function (hti) {
            if (hti) {
                return '<b>' + hti.name + '</b> - <b>' + hti.x + '</b></br>' +
                    '<b>min</b>: ' + hti.item.min + '</br>' +
                    '<b>firstQuartile</b>: ' + hti.item.firstQuartile + '</br>' +
                    '<b>median</b>: ' + hti.item.median + '</br>' +
                    '<b>thirdQuartile</b>: ' + hti.item.thirdQuartile + '</br>' +
                    '<b>max</b>: ' + hti.item.max + '</br>' +
                    '<b>mean</b>: ' + hti.item.mean + '</br>';
            }
        };
    };
    __decorate([
        core_1.ViewChild('boxwhisker')
    ], BoxWhiskerCmp.prototype, "boxwhisker", void 0);
    __decorate([
        core_1.ViewChild('boxwhisker2')
    ], BoxWhiskerCmp.prototype, "boxwhisker2", void 0);
    __decorate([
        core_1.ViewChild('boxwhisker3')
    ], BoxWhiskerCmp.prototype, "boxwhisker3", void 0);
    __decorate([
        core_1.ViewChild('boxwhiskerChart')
    ], BoxWhiskerCmp.prototype, "boxwhiskerChart", void 0);
    BoxWhiskerCmp = __decorate([
        core_1.Component({
            selector: 'box-whisker-cmp',
            templateUrl: 'src/components/BoxWhiskerCmp.html'
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc))
    ], BoxWhiskerCmp);
    return BoxWhiskerCmp;
}());
exports.BoxWhiskerCmp = BoxWhiskerCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: BoxWhiskerCmp }
]);
var BoxWhiskerModule = (function () {
    function BoxWhiskerModule() {
    }
    BoxWhiskerModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, forms_1.FormsModule, wijmo_angular2_chart_1.WjChartModule, wijmo_angular2_chart_analytics_1.WjChartAnalyticsModule, wijmo_angular2_input_1.WjInputModule],
            declarations: [BoxWhiskerCmp],
        })
    ], BoxWhiskerModule);
    return BoxWhiskerModule;
}());
exports.BoxWhiskerModule = BoxWhiskerModule;
//# sourceMappingURL=BoxWhiskerCmp.js.map