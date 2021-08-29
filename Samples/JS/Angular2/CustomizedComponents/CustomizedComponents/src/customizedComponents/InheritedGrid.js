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
var wjcCore = require('wijmo/wijmo');
var wjcGrid = require('wijmo/wijmo.grid');
var wijmo_angular2_grid_1 = require('wijmo/wijmo.angular2.grid');
var EditableSelectionRenderer_1 = require('../cellTemplates/EditableSelectionRenderer');
// Custom grid component implemented by deriving from the WjFlexGrid component.
// (requires Angular version 2.3.1 or higher)
//
// The WjComponent decorator merges the definitions made for this class with the definitions for
// the base class decorator.
var InheritedGrid = (function (_super) {
    __extends(InheritedGrid, _super);
    function InheritedGrid() {
        _super.apply(this, arguments);
        this._showSelectColumn = true;
        this._isEditable = true;
        this.selectionType = EditableSelectionRenderer_1.SelectionType.Single;
    }
    // constructor(.....) {}
    //
    // We don't declare a constructor at all, in order to avoid necessity to maintain 
    // constructor parameters and keep them in synch with the base WjFlexGrid's constructor
    // parameters. Instead, we override the "created" method, which is called in the last
    // line of any Wijmo component's constructor, and perform necessary initializations here.
    InheritedGrid.prototype.created = function () {
        // Disable cell selection.
        this.selectionMode = wjcGrid.SelectionMode.None;
        // Disables standard cell editing functionality.
        this.isReadOnly = true;
    };
    Object.defineProperty(InheritedGrid.prototype, "isEditable", {
        // Indicates whether cell editing is enabled.
        get: function () {
            return this._isEditable;
        },
        set: function (value) {
            if (this._isEditable != value) {
                this._isEditable = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    // Overrides the onFormatItem method and adds the logic that enables or disables cell editing based 
    // on the isEditable property value.
    InheritedGrid.prototype.onFormatItem = function (e) {
        _super.prototype.onFormatItem.call(this, e);
        if (e.panel.cellType === wjcGrid.CellType.Cell) {
            var column = this.columns[e.col];
            wjcCore.enable(e.cell, this.isEditable || column.name === 'select');
        }
    };
    InheritedGrid = __decorate([
        core_1.Component({
            selector: 'inherited-grid',
            // We could specify a default WjFlexGrid using wjFlexGridMeta.template property,
            // but we want to create a grid with a predefined Select column, so we define a custom template
            // that includes the Select column definition, see the template definition in html file for details.
            templateUrl: 'src/customizedComponents/inheritedGrid.html',
            // Merge base component 'inputs' with the properties added in this class.
            inputs: wijmo_angular2_grid_1.wjFlexGridMeta.inputs.concat(['selectionType', 'isEditable']),
            outputs: wijmo_angular2_grid_1.wjFlexGridMeta.outputs,
            // In addition to providers specified in the base component, we have to add the
            // special 'WjComponent' provider that will supply a value to the parentCmp parameter
            // of child components like WjFlexGridColumn. This parameter provides a reference
            // to a parent Wijmo component and is vital for parent-child components interaction.
            // The base WjFlexGrid component declare such a provider as well, but it's not included
            // in the wjFlexGridMeta.providers array for consistency.
            providers: [
                { provide: 'WjComponent', useExisting: core_1.forwardRef(function () { return InheritedGrid; }) }
            ].concat(wijmo_angular2_grid_1.wjFlexGridMeta.providers)
        })
    ], InheritedGrid);
    return InheritedGrid;
}(wijmo_angular2_grid_1.WjFlexGrid));
exports.InheritedGrid = InheritedGrid;
//# sourceMappingURL=InheritedGrid.js.map