module wijmo.grid.sheet {
    'use strict';

    /*
     * The editor used to inspect and modify @see:FlexSheetValueFilter objects.
     *
     * This class is used by the @see:FlexSheetFilter class; you 
     * rarely use it directly.
     */
    export class _FlexSheetValueFilterEditor extends wijmo.grid.filter.ValueFilterEditor {
        /*
         * Updates editor with current filter settings.
         */
        updateEditor() {
            var col = this.filter.column,
                flexSheet = <FlexSheet>col.grid,
                colIndex = col.index,
                values = [],
                keys = {},
                row: Row,
                mergedRange: CellRange,
                value: any,
                sv: any,
                currentFilterResult: boolean,
                otherFilterResult: boolean,
                text: string;

            // get list of unique values
            if (this.filter.uniqueValues) {  // explicit list provided
                super.updateEditor();
                return;
            }

            // format and add unique values to the 'values' array
            for (var i = 0; i < flexSheet.rows.length; i++) {
                // Get the result of current filter for current row.
                currentFilterResult = this.filter.apply(i);
                // Get the result of other filters for current row.
                sv = this.filter.showValues;
                this.filter.showValues = null;
                otherFilterResult = flexSheet._filter['_filter'](i);
                this.filter.showValues = sv;

                mergedRange = flexSheet.getMergedRange(flexSheet.cells, i, colIndex);
                if (mergedRange && (i !== mergedRange.topRow || colIndex !== mergedRange.leftCol)) {
                    continue;
                }

                row = flexSheet.rows[i];
                if (row instanceof HeaderRow || (!row.isVisible && (currentFilterResult || !otherFilterResult))) {
                    continue;
                }

                value = flexSheet.getCellValue(i, colIndex);
                text = flexSheet.getCellValue(i, colIndex, true);
                if (!keys[text]) {
                    keys[text] = true;
                    values.push({ value: value, text: text });
                }
            }
            
            // check the items that are currently selected
            var showValues = this.filter.showValues;
            if (!showValues || Object.keys(showValues).length == 0) {
                for (var i = 0; i < values.length; i++) {
                    values[i].show = true;
                }
            } else {
                for (var key in showValues) {
                    for (var i = 0; i < values.length; i++) {
                        if (values[i].text == key) {
                            values[i].show = true;
                            break;
                        }
                    }
                }
            }

            // honor isContentHtml property
            this['_lbValues'].isContentHtml = col.isContentHtml;

            // load filter and apply immediately
            this['_cmbFilter'].text = this.filter.filterText;
            this['_filterText'] = this['_cmbFilter'].text.toLowerCase();

            // show the values
            this['_view'].pageSize = this.filter.maxValues;
            this['_view'].sourceCollection = values;
            this['_view'].moveCurrentToPosition(-1);
        }
    }
}