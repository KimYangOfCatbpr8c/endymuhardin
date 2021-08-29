"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var wjcGrid = require('wijmo/wijmo.grid');
var wjcCore = require('wijmo/wijmo');
var core_1 = require('@angular/core');
var EditableSelectionRenderer_1 = require('../cellTemplates/EditableSelectionRenderer');
// Represents the custom grid component implemented by means of aggregating the WjFlexGrid component.
var AggregatedGrid = (function () {
    function AggregatedGrid() {
        this._isEditable = true;
        // A type of selection provided by the Select column.
        this.selectionType = EditableSelectionRenderer_1.SelectionType.Single;
        // References SelectionType enum to use it in markup.
        this.SelectionTypeEnum = EditableSelectionRenderer_1.SelectionType;
        // Provide correct 'this' for the formatItem event handler.
        this.onFormatItem = this._onFormatItem.bind(this);
    }
    Object.defineProperty(AggregatedGrid.prototype, "isEditable", {
        // Indicates whether grid cells editing is enabled.
        get: function () {
            return this._isEditable;
        },
        set: function (value) {
            if (this._isEditable != value) {
                this._isEditable = value;
                if (this.flex) {
                    // invalidates grid to apply changes
                    this.flex.invalidate();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    // FlexGrid.formatItem event handler, enables or disables cell editing based on the isEditable property value.
    AggregatedGrid.prototype._onFormatItem = function (e) {
        if (e.panel.cellType === wjcGrid.CellType.Cell) {
            var column = this.flex.columns[e.col];
            wjcCore.enable(e.cell, this.isEditable || column.name === 'select');
        }
    };
    __decorate([
        core_1.Input()
    ], AggregatedGrid.prototype, "itemsSource", void 0);
    __decorate([
        core_1.Input()
    ], AggregatedGrid.prototype, "selectionType", void 0);
    __decorate([
        core_1.ViewChild('flex')
    ], AggregatedGrid.prototype, "flex", void 0);
    __decorate([
        core_1.ContentChildren(core_1.forwardRef(function () { return AggregatedGridColumn; }))
    ], AggregatedGrid.prototype, "columns", void 0);
    __decorate([
        core_1.Input()
    ], AggregatedGrid.prototype, "isEditable", null);
    AggregatedGrid = __decorate([
        core_1.Component({
            selector: 'aggregated-grid',
            templateUrl: 'src/customizedComponents/aggregatedGrid.html'
        })
    ], AggregatedGrid);
    return AggregatedGrid;
}());
exports.AggregatedGrid = AggregatedGrid;
;
// A column definition for the AggregatedGrid component, which is used as a child of aggregated-grid in markup,
// in the same way as wj-flex-grid-column components are used with wj-flex-grid.
// Exposes the same set of properties for binding in markup as wj-flex-grid-column does, plus the cellTemplate
// property that can be assigned with a type reference to a component that should be used as the column cell template.
var AggregatedGridColumn = (function () {
    function AggregatedGridColumn() {
    }
    AggregatedGridColumn = __decorate([
        core_1.Component({
            selector: 'aggregated-grid-column',
            template: '',
            // We need to provide a list of bindable properties here. We could just use wjFlexGridMeta.inputs
            // property to specify all WjFlexGridColumn's properties here, and this will work with Ng2 run-time
            // compiler, but will be rejected by the AoT compiler. The latter requires that any property
            // specified in the 'inputs' metadata should be explicitly defined as a component class member.
            // Because of this, we just add few properties that we actually use, and declare them as class
            // members.
            // We also add the 'cellTemplate' property that is absent in WjFlexGridColumn and specific to 
            // AggregatedGridColumn. This property allows to specify a component type that should be used
            // as the column's cell template.
            inputs: ['header', 'binding', 'width', 'cellTemplate']
        })
    ], AggregatedGridColumn);
    return AggregatedGridColumn;
}());
exports.AggregatedGridColumn = AggregatedGridColumn;
;
//# sourceMappingURL=AggregatedGrid.js.map