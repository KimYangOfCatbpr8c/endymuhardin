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
// Angular
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_chart_1 = require('wijmo/wijmo.angular2.chart');
var wijmo_angular2_chart_radar_1 = require('wijmo/wijmo.angular2.chart.radar');
var wijmo_angular2_chart_animation_1 = require('wijmo/wijmo.angular2.chart.animation');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var AppTab_1 = require('./components/AppTab');
var DataSvc_1 = require('./services/DataSvc');
'use strict';
// The Explorer application root component.
var AppCmp = (function () {
    function AppCmp(dataSvc) {
        var _this = this;
        this.basicChartType = 'Line';
        this.basicTotalAngle = 360;
        this.basicStartAngle = 0;
        this.basicStacking = 'None';
        this.basicReversed = false;
        this.polarChartType = 'Line';
        this.polarTotalAngle = 360;
        this.polarStartAngle = 0;
        this.polarStacking = 'None';
        this.polarReversed = false;
        this.animationData = [];
        this.duration = 400;
        this.easing = 'Swing';
        this.animationMode = 'Point';
        this.animationChartType = 'Line';
        this.animationBindingX = 'country';
        this.basicStartAngleChanged = function (sender) {
            if (sender.value < sender.min || sender.value > sender.max) {
                return;
            }
            _this.basicStartAngle = sender.value;
        };
        this.basicTotalAngleChanged = function (sender) {
            if (sender.value < sender.min || sender.value > sender.max) {
                return;
            }
            _this.basicTotalAngle = sender.value;
        };
        this.polarStartAngleChanged = function (sender) {
            if (sender.value < sender.min || sender.value > sender.max) {
                return;
            }
            _this.polarStartAngle = sender.value;
        };
        this.polarTotalAngleChanged = function (sender) {
            if (sender.value < sender.min || sender.value > sender.max) {
                return;
            }
            _this.polarTotalAngle = sender.value;
        };
        this.durationChanged = function (sender) {
            if (sender.value < sender.min || sender.value > sender.max) {
                return;
            }
            _this.duration = sender.value;
            if (_this.animationChart) {
                _this.animationChart.refresh();
            }
        };
        this.animationChanged = function () {
            if (_this.animationChart) {
                // call with a delay to make sure that bindings have propagated to all components
                setTimeout(function () {
                    _this.animationChart.refresh();
                }, 0);
            }
        };
        this.isPolarChanged = function (sender) {
            var chart = _this.animationChart, isPolar = sender.checked;
            if (!chart) {
                return;
            }
            chart.beginUpdate();
            if (isPolar) {
                _this.animationData = _this.dataSvc.getPolarData();
                _this.animationBindingX = 'longitude';
                chart.series[0].binding = 'latitude1';
                chart.series[0].name = 'Latitude1';
                chart.series[1].binding = 'latitude2';
                chart.series[1].name = 'Latitude2';
            }
            else {
                _this.animationData = _this.dataSvc.getData();
                _this.animationBindingX = 'country';
                chart.series[0].binding = 'sales';
                chart.series[0].name = 'Sales';
                chart.series[1].binding = 'downloads';
                chart.series[1].name = 'Downloads';
            }
            chart.endUpdate();
        };
        this.dataSvc = dataSvc;
        this.basicData = this.dataSvc.getData();
        this.basicPolarData = this.dataSvc.getPolarData();
        this.animationData = this.dataSvc.getData();
    }
    __decorate([
        core_1.ViewChild('animationChart')
    ], AppCmp.prototype, "animationChart", void 0);
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
            imports: [wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_1.WjChartModule, wijmo_angular2_chart_radar_1.WjChartRadarModule, wijmo_angular2_chart_animation_1.WjChartAnimationModule, platform_browser_1.BrowserModule, forms_1.FormsModule, AppTab_1.TabsModule],
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