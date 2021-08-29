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
var wijmo_angular2_chart_interaction_1 = require('wijmo/wijmo.angular2.chart.interaction');
var DataSvc_1 = require('./../../services/DataSvc');
var TooltipSvc_1 = require('./../../services/TooltipSvc');
//Renko sample component
var RenkoCmp = (function () {
    function RenkoCmp(dataSvc, tooltipSvc) {
        this.data = [];
        this.dataSvc = dataSvc;
        this.tooltipSvc = tooltipSvc;
        this.dataList = dataSvc.getDataList();
        this.selectedSymbol = this.dataList[0].symbol;
        this.setDataSource();
        this.title = 'Renko';
        this.options = {
            renko: {
                boxSize: 2,
                rangeMode: 'Fixed',
                fields: 'Close'
            }
        };
        this.style = {
            stroke: 'rgb(136, 189, 230)',
            fill: 'rgba(136, 189, 230, 0.701961)'
        };
        this.altStyle = {
            stroke: 'rgb(136, 189, 230)',
            fill: 'transparent'
        };
    }
    RenkoCmp.prototype.selectedSymbolChanged = function () {
        this.setDataSource();
    };
    RenkoCmp.prototype.chartRendered = function () {
        // customize tooltips
        if (this.chart) {
            this.chart.tooltip.content = this.tooltipSvc.getFinancialTooltip;
        }
    };
    RenkoCmp.prototype.optionChanged = function () {
        if (this.chart) {
            this.chart.invalidate();
        }
    };
    RenkoCmp.prototype.boxSizeChanged = function (input) {
        if (input.value < input.min || (input.max && input.value > input.max)) {
            return;
        }
        if (this.chart) {
            this.chart.invalidate();
        }
    };
    RenkoCmp.prototype.rangeModeChanged = function (menu) {
        var input = this.inputNumber;
        if (menu.selectedValue === 'ATR') {
            input.format = 'n0';
            input.min = 2;
            input.max = this.data.length - 2;
            input.value = wjcCore.clamp(input.value, 14, this.data.length - 2);
            input.step = 1;
        }
        else {
            input.format = 'n0';
            input.min = 1;
            input.max = null;
            input.step = 1;
        }
        this.optionChanged();
    };
    RenkoCmp.prototype.setDataSource = function () {
        var _this = this;
        var symbol = this.selectedSymbol;
        this.dataSvc.getData(symbol).subscribe(function (data) {
            _this.data = data;
        });
    };
    __decorate([
        core_1.ViewChild('chart')
    ], RenkoCmp.prototype, "chart", void 0);
    __decorate([
        core_1.ViewChild('inputNumber')
    ], RenkoCmp.prototype, "inputNumber", void 0);
    RenkoCmp = __decorate([
        core_1.Component({
            selector: 'renko-cmp',
            templateUrl: 'src/components/charttype/RenkoCmp.html',
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc)),
        __param(1, core_1.Inject(TooltipSvc_1.TooltipSvc))
    ], RenkoCmp);
    return RenkoCmp;
}());
exports.RenkoCmp = RenkoCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: RenkoCmp }
]);
var RenkoModule = (function () {
    function RenkoModule() {
    }
    RenkoModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, forms_1.FormsModule, routing, wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_finance_1.WjChartFinanceModule, wijmo_angular2_chart_interaction_1.WjChartInteractionModule],
            declarations: [RenkoCmp],
        })
    ], RenkoModule);
    return RenkoModule;
}());
exports.RenkoModule = RenkoModule;
//# sourceMappingURL=RenkoCmp.js.map