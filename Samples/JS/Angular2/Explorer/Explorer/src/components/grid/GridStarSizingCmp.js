'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var GridBaseCmp_1 = require('./GridBaseCmp');
var DataSvc_1 = require('../../services/DataSvc');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
// FlexGrid Star Sizing component.
var GridStarSizingCmp = (function (_super) {
    __extends(GridStarSizingCmp, _super);
    function GridStarSizingCmp(dataSvc) {
        _super.call(this, dataSvc);
    }
    GridStarSizingCmp = __decorate([
        core_1.Component({
            selector: 'grid-star-sizing-cmp',
            templateUrl: 'src/components/grid/gridStarSizingCmp.html'
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc))
    ], GridStarSizingCmp);
    return GridStarSizingCmp;
}(GridBaseCmp_1.GridBaseCmp));
exports.GridStarSizingCmp = GridStarSizingCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: GridStarSizingCmp }
]);
var GridStarSizingModule = (function () {
    function GridStarSizingModule() {
    }
    GridStarSizingModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, wijmo_angular2_grid_1.WjGridModule, wijmo_angular2_input_1.WjInputModule],
            declarations: [GridStarSizingCmp],
        })
    ], GridStarSizingModule);
    return GridStarSizingModule;
}());
exports.GridStarSizingModule = GridStarSizingModule;
//# sourceMappingURL=GridStarSizingCmp.js.map