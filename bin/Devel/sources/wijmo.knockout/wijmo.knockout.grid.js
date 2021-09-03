var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
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
        var wjFlexGrid = (function (_super) {
            __extends(wjFlexGrid, _super);
            function wjFlexGrid() {
                _super.apply(this, arguments);
            }
            wjFlexGrid.prototype._getControlConstructor = function () {
                return wijmo.grid.FlexGrid;
            };
            wjFlexGrid.prototype._createWijmoContext = function () {
                return new WjFlexGridContext(this);
            };
            wjFlexGrid.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var formatterDesc = knockout.MetaFactory.findProp('itemFormatter', this._metaData.props);
                formatterDesc.updateControl = this._formatterPropHandler;
            };
            wjFlexGrid.prototype._formatterPropHandler = function (link, propDesc, control, unconvertedValue, convertedValue) {
                if (unconvertedValue !== link._userFormatter) {
                    link._userFormatter = unconvertedValue;
                    control.invalidate();
                }
                return true;
            };
            wjFlexGrid._columnTemplateProp = '_wjkoColumnTemplate';
            wjFlexGrid._cellClonedTemplateProp = '__wjkoClonedTempl';
            wjFlexGrid._cellVMProp = '__wjkoCellVM';
            wjFlexGrid._columnStyleBinding = 'wjStyle';
            wjFlexGrid._columnStyleProp = '__wjkoStyle';
            return wjFlexGrid;
        }(knockout.WjBinding));
        knockout.wjFlexGrid = wjFlexGrid;
        var WjFlexGridContext = (function (_super) {
            __extends(WjFlexGridContext, _super);
            function WjFlexGridContext() {
                _super.apply(this, arguments);
                this._wrapperFormatter = this._itemFormatter.bind(this);
            }
            WjFlexGridContext.prototype._initControl = function () {
                _super.prototype._initControl.call(this);
                this.control.itemFormatter = this._wrapperFormatter;
            };
            WjFlexGridContext.prototype._itemFormatter = function (panel, r, c, cell) {
                var column = panel.columns[c], cellTemplate = column[wjFlexGrid._columnTemplateProp], cellStyle = column[wjFlexGrid._columnStyleProp];
                if ((cellTemplate || cellStyle) && panel.cellType == wijmo.grid.CellType.Cell) {
                    // do not format in edit mode
                    var editRange = panel.grid.editRange;
                    if (editRange && editRange.row === r && editRange.col === c) {
                        return;
                    }
                    // no templates in GroupRows
                    if (panel.rows[r] instanceof wijmo.grid.GroupRow) {
                        return;
                    }
                    var cellVM = cell[wjFlexGrid._cellVMProp], clonedTempl = cell[wjFlexGrid._cellClonedTemplateProp], item = panel.rows[r].dataItem;
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
            };
            return WjFlexGridContext;
        }(knockout.WjContext));
        knockout.WjFlexGridContext = WjFlexGridContext;
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
        var wjFlexGridColumn = (function (_super) {
            __extends(wjFlexGridColumn, _super);
            function wjFlexGridColumn() {
                _super.apply(this, arguments);
            }
            wjFlexGridColumn.prototype._getControlConstructor = function () {
                return wijmo.grid.Column;
            };
            wjFlexGridColumn.prototype._createControl = function (element) {
                return new wijmo.grid.Column();
            };
            wjFlexGridColumn.prototype._createWijmoContext = function () {
                return new WjFlexGridColumnContext(this);
            };
            return wjFlexGridColumn;
        }(knockout.WjBinding));
        knockout.wjFlexGridColumn = wjFlexGridColumn;
        // FlexGrid Column context, contains specific code to add column to the parent grid.
        var WjFlexGridColumnContext = (function (_super) {
            __extends(WjFlexGridColumnContext, _super);
            function WjFlexGridColumnContext() {
                _super.apply(this, arguments);
            }
            WjFlexGridColumnContext.prototype._initControl = function () {
                var gridContext = this.parentWjContext;
                if (gridContext) {
                    var grid = gridContext.control;
                    // Turn off autoGenerateColumns and clear the columns collection before initializing this column.
                    if (grid.autoGenerateColumns) {
                        grid.autoGenerateColumns = false;
                        grid.columns.clear();
                    }
                }
                _super.prototype._initControl.call(this);
                // Store child content in the Column and clear it.
                this.control[wjFlexGrid._columnTemplateProp] = this.element.innerHTML.trim();
                var wjStyleBind = this.allBindings.get(wjFlexGrid._columnStyleBinding);
                if (wjStyleBind) {
                    this.control[wjFlexGrid._columnStyleProp] = wjStyleBind.trim();
                }
                this.element.innerHTML = '';
            };
            return WjFlexGridColumnContext;
        }(knockout.WjContext));
        knockout.WjFlexGridColumnContext = WjFlexGridColumnContext;
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
        var wjStyle = (function () {
            function wjStyle() {
                this.preprocess = function (value, name, addBinding) {
                    return wjStyle.quoteString(value);
                };
                this.init = function () {
                };
            }
            wjStyle.quoteString = function (s) {
                if (s == null) {
                    return s;
                }
                return "'" + s.replace(/'/g, "\\'") + "'";
            };
            wjStyle.unquoteString = function (s) {
                if (!s || s.length < 2) {
                    return s;
                }
                if (s.charAt(0) === "'") {
                    s = s.substr(1, s.length - 1);
                }
                return s.replace(/\\\'/g, "'");
            };
            return wjStyle;
        }());
        knockout.wjStyle = wjStyle;
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
        var wjFlexGridFilter = (function (_super) {
            __extends(wjFlexGridFilter, _super);
            function wjFlexGridFilter() {
                _super.apply(this, arguments);
            }
            wjFlexGridFilter.prototype._getControlConstructor = function () {
                return wijmo.grid.filter.FlexGridFilter;
            };
            return wjFlexGridFilter;
        }(knockout.WjBinding));
        knockout.wjFlexGridFilter = wjFlexGridFilter;
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
        var wjGroupPanel = (function (_super) {
            __extends(wjGroupPanel, _super);
            function wjGroupPanel() {
                _super.apply(this, arguments);
            }
            wjGroupPanel.prototype._getControlConstructor = function () {
                return wijmo.grid.grouppanel.GroupPanel;
            };
            return wjGroupPanel;
        }(knockout.WjBinding));
        knockout.wjGroupPanel = wjGroupPanel;
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
        var wjFlexSheet = (function (_super) {
            __extends(wjFlexSheet, _super);
            function wjFlexSheet() {
                _super.apply(this, arguments);
            }
            wjFlexSheet.prototype._getControlConstructor = function () {
                return wijmo.grid.sheet.FlexSheet;
            };
            return wjFlexSheet;
        }(wjFlexGrid));
        knockout.wjFlexSheet = wjFlexSheet;
        /**
         * KnockoutJS binding for the @see:FlexSheet @see:Sheet object.
         *
         * The @see:wjSheet binding must be contained in a @see:wjFlexSheet binding.
         *
         * The <b>wjSheet</b> binding supports all read-write properties and events of
         * the @see:Sheet class.
         *
         */
        var wjSheet = (function (_super) {
            __extends(wjSheet, _super);
            function wjSheet() {
                _super.apply(this, arguments);
            }
            wjSheet.prototype._getControlConstructor = function () {
                return wijmo.grid.sheet.Sheet;
            };
            wjSheet.prototype._createWijmoContext = function () {
                return new WjSheetContext(this);
            };
            return wjSheet;
        }(knockout.WjBinding));
        knockout.wjSheet = wjSheet;
        var WjSheetContext = (function (_super) {
            __extends(WjSheetContext, _super);
            function WjSheetContext() {
                _super.apply(this, arguments);
            }
            WjSheetContext.prototype._initControl = function () {
                _super.prototype._initControl.call(this);
                var valSet = this.valueAccessor(), flexSheet = this.parentWjContext.control, itemsSource = ko.unwrap(valSet['itemsSource']), sheetName = ko.unwrap(valSet['name']);
                if (itemsSource) {
                    return flexSheet.addBoundSheet(sheetName, itemsSource);
                }
                else {
                    return flexSheet.addUnboundSheet(sheetName, +ko.unwrap(valSet['rowCount']), +ko.unwrap(valSet['columnCount']));
                }
            };
            return WjSheetContext;
        }(knockout.WjContext));
        knockout.WjSheetContext = WjSheetContext;
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
        var wjMultiRow = (function (_super) {
            __extends(wjMultiRow, _super);
            function wjMultiRow() {
                _super.apply(this, arguments);
            }
            wjMultiRow.prototype._getControlConstructor = function () {
                return wijmo.grid.multirow.MultiRow;
            };
            return wjMultiRow;
        }(wjFlexGrid));
        knockout.wjMultiRow = wjMultiRow;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
// Register bindings
(ko.bindingHandlers)[wijmo.knockout.wjFlexGrid._columnStyleBinding] = new wijmo.knockout.wjStyle();
(ko.bindingHandlers).wjFlexGrid = new wijmo.knockout.wjFlexGrid();
(ko.bindingHandlers).wjFlexGridColumn = new wijmo.knockout.wjFlexGridColumn();
(ko.bindingHandlers).wjFlexGridFilter = new wijmo.knockout.wjFlexGridFilter();
(ko.bindingHandlers).wjGroupPanel = new wijmo.knockout.wjGroupPanel();
(ko.bindingHandlers).wjFlexSheet = new wijmo.knockout.wjFlexSheet();
(ko.bindingHandlers).wjSheet = new wijmo.knockout.wjSheet();
(ko.bindingHandlers).wjMultiRow = new wijmo.knockout.wjMultiRow();
//# sourceMappingURL=wijmo.knockout.grid.js.map