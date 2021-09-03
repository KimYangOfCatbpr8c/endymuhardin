module wijmo.olap {
    'use strict';

    // globalization
    wijmo.culture.olap = wijmo.culture.olap || {};
    wijmo.culture.olap._ListContextMenu = {
        up: 'Move Up',
        down: 'Move Down',
        first: 'Move to Beginning',
        last: 'Move to End',
        filter: 'Move to Report Filter',
        rows: 'Move to Row Labels',
        cols: 'Move to Column Labels',
        vals: 'Move to Values',
        remove: 'Remove Field',
        edit: 'Field Settings...',
        detail: 'Show Detail...'
    }

    /**
     * Context Menu for @see:ListBox controls containing @see:PivotField objects. 
     */
    export class _ListContextMenu extends input.Menu {
        _full: boolean;

        /**
         * Initializes a new instance of the @see:_ListContextMenu class.
         * 
         * @param full Whether to include all commands or only the ones that apply to the main field list.
         */
        constructor(full: boolean) {

            // initialize the menu
            super(document.createElement('div'), {
                header: 'Field Context Menu',
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
            this._full = full;
            this.itemsSource = this._getMenuItems(full)

            // add a class to allow CSS customization
            addClass(this.dropDown, 'context-menu');
        }

        // refresh menu items in case culture changed
        refresh(fullUpdate = true) {
            this.itemsSource = this._getMenuItems(this._full);
            super.refresh(fullUpdate);
        }

        /**
         * Attaches this context menu to a @see:ListBox control.
         *
         * @param listBox @see:ListBox control to attach this menu to.
         */
        attach(listBox: input.ListBox) {
            assert(listBox instanceof input.ListBox, 'Expecting a ListBox control...');
            var owner = listBox.hostElement;
            owner.addEventListener('contextmenu', (e) => {

                // prevent default context menu
                e.preventDefault();

                // select the item that was clicked
                this.owner = owner;
                if (this._selectListBoxItem(e)) {

                    // show the context menu
                    var dropDown = this.dropDown;
                    this.selectedIndex = -1;
                    if (this.onIsDroppedDownChanging(new CancelEventArgs())) {
                        showPopup(dropDown, e);
                        this.onIsDroppedDownChanged();
                        dropDown.focus();
                    }
                }
            });
        }

        // ** implementation

        // select the item that was clicked before showing the context menu
        _selectListBoxItem(e: MouseEvent): boolean {
            var lb = <input.ListBox>Control.getControl(this.owner);
            if (lb instanceof input.ListBox) {
                var el = document.elementFromPoint(e.clientX, e.clientY);
                var children = this.owner.children;
                for (var index = 0; index < children.length; index++) {
                    if (contains(children[index], e.target)) {
                        lb.selectedIndex = index;
                        return true;
                    }
                }
            }
            return false;
        }

        // get the items used to populate the menu
        _getMenuItems(full: boolean): any[] {
            var items: any[];

            // build list
            if (full) {
                items = [
                    { text: '<div class="menu-icon"></div>Move Up', parm: 'up' },
                    { text: '<div class="menu-icon"></div>Move Down', parm: 'down' },
                    { text: '<div class="menu-icon"></div>Move to Beginning', parm: 'first' },
                    { text: '<div class="menu-icon"></div>Move to End', parm: 'last' },
                    { text: '<div class="wj-separator"></div>' },
                    { text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>Move to Report Filter', parm: 'filter' },
                    { text: '<div class="menu-icon">&#8801;</div>Move to Row Labels', parm: 'rows' },
                    { text: '<div class="menu-icon">&#10996;</div>Move to Column Labels', parm: 'cols' },
                    { text: '<div class="menu-icon">&#931;</div>Move to Values', parm: 'vals' },
                    { text: '<div class="wj-separator"></div>' },
                    { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>Remove Field', parm: 'remove' },
                    { text: '<div class="wj-separator"></div>' },
                    { text: '<div class="menu-icon">&#9965;</div>Field Settings...', parm: 'edit' }
                ];
            } else {
                items = [
                    { text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>Add to Report Filter', parm: 'filter' },
                    { text: '<div class="menu-icon">&#8801;</div>Add to Row Labels', parm: 'rows' },
                    { text: '<div class="menu-icon">&#10996;</div>Add to Column Labels', parm: 'cols' },
                    { text: '<div class="menu-icon">&#931;</div>Add to Values', parm: 'vals' },
                    { text: '<div class="wj-separator"></div>' },
                    { text: '<div class="menu-icon">&#9965;</div>Field Settings...', parm: 'edit' }
                ];
            }

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
            var lb = <input.ListBox>Control.getControl(this.owner),
                fld = <PivotField>(lb ? lb.selectedItem : null),
                flds = lb ? <collections.ObservableArray>lb.itemsSource : null,
                ng = fld ? fld.engine : null,
                target = this._getTargetList(ng, parm);

            switch (parm) {

                // move field within the list
                case 'up':
                case 'first':
                case 'down':
                case 'last':
                    if (ng) {
                        var index = flds.indexOf(fld),
                            newIndex = parm == 'up' ? index - 1 : parm == 'first' ? 0 : parm == 'down' ? index + 1 : parm == 'last' ? flds.length : -1;
                        if (index < newIndex) {
                            newIndex--;
                        }
                        ng.deferUpdate(() => {
                            flds.removeAt(index);
                            flds.insert(newIndex, fld);
                        });
                    }
                    break;

                // move/copy field to a different list
                case 'filter':
                case 'rows':
                case 'cols':
                case 'vals':
                    if (target && fld) {
                        target.push(fld);
                    }
                    break;

                // remove this field from the list
                case 'remove':
                    if (fld) {
                        ng.removeField(fld);
                    }
                    break;

                // edit this field's settings
                case 'edit':
                    if (fld) {
                        ng.editField(fld);
                    }
                    break;
            }
        }
        _canExecute(parm): boolean {
            var lb = <input.ListBox>Control.getControl(this.owner),
                fld = <PivotField>(lb ? lb.selectedItem : null),
                ng = fld ? fld.engine : null,
                target = this._getTargetList(ng, parm);

            // check whether the command can be executed in the current context
            switch (parm) {

                // disable moving first item up/first
                case 'up':
                case 'first':
                    return lb && lb.selectedIndex > 0;

                // disable moving last item down/last
                case 'down':
                case 'last':
                    return lb && lb.selectedIndex < lb.collectionView.items.length - 1;

                // disable moving to lists that contain the target
                case 'filter':
                case 'rows':
                case 'cols':
                case 'vals':
                    return target && target.indexOf(fld) < 0;

                // edit fields only if the engine allows it
                case 'edit':
                    return ng && ng.allowFieldEditing;
            }

            // all else is OK
            return true;
        }

        // get target list for a command
        _getTargetList(engine: PivotEngine, parm: string) {
            if (engine) {
                switch (parm) {
                    case 'filter':
                        return engine.filterFields;
                    case 'rows':
                        return engine.rowFields;
                    case 'cols':
                        return engine.columnFields;
                    case 'vals':
                        return engine.valueFields;
                }
            }
            return null;
        }
    }
}