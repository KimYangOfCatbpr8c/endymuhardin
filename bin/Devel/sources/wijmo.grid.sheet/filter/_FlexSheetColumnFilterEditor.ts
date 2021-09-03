module wijmo.grid.sheet {
    'use strict';

    /*
     * The editor used to inspect and modify column filters.
     *
     * This class is used by the @see:FlexSheetFilter class; you 
     * rarely use it directly.
     */
    export class _FlexSheetColumnFilterEditor extends wijmo.grid.filter.ColumnFilterEditor {
       /*
        * Initializes a new instance of the @see:FlexSheetColumnFilterEditor class.
        *
        * @param element The DOM element that hosts the control, or a selector 
        * for the host element (e.g. '#theCtrl').
        * @param filter The @see:FlexSheetColumnFilter to edit.
        * @param sortButtons Whether to show sort buttons in the editor.
        */
        constructor(element: any, filter: _FlexSheetColumnFilter, sortButtons = true) {
            super(element, filter, sortButtons);

            var self = this,
                btnAsc: Node,
                btnDsc: Node;


            if (sortButtons) {
                this['_divSort'].style.display = '';
            }

            btnAsc = this.cloneElement(this['_btnAsc']);
            btnDsc = this.cloneElement(this['_btnDsc']);

            this['_btnAsc'].parentNode.replaceChild(btnAsc, this['_btnAsc']);
            this['_btnDsc'].parentNode.replaceChild(btnDsc, this['_btnDsc']);
            btnAsc.addEventListener('click', (e: MouseEvent) => {
                self._sortBtnClick(e, true);
            });
            btnDsc.addEventListener('click', (e: MouseEvent) => {
                self._sortBtnClick(e, false);
            });
        }

        // shows the value or filter editor
        _showFilter(filterType: wijmo.grid.filter.FilterType) {
            
            // create editor if we have to
            if (filterType == wijmo.grid.filter.FilterType.Value && this['_edtVal'] == null) {
                this['_edtVal'] = new _FlexSheetValueFilterEditor(this['_divEdtVal'], this.filter.valueFilter);
            }
           
            super._showFilter(filterType);
        }

        // sort button click event handler
        private _sortBtnClick(e: MouseEvent, asceding: boolean) {
            var column = this.filter.column,
                sortManager = (<FlexSheet>column.grid).sortManager,
                sortIndex: number,
                offset: number,
                sortItem: ColumnSortDescription;

            e.preventDefault();
            e.stopPropagation();

            sortIndex = sortManager.checkSortItemExists(column.index);
            if (sortIndex > -1) {
                // If the sort item for current column doesn't exist, we add new sort item for current column
                sortManager.sortDescriptions.moveCurrentToPosition(sortIndex)
                sortItem = sortManager.sortDescriptions.currentItem;
                sortItem.ascending = asceding;
                offset = -sortIndex;
            } else {
                sortManager.addSortLevel(column.index, asceding);
                offset = -(sortManager.sortDescriptions.items.length - 1);
            }
            // Move sort item for current column to first level.
            sortManager.moveSortLevel(offset);
            sortManager.commitSort();

            // show current filter state
            this.updateEditor();

            // raise event so caller can close the editor and apply the new filter
            this.onButtonClicked();
        }

        // Clone dom element and its child node
        private cloneElement(element: HTMLElement): Node {
            var cloneEle = element.cloneNode();

            while (element.firstChild) {
                cloneEle.appendChild(element.lastChild);
            }

            return cloneEle;
        }
    }
}