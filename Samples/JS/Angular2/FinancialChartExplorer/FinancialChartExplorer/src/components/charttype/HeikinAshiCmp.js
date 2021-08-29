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
'use strict';
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_chart_finance_1 = require('wijmo/wijmo.angular2.chart.finance');
var wijmo_angular2_chart_interaction_1 = require('wijmo/wijmo.angular2.chart.interaction');
var DataSvc_1 = require('./../../services/DataSvc');
var TooltipSvc_1 = require('./../../services/TooltipSvc');
//HeikinAshi sample component
var HeikinAshiCmp = (function () {
    function HeikinAshiCmp(dataSvc, tooltipSvc) {
        this.data = [];
        this.dataSvc = dataSvc;
        this.tooltipSvc = tooltipSvc;
        this.dataList = dataSvc.getDataList();
        this.selectedSymbol = this.dataList[0].symbol;
        this.setDataSource();
        this.title = 'Heikin-Ashi';
    }
    HeikinAshiCmp.prototype.selectedSymbolChanged = function () {
        this.setDataSource();
    };
    HeikinAshiCmp.prototype.selectorChartRendered = function () {
        if (this.selector && this.selectorChart) {
            var range = this.dataSvc.findApproxRange(this.selectorChart.axisX.actualMin, this.selectorChart.axisX.actualMax);
            this.selector.max = range.max;
            this.selector.min = range.min;
        }
    };
    HeikinAshiCmp.prototype.chartRendered = function () {
        // customize tooltips
        if (this.chart) {
            this.chart.tooltip.content = this.tooltipSvc.getFinancialTooltip;
        }
    };
    HeikinAshiCmp.prototype.rangeChanged = function () {
        var chart = this.chart, selector = this.selector, yRange;
        if (!chart || !selector) {
            return;
        }
        // find visible y-range
        yRange = this.dataSvc.findRenderedYRange(this.data, selector.min, selector.max);
        // update main chart's x & y range
        chart.axisX.min = selector.min;
        chart.axisX.max = selector.max;
        chart.axisY.min = yRange.min;
        chart.axisY.max = yRange.max;
        chart.invalidate();
    };
    HeikinAshiCmp.prototype.setDataSource = function () {
        var _this = this;
        var symbol = this.selectedSymbol;
        this.dataSvc.getData(symbol).subscribe(function (data) {
            _this.data = data;
        });
    };
    __decorate([
        core_1.ViewChild('chart')
    ], HeikinAshiCmp.prototype, "chart", void 0);
    __decorate([
        core_1.ViewChild('selectorChart')
    ], HeikinAshiCmp.prototype, "selectorChart", void 0);
    __decorate([
        core_1.ViewChild('selector')
    ], HeikinAshiCmp.prototype, "selector", void 0);
    HeikinAshiCmp = __decorate([
        core_1.Component({
            selector: 'heikin-ashi-cmp',
            templateUrl: 'src/components/charttype/HeikinAshiCmp.html',
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc)),
        __param(1, core_1.Inject(TooltipSvc_1.TooltipSvc))
    ], HeikinAshiCmp);
    return HeikinAshiCmp;
}());
exports.HeikinAshiCmp = HeikinAshiCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: HeikinAshiCmp }
]);
var HeikinAshiModule = (function () {
    function HeikinAshiModule() {
    }
    HeikinAshiModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, forms_1.FormsModule, routing, wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_finance_1.WjChartFinanceModule, wijmo_angular2_chart_interaction_1.WjChartInteractionModule],
            declarations: [HeikinAshiCmp],
        })
    ], HeikinAshiModule);
    return HeikinAshiModule;
}());
exports.HeikinAshiModule = HeikinAshiModule;
//# sourceMappingURL=HeikinAshiCmp.js.map