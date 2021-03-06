"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var wjcCore = require('wijmo/wijmo');
var core_1 = require('@angular/core');
// ToDate pipe - converts date/time string to a Date object
var ToDatePipe = (function () {
    function ToDatePipe() {
    }
    ToDatePipe.prototype.transform = function (value, args) {
        if (value && wjcCore.isString(value)) {
            // parse date/time using RFC 3339 pattern
            var dt = wjcCore.changeType(value, wjcCore.DataType.Date, 'r');
            if (wjcCore.isDate(dt)) {
                return dt;
            }
        }
        return value;
    };
    ToDatePipe = __decorate([
        core_1.Pipe({
            name: 'toDate'
        })
    ], ToDatePipe);
    return ToDatePipe;
}());
exports.ToDatePipe = ToDatePipe;
//# sourceMappingURL=appPipes.js.map