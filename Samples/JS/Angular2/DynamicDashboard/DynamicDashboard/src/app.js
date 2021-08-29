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
///<reference path="../typings/globals/core-js/index.d.ts"/>
var wjcCore = require('wijmo/wijmo');
// Angular
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_chart_1 = require('wijmo/wijmo.angular2.chart');
var wijmo_angular2_gauge_1 = require('wijmo/wijmo.angular2.gauge');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var DynamicCompService_1 = require('./services/DynamicCompService');
var BarChartCmp_1 = require('./components/BarChartCmp');
var GridCmp_1 = require('./components/GridCmp');
var RadialGaugeCmp_1 = require('./components/RadialGaugeCmp');
var LinearGaugeCmp_1 = require('./components/LinearGaugeCmp');
var ColumnChartCmp_1 = require('./components/ColumnChartCmp');
var LineChartCmp_1 = require('./components/LineChartCmp');
var BubbleChartCmp_1 = require('./components/BubbleChartCmp');
var BulletGraphCmp_1 = require('./components/BulletGraphCmp');
var BlankCmp_1 = require('./components/BlankCmp');
'use strict';
// The Explorer application root component.
var AppCmp = (function () {
    function AppCmp(_compService) {
        this.tileTypes = 'Grid,Radial Gauge,Linear Gauge,Bar Chart,Column Chart,Line Chart,Bubble Chart,Bullet Graph,Blank'.split(',');
        this.dragSource = null;
        this.dropTarget = null;
        this._compService = _compService;
    }
    AppCmp.prototype.ngAfterViewInit = function () {
        var cmp;
        for (var i = 0; i < this.tileTypes.length && i < 4; i++) {
            cmp = this._compService.createDynaComp(this.compContainer, this.tileTypes[i]);
        }
    };
    AppCmp.prototype.addTile = function (tileType) {
        var cmp = this._compService.createDynaComp(this.compContainer, tileType);
    };
    AppCmp.prototype.handleTile = function (e) {
        if (wjcCore.closest(e.target, '.glyphicon-remove') != null) {
            var tile = wjcCore.closest(e.target, '.tile');
            if (tile != null) {
                var idx = this.getIndex(tile.parentElement);
                this._compService.removeComp(this.compContainer, idx - 1);
            }
        }
        if (wjcCore.closest(e.target, '.glyphicon-pencil') != null) {
            var tile = wjcCore.closest(e.target, '.tile');
            if (tile != null) {
                alert('edit tile parameters...');
            }
        }
    };
    AppCmp.prototype.dragstart = function (e) {
        var panel = document.querySelector('.dashboard'), target = wjcCore.closest(e.target, '.tile');
        if (target) {
            this.dragSource = target;
            wjcCore.addClass(this.dragSource, 'drag-source');
            var dt = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('text', this.dragSource.innerHTML);
        }
    };
    AppCmp.prototype.dragover = function (e) {
        if (this.dragSource) {
            var tile = wjcCore.closest(e.target, '.tile');
            if (tile == this.dragSource) {
                tile = null;
            }
            if (this.dragSource && tile && tile != this.dragSource) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
            if (this.dropTarget != tile) {
                wjcCore.removeClass(this.dropTarget, 'drag-over');
                this.dropTarget = tile;
                wjcCore.addClass(this.dropTarget, 'drag-over');
            }
        }
    };
    AppCmp.prototype.drop = function (e) {
        if (this.dragSource && this.dropTarget) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            var srcIndex = this.getIndex(this.dragSource.parentElement), dstIndex = this.getIndex(this.dropTarget.parentElement), refChild = srcIndex > dstIndex ? this.dropTarget.parentElement : this.dropTarget.parentElement.nextElementSibling;
            this._compService.moveComp(this.compContainer, srcIndex - 1, dstIndex - 1);
            // invalidate Wijmo controls after layout updates
            wjcCore.Control.invalidateAll();
        }
    };
    AppCmp.prototype.dragend = function (e) {
        wjcCore.removeClass(this.dragSource, 'drag-source');
        wjcCore.removeClass(this.dropTarget, 'drag-over');
        this.dragSource = this.dropTarget = null;
    };
    AppCmp.prototype.getIndex = function (e) {
        var p = e.parentElement;
        for (var i = 0; i < p.children.length; i++) {
            if (p.children[i] == e)
                return i;
        }
        return -1;
    };
    __decorate([
        core_1.ViewChild('dynCompContainer', { read: core_1.ViewContainerRef })
    ], AppCmp.prototype, "compContainer", void 0);
    AppCmp = __decorate([
        core_1.Component({
            selector: 'app-cmp',
            templateUrl: 'src/app.html'
        }),
        __param(0, core_1.Inject(DynamicCompService_1.DynamicCompService))
    ], AppCmp);
    return AppCmp;
}());
exports.AppCmp = AppCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, wijmo_angular2_input_1.WjInputModule, wijmo_angular2_chart_1.WjChartModule, wijmo_angular2_grid_1.WjGridModule, wijmo_angular2_gauge_1.WjGaugeModule],
            declarations: [AppCmp, BarChartCmp_1.BarChartCmp, GridCmp_1.GridCmp, RadialGaugeCmp_1.RadialGaugeCmp, LinearGaugeCmp_1.LinearGaugeCmp, ColumnChartCmp_1.ColumnChartCmp,
                LineChartCmp_1.LineChartCmp, BubbleChartCmp_1.BubbleChartCmp, BulletGraphCmp_1.BulletGraphCmp, BlankCmp_1.BlankCmp],
            providers: [DynamicCompService_1.DynamicCompService],
            entryComponents: [BarChartCmp_1.BarChartCmp, GridCmp_1.GridCmp, RadialGaugeCmp_1.RadialGaugeCmp, LinearGaugeCmp_1.LinearGaugeCmp, ColumnChartCmp_1.ColumnChartCmp,
                LineChartCmp_1.LineChartCmp, BubbleChartCmp_1.BubbleChartCmp, BulletGraphCmp_1.BulletGraphCmp, BlankCmp_1.BlankCmp],
            bootstrap: [AppCmp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
core_1.enableProdMode();
// Bootstrap application 
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=app.js.map