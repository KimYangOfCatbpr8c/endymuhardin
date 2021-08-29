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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var TreeViewBaseCmp_1 = require('./TreeViewBaseCmp');
var wijmo_angular2_nav_1 = require('wijmo/wijmo.angular2.nav');
// Intro sample component.
var TreeViewIntroCmp = (function (_super) {
    __extends(TreeViewIntroCmp, _super);
    function TreeViewIntroCmp() {
        _super.call(this);
    }
    TreeViewIntroCmp = __decorate([
        core_1.Component({
            selector: 'tv-intro-cmp',
            templateUrl: 'src/components/nav/treeViewIntroCmp.html'
        })
    ], TreeViewIntroCmp);
    return TreeViewIntroCmp;
}(TreeViewBaseCmp_1.TreeViewBaseCmp));
exports.TreeViewIntroCmp = TreeViewIntroCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: TreeViewIntroCmp }
]);
var TreeViewIntroModule = (function () {
    function TreeViewIntroModule() {
    }
    TreeViewIntroModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, forms_1.FormsModule, wijmo_angular2_nav_1.WjNavModule],
            declarations: [TreeViewIntroCmp],
        })
    ], TreeViewIntroModule);
    return TreeViewIntroModule;
}());
exports.TreeViewIntroModule = TreeViewIntroModule;
//# sourceMappingURL=TreeViewIntroCmp.js.map