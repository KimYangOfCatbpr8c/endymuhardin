'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
// Intro sample component.
var TreeViewBaseCmp = (function () {
    function TreeViewBaseCmp() {
        this.items = [];
        this.isAnimated = true;
        this.autoCollapse = true;
        this.expandOnClick = true;
        this.items = this._getItems();
    }
    TreeViewBaseCmp.prototype._getItems = function () {
        return [
            {
                header: 'Electronics', img: 'resources/electronics.png', items: [
                    { header: 'Trimmers/Shavers' },
                    { header: 'Tablets' },
                    {
                        header: 'Phones', img: 'resources/phones.png', items: [
                            { header: 'Apple' },
                            { header: 'Motorola', newItem: true },
                            { header: 'Nokia' },
                            { header: 'Samsung' }
                        ]
                    },
                    { header: 'Speakers', newItem: true },
                    { header: 'Monitors' }
                ]
            },
            {
                header: 'Toys', img: 'resources/toys.png', items: [
                    { header: 'Shopkins' },
                    { header: 'Train Sets' },
                    { header: 'Science Kit', newItem: true },
                    { header: 'Play-Doh' },
                    { header: 'Crayola' }
                ]
            },
            {
                header: 'Home', img: 'resources/home.png', items: [
                    { header: 'Coffeee Maker' },
                    { header: 'Breadmaker', newItem: true },
                    { header: 'Solar Panel', newItem: true },
                    { header: 'Work Table' },
                    { header: 'Propane Grill' }
                ]
            }
        ];
    };
    TreeViewBaseCmp = __decorate([
        core_1.Component({
            selector: '',
            templateUrl: ''
        })
    ], TreeViewBaseCmp);
    return TreeViewBaseCmp;
}());
exports.TreeViewBaseCmp = TreeViewBaseCmp;
//# sourceMappingURL=TreeViewBaseCmp.js.map