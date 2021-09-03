module wijmo.knockout {
    /**
     * KnockoutJS binding for the @see:FlexGrid control.
     *
     * Use the @see:wjFlexGrid binding to add @see:FlexGrid controls to your 
     * KnockoutJS applications. For example:
     * 
     * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
     * &lt;div data-bind="wjFlexGrid: { itemsSource: data }"&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Country', 
     *         binding: 'country', 
     *         width: '*' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Date', 
     *         binding: 'date' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Revenue', 
     *         binding: 'amount', 
     *         format: 'n0' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Active', 
     *         binding: 'active' }"&gt;
     *     &lt;/div&gt;
     * &lt;/div&gt;</pre>
     * 
     * The <b>wjFlexGrid</b> binding may contain @see:wjFlexGridColumn child bindings.
     *
     * The <b>wjFlexGrid</b> binding supports all read-write properties and events of 
     * the @see:FlexGrid control, except for the <b>scrollPosition</b> and 
     * <b>selection</b> properties. 
     */
    export class wjFlexGrid extends WjBinding {
        static _columnTemplateProp = '_wjkoColumnTemplate';
        static _cellClonedTemplateProp = '__wjkoClonedTempl';
        static _cellVMProp = '__wjkoCellVM';
        static _columnStyleBinding = 'wjStyle';
        static _columnStyleProp = '__wjkoStyle';

        _getControlConstructor(): any {
            return wijmo.grid.FlexGrid;
        }

        _createWijmoContext(): WjContext {
            return new WjFlexGridContext(this);
        }

        _initialize() {
            super._initialize();
            var formatterDesc = MetaFactory.findProp('itemFormatter', <PropDesc[]>this._metaData.props);
            formatterDesc.updateControl = this._formatterPropHandler;
        }

        private _formatterPropHandler(link: any, propDesc: PropDesc, control: any, unconvertedValue: any, convertedValue: any): boolean {
            if (unconvertedValue !== link._userFormatter) {
                link._userFormatter = unconvertedValue;
                control.invalidate();
            }
            return true;
        }
    }

    export class WjFlexGridContext extends WjContext {
        _wrapperFormatter = this._itemFormatter.bind(this);
        _userFormatter: Function;

        _initControl() {
            super._initControl();
            (<wijmo.grid.FlexGrid>this.control).itemFormatter = this._wrapperFormatter;
        }

        private _itemFormatter(panel, r, c, cell) {
            var column = panel.columns[c],
                cellTemplate = column[wjFlexGrid._columnTemplateProp],
                cellStyle = column[wjFlexGrid._columnStyleProp];
            if ((cellTemplate || cellStyle) && panel.cellType == wijmo.grid.CellType.Cell) {
                // do not format in edit mode
                var editRange: wijmo.grid.CellRange = panel.grid.editRange;
                if (editRange && editRange.row === r && editRange.col === c) {
                    return;
                }
                // no templates in GroupRows
                if (panel.rows[r] instanceof wijmo.grid.GroupRow) {
                    return;
                }

                var cellVM = cell[wjFlexGrid._cellVMProp],
                    clonedTempl = cell[wjFlexGrid._cellClonedTemplateProp],
                    item = panel.rows[r].dataItem;
                if (!cellVM) {
                    cellVM = {
                        $row: ko.observable(r),
                        $col: ko.observable(c),
                        $item: ko.observable(item)
                    };
                    var cellContext = this.bindingContext.extend(cellVM);
                    if (cellTemplate) {
                        cell.innerHTML = '<div>' + cellTemplate + '</div>';
                        var childEl = cell.childNodes[0];
                        cell[wjFlexGrid._cellClonedTemplateProp] = childEl;
                    }
                    else {
                        cell.setAttribute('data-bind', 'style:' + cellStyle);
                    }
                    cell[wjFlexGrid._cellVMProp] = cellVM;
                    ko.applyBindings(cellContext, cell);
                }
                else {
                    if (clonedTempl) {
                        cell.innerHTML = '';
                        cell.appendChild(clonedTempl);
                    }
                    cellVM.$row(r);
                    cellVM.$col(c);
                    if (cellVM.$item() != item) {
                        cellVM.$item(item);
                    }
                    else {
                        cellVM.$item.valueHasMutated();
                    }
                }
                //Enlarge rows height if cell doesn't fit in the current row height.
                var cellHeight = cell.scrollHeight;
                if (panel.rows[r].renderHeight < cellHeight) {
                    panel.rows.defaultSize = cellHeight;
                }

            }
            else if (this._userFormatter) {
                this._userFormatter(panel, r, c, cell);
            } 
        }
    }

    /**
     * KnockoutJS binding for the @see:FlexGrid @see:Column object.
     *
     * The @see:wjFlexGridColumn binding must be contained in a @see:wjFlexGrid binding. For example:
     * 
     * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
     * &lt;div data-bind="wjFlexGrid: { itemsSource: data }"&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Country', 
     *         binding: 'country', 
     *         width: '*' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Date', 
     *         binding: 'date' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Revenue', 
     *         binding: 'amount', 
     *         format: 'n0' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Active', 
     *         binding: 'active' }"&gt;
     *     &lt;/div&gt;
     * &lt;/div&gt;</pre>
     *
     * The <b>wjFlexGridColumn</b> binding supports all read-write properties and events of 
     * the @see:Column class. The <b>isSelected</b> property provides two-way binding mode.
     *
     * In addition to regular attributes that match properties in the <b>Column</b> class,  
     * an element with the @see:wjFlexGridColumn binding may contain a @see:wjStyle binding that
     * provides conditional formatting and an HTML fragment that is used as a cell template. Grid 
     * rows automatically stretch vertically to fit custom cell contents.
     *
     * Both the <b>wjStyle</b> binding and the HTML fragment can use the <b>$item</b> observable variable in 
     * KnockoutJS bindings to refer to the item that is bound to the current row. Also available are the 
     * <b>$row</b> and <b>$col</b> observable variables containing cell row and column indexes. For example:
     *
     * <pre>&lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Symbol', 
     *         binding: 'symbol', 
     *         readOnly: true, 
     *         width: '*' }"&gt;
     *   &lt;a data-bind="attr: { 
     *         href: 'https://finance.yahoo.com/q?s=' + $item().symbol() }, 
     *         text: $item().symbol"&gt;
     *   &lt;/a&gt;
     * &lt;/div&gt;
     * &lt;div data-bind="wjFlexGridColumn: { 
     *      header: 'Change',
     *         binding: 'changePercent',
     *         format: 'p2',
     *         width: '*'
     *         },
     *         wjStyle: { 
     *         color: getAmountColor($item().change) }"&gt;
     * &lt;/div&gt;</pre>
     *
     * These bindings create two columns. 
     * The first has a template that produces a hyperlink based on the bound item's "symbol" property. 
     * The second has a conditional style that renders values with a color determined by a function
     * implemented in the controller.
     */
    export class wjFlexGridColumn extends WjBinding {

        _getControlConstructor(): any {
            return wijmo.grid.Column;
        }

        _createControl(element: any): any {
            return new wijmo.grid.Column();
        }

        _createWijmoContext(): WjContext {
            return new WjFlexGridColumnContext(this);
        }

    }
    // FlexGrid Column context, contains specific code to add column to the parent grid.
    export class WjFlexGridColumnContext extends WjContext {
        _initControl() {
            var gridContext = this.parentWjContext;
            if (gridContext) {
                var grid: wijmo.grid.FlexGrid = <wijmo.grid.FlexGrid>gridContext.control;
                // Turn off autoGenerateColumns and clear the columns collection before initializing this column.
                if (grid.autoGenerateColumns) {
                    grid.autoGenerateColumns = false;
                    grid.columns.clear();
                }
            }
            super._initControl();
            // Store child content in the Column and clear it.
            this.control[wjFlexGrid._columnTemplateProp] = this.element.innerHTML.trim();
            var wjStyleBind = this.allBindings.get(wjFlexGrid._columnStyleBinding);
            if (wjStyleBind) {
                this.control[wjFlexGrid._columnStyleProp] = wjStyleBind.trim();
            }
            this.element.innerHTML = '';
        }
    }

    /**
     * KnockoutJS binding for conditional formatting of @see:FlexGrid @see:Column cells.
     *
     * Use the @see:wjStyle binding together with the @see:wjFlexGridColumn binding to provide
     * conditional formatting to column cells. 
     * For example:
     * 
     * <pre>&lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Change',
     *         binding: 'changePercent',
     *         format: 'p2',
     *         width: '*'
     *         },
     *         wjStyle: { color: getAmountColor($item().change) }"&gt;&lt;/div&gt;</pre>
     *
     *
     * The <b>wjStyle</b> uses the same syntax as the native KnockoutJS 
     * <a href="http://knockoutjs.com/documentation/style-binding.html" target="_blank">style</a> binding.
     * In addition to the view model properties, the following observable variables are available in binding
     * expressions:
     *
     * <dl class="dl-horizontal">
     *   <dt>$item</dt>  <dd>References the item that is bound to the current row.</dd>
     *   <dt>$row</dt>  <dd>The row index.</dd>
     *   <dt>$col</dt>  <dd>The column index.</dd>
     * </dl>
     */
    export class wjStyle {

        preprocess = function (value: string, name: string, addBinding: (name: string, value: string) => string) {
            return wjStyle.quoteString(value);
        }

        init = function () {
        }

        static quoteString(s: string): string {
            if (s == null) {
                return s;
            }
            return "'" + s.replace(/'/g, "\\'") + "'";
        }

        static unquoteString(s: string): string {
            if (!s || s.length < 2) {
                return s;
            }
            if (s.charAt(0) === "'") {
                s = s.substr(1, s.length - 1);
            }
            return s.replace(/\\\'/g, "'");
        }

    }

    /**
     * KnockoutJS binding for the @see:FlexGrid @see:FlexGridFilter object.
     *
     * The @see:wjFlexGridFilter binding must be contained in a @see:wjFlexGrid binding. For example:
     * 
     * <pre>&lt;p&gt;Here is a FlexGrid control with column filters:&lt;/p&gt;
     * &lt;div data-bind="wjFlexGrid: { itemsSource: data }"&gt;
     *     &lt;div data-bind="wjFlexGridFilter: { filterColumns: ['country', 'amount']  }"&gt;&lt;/div&gt;
     * &nbsp;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Country', 
     *         binding: 'country', 
     *         width: '*' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Date', 
     *         binding: 'date' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Revenue', 
     *         binding: 'amount', 
     *         format: 'n0' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Active', 
     *         binding: 'active' }"&gt;
     *     &lt;/div&gt;
     * &lt;/div&gt;</pre>
     *
     * The <b>wjFlexGridFilter</b> binding supports all read-write properties and events of 
     * the @see:FlexGridFilter class. 
     *
     */
    export class wjFlexGridFilter extends WjBinding {

        _getControlConstructor(): any {
            return wijmo.grid.filter.FlexGridFilter;
        }

    }

    /**
     * KnockoutJS binding for the @see:FlexGrid @see:GroupPanel control.
     *
     * The <b>wjGroupPanel</b> binding should be connected to the <b>FlexGrid</b> control using the <b>grid</b> property. 
     * For example:
     * 
     * <pre>&lt;p&gt;Here is a FlexGrid control with GroupPanel:&lt;/p&gt;
     * &nbsp;
     * &lt;div data-bind="wjGroupPanel: { grid: flex(), placeholder: 'Drag columns here to create groups.' }"&gt;&lt;/div&gt;
     * &nbsp;
     * &lt;div data-bind="wjFlexGrid: { control: flex, itemsSource: data }"&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Country', 
     *         binding: 'country', 
     *         width: '*' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Date', 
     *         binding: 'date' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Revenue', 
     *         binding: 'amount', 
     *         format: 'n0' }"&gt;
     *     &lt;/div&gt;
     *     &lt;div data-bind="wjFlexGridColumn: { 
     *         header: 'Active', 
     *         binding: 'active' }"&gt;
     *     &lt;/div&gt;
     * &lt;/div&gt;</pre>
     *
     * The <b>wjGroupPanel</b> binding supports all read-write properties and events of 
     * the @see:GroupPanel class. 
     *
     */
    export class wjGroupPanel extends WjBinding {

        _getControlConstructor(): any {
            return wijmo.grid.grouppanel.GroupPanel;
        }

    }

    /**
     * KnockoutJS binding for the @see:FlexSheet control.
     *
     * Use the @see:wjFlexSheet binding to add @see:FlexSheet controls to your 
     * KnockoutJS applications. 
     * 
     * The <b>wjFlexSheet</b> binding may contain @see:wjSheet child bindings.
     *
     * The <b>wjFlexSheet</b> binding supports all read-write properties and events of 
     * the @see:FlexSheet control. 
     */
    export class wjFlexSheet extends wjFlexGrid {

        _getControlConstructor(): any {
            return wijmo.grid.sheet.FlexSheet;
        }

    }

    /**
     * KnockoutJS binding for the @see:FlexSheet @see:Sheet object.
     *
     * The @see:wjSheet binding must be contained in a @see:wjFlexSheet binding. 
     * 
     * The <b>wjSheet</b> binding supports all read-write properties and events of 
     * the @see:Sheet class. 
     *
     */
    export class wjSheet extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.grid.sheet.Sheet;
        }

        _createWijmoContext(): WjContext {
            return new WjSheetContext(this);
        }

    }

    export class WjSheetContext extends WjContext {
        _initControl() {
            super._initControl();
            var valSet = this.valueAccessor(),
                flexSheet = <wijmo.grid.sheet.FlexSheet>this.parentWjContext.control,
                itemsSource = ko.unwrap(valSet['itemsSource']),
                sheetName = ko.unwrap(valSet['name']);

            if (itemsSource) {
                return flexSheet.addBoundSheet(sheetName, itemsSource);
            } else {
                return flexSheet.addUnboundSheet(sheetName, +ko.unwrap(valSet['rowCount']), +ko.unwrap(valSet['columnCount']));
            }
        }
    }

  /**
     * KnockoutJS binding for the @see:MultiRow object.
     * Use the @see:wjMultiRow binding to add @see:MultiRow controls to your
     * KnockoutJS applications. For example:
     *  &lt;div data-bind="wjMultiRow:
     *      {
     *          itemsSource: orders,
     *          layoutDefinition: ldThreeLines
     *      }"&gt;
     *  &lt;/div&gt;
     *                                    
     * The <b>wjMultiRow</b> binding supports all read-write properties and events of
     * the @see:MultiRow class.
     *
     */
    export class wjMultiRow extends wjFlexGrid {
        _getControlConstructor(): any {
            return wijmo.grid.multirow.MultiRow;
        }
    }

} 

// Register bindings
(<any>(ko.bindingHandlers))[wijmo.knockout.wjFlexGrid._columnStyleBinding] = new wijmo.knockout.wjStyle();
(<any>(ko.bindingHandlers)).wjFlexGrid = new wijmo.knockout.wjFlexGrid();
(<any>(ko.bindingHandlers)).wjFlexGridColumn = new wijmo.knockout.wjFlexGridColumn();
(<any>(ko.bindingHandlers)).wjFlexGridFilter = new wijmo.knockout.wjFlexGridFilter();
(<any>(ko.bindingHandlers)).wjGroupPanel = new wijmo.knockout.wjGroupPanel();
(<any>(ko.bindingHandlers)).wjFlexSheet = new wijmo.knockout.wjFlexSheet();
(<any>(ko.bindingHandlers)).wjSheet = new wijmo.knockout.wjSheet();
(<any>(ko.bindingHandlers)).wjMultiRow = new wijmo.knockout.wjMultiRow();