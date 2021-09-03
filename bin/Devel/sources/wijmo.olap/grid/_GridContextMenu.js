var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Context Menu for @see:PivotGrid controls.
         */
        var _GridContextMenu = (function (_super) {
            __extends(_GridContextMenu, _super);
            /**
             * Initializes a new instance of the @see:_GridContextMenu class.
             */
            function _GridContextMenu() {
                var _this = this;
                // initialize the menu
                _super.call(this, document.createElement('div'), {
                    header: 'PivotGrid Context Menu',
                    displayMemberPath: 'text',
                    commandParameterPath: 'parm',
                    command: {
                        executeCommand: function (parm) {
                            _this._execute(parm);
                        },
                        canExecuteCommand: function (parm) {
                            return _this._canExecute(parm);
                        }
                    }
                });
                // finish initializing (after call to super)
                this.itemsSource = this._getMenuItems();
                // add a class to allow CSS customization
                wijmo.addClass(this.dropDown, 'context-menu');
            }
            // refresh menu items in case culture changed
            _GridContextMenu.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this.itemsSource = this._getMenuItems();
                _super.prototype.refresh.call(this, fullUpdate);
            };
            /**
             * Attaches this context menu to a @see:PivotGrid control.
             *
             * @param grid @see:PivotGrid to attach this menu to.
             */
            _GridContextMenu.prototype.attach = function (grid) {
                var _this = this;
                wijmo.assert(grid instanceof olap.PivotGrid, 'Expecting a PivotGrid control...');
                var owner = grid.hostElement;
                owner.addEventListener('contextmenu', function (e) {
                    if (grid.customContextMenu) {
                        // prevent default context menu
                        e.preventDefault();
                        // select the item that was clicked
                        _this.owner = owner;
                        if (_this._selectField(e)) {
                            // show the context menu
                            var dropDown = _this.dropDown;
                            _this.selectedIndex = -1;
                            if (_this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                                wijmo.showPopup(dropDown, e);
                                _this.onIsDroppedDownChanged();
                                dropDown.focus();
                            }
                        }
                    }
                });
            };
            // ** implementation
            // select the item that was clicked before showing the context menu
            _GridContextMenu.prototype._selectField = function (e) {
                // assume we have no target field
                this._targetField = null;
                this._htDown = null;
                // find target field based on hit-testing
                var g = wijmo.Control.getControl(this.owner), ng = g.engine, ht = g.hitTest(e);
                switch (ht.cellType) {
                    case wijmo.grid.CellType.Cell:
                        g.select(ht.range);
                        this._targetField = ng.valueFields[ht.col % ng.valueFields.length];
                        this._htDown = ht;
                        break;
                    case wijmo.grid.CellType.ColumnHeader:
                        this._targetField = ng.columnFields[ht.row];
                        break;
                    case wijmo.grid.CellType.RowHeader:
                        this._targetField = ng.rowFields[ht.col];
                        break;
                    case wijmo.grid.CellType.TopLeft:
                        if (ht.row == ht.panel.rows.length - 1) {
                            this._targetField = ng.rowFields[ht.col];
                        }
                        break;
                }
                // show the menu if we have a field
                return this._targetField != null;
            };
            // get the items used to populate the menu
            _GridContextMenu.prototype._getMenuItems = function () {
                // get items
                var items = [
                    { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>Remove Field', parm: 'remove' },
                    { text: '<div class="menu-icon">&#9965;</div>Field Settings...', parm: 'edit' },
                    { text: '<div class="wj-separator"></div>' },
                    { text: '<div class="menu-icon">&#8981;</div>Show Detail...', parm: 'detail' }
                ];
                // localize items
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.parm) {
                        var text = wijmo.culture.olap._ListContextMenu[item.parm];
                        wijmo.assert(text, 'missing localized text for item ' + item.parm);
                        item.text = item.text.replace(/([^>]+$)/, text);
                    }
                }
                // return localized items
                return items;
            };
            // execute the menu commands
            _GridContextMenu.prototype._execute = function (parm) {
                var g = wijmo.Control.getControl(this.owner), fld = this._targetField, ht = this._htDown;
                switch (parm) {
                    case 'remove':
                        g.engine.removeField(fld);
                        break;
                    case 'edit':
                        g.engine.editField(fld);
                        break;
                    case 'detail':
                        g.showDetail(ht.row, ht.col);
                        break;
                }
            };
            _GridContextMenu.prototype._canExecute = function (parm) {
                var g = wijmo.Control.getControl(this.owner), ng = g.engine;
                // check whether the command can be executed in the current context
                switch (parm) {
                    case 'remove':
                        return this._targetField != null;
                    case 'edit':
                        return this._targetField != null && g.engine.allowFieldEditing;
                    case 'detail':
                        return this._htDown != null;
                }
                // all else is OK
                return true;
            };
            return _GridContextMenu;
        }(wijmo.input.Menu));
        olap._GridContextMenu = _GridContextMenu;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_GridContextMenu.js.map