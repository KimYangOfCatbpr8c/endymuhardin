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
var core_1 = require('@angular/core');
var BarChartCmp_1 = require('../components/BarChartCmp');
var GridCmp_1 = require('../components/GridCmp');
var RadialGaugeCmp_1 = require('../components/RadialGaugeCmp');
var LinearGaugeCmp_1 = require('../components/LinearGaugeCmp');
var ColumnChartCmp_1 = require('../components/ColumnChartCmp');
var LineChartCmp_1 = require('../components/LineChartCmp');
var BubbleChartCmp_1 = require('../components/BubbleChartCmp');
var BulletGraphCmp_1 = require('../components/BulletGraphCmp');
var BlankCmp_1 = require('../components/BlankCmp');
var DynamicCompService = (function () {
    function DynamicCompService(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }
    DynamicCompService.prototype.createDynaComp = function (vCref, tileType) {
        var dynaCmp;
        if (tileType === 'Grid') {
            dynaCmp = GridCmp_1.GridCmp;
        }
        else if (tileType === "Bar Chart") {
            dynaCmp = BarChartCmp_1.BarChartCmp;
        }
        else if (tileType === "Radial Gauge") {
            dynaCmp = RadialGaugeCmp_1.RadialGaugeCmp;
        }
        else if (tileType === "Linear Gauge") {
            dynaCmp = LinearGaugeCmp_1.LinearGaugeCmp;
        }
        else if (tileType === "Column Chart") {
            dynaCmp = ColumnChartCmp_1.ColumnChartCmp;
        }
        else if (tileType === "Line Chart") {
            dynaCmp = LineChartCmp_1.LineChartCmp;
        }
        else if (tileType === "Bubble Chart") {
            dynaCmp = BubbleChartCmp_1.BubbleChartCmp;
        }
        else if (tileType === "Bullet Graph") {
            dynaCmp = BulletGraphCmp_1.BulletGraphCmp;
        }
        else if (tileType === "Blank") {
            dynaCmp = BlankCmp_1.BlankCmp;
        }
        var factory = this.componentFactoryResolver.resolveComponentFactory(dynaCmp);
        // vCref is needed cause of that injector..
        var injector = core_1.ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
        // create component without adding it directly to the DOM
        var comp = factory.create(injector);
        // add inputs first !! otherwise component/template crashes ..
        //comp.instance.model = modelInput;
        // all inputs set? add it to the DOM ..
        vCref.insert(comp.hostView);
        return comp;
    };
    DynamicCompService.prototype.removeComp = function (vCref, idx) {
        vCref.remove(idx);
    };
    DynamicCompService.prototype.moveComp = function (vCref, idx1, idx2) {
        var hostView = vCref.get(idx1);
        vCref.move(hostView, idx2);
    };
    DynamicCompService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(core_1.ComponentFactoryResolver))
    ], DynamicCompService);
    return DynamicCompService;
}());
exports.DynamicCompService = DynamicCompService;
//# sourceMappingURL=DynamicCompService.js.map