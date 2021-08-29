"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<reference path="../typings/globals/core-js/index.d.ts"/>
var wjcCore = require('wijmo/wijmo');
var wjcData = require('wijmo/wijmo.odata');
var wjcNav = require('wijmo/wijmo.nav');
// Angular
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var wijmo_angular2_nav_1 = require('wijmo/wijmo.angular2.nav');
var AppTab_1 = require('./components/AppTab');
'use strict';
// The Explorer application root component.
var AppCmp = (function () {
    function AppCmp() {
        var _this = this;
        this.items = [];
        this.editableItems = [];
        this.accordionItems = [];
        this.lazyItems = [];
        this.lazyLoadODataItems = [];
        this.dragItems1 = [];
        this.dragItems2 = [];
        this.isAnimated = true;
        this.autoCollapse = true;
        this.expandOnClick = true;
        this.useCustomCss = true;
        this.navItem = '';
        this.accordioItem = '';
        this.chkStatus = '';
        this.allowDraggingParentNodes = true;
        this.allowDroppingIntoEmpty = true;
        this.allowDragging = true;
        this._nwindService = 'http://services.odata.org/V4/Northwind/Northwind.svc';
        var employees;
        this.items = this._getItems();
        this.editableItems = JSON.parse(JSON.stringify(this.items)); // separate copy for editing (TFS 242748)
        this.accordionItems = this._getAccordionItems();
        this.lazyItems = this._getLazyItems();
        employees = new wjcData.ODataCollectionView(this._nwindService, 'Employees', {
            fields: 'EmployeeID,FirstName,LastName'.split(','),
            loaded: function () {
                var items = employees.items.map(function (e) {
                    e.FullName = e.FirstName + ' ' + e.LastName;
                    e.Orders = []; // lazy-load orders
                    return e;
                });
                _this.lazyLoadODataItems = items;
            }
        });
        this.dragItems1 = [
            { header: 'Item 1.1' },
            { header: 'Item 1.2' },
            { header: 'Item 1.3' },
        ];
        this.dragItems2 = [
            { header: 'Item 2.1' },
            { header: 'Item 2.2' },
            { header: 'Item 2.3' },
        ];
        // lazy loading function
        this.lazyLoadFunction = this._lazyLoadFunction.bind(this);
        this.lazyLoadODataFunction = this._lazyLoadODataFunction.bind(this);
    }
    AppCmp.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.tvAccordion.hostElement.addEventListener('click', function (e) {
            if (e.target.tagName == 'A') {
                _this.accordioItem = 'Navigating to *** ' + e.target.href + ' ***';
                e.preventDefault();
            }
        });
    };
    // 'Navigation' display
    AppCmp.prototype.navTo = function (treeView) {
        this.navItem = 'Navigating to *** ' + treeView.selectedItem.header + ' ***';
    };
    // use dragStart event to honor the allowDraggingParentNodes setting
    // by setting the 'cancel' event parameter to true
    AppCmp.prototype.dragStart = function (sender, e) {
        if (e.node.hasChildren) {
            if (!this.allowDraggingParentNodes) {
                e.cancel = true; // prevent dragging parent nodes
            }
            else {
                e.node.isCollapsed = true; // collapse parent nodes when dragging
            }
        }
    };
    // use dragOver event to honor the allowDroppingIntoEmpty setting
    // by changing the 'position' event parameter to 'Before'
    AppCmp.prototype.dragOver = function (sender, e) {
        if (!this.allowDroppingIntoEmpty &&
            !e.dropTarget.hasChildren &&
            e.position == wjcNav.DropPosition.Into) {
            e.position = wjcNav.DropPosition.Before;
        }
    };
    // allow drag/drop between tvDragDrop1 and tvDragDrop2
    AppCmp.prototype.dragOverBetweenTrees = function (tvDragDrop1, tvDragDrop2, e) {
        var t1 = e.dragSource.treeView;
        var t2 = e.dropTarget.treeView;
        if (t1 == tvDragDrop1 || t1 == tvDragDrop2) {
            if (t2 == tvDragDrop1 || t2 == tvDragDrop2) {
                e.cancel = false;
            }
        }
    };
    // editing support
    AppCmp.prototype.nodeEditStarting = function (sender, e) {
        if (e.node.hasChildren) {
            e.cancel = true;
        }
    };
    // display checked items
    AppCmp.prototype.checkedItems = function (treeView) {
        var items = treeView.checkedItems, msg = '';
        if (items.length) {
            msg = '<p><b>Checked Items:</b></p><ol>\r\n';
            for (var i = 0; i < items.length; i++) {
                msg += '<li>' + items[i].header + '</li>\r\n';
            }
            msg += '</ol>';
        }
        this.chkStatus = msg;
    };
    // save checked items
    AppCmp.prototype.saveCheckedItems = function (treeView) {
        this._saveCheckedItems = treeView.checkedItems;
    };
    // restore checked items
    AppCmp.prototype.restoreCheckedItems = function (treeView) {
        treeView.checkedItems = this._saveCheckedItems || [];
    };
    // disable node
    AppCmp.prototype.disableNode = function (treeView) {
        var nd = treeView.selectedNode;
        if (nd) {
            nd.isDisabled = true;
        }
    };
    // enable all nodes
    AppCmp.prototype.enableAllNodes = function (treeView) {
        for (var nd = treeView.getFirstNode(); nd; nd = nd.next()) {
            nd.isDisabled = false;
        }
    };
    // custom item
    AppCmp.prototype.formatItem = function (treeView, e) {
        if (e.dataItem.newItem) {
            e.element.innerHTML +=
                '<img style="margin-left:6px" src="resources/new.png"/>';
        }
    };
    AppCmp.prototype._lazyLoadFunction = function (node, callback) {
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
    AppCmp.prototype._lazyLoadODataFunction = function (node, callback) {
        switch (node.level) {
            // load orders for an employee
            case 0:
                var url = 'Employees(' + node.dataItem.EmployeeID + ')/Orders';
                var orders = new wjcData.ODataCollectionView(this._nwindService, url, {
                    fields: 'OrderID,ShipName,ShipCountry'.split(','),
                    loaded: function () {
                        var items = orders.items.map(function (e) {
                            e.Order_Details = []; // lazy-order details
                            return e;
                        });
                        callback(items);
                    }
                });
                break;
            // load extended details for an order
            case 1:
                var url = "Order_Details_Extendeds/?$filter=OrderID eq " + node.dataItem.OrderID;
                var details = new wjcData.ODataCollectionView(this._nwindService, url, {
                    fields: 'ProductName,ExtendedPrice'.split(','),
                    loaded: function () {
                        var items = details.items.map(function (e) {
                            e.Summary = wjcCore.format('{ProductName}: {ExtendedPrice:c}', e);
                            return e;
                        });
                        callback(items);
                    }
                });
                break;
            // default
            default:
                callback(null);
        }
    };
    AppCmp.prototype._getItems = function () {
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
    AppCmp.prototype._getAccordionItems = function () {
        return [
            {
                header: 'Angular', items: [
                    { header: '<a href="ng/intro">Introduction</a>' },
                    { header: '<a href="ng/samples">Samples</a>' },
                    { header: '<a href="ng/perf">Performance</a>' }
                ]
            },
            {
                header: 'React', items: [
                    { header: '<a href="rc/intro">Introduction</a>' },
                    { header: '<a href="rc/samples">Samples</a>' },
                    { header: '<a href="rc/perf">Performance</a>' }
                ]
            },
            {
                header: 'Vue', items: [
                    { header: '<a href="vue/intro">Introduction</a>' },
                    { header: '<a href="vue/samples">Samples</a>' },
                    { header: '<a href="vue/perf">Performance</a>' }
                ]
            },
            {
                header: 'Knockout', items: [
                    { header: '<a href="ko/intro">Introduction</a>' },
                    { header: '<a href="ko/samples">Samples</a>' },
                    { header: '<a href="ko/perf">Performance</a>' }
                ]
            },
        ];
    };
    AppCmp.prototype._getLazyItems = function () {
        return [
            { header: 'Lazy Node 1', items: [] },
            { header: 'Lazy Node 2', items: [] },
            { header: 'Lazy Node 3', items: [] }
        ];
    };
    __decorate([
        core_1.ViewChild('tvAccordion')
    ], AppCmp.prototype, "tvAccordion", void 0);
    AppCmp = __decorate([
        core_1.Component({
            selector: 'app-cmp',
            templateUrl: 'src/app.html'
        })
    ], AppCmp);
    return AppCmp;
}());
exports.AppCmp = AppCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [wijmo_angular2_nav_1.WjNavModule, platform_browser_1.BrowserModule, AppTab_1.TabsModule, forms_1.FormsModule],
            declarations: [AppCmp],
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