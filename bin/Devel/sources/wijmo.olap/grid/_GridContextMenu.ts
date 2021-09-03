module wijmo.olap {
    'use strict';

    /**
     * Context Menu for @see:PivotGrid controls. 
     */
    export class _GridContextMenu extends input.Menu {
        private _targetField: PivotField;
        private _htDown: wijmo.grid.HitTestInfo;

        /**
         * Initializes a new instance of the @see:_GridContextMenu class.
         */
        constructor() {

            // initialize the menu
            super(document.createElement('div'), {
                header: 'PivotGrid Context Menu',
                displayMemberPath: 'text',
                commandParameterPath: 'parm',
                command: {
                    executeCommand: (parm: string) => {
                        this._execute(parm);
                    },
                    canExecuteCommand: (parm: string) => {
                        return this._canExecute(parm);
                    }
                }
            });

            // finish initializing (after call to super)
            this.itemsSource = this._getMenuItems();

            // add a class to allow CSS customization
            addClass(this.dropDown, 'context-menu');
        }

        // refresh menu items in case culture changed
        refresh(fullUpdate = true) {
            this.itemsSource = this._getMenuItems();
            super.refresh(fullUpdate);
        }

        /**
         * Attaches this context menu to a @see:PivotGrid control.
         *
         * @param grid @see:PivotGrid to attach this menu to.
         */
        attach(grid: PivotGrid) {
            assert(grid instanceof PivotGrid, 'Expecting a PivotGrid control...');
            var owner = grid.hostElement;
            owner.addEventListener('contextmenu',(e) => {
                if (grid.customContextMenu) {

                    // prevent default context menu
                    e.preventDefault();

                    // select the item that was clicked
                    this.owner = owner;
                    if (this._selectField(e)) {

                        // show the context menu
                        var dropDown = this.dropDown;
                        this.selectedIndex = -1;
                        if (this.onIsDroppedDownChanging(new CancelEventArgs())) {
                            showPopup(dropDown, e);
                            this.onIsDroppedDownChanged();
                            dropDown.focus();
                        }
                    }
                }
            });
        }

        // ** implementation

        // select the item that was clicked before showing the context menu
        _selectField(e: MouseEvent): boolean {

            // assume we have no target field
            this._targetField = null;
            this._htDown = null;

            // find target field based on hit-testing
            var g = <PivotGrid>Control.getControl(this.owner),
                ng = g.engine,
                ht = g.hitTest(e);
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
        }

        // get the items used to populate the menu
        _getMenuItems(): any[] {

            // get items
            var items: any = [
                { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>Remove Field', parm: 'remove' },
                { text: '<div class="menu-icon">&#9965;</div>Field Settings...', parm: 'edit' },
                { text: '<div class="wj-separator"></div>' },
                { text: '<div class="menu-icon">&#8981;</div>Show Detail...', parm: 'detail' }
            ];

            // localize items
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.parm) {
                    var text = culture.olap._ListContextMenu[item.parm];
                    assert(text, 'missing localized text for item ' + item.parm);
                    item.text = item.text.replace(/([^>]+$)/, text);
                }
            }

            // return localized items
            return items;
        }

        // execute the menu commands
        _execute(parm) {
            var g = <PivotGrid>Control.getControl(this.owner),
                fld = this._targetField,
                ht = this._htDown;
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
        }
        _canExecute(parm): boolean {
            var g = <PivotGrid>Control.getControl(this.owner),
                ng = g.engine;

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
        }
    }
}