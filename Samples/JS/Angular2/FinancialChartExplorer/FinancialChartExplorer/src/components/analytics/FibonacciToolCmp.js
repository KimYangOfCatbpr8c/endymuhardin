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
var wjcChart = require('wijmo/wijmo.chart');
'use strict';
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_chart_finance_1 = require('wijmo/wijmo.angular2.chart.finance');
var wijmo_angular2_chart_interaction_1 = require('wijmo/wijmo.angular2.chart.interaction');
var wijmo_angular2_chart_annotation_1 = require('wijmo/wijmo.angular2.chart.annotation');
var wijmo_angular2_chart_finance_analytics_1 = require('wijmo/wijmo.angular2.chart.finance.analytics');
var DataSvc_1 = require('./../../services/DataSvc');
var TooltipSvc_1 = require('./../../services/TooltipSvc');
//FibonacciTool sample component
var FibonacciToolCmp = (function () {
    function FibonacciToolCmp(dataSvc, tooltipSvc) {
        this.data = [];
        this.dataSvc = dataSvc;
        this.tooltipSvc = tooltipSvc;
        this.dataList = dataSvc.getDataList();
        this.selectedSymbol = this.dataList[0].symbol;
        this.selectedFib = 'retracements';
        this.setDataSource();
        this.title = 'Fibonacci Tool';
        this.properties = {
            retracements: {
                labelPosition: 'Left',
                uptrend: true,
                selectorVisible: false
            },
            arcs: {
                labelPosition: 'Top',
                start: new wjcChart.DataPoint(46, 19.75),
                end: new wjcChart.DataPoint(54, 17.1)
            },
            fans: {
                labelPosition: 'Top',
                start: new wjcChart.DataPoint(10, 18.12),
                end: new wjcChart.DataPoint(32, 20.53)
            },
            timeZones: {
                labelPosition: 'Right',
                start: 0,
                end: 3
            }
        };
    }
    FibonacciToolCmp.prototype.selectedSymbolChanged = function () {
        this.setDataSource();
    };
    FibonacciToolCmp.prototype.rangeChanged = function () {
        var chart = this.chart;
        if (chart) {
            chart.beginUpdate();
            chart.series[1].maxX = this.selector.max;
            chart.series[1].minX = this.selector.min;
            chart.endUpdate();
        }
    };
    FibonacciToolCmp.prototype.valueChanged = function () {
        if (this.chart) {
            this.chart.invalidate();
        }
    };
    FibonacciToolCmp.prototype.fibTypeClicked = function (type) {
        // ensure range selector is hidden
        if (type.selectedIndex !== 2) {
            this.properties.retracements.selectorVisible = false;
        }
    };
    FibonacciToolCmp.prototype.setDataSource = function () {
        var _this = this;
        var symbol = this.selectedSymbol;
        this.dataSvc.getData(symbol).subscribe(function (data) {
            _this.data = data;
        });
    };
    __decorate([
        core_1.ViewChild('chart')
    ], FibonacciToolCmp.prototype, "chart", void 0);
    __decorate([
        core_1.ViewChild('selector')
    ], FibonacciToolCmp.prototype, "selector", void 0);
    FibonacciToolCmp = __decorate([
        core_1.Component({
            selector: 'fibonacci-tool-cmp',
            templateUrl: 'src/components/analytics/FibonacciToolCmp.html',
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc)),
        __param(1, core_1.Inject(TooltipSvc_1.TooltipSvc))
    ], FibonacciToolCmp);
    return FibonacciToolCmp;
}());
exports.FibonacciToolCmp = FibonacciToolCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: FibonacciToolCmp }
]);
var FibonacciToolModule = (function () {
    function FibonacciToolModule() {
    }
    FibonacciToolModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, forms_1.FormsModule, routing,
                wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_finance_1.WjChartFinanceModule, wijmo_angular2_chart_interaction_1.WjChartInteractionModule, wijmo_angular2_chart_annotation_1.WjChartAnnotationModule,
                wijmo_angular2_chart_finance_analytics_1.WjChartFinanceAnalyticsModule],
            declarations: [FibonacciToolCmp],
        })
    ], FibonacciToolModule);
    return FibonacciToolModule;
}());
exports.FibonacciToolModule = FibonacciToolModule;
//# sourceMappingURL=FibonacciToolCmp.js.map