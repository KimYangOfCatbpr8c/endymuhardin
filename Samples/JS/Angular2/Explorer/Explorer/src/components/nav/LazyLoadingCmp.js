'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var wijmo_angular2_nav_1 = require('wijmo/wijmo.angular2.nav');
// Intro sample component.
var LazyLoadingCmp = (function () {
    function LazyLoadingCmp() {
        this.lazyItems = [];
        this.lazyItems = this._getLazyItems();
        this.lazyLoadFunction = this._lazyLoadFunction.bind(this);
    }
    LazyLoadingCmp.prototype._getLazyItems = function () {
        return [
            { header: 'Lazy Node 1', items: [] },
            { header: 'Lazy Node 2', items: [] },
            { header: 'Lazy Node 3', items: [] }
        ];
    };
    LazyLoadingCmp.prototype._lazyLoadFunction = function (node, callback) {
        setTimeout(function () {
            var result = [
                { header: 'Another lazy node...', items: [] },
                { header: 'A non-lazy node without children' },
                {
                    header: 'A non-lazy node with child nodes', items: [
                        { header: 'hello' },
                        { header: 'world' }
                    ]
                }
            ];
            callback(result); // return result to control
        }, 2500); // 2.5sec http delay
    };
    LazyLoadingCmp = __decorate([
        core_1.Component({
            selector: 'lazy-loading-cmp',
            templateUrl: 'src/components/nav/lazyLoadingCmp.html'
        })
    ], LazyLoadingCmp);
    return LazyLoadingCmp;
}());
exports.LazyLoadingCmp = LazyLoadingCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: LazyLoadingCmp }
]);
var LazyLoadingModule = (function () {
    function LazyLoadingModule() {
    }
    LazyLoadingModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, forms_1.FormsModule, wijmo_angular2_nav_1.WjNavModule],
            declarations: [LazyLoadingCmp],
        })
    ], LazyLoadingModule);
    return LazyLoadingModule;
}());
exports.LazyLoadingModule = LazyLoadingModule;
//# sourceMappingURL=LazyLoadingCmp.js.map