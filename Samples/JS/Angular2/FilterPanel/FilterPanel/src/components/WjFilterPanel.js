"use strict";
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
var FilterPanel_1 = require('../FilterPanel');
var core_1 = require('@angular/core');
// Represents a panel shows currently active filters and allows users to remove filters by clicking.
var WjFilterPanel = (function (_super) {
    __extends(WjFilterPanel, _super);
    function WjFilterPanel(elRef) {
        _super.call(this, elRef.nativeElement);
    }
    __decorate([
        core_1.Input()
    ], WjFilterPanel.prototype, "filter", void 0);
    __decorate([
        core_1.Input()
    ], WjFilterPanel.prototype, "placeholder", void 0);
    WjFilterPanel = __decorate([
        core_1.Component({
            selector: 'wj-filter-panel',
            template: "<div></div>",
        }),
        __param(0, core_1.Inject(core_1.ElementRef))
    ], WjFilterPanel);
    return WjFilterPanel;
}(FilterPanel_1.FilterPanel));
exports.WjFilterPanel = WjFilterPanel;
;
//# sourceMappingURL=WjFilterPanel.js.map