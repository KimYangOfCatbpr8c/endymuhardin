"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var wjcCore = require('wijmo/wijmo');
'use strict';
var core_1 = require('@angular/core');
var BaseCmp = (function () {
    function BaseCmp() {
        this.dynaCom = '';
        this.data = this.getData();
    }
    // some random data
    BaseCmp.prototype.getData = function () {
        var data = [], today = new Date();
        for (var i = 0; i < 12; i++) {
            var sales = 100 + Math.random() * 800 + i * 50, expenses = 50 + Math.random() * 300 + i * 5;
            data.push({
                id: i,
                date: wjcCore.DateTime.addMonths(today, 12 - i),
                sales: sales,
                expenses: expenses,
                profit: sales - expenses
            });
        }
        return new wjcCore.CollectionView(data);
    };
    BaseCmp = __decorate([
        core_1.Component({
            selector: 'dyna-cmp',
            templateUrl: 'src/components/dynaTemp.html'
        })
    ], BaseCmp);
    return BaseCmp;
}());
exports.BaseCmp = BaseCmp;
//# sourceMappingURL=BaseCmp.js.map