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
///<reference path="../typings/globals/core-js/index.d.ts"/>
var wjcCore = require('wijmo/wijmo');
var wjcGrid = require('wijmo/wijmo.grid');
var wjcInput = require('wijmo/wijmo.input');
// Angular
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var platform_browser_1 = require('@angular/platform-browser');
var wijmo_angular2_core_1 = require('wijmo/wijmo.angular2.core');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var DataSvc_1 = require('./services/DataSvc');
'use strict';
// The Explorer application root component.
var AppCmp = (function () {
    function AppCmp(dataSvc) {
        var _this = this;
        this.filter = {
            title: '',
            author: '',
            price: null
        };
        this.toFilter = null;
        this.dataSvc = dataSvc;
        // expose book data as a CollectionView
        this.books = new wjcCore.CollectionView(this.dataSvc.getBooks());
        // apply filter
        this.books.filter = function (item) {
            // filter by title, author, price
            var ft = _this.filter.title;
            if (ft && item.title.toLowerCase().indexOf(ft.toLowerCase()) < 0) {
                return false;
            }
            var fa = _this.filter.author;
            if (fa && fa.indexOf('(all') < 0 && item.author.toLowerCase().indexOf(fa.toLowerCase()) < 0) {
                return false;
            }
            var fp = _this.filter.price;
            if (fp != null && item.price > fp) {
                return false;
            }
            // all passed
            return true;
        };
        // keep list of authors for filtering
        this.authors = new wjcCore.ObservableArray();
        this.books.collectionChanged.addHandler(function () {
            _this.updateAuthors();
        });
        this.updateAuthors();
    }
    AppCmp.prototype.ngAfterViewInit = function () {
        var flex = this.flex;
        if (flex) {
            this.customFilterComp();
            // enable merging
            flex.allowMerging = wjcGrid.AllowMerging.ColumnHeaders;
            // add extra column header row
            var row = new wjcGrid.Row(), ch = flex.columnHeaders;
            // initialize header cells
            row.allowMerging = true;
            for (var i = 0; i < flex.columns.length; i++) {
                flex.columns[i].allowMerging = true;
            }
            ch.rows.insert(0, row);
            this.setHeader(ch, 0, 0, 1, 0, 'Sales');
            this.setHeader(ch, 0, 1, 0, 2, 'Book');
            this.setHeader(ch, 0, 3, 0, 3, 'Price');
            this.setHeader(ch, 1, 3, 1, 3, '');
            this.setHeader(ch, 0, 4, 0, 5, 'Delivery Terms');
            this.setHeader(ch, 1, 4, 1, 4, 'In Store');
            this.setHeader(ch, 1, 5, 1, 5, 'Shipping');
            this.setHeader(ch, 0, 6, 1, 6, 'Bestseller');
            this.setHeader(ch, 0, 7, 1, 7, 'Publication Date');
            ch.rows[1].height = ch.rows.defaultSize + 12;
            // enable custom item formatter
            var itf = this.itemFormatter.bind(this);
            flex.itemFormatter = itf;
            // create DataMap for 'shipping' column
            var shippingValues = [
                { key: 1, val: '1 hour' },
                { key: 12, val: '12 hours' },
                { key: 24, val: '24 hours' },
                { key: 24, val: '1 day' },
                { key: 48, val: '2 days' },
                { key: 7 * 24, val: '1 week' },
                { key: -1, val: 'pickup' },
                { key: null, val: 'na' }
            ];
            flex.columns.getColumn('shipping').dataMap = new wjcGrid.DataMap(shippingValues, 'key', 'val');
        }
    };
    // update author list
    AppCmp.prototype.updateAuthors = function () {
        var authors = this.authors, items = this.books.sourceCollection;
        authors.beginUpdate();
        // populate avoiding duplicates
        authors.clear();
        for (var i = 0; i < items.length; i++) {
            var a = items[i].author;
            if (authors.indexOf(a) < 0) {
                authors.push(a);
            }
        }
        // sort authors
        authors.sort();
        // insert item to remove filter at the first position
        authors.splice(0, 0, '(all authors)');
        // done updating
        authors.endUpdate();
    };
    AppCmp.prototype.updateFilter = function (part, value) {
        var _this = this;
        if (this.filter[part] != value) {
            // update filter
            this.filter[part] = value;
            // reschedule update
            if (this.toFilter)
                clearTimeout(this.toFilter);
            this.toFilter = setTimeout(function () {
                // refresh view, keep focused element
                var focused = document.activeElement;
                _this.books.refresh();
                setTimeout(function () {
                    if (focused) {
                        focused.focus();
                    }
                }, 100);
            }, 600);
        }
    };
    AppCmp.prototype.customFilterComp = function () {
        var _this = this;
        // title filter
        this.cmbTitle = new wjcInput.ComboBox(document.createElement('div'), {
            placeholder: 'title',
            textChanged: function (s, e) {
                _this.updateFilter('title', s.text);
            }
        });
        this.stopPropagation(this.cmbTitle);
        this.watchFocus(this.cmbTitle, 'title');
        this.cmbAuth = new wjcInput.ComboBox(document.createElement('div'), {
            placeholder: 'author',
            itemsSource: this.authors,
            textChanged: function (s, e) {
                _this.updateFilter('author', s.text);
            }
        });
        this.stopPropagation(this.cmbAuth);
        this.watchFocus(this.cmbAuth, 'author');
        // price filter
        this.inPrice = new wjcInput.InputNumber(document.createElement('div'), {
            isRequired: false,
            value: null,
            placeholder: 'max price',
            valueChanged: function (s, e) {
                _this.updateFilter('price', s.value);
            }
        });
        this.stopPropagation(this.inPrice);
        this.watchFocus(this.inPrice, 'price');
    };
    // stop propagation of mouse and keyboard events in order to
    // prevent the grid from responding to these events.
    AppCmp.prototype.stopPropagation = function (ctl) {
        ctl.hostElement.style.fontWeight = 'normal';
        var events = ['mousedown', 'keypress', 'keydown'];
        for (var i = 0; i < events.length; i++) {
            ctl.hostElement.addEventListener(events[i], function (e) {
                e.stopPropagation();
            });
        }
    };
    // scroll the grid when the header editors get the focus
    AppCmp.prototype.watchFocus = function (ctl, binding) {
        var _this = this;
        ctl.hostElement.addEventListener('focus', function (e) {
            var col = _this.flex.columns.getColumn(binding);
            _this.flex.scrollIntoView(-1, col.index);
        }, true);
    };
    // item formatter
    AppCmp.prototype.itemFormatter = function (panel, r, c, cell) {
        var flex = panel.grid, row = flex.rows[r], col = flex.columns[c], sel = flex.selection, editCell = flex.activeEditor && sel.row == r && sel.col == c;
        // add filters to column headers
        if (panel.cellType == wjcGrid.CellType.ColumnHeader && r == 1) {
            switch (col.binding) {
                // title filter
                case 'title':
                    cell.innerHTML = '';
                    cell.appendChild(this.cmbTitle.hostElement);
                    break;
                // author filter
                case 'author':
                    cell.innerHTML = '';
                    cell.appendChild(this.cmbAuth.hostElement);
                    break;
                // price filter
                case 'price':
                    cell.innerHTML = '';
                    cell.appendChild(this.inPrice.hostElement);
                    break;
            }
        }
        // customize data cells
        if (panel.cellType == wjcGrid.CellType.Cell && !editCell) {
            switch (col.binding) {
                // use links for titles
                case 'title':
                    cell.innerHTML = wjcCore.format('<a href="{url}" target="_blank">{title}</a>', row.dataItem);
                    break;
                // use color and icons for sales
                case 'sales':
                    cell.innerHTML = wjcCore.format('<span style="color:{color}"><span class="wj-glyph-{dir}" style="float:left;margin:6px"></span> {sales:n0}</span>', {
                        color: row.dataItem.sales > 0 ? 'green' : 'red',
                        dir: row.dataItem.sales > 0 ? 'up' : 'down',
                        sales: row.dataItem.sales
                    });
                    break;
            }
        }
    };
    // set cell header
    AppCmp.prototype.setHeader = function (p, r1, c1, r2, c2, hdr) {
        for (var r = r1; r <= r2; r++) {
            for (var c = c1; c <= c2; c++) {
                p.setCellData(r, c, hdr);
            }
        }
    };
    __decorate([
        core_1.ViewChild('flex')
    ], AppCmp.prototype, "flex", void 0);
    AppCmp = __decorate([
        core_1.Component({
            selector: 'app-cmp',
            templateUrl: 'src/app.html'
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc))
    ], AppCmp);
    return AppCmp;
}());
exports.AppCmp = AppCmp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [wijmo_angular2_core_1.WjCoreModule, wijmo_angular2_input_1.WjInputModule, wijmo_angular2_grid_1.WjGridModule, platform_browser_1.BrowserModule],
            declarations: [AppCmp],
            providers: [DataSvc_1.DataSvc],
            bootstrap: [AppCmp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
core_1.enableProdMode();
// Bootstrap application with hash style navigation and global services.
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=app.js.map