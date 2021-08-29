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
var wjcFlexGridColumnPicker = require('../FlexGridColumnPicker');
'use strict';
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var WjFlexGrid = require('wijmo/wijmo.angular2.grid');
var ColumnPicker = (function () {
    function ColumnPicker(_flex) {
        this._flex = _flex;
    }
    ColumnPicker.prototype.ngOnInit = function () {
        if (!this._flex) {
            return;
        }
        var cp = new wjcFlexGridColumnPicker.FlexGridColumnPicker(this._flex, this.columnPicker);
    };
    ColumnPicker.prototype.ngOnDestroy = function () {
        this._flex.invalidate();
    };
    ColumnPicker = __decorate([
        core_1.Directive({
            selector: '[columnPicker]',
            inputs: ['columnPicker']
        }),
        __param(0, core_1.Self()),
        __param(0, core_2.Inject(WjFlexGrid.WjFlexGrid))
    ], ColumnPicker);
    return ColumnPicker;
}());
exports.ColumnPicker = ColumnPicker;
//# sourceMappingURL=ColumnPickerDctv.js.map