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
var CustomNodeCmp = (function (_super) {
    __extends(CustomNodeCmp, _super);
    function CustomNodeCmp() {
        _super.call(this);
    }
    CustomNodeCmp.prototype.formatItem = function (treeView, e) {
        if (e.dataItem.newItem) {
            e.element.innerHTML +=
                '<img style="margin-left:6px" src="resources/new.png"/>';
        }
    };
    CustomNodeCmp = __decorate([
        core_1.Component({
            selector: 'custom-node-cmp',
            templateUrl: 'src/components/nav/customNodeCmp.html'
        })
    ], CustomNodeCmp);
    return CustomNodeCmp;
}(TreeViewBaseCmp_1.TreeViewBaseCmp));
exports.CustomNodeCmp = CustomNodeCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: CustomNodeCmp }
]);
var CustomNodeModule = (function () {
    function CustomNodeModule() {
    }
    CustomNodeModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, forms_1.FormsModule, wijmo_angular2_nav_1.WjNavModule],
            declarations: [CustomNodeCmp],
        })
    ], CustomNodeModule);
    return CustomNodeModule;
}());
exports.CustomNodeModule = CustomNodeModule;
//# sourceMappingURL=CustomNodeCmp.js.map