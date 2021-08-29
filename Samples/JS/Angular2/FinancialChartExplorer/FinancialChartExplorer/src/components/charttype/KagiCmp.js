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
var wjcCore = require('wijmo/wijmo');
'use strict';
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_chart_finance_1 = require('wijmo/wijmo.angular2.chart.finance');
var DataSvc_1 = require('./../../services/DataSvc');
var TooltipSvc_1 = require('./../../services/TooltipSvc');
//Kagi sample component
var KagiCmp = (function () {
    function KagiCmp(dataSvc, tooltipSvc) {
        this.data = [];
        this.dataSvc = dataSvc;
        this.tooltipSvc = tooltipSvc;
        this.dataList = dataSvc.getDataList();
        this.selectedSymbol = this.dataList[0].symbol;
        this.setDataSource();
        this.title = 'Kagi';
        this.options = {
            kagi: {
                reversalAmount: 1,
                rangeMode: 'Fixed',
                fields: 'Close'
            }
        };
        this.style = {
            stroke: 'rgb(136, 189, 230)'
        };
        this.altStyle = {
            stroke: 'rgb(136, 189, 230)'
        };
    }
    KagiCmp.prototype.selectedSymbolChanged = function () {
        this.setDataSource();
    };
    KagiCmp.prototype.chartRendered = function () {
        // customize tooltips
        if (this.chart) {
            this.chart.tooltip.content = this.tooltipSvc.getFinancialTooltip;
        }
    };
    KagiCmp.prototype.optionChanged = function () {
        if (this.chart) {
            this.chart.invalidate();
        }
    };
    KagiCmp.prototype.reversalAmountChanged = function (input) {
        if (input.value < input.min || (input.max && input.value > input.max)) {
            return;
        }
        if (this.chart) {
            this.chart.invalidate();
        }
    };
    KagiCmp.prototype.rangeModeChanged = function (menu) {
        var reversalInput = this.inputNumber;
        if (menu.selectedValue === 'Percentage') {
            reversalInput.format = 'p0';
            reversalInput.min = 0;
            reversalInput.max = 1;
            reversalInput.value = wjcCore.clamp(reversalInput.value, 0, .05);
            reversalInput.step = 0.05;
        }
        else if (menu.selectedValue === 'ATR') {
            reversalInput.format = 'n0';
            reversalInput.min = 2;
            reversalInput.max = this.data.length - 2;
            reversalInput.value = wjcCore.clamp(reversalInput.value, 14, this.data.length - 2);
            reversalInput.step = 1;
        }
        else {
            reversalInput.format = 'n0';
            reversalInput.min = 1;
            reversalInput.max = null;
            reversalInput.value = 1;
            reversalInput.step = 1;
        }
        this.optionChanged();
    };
    KagiCmp.prototype.setDataSource = function () {
        var _this = this;
        var symbol = this.selectedSymbol;
        this.dataSvc.getData(symbol).subscribe(function (data) {
            _this.data = data;
        });
    };
    __decorate([
        core_1.ViewChild('chart')
    ], KagiCmp.prototype, "chart", void 0);
    __decorate([
        core_1.ViewChild('inputNumber')
    ], KagiCmp.prototype, "inputNumber", void 0);
    KagiCmp = __decorate([
        core_1.Component({
            selector: 'kagi-cmp',
            templateUrl: 'src/components/charttype/KagiCmp.html',
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc)),
        __param(1, core_1.Inject(TooltipSvc_1.TooltipSvc))
    ], KagiCmp);
    return KagiCmp;
}());
exports.KagiCmp = KagiCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: KagiCmp }
]);
var KagiModule = (function () {
    function KagiModule() {
    }
    KagiModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, forms_1.FormsModule, routing, wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_finance_1.WjChartFinanceModule],
            declarations: [KagiCmp],
        })
    ], KagiModule);
    return KagiModule;
}());
exports.KagiModule = KagiModule;
//# sourceMappingURL=KagiCmp.js.map