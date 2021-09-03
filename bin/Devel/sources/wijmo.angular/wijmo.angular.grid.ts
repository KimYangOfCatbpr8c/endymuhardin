//
// AngularJS directives for wijmo.grid module
//
module wijmo.angular {
    var wijmoGrid = window['angular'].module('wj.grid', []);
    //if (!wijmo.grid) {
    //    return;
    //}

    //#region "Grid directives registration"

    //var wijmoGrid = window['angular'].module('wj.grid', []);

    // register only if module is loaded
    if (wijmo.grid && wijmo.grid.FlexGrid) {

        wijmoGrid.directive('wjFlexGrid', ['$compile', '$interpolate', function ($compile, $interpolate) {
            return new WjFlexGrid($compile, $interpolate);
        }]);

        wijmoGrid.directive('wjFlexGridColumn', ['$compile', function ($compile) {
            return new WjFlexGridColumn($compile);
        }]);

        wijmoGrid.directive('wjFlexGridCellTemplate', [function () {
            return new WjFlexGridCellTemplate();
        }]);

        if (wijmo.grid.filter) {
            wijmoGrid.directive('wjFlexGridFilter', [function () {
                return new WjFlexGridFilter();
            }]);
        }

        if (wijmo.grid.grouppanel) {
            wijmoGrid.directive('wjGroupPanel', [function () {
                return new WjGroupPanel();
            }]);
        }

        if (wijmo.grid.detail) {
            wijmoGrid.directive('wjFlexGridDetail', ['$compile', function ($compile) {
                return new WjFlexGridDetail($compile);
            }]);
        }

        if (wijmo.grid.sheet) {
            wijmoGrid.directive('wjFlexSheet', ['$compile', '$interpolate', function ($compile, $interpolate) {
                return new WjFlexSheet($compile, $interpolate);
            }]);

            wijmoGrid.directive('wjSheet', [function () {
                return new WjSheet();
            }]);
        }

        if (wijmo.grid.multirow) {
            wijmoGrid.directive('wjMultiRow', ['$compile', '$interpolate', function ($compile, $interpolate) {
                return new WjMultiRow($compile, $interpolate);
            }]);
        }

    }

    //#endregion "Grid directives definitions"

    //#region "Grid directives classes"

    /**
        * AngularJS directive for the @see:FlexGrid control.
        *
        * Use the <b>wj-flex-grid</b> directive to add grids to your AngularJS applications. 
        * Note that directive and parameter names must be formatted as lower-case with dashes 
        * instead of camel-case. For example:
        * 
        * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
        * &lt;wj-flex-grid items-source="data"&gt;
        *   &lt;wj-flex-grid-column 
        *     header="Country" 
        *     binding="country"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        *   &lt;wj-flex-grid-column 
        *     header="Sales" 
        *     binding="sales"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        *   &lt;wj-flex-grid-column 
        *     header="Expenses" 
        *     binding="expenses"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        *   &lt;wj-flex-grid-column 
        *     header="Downloads" 
        *     binding="downloads"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        * &lt;/wj-flex-grid&gt;</pre>
        *
        * The example below creates a FlexGrid control and binds it to a 'data' array
        * exposed by the controller. The grid has three columns, each corresponding to 
        * a property of the objects contained in the source array.
        *
        * @fiddle:QNb9X
        * 
        * The <b>wj-flex-grid</b> directive supports the following attributes:
        * 
        * <dl class="dl-horizontal">
        *   <dt>allow-add-new</dt>              <dd><code>@</code> A value indicating whether to show a new row 
        *                                     template so users can add items to the source collection.</dd>
        *   <dt>allow-delete</dt>             <dd><code>@</code> A value indicating whether the grid deletes the
        *                                     selected rows when the Delete key is pressed.</dd>
        *   <dt>allow-dragging</dt>           <dd><code>@</code> An @see:AllowDragging value indicating 
        *                                     whether and how the user can drag rows and columns with the mouse.</dd>
        *   <dt>allow-merging</dt>            <dd><code>@</code> An @see:AllowMerging value indicating 
        *                                     which parts of the grid provide cell merging.</dd>
        *   <dt>allow-resizing</dt>           <dd><code>@</code> An @see:AllowResizing value indicating 
        *                                     whether users are allowed to resize rows and columns with the mouse.</dd>
        *   <dt>allow-sorting</dt>            <dd><code>@</code> A boolean value indicating whether users can sort 
        *                                     columns by clicking the column headers.</dd>
        *   <dt>auto-generate-columns</dt>    <dd><code>@</code> A boolean value indicating whether the grid generates 
        *                                     columns automatically based on the <b>items-source</b>.</dd>
        *   <dt>child-items-path</dt>         <dd><code>@</code> The name of the property used to generate 
        *                                     child rows in hierarchical grids (or an array of property names if items
        *                                     at different hierarchical levels use different names for their child items).</dd>
        *   <dt>control</dt>                  <dd><code>=</code> A reference to the @see:FlexGrid control 
        *                                     created by this directive.</dd>
        *   <dt>defer-resizing</dt>           <dd><code>=</code> A boolean value indicating whether row and column 
        *                                     resizing should be deferred until the user releases the mouse button.</dd>
        *   <dt>frozen-columns</dt>           <dd><code>@</code> The number of frozen (non-scrollable) columns in the grid.</dd>
        *   <dt>frozen-rows</dt>              <dd><code>@</code> The number of frozen (non-scrollable) rows in the grid.</dd>
        *   <dt>group-header-format</dt>      <dd><code>@</code> The format string used to create the group 
        *                                     header content.</dd>
        *   <dt>headers-visibility</dt>       <dd><code>=</code> A @see:HeadersVisibility value 
        *                                     indicating whether the row and column headers are visible. </dd>
        *   <dt>ime-enabled</dt>              <dd><code>@</code> Gets or sets a value that determines whether the grid should 
        *                                     support Input Method Editors (IME) while not in edit mode.</dd>
        *   <dt>initialized</dt>              <dd><code>&</code> This event occurs after the binding has finished
        *                                     initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>           <dd><code>=</code> A value indicating whether the binding has finished
        *                                     initializing the control with attribute values. </dd>
        *   <dt>item-formatter</dt>           <dd><code>=</code> A function that customizes 
        *                                     cells on this grid.</dd>
        *   <dt>items-source</dt>             <dd><code>=</code> An array or @see:ICollectionView object that 
        *                                     contains the items shown on the grid.</dd>
        *   <dt>is-read-only</dt>             <dd><code>@</code> A boolean value indicating whether the user is 
        *                                     prevented from editing grid cells by typing into them.</dd>
        *   <dt>merge-manager</dt>            <dd><code>=</code> A @see:MergeManager object that specifies  
        *                                     the merged extent of the specified cell.</dd>
        *   <dt>selection-mode</dt>           <dd><code>@</code> A @see:SelectionMode value 
        *                                     indicating whether and how the user can select cells.</dd>
        *   <dt>show-groups</dt>              <dd><code>@</code> A boolean value indicating whether to insert group 
        *                                     rows to delimit data groups.</dd>
        *   <dt>show-sort</dt>                <dd><code>@</code> A boolean value indicating whether to display sort 
        *                                     indicators in the column headers.</dd>
        *   <dt>sort-row-index</dt>           <dd><code>@</code> A number specifying the index of row in the column 
        *                                     header panel that shows and changes the current sort.</dd>
        *   <dt>tree-indent</dt>              <dd><code>@</code> The indentation, in pixels, used to offset row 
        *                                     groups of different levels.</dd>
        *   <dt>beginning-edit</dt>           <dd><code>&</code> Handler for the @see:FlexGrid.beginningEdit event.</dd>
        *   <dt>cell-edit-ended</dt>          <dd><code>&</code> Handler for the @see:FlexGrid.cellEditEnded event.</dd>
        *   <dt>cell-edit-ending</dt>         <dd><code>&</code> Handler for the @see:FlexGrid.cellEditEnding event.</dd>
        *   <dt>prepare-cell-for-edit</dt>    <dd><code>&</code> Handler for the @see:FlexGrid.prepareCellForEdit event.</dd>
        *   <dt>resizing-column</dt>          <dd><code>&</code> Handler for the @see:FlexGrid.resizingColumn event.</dd>
        *   <dt>resized-column</dt>           <dd><code>&</code> Handler for the @see:FlexGrid.resizedColumn event.</dd>
        *   <dt>dragged-column</dt>           <dd><code>&</code> Handler for the @see:FlexGrid.draggedColumn event.</dd>
        *   <dt>dragging-column</dt>          <dd><code>&</code> Handler for the @see:FlexGrid.draggingColumn event.</dd>
        *   <dt>sorted-column</dt>            <dd><code>&</code> Handler for the @see:FlexGrid.sortedColumn event.</dd>
        *   <dt>sorting-column</dt>           <dd><code>&</code> Handler for the @see:FlexGrid.sortingColumn event.</dd>
        *   <dt>deleting-row</dt>             <dd><code>&</code> Handler for the @see:FlexGrid.deletingRow event.</dd>
        *   <dt>dragging-row</dt>             <dd><code>&</code> Handler for the @see:FlexGrid.draggingRow event.</dd>
        *   <dt>dragged-row</dt>              <dd><code>&</code> Handler for the @see:FlexGrid.draggedRow event.</dd>
        *   <dt>resizing-row</dt>             <dd><code>&</code> Handler for the @see:FlexGrid.resizingRow event.</dd>
        *   <dt>resized-row</dt>              <dd><code>&</code> Handler for the @see:FlexGrid.resizedRow event.</dd>
        *   <dt>row-added</dt>                <dd><code>&</code> Handler for the @see:FlexGrid.rowAdded event.</dd>
        *   <dt>row-edit-ended</dt>           <dd><code>&</code> Handler for the @see:FlexGrid.rowEditEnded event.</dd>
        *   <dt>row-edit-ending</dt>          <dd><code>&</code> Handler for the @see:FlexGrid.rowEditEnding event.</dd>
        *   <dt>loaded-rows</dt>              <dd><code>&</code> Handler for the @see:FlexGrid.loadedRows event.</dd>
        *   <dt>loading-rows</dt>             <dd><code>&</code> Handler for the @see:FlexGrid.loadingRows event.</dd>
        *   <dt>group-collapsed-changed</dt>  <dd><code>&</code> Handler for the @see:FlexGrid.groupCollapsedChanged event.</dd>
        *   <dt>group-collapsed-changing</dt> <dd><code>&</code> Handler for the @see:FlexGrid.groupCollapsedChanging event.</dd>
        *   <dt>items-source-changed</dt>     <dd><code>&</code> Handler for the @see:FlexGrid.itemsSourceChanged event.</dd>
        *   <dt>selection-changing</dt>       <dd><code>&</code> Handler for the @see:FlexGrid.selectionChanging event.</dd>
        *   <dt>selection-changed</dt>        <dd><code>&</code> Handler for the @see:FlexGrid.selectionChanged event.</dd>
        *   <dt>got-focus</dt>                <dd><code>&</code> Handler for the @see:FlexGrid.gotFocus event.</dd>
        *   <dt>lost-focus</dt>               <dd><code>&</code> Handler for the @see:FlexGrid.lostFocus event.</dd>
        *   <dt>scroll-position-changed</dt>  <dd><code>&</code> Handler for the @see:FlexGrid.scrollPositionChanged event.</dd>
        * </dl>
        *
        * The <b>wj-flex-grid</b> directive may contain @see:WjFlexGridColumn, @see:WjFlexGridCellTemplate and 
        * @see:WjFlexGridDetail child directives.
        */
    export class WjFlexGrid extends WjDirective {

        // Stores instance of Angular $compile and $interpolate services
        _$compile: ng.ICompileService;
        _$interpolate: ng.IInterpolateService;

        // Initializes a new instance of a WjFlexGrid
        constructor($compile: ng.ICompileService, $interpolate: ng.IInterpolateService) {
            super();

            this._$compile = $compile;
            this._$interpolate = $interpolate;
            var self = this;

            //super();

            this.transclude = true;
            this.template = '<div ng-transclude />';

        }

        // Gets the Wijmo FlexGrid control constructor
        get _controlConstructor() {
            return wijmo.grid.FlexGrid;
        }

        _createLink(): WjLink {
            return new WjFlexGridLink();
        }

        // Initializes WjFlexGrid property map
        _initProps() {
            var childPathDesc = MetaFactory.findProp('childItemsPath', this._props);
            childPathDesc.scopeBindingMode = '@';
            childPathDesc.customHandler = function (scope, control, value, oldValue, link) {
                if (value) {
                    value = (<string>value).trim();
                    if (value && value[0] === '[') {
                        var arr = scope.$parent.$eval(value);
                        control['childItemsPath'] = arr;
                        return true;
                    }
                }
                return false;
            }
        }

    }

    export class WjFlexGridLink extends WjLink {

        _initControl(): any {
            var grid = super._initControl();
            new DirectiveCellFactory(grid, this);
            return grid;
        }

    }

    // Mockup for CellFactory, to allow DirectiveCellFactory be loaded in case of absent wijmo.grid module.
    var gridModule = wijmo.grid && wijmo.grid.CellFactory;
    if (!gridModule) {
        (<any>wijmo).grid = {};
        (<any>wijmo.grid).CellFactory = function () { };
    }

    class DirectiveCellFactory extends wijmo.grid.CellFactory {
        // Array of string members of the CellTemplateType enum.
        private static _templateTypes: string[];
        private static _cellStampProp = '__wjCellStamp';

        private _gridLink: WjFlexGridLink;
        private _baseCf: wijmo.grid.CellFactory;
        private _rowHeightUpdates: _RowHeightUpdateQueue;

        private _closingApplyTimeOut;
        private _lastApplyTimeStamp = 0;
        private _noApplyLag = false;
        private _editChar;
        private _startingEditing = false;
        private _evtInput: any;
        private _evtBlur: any;
        private _cellStampCounter = 0;

        constructor(grid: wijmo.grid.FlexGrid, gridLink: WjFlexGridLink) {
            super();

            this._gridLink = gridLink;
            this._rowHeightUpdates = new _RowHeightUpdateQueue(this);

            // init _templateTypes
            if (!DirectiveCellFactory._templateTypes) {
                DirectiveCellFactory._templateTypes = [];
                for (var templateType in CellTemplateType) {
                    if (isNaN(<any>templateType)) {
                        DirectiveCellFactory._templateTypes.push(templateType);
                    }
                }
            }

            // override grid's cell factory
            var self = this;
            this._baseCf = grid.cellFactory;
            grid.cellFactory = this;


            // initialize input event dispatcher
            this._evtInput = document.createEvent('HTMLEvents');
            this._evtInput.initEvent('input', true, false);
            // initialize blur event dispatcher
            this._evtBlur = document.createEvent('HTMLEvents');
            this._evtBlur.initEvent('blur', false, false);

            // no $apply() lag while editing
            grid.prepareCellForEdit.addHandler(function (s, e) {
                self._noApplyLag = true;
            });
            grid.cellEditEnded.addHandler(function (s, e: wijmo.grid.CellRangeEventArgs) {
                // If column has no cell edit template, clear _editChar buffer.
                if (e.range.col < 0 ||
                    !grid.columns[e.range.col][WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType.CellEdit)]) {
                    self._editChar = null;
                }
                setTimeout(function () {
                    self._noApplyLag = false;
                }, 300);
            });
            grid.beginningEdit.addHandler(function (s, e) {
                self._startingEditing = true;
            });

            grid.hostElement.addEventListener('keydown', function (e) {
                self._startingEditing = false;
            }, true);

            grid.hostElement.addEventListener('keypress', function (e) {
                var char = e.charCode > 32 ? String.fromCharCode(e.charCode) : null;
                if (char) {
                    // Grid's _KeyboardHandler may receive 'keypress' before or after this handler (observed at least in IE,
                    // not clear why this happens). So both grid.activeEditor and _startingEditing (the latter is initialized in
                    // beginningEdit and cleared in 'keydown') participate in detecting whether this char has initialized a cell
                    // editing.
                    if (!grid.activeEditor || self._startingEditing) {
                        self._editChar = char;
                    } else if (self._editChar) {
                        self._editChar += char;
                    }
                }
            }, true);
        }

        public updateCell(panel: wijmo.grid.GridPanel, rowIndex: number, colIndex: number, cell: HTMLElement, rng?: wijmo.grid.CellRange) {

            this._cellStampCounter = (this._cellStampCounter + 1) % 10000000;
            let cellStamp = cell[DirectiveCellFactory._cellStampProp] = this._cellStampCounter;

            // restore overflow for any cell
            if (cell.style.overflow) {
                cell.style.overflow = '';
            }

            var self = this,
                grid = <wijmo.grid.FlexGrid>panel.grid,
                editRange = grid.editRange,
                templateType: CellTemplateType,
                row = <wijmo.grid.Row>panel.rows[rowIndex],
                dataItem = row.dataItem,
                isGridCtx = false,
                needCellValue = false,
                isEdit = false,
                isCvGroup = false;

            // determine template type
            switch (panel.cellType) {
                case wijmo.grid.CellType.Cell:
                    if (editRange && editRange.row === rowIndex && editRange.col === colIndex) {
                        templateType = CellTemplateType.CellEdit;
                        needCellValue = isEdit = true;
                    } else if (row instanceof wijmo.grid.GroupRow) {
                        isCvGroup = dataItem instanceof wijmo.collections.CollectionViewGroup;
                        var isHierNonGroup = !(isCvGroup || (<wijmo.grid.GroupRow>row).hasChildren);
                        if (colIndex == panel.columns.firstVisibleIndex) {
                            templateType = isHierNonGroup ? CellTemplateType.Cell : CellTemplateType.GroupHeader;
                        } else {
                            templateType = isHierNonGroup ? CellTemplateType.Cell : CellTemplateType.Group;
                            needCellValue = true;
                        }
                    } else if (!(wijmo.grid['detail'] && wijmo.grid['detail'].DetailRow &&
                        (row instanceof wijmo.grid['detail'].DetailRow))) {
                        templateType = CellTemplateType.Cell;
                    }
                    break;
                case wijmo.grid.CellType.ColumnHeader:
                    templateType = CellTemplateType.ColumnHeader;
                    break;
                case wijmo.grid.CellType.RowHeader:
                    templateType = grid.collectionView &&
                        (<wijmo.collections.IEditableCollectionView>grid.collectionView).currentEditItem === dataItem
                        ? CellTemplateType.RowHeaderEdit
                        : CellTemplateType.RowHeader;
                    isGridCtx = true;
                    break;
                case wijmo.grid.CellType.TopLeft:
                    templateType = CellTemplateType.TopLeft;
                    isGridCtx = true;
                    break;
                case wijmo.grid.CellType.ColumnFooter:
                    templateType = CellTemplateType.ColumnFooter;
                    needCellValue = true;
                    break;
                case wijmo.grid.CellType.BottomLeft:
                    templateType = CellTemplateType.BottomLeft;
                    isGridCtx = true;
                    break;
            }

            var isUpdated = false;

            if (templateType != null) {

                var col = <wijmo.grid.Column>(isCvGroup && templateType == CellTemplateType.GroupHeader ?
                    grid.columns.getColumn(dataItem.groupDescription['propertyName']) :
                    (colIndex >= 0 && colIndex < panel.columns.length ? panel.columns[colIndex] : null));

                if (col) {
                    var templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType),
                        templContext = <_ICellTemplateContext>(isGridCtx ? <any>grid : <any>col)[templContextProp];

                    // maintain template inheritance
                    if (!templContext) {
                        if (templateType === CellTemplateType.RowHeaderEdit) {
                            templateType = CellTemplateType.RowHeader;
                            templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType);
                            templContext = grid[templContextProp];
                        } else if (templateType === CellTemplateType.Group || templateType === CellTemplateType.GroupHeader) {
                            if (!isCvGroup) {
                                templateType = CellTemplateType.Cell;
                                templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType);
                                templContext = col[templContextProp];
                            }
                        }
                    }

                    if (templContext) {
                        // apply directive template and style
                        var tpl = self._getCellTemplate(templContext.cellTemplate),
                            cellStyle = templContext.cellStyle,
                            cellClass = templContext.cellClass,
                            isTpl = !wijmo.isNullOrWhiteSpace(tpl),
                            isStyle = !wijmo.isNullOrWhiteSpace(cellStyle),
                            isClass = !wijmo.isNullOrWhiteSpace(cellClass),
                            cellValue;
                        if (needCellValue) {
                            cellValue = panel.getCellData(rowIndex, colIndex, false);
                        }

                        // apply cell template
                        if (isTpl) {
                            var measureAttr = cell.getAttribute(wijmo.grid.FlexGrid._WJS_MEASURE),
                                isMeasuring = measureAttr && measureAttr.toLowerCase() === 'true';
                            isUpdated = true;
                            if (isEdit) {
                                this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng, true);
                            }

                            // if this is false then we can't reuse previously cached scope and linked tree.
                            var cellContext = <_ICellTemplateCache>(cell[templContextProp] || {}),
                                isForeignCell = cellContext.column !== col || !cellContext.cellScope || !cellContext.cellScope.$root;

                            // create a new cell scope, as a child of the column's parent scope 
                            // (which could be ng-repeat with its specific properties), 
                            // or reuse the one created earlier for this cell and cached in the 
                            // cellContext.cellScope property. 
                            // in any case initialize the scope with cell specific properties.
                            var cellScope = cellContext.cellScope;

                            if (isForeignCell) {
                                this._doDisposeCell(cell);
                                cellContext.cellScope = cellScope = templContext.templLink.scope.$parent.$new();
                                cellContext.column = col;
                                cell[templContextProp] = cellContext;
                            }

                            var scopeChanged = cellScope.$row !== row || cellScope.$col !== col || cellScope.$item !== dataItem ||
                                cellScope.$value !== cellValue;
                            if (scopeChanged) {
                                self._initCellScope(cellScope, row, col, dataItem, cellValue);
                            }

                            // compile column template to get a link function, or reuse the 
                            // link function got earlier for this column and cached in the 
                            // templContext.cellLink property. 
                            var cellLink = templContext.cellLink;
                            if (!cellLink) {
                                cellLink = templContext.cellLink = (<WjFlexGrid>this._gridLink.directive)._$compile(
                                    '<div style="display:none"' + (isStyle ? ' ng-style="' + cellStyle + '"' : '') +
                                    (isClass ? ' ng-class="' + cellClass + '"' : '') + '>' + tpl + '</div>');
                                //'<div ' + (isStyle ? ' ng-style="' + cellStyle + '"' : '') + '>' + tpl + '</div>');
                            }

                            // link the cell template to the cell scope and get a bound DOM 
                            // subtree to use as the cell content, 
                            // or reuse the bound subtree linked earlier and cached in the 
                            // cellContext.clonedElement property.
                            // we pass a clone function to the link function to force it to 
                            // return a clone of the template.
                            var clonedElement = cellContext.clonedElement;
                            if (isForeignCell) {
                                //register watch before link, it'll then unhide the root element before linked element binding
                                var dispose = cellScope.$watch(function (scope) {
                                    if (!clonedElement) {
                                        return;
                                    }
                                    dispose();
                                    clonedElement[0].style.display = '';

                                    // This resolves the problem with non-painting header cells in IE, whose reason
                                    // is unclear (appeared after we started to add invisible clonedElement). 
                                    // We change some style property, which forces IE to repaint the cell, 
                                    // and after some delay restore its original value.
                                    if (panel.cellType === wijmo.grid.CellType.ColumnHeader || panel.cellType === wijmo.grid.CellType.TopLeft) {
                                        var clonedStyle = clonedElement[0].style,
                                            prevColor = clonedStyle.outlineColor,
                                            prevWidth = clonedStyle.outlineWidth;
                                        clonedStyle.outlineColor = 'white';
                                        clonedStyle.outlineWidth = '0px';
                                        setTimeout(function () {
                                            clonedStyle.outlineColor = prevColor;
                                            clonedStyle.outlineWidth = prevWidth;
                                        }, 0);
                                    }

                                    //clonedElement[0].style.visibility = 'visible';
                                });

                                cellContext.clonedElement = clonedElement = cellLink(cellScope, function (clonedEl, scope) { });
                                //clonedElement[0].style.display = 'none';
                                //clonedElement[0].style.visibility = 'collapse';
                            }

                            // insert the bound content subtree to the cell, 
                            // after $apply to prevent flickering.
                            // TBD: check whether this code is really necessary
                            if (isMeasuring /*&& clonedElement[0].style.display == 'none'*/) {
                                clonedElement[0].style.display = '';
                            }
                            var replaceFirst = false;
                            if (isEdit) {
                                var rootEl = cell.firstElementChild;
                                if (rootEl) {
                                    // set focus to cell, because hiding a focused element may move focus to a page body
                                    // that will force Grid to finish editing.
                                    cell.focus();
                                    (<HTMLElement>rootEl).style.display = 'none';

                                    //cell.textContent = '';

                                }
                            } else {
                                replaceFirst = cell.childNodes.length == 1;
                                if (!replaceFirst) {
                                    cell.textContent = '';
                                }
                            }
                            if (replaceFirst) {
                                if (clonedElement[0] !== cell.firstChild) {
                                    cell.replaceChild(clonedElement[0], cell.firstChild);
                                }
                            } else {
                                cell.appendChild(clonedElement[0]);
                            }

                            if (templContext.cellOverflow) {
                                cell.style.overflow = templContext.cellOverflow;
                            }

                            var lag = 40,
                                closingLag = 10;
                            if (this._closingApplyTimeOut) {
                                clearTimeout(this._closingApplyTimeOut);
                            }
                            self._rowHeightUpdates.add({ panel: panel, cell: cell, rng: rng, cellStamp: cellStamp });
                            if (isMeasuring || editRange || this._noApplyLag || scopeChanged && (Date.now() - this._lastApplyTimeStamp) > lag) {
                                clearTimeout(this._closingApplyTimeOut);
                                if (!cellScope.$root.$$phase) {
                                    cellScope.$apply();
                                }
                                if (!editRange && !isMeasuring) {
                                    self._rowHeightUpdates.execute();
                                }
                                this._lastApplyTimeStamp = Date.now();
                            }
                            else {
                                clearTimeout(this._closingApplyTimeOut);
                                this._closingApplyTimeOut = setTimeout(function () {
                                    clearTimeout(this._closingApplyTimeOut);
                                    if (!cellScope.$root.$$phase) {
                                        cellScope.$apply();
                                    }
                                    self._rowHeightUpdates.execute();
                                }, closingLag);
                            }

                            // increase row height if cell doesn't fit in the current row height.
                            setTimeout(function () {
                                //var cellHeight = cell.scrollHeight,
                                //    panelRows = panel.rows;
                                //if (rowIndex < panelRows.length && panelRows[rowIndex].renderHeight < cellHeight) {
                                //    panelRows.defaultSize = cellHeight;
                                if (self._updateRowHeight(panel, cell, rng, cellStamp)) {
                                    if (isEdit) {
                                        self._rowHeightUpdates.clear();
                                        grid.refresh();
                                        //grid.refreshCells(false, true, false);
                                        grid.startEditing();
                                        return;
                                    }
                                } else if (isEdit && !contains(clonedElement[0], wijmo.getActiveElement())) {
                                    // Find first visible input element and focus it. Make it only if editing
                                    // was not interrupted by row height change performed above, because it may finally
                                    // results in calling setSelectionRange on detached input, which causes crash in IE.
                                    var inputs = clonedElement[0].querySelectorAll('input');
                                    if (inputs) {
                                        for (var i = 0; i < inputs.length; i++) {
                                            var input = <HTMLInputElement>inputs[i],
                                                inpSt = window.getComputedStyle(input);
                                            if (inpSt.display !== 'none' && inpSt.visibility === 'visible') {
                                                var inpFocusEh = function () {
                                                    input.removeEventListener('focus', inpFocusEh);
                                                    setTimeout(function () {
                                                        if (self._editChar) {
                                                            input.value = self._editChar;
                                                            self._editChar = null;
                                                            wijmo.setSelectionRange(input, input.value.length);
                                                            input.dispatchEvent(self._evtInput);
                                                        }
                                                    }, 50);
                                                };

                                                input.addEventListener('focus', inpFocusEh);
                                                input.focus();

                                                break;
                                            }
                                        }
                                    }
                                }
                            }, 0);

                            if (isEdit) {

                                var editEndingEH = function (s, e) {
                                    grid.cellEditEnding.removeHandler(editEndingEH);
                                    // Move focus out of the current input element, in order to let it to save
                                    // its value (necessary for controls like InputDate that can't update value immediately
                                    // as user typing).
                                    // We do it via event emulation, instead of moving focus to another element,
                                    // because in IE an element doesn't fit in time to receive the 'blur' event.
                                    var activeElement = wijmo.getActiveElement();
                                    if (activeElement) {
                                        activeElement.dispatchEvent(self._evtBlur);
                                    }
                                    // We need to move focus nevertheless, because without this grid may lose focus at all in IE.
                                    cell.focus();
                                    if (!e.cancel) {
                                        e.cancel = true;
                                        panel.grid.setCellData(rowIndex, colIndex, cellScope.$value);
                                    }

                                    // close all open dropdowns 
                                    var dropDowns = cell.querySelectorAll('.wj-dropdown');
                                    [].forEach.call(dropDowns, function (el) {
                                        var ctrl = wijmo.Control.getControl(el);
                                        if (ctrl && ctrl instanceof wijmo.input.DropDown) {
                                            (<wijmo.input.DropDown>ctrl).isDroppedDown = false;
                                        }
                                    });
                                };

                                // subscribe the handler to the cellEditEnding event
                                grid.cellEditEnding.addHandler(editEndingEH);
                            } else {
                                this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng, false);
                            }

                        }
                    }
                }
            }

            if (!isUpdated) {
                this._doDisposeCell(cell);
                this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng);
            }

            // apply cell style
            if (!isTpl && (isStyle || isClass)) {

                // build cell style object
                var cellScopeSt = self._initCellScope({}, row, col, dataItem, cellValue),
                    style = isStyle ? this._gridLink.scope.$parent.$eval(cellStyle, cellScopeSt) : null,
                    classObj = isClass ? this._gridLink.scope.$parent.$eval(cellClass, cellScopeSt) : null;

                // apply style to cell
                if (style || classObj) {
                    var rootElement = document.createElement('div');

                    // copy elements instead of innerHTML in order to keep bindings 
                    // in templated cells
                    while (cell.firstChild) {
                        rootElement.appendChild(cell.firstChild);
                    }
                    cell.appendChild(rootElement);
                    // apply style
                    if (style) {
                        for (var key in style) {
                            rootElement.style[key] = style[key];
                        }
                    }
                    // apply classes
                    if (classObj) {
                        var classArr = <any[]>(isArray(classObj) ? classObj : [classObj]),
                            clStr = '';
                        for (var i = 0; i < classArr.length; i++) {
                            var curPart = classArr[i];
                            if (curPart) {
                                if (isString(curPart)) {
                                    clStr += ' ' + curPart;
                                } else {
                                    for (var clName in curPart) {
                                        if (curPart[clName]) {
                                            clStr += ' ' + clName;
                                        }
                                    }
                                }
                            }
                        }
                        rootElement.className = clStr;
                    }
                }
            }
        }

        disposeCell(cell: HTMLElement) {
            this._doDisposeCell(cell);
        }

        _doDisposeCell(cell: HTMLElement) {
            var ttm = DirectiveCellFactory._templateTypes;
            for (var i = 0; i < ttm.length; i++) {
                var templContextProp = WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType[ttm[i]]),
                    cellContext = <_ICellTemplateCache>(cell[templContextProp]);
                if (cellContext && cellContext.cellScope && cellContext.cellScope.$root) {
                    cellContext.cellScope.$destroy();
                    // this is necessary to avoid a memory leak probably caused by JQLite implementation.
                    if (cellContext.clonedElement) {
                        cellContext.clonedElement.remove();
                        cellContext.clonedElement = null;
                    }
                    cell[templContextProp] = null;
                }
            }
        }

        _updateRowHeight(panel: wijmo.grid.GridPanel, cell: HTMLElement, rng: wijmo.grid.CellRange, cellStamp: number): boolean {
            var cellHeight = cell.scrollHeight,
                panelRows = panel.rows,
                rowSpan = rng && rng.rowSpan || 1;
            if (cellStamp === cell[DirectiveCellFactory._cellStampProp] && (panelRows.defaultSize * rowSpan) < cellHeight) {
                panelRows.defaultSize = cellHeight / rowSpan;
                return true;
            }

            return false;
        }

        private _initCellScope(scope, row: wijmo.grid.Row, col: wijmo.grid.Column, dataItem, cellValue) {
            scope.$row = row;
            scope.$col = col;
            scope.$item = dataItem;
            scope.$value = cellValue;
            return scope;
        }

        private _getCellTemplate(tpl) {
            if (tpl) {
                tpl = tpl.replace(/ class\=\"ng\-scope\"( \"ng\-binding\")?/g, '');
                tpl = tpl.replace(/<span>\s*<\/span>/g, '');
                tpl = tpl.trim();
            }
            return tpl;
        }

    }

    interface _RowHeightUpdateRequest {
        panel: wijmo.grid.GridPanel;
        cell: HTMLElement;
        rng: wijmo.grid.CellRange
        cellStamp: number;
    }
    class _RowHeightUpdateQueue {
        private _requests: _RowHeightUpdateRequest[] = [];
        private _timeOuts = [];
        private _cellFactory: DirectiveCellFactory;

        constructor(cellFactory: DirectiveCellFactory) {
            this._cellFactory = cellFactory;
        }

        add(request: _RowHeightUpdateRequest) {
            this._requests.push(request);
        }

        execute() {
            var requests = this._requests;
            while (requests.length > 0) {
                var request = this._requests.shift(),
                    self = this;
                var timeOut = (function (request) {
                    return setTimeout(function () {
                        if (self._cellFactory._updateRowHeight(request.panel, request.cell, request.rng, request.cellStamp)) {
                            self.clear();
                        } else {
                            var toIdx = self._timeOuts.indexOf(timeOut);
                            if (toIdx > -1) {
                                self._timeOuts.splice(toIdx, 1);
                            }
                        }
                    }, 0)
                })(request);
                this._timeOuts.push(timeOut);
            }
        }

        clear() {
            this._requests.splice(0, this._requests.length);
            this._clearTimeouts();
        }

        private _clearTimeouts() {
            var timeOuts = this._timeOuts;
            for (var i = 0; i < timeOuts.length; i++) {
                clearTimeout(timeOuts[i]);
            }
            timeOuts.splice(0, timeOuts.length);
        }
    }

    // Remove wijmo.grid mockup after DirectiveCellFactory has been loaded.
    if (!gridModule) {
        (<any>wijmo).grid = null;
    }

    /**
     * AngularJS directive for the @see:Column object.
     *
     * The <b>wj-flex-grid-column</b> directive must be contained in a @see:WjFlexGrid directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>aggregate</dt>         <dd><code>@</code> The @see:Aggregate object to display in 
     *                              the group header rows for this column.</dd>
     *   <dt>align</dt>             <dd><code>@</code> The string value that sets the horizontal 
     *                              alignment of items in the column to left, right, or center.</dd>
     *   <dt>allow-dragging</dt>    <dd><code>@</code> The value indicating whether the user can move 
     *                              the column to a new position with the mouse.</dd>
     *   <dt>allow-sorting</dt>     <dd><code>@</code> The value indicating whether the user can sort 
     *                              the column by clicking its header.</dd>
     *   <dt>allow-resizing</dt>    <dd><code>@</code> The value indicating whether the user can 
     *                              resize the column with the mouse.</dd>
     *   <dt>allow-merging</dt>     <dd><code>@</code> The value indicating whether the user can merge 
     *                              cells in the column.</dd>
     *   <dt>binding</dt>           <dd><code>@</code> The name of the property to which the column is 
     *                              bound.</dd>
     *   <dt>css-class</dt>         <dd><code>@</code> The name of a CSS class to use when 
     *                              rendering the column.</dd>
     *   <dt>data-map</dt>          <dd><code>=</code> The @see:DataMap object to use to convert raw  
     *                              values into display values for the column.</dd>
     *   <dt>data-type</dt>         <dd><code>@</code> The enumerated @see:DataType value that indicates 
     *                              the type of value stored in the column.</dd>
     *   <dt>format</dt>            <dd><code>@</code> The format string to use to convert raw values 
     *                              into display values for the column (see @see:Globalize).</dd>
     *   <dt>header</dt>            <dd><code>@</code> The string to display in the column header.</dd>
     *   <dt>input-type</dt>        <dd><code>@</code> The type attribute to specify the input element 
     *                              used to edit values in the column. The default is "tel" for numeric 
     *                              columns, and "text" for all other non-Boolean columns.</dd>
     *   <dt>is-content-html</dt>   <dd><code>@</code> The value indicating whether cells in the column 
     *                              contain HTML content rather than plain text.</dd>
     *   <dt>is-read-only</dt>      <dd><code>@</code> The value indicating whether the user is prevented 
     *                              from editing values in the column.</dd>
     *   <dt>is-selected</dt>       <dd><code>@</code> The value indicating whether the column is selected.</dd>
     *   <dt>mask</dt>              <dd><code>@</code> The mask string used to edit values in the 
     *                              column.</dd>
     *   <dt>max-width</dt>         <dd><code>@</code> The maximum width for the column.</dd>
     *   <dt>min-width</dt>         <dd><code>@</code> The minimum width for the column.</dd>
     *   <dt>name</dt>              <dd><code>@</code> The column name. You can use it to retrieve the 
     *                              column.</dd>
     *   <dt>is-required</dt>       <dd><code>@</code> The value indicating whether the column must contain 
     *                              non-null values.</dd>
     *   <dt>show-drop-down</dt>    <dd><code>@</code> The value indicating whether to show drop-down buttons 
     *                              for editing based on the column's @see:DataMap.</dd>
     *   <dt>visible</dt>           <dd><code>@</code> The value indicating whether the column is visible.</dd>
     *   <dt>width</dt>             <dd><code>@</code> The width of the column in pixels or as a 
     *                              star value.</dd>
     *   <dt>word-wrap</dt>         <dd><code>@</code> The value indicating whether cells in the column wrap 
     *                              their content.</dd>
     * </dl>
     *
     * Any html content within the <b>wj-flex-grid-column</b> directive is treated as a template for the cells in that column. 
     * The template is applied only to regular cells. If you wish to apply templates to specific cell types such as 
     * column or group headers, then please see the @see:WjFlexGridCellTemplate directive.
     *
     * The following example creates two columns with a template and a conditional style:
     *
     * @fiddle:5L423
     *
     * The <b>wj-flex-grid-column</b> directive may contain @see:WjFlexGridCellTemplate child directives.
     */
    class WjFlexGridColumn extends WjDirective {

        static _colTemplateProp = '$__wjColTemplate';
        static _colWjLinkProp = '$__wjLink';
        static _cellCtxProp = '$_cellCtxProp';

        _$compile: ng.ICompileService;

        // Initializes a new instance of a WjGridColumn
        constructor($compile: ng.ICompileService) {
            super();

            this._$compile = $compile;

            // The 'data-map' HTML attribute is converted to 'map' by Angular, so we give it the 'map' alias.
            this.scope["dataMap"] += "map";
            this.scope["dataType"] += "type";

            this.require = '^wjFlexGrid';

            this['terminal'] = true;
            // If Angular supports template definition via a function (available starting with ver. 1.1.4) then we utilize this
            // possibility, because this is the only entry point where we have an access to an unprocessed version of a column 
            // cell template with element level directives definitions in their original state.
            if (WjDirective._dynaTemplates) {
                // must be false, otherwise directive's subtree will no be available in the template function
                this.transclude = false;
                // should be less then at ng-repeat/ng-if etc (to let them take a control over a column directive creation), 
                // but bigger than at ordinal directives (like ng-style, to not allow them to evaluate during the column directive
                // linking).
                this['priority'] = 100;
                this.template = function (tElement, tAttrs) {
                    // stores cell template definition, tAttrs is the only object that allows us to share a data
                    // with the link function.
                    tAttrs[WjFlexGridColumn._colTemplateProp] = tElement[0].innerHTML;
                    return '<div class="wjGridColumn"/>';
                }
                // under old Angular work in the degraded mode without element level directives support, 
                // retrieve cell template in the link function where element level directives are already compiled.
            } else {
                this.transclude = true;
                this.template = '<div class="wjGridColumn" ng-transclude/>';
            }

        }

        get _controlConstructor() {
            return wijmo.grid.Column;
        }

        _initControl(element: any): any {
            return new wijmo.grid.Column();
        }

        _createLink(): WjLink {
            return new WjFlexGridColumnLink();
        }

    }

    interface _ICellTemplateContext {
        cellTemplate?: string;
        cellStyle?: string;
        cellClass?: string;
        cellLink?: any;
        templLink?: WjLink;
        cellOverflow?: string;
    }

    interface _ICellTemplateCache {
        column?: wijmo.grid.Column;
        cellScope?: any;
        clonedElement?: any;
    }

    class WjFlexGridColumnLink extends WjLink {

        public _initParent(): void {
            var grid = <wijmo.grid.FlexGrid>this.parent.control;
            if (grid.autoGenerateColumns) {
                grid.autoGenerateColumns = false;
                this._safeApply(this.scope, 'autoGenerateColumns', false);
                grid.columns.clear();
            }

            super._initParent();

            // Assign cell template defined without WjFlexGridCellTemplate tag if the latter was not specified.
            var cellCtxProp = WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType.Cell),
                cellCtxByTag = this.control[cellCtxProp],
                cellCtxWoTag = this[WjFlexGridColumn._cellCtxProp];
            if (!cellCtxByTag && cellCtxWoTag) {
                this.control[cellCtxProp] = cellCtxWoTag;
            }

            this.control[WjFlexGridColumn._colWjLinkProp] = this;

        }

        public _link() {

            // get column template (HTML content)
            var rootEl = this.tElement[0],
                dynaTempl = this.tAttrs[WjFlexGridColumn._colTemplateProp],
                template = dynaTempl != null ? dynaTempl : WjDirective._removeTransclude(rootEl.innerHTML),
                cellTemplContext = <_ICellTemplateContext>{};
            if (!wijmo.isNullOrWhiteSpace(template)) {
                //this.control['cellTemplate'] = template;
                var templRoot = document.createElement('div');
                templRoot.innerHTML = template;
                var childElements = [];
                [].forEach.call(templRoot.children, function (value) {
                    childElements.push(value);
                });
                var linkScope;
                for (var i = 0; i < childElements.length; i++) {
                    var curTempl = <HTMLElement>childElements[i];
                    if (curTempl.tagName.toLocaleLowerCase() === WjFlexGridCellTemplate._tagName) {
                        if (!linkScope) {
                            //linkScope = this.scope.$parent;
                            linkScope = this.scope.$parent.$new();
                        }
                        // remove cell template directive from cell's template
                        templRoot.removeChild(curTempl);

                        // compile and link cell template directive
                        rootEl.appendChild(curTempl);
                        (<WjFlexGridColumn>this.directive)._$compile(curTempl)(linkScope);
                    }
                }

                var cleanCellTempl = templRoot.innerHTML;
                if (!wijmo.isNullOrWhiteSpace(cleanCellTempl)) {
                    cellTemplContext.cellTemplate = cleanCellTempl;
                }

            }

            // get column style
            var style = this.tAttrs['ngStyle'],
                ngClass = this.tAttrs['ngClass'];
            if (style) {
                cellTemplContext.cellStyle = style;
            }
            if (ngClass) {
                cellTemplContext.cellClass = ngClass;
            }

            if (cellTemplContext.cellTemplate || cellTemplContext.cellStyle || cellTemplContext.cellClass) {
                cellTemplContext.templLink = this;
                this[WjFlexGridColumn._cellCtxProp] = cellTemplContext;
            }

            super._link();
        }

    }

    /**
     * Defines the type of cell to which the template applies.
     * This value is specified in the <b>cell-type</b> attribute
     * of the @see:WjFlexGridCellTemplate directive.
     */
    export enum CellTemplateType {
        /** Defines a regular (data) cell. */
        Cell,
        /** Defines a cell in edit mode. */
        CellEdit,
        /** Defines a column header cell. */
        ColumnHeader,
        /** Defines a row header cell. */
        RowHeader,
        /** Defines a row header cell in edit mode. */
        RowHeaderEdit,
        /** Defines a top left cell. */
        TopLeft,
        /** Defines a group header cell in a group row. */
        GroupHeader,
        /** Defines a regular cell in a group row. */
        Group,
        /** Defines a column footer cell. */
        ColumnFooter,
        /** Defines a bottom left cell (at the intersection of the row header and column footer cells). **/
        BottomLeft
    }

    /**
     * AngularJS directive for the @see:FlexGrid cell templates.
     *
     * The <b>wj-flex-grid-cell-template</b> directive defines a template for a certain 
     * cell type in @see:FlexGrid, and must contain a <b>cell-type</b> attribute that 
     * specifies the @see:CellTemplateType. Depending on the template's cell type, 
     * the <b>wj-flex-grid-cell-template</b> directive must be a child of either @see:WjFlexGrid 
     * or @see:WjFlexGridColumn directives.
     *
     * Column-specific cell templates must be contained in <b>wj-flex-grid-column</b>
     * directives, and cells that are not column-specific (like row header or top left cells)
     * must be contained in the <b>wj-flex-grid directive</b>.
     *
     * In addition to an HTML fragment, <b>wj-flex-grid-cell-template</b> directives may 
     * contain an <b>ng-style</b> or <b>ng-class</b> attribute that provides conditional formatting for cells.
     * 
     * Both the <b>ng-style/ng-class</b> attributes and the HTML fragment can use the <b>$col</b>, 
     * <b>$row</b> and <b>$item</b> template variables that refer to the @see:Column, 
     * @see:Row and <b>Row.dataItem</b> objects pertaining to the cell.
     *
     * For cell types like <b>Group</b> and <b>CellEdit</b>, an additional <b>$value</b> 
     * variable containing an unformatted cell value is provided. For example, here is a 
     * FlexGrid control with templates for row headers and for the Country column's regular
     * and column header cells:
     *
     * <pre>&lt;wj-flex-grid items-source="data"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="RowHeader"&gt;
     *     {&#8203;{$row.index}}
     *   &lt;/wj-flex-grid-cell-template&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="RowHeaderEdit"&gt;
     *     ...
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &nbsp;
     *   &lt;wj-flex-grid-column header="Country" binding="country"&gt;
     *     &lt;wj-flex-grid-cell-template cell-type="ColumnHeader"&gt;
     *       &lt;img ng-src="resources/globe.png" /&gt;
     *         {&#8203;{$col.header}}
     *       &lt;/wj-flex-grid-cell-template&gt;
     *       &lt;wj-flex-grid-cell-template cell-type="Cell"&gt;
     *         &lt;img ng-src="resources/{&#8203;{$item.country}}.png" /&gt;
     *         {&#8203;{$item.country}}
     *       &lt;/wj-flex-grid-cell-template&gt;
     *     &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column header="Sales" binding="sales"&gt;&lt;/wj-flex-grid-column&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * For more detailed information on specific cell type templates refer to the 
     * documentation for the @see:CellTemplateType enumeration.
     *
     * Note that the <b>wj-flex-grid-column</b> directive may also contain arbitrary content 
     * that is treated as a template for a regular data cell (<i>cell-type="Cell"</i>). But if
     * a <b>wj-flex-grid-cell-template</b> directive exists and is set to <i>cell-type="Cell"</i>
     * under the <b>wj-flex-grid-column</b> directive, it takes priority and overrides the
     * arbitrary content.
     *
     * The <b>wj-flex-grid-cell-template</b> directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>cell-type</dt>
     *   <dd><code>@</code>
     *     The @see:CellTemplateType value defining the type of cell the template applies to.
     *   </dd>
     *   <dt>cell-overflow</dt>
     *   <dd><code>@</code>
     *     Defines the <b>style.overflow</b> property value for cells.
     *   </dd>
     * </dl>
     *
     * The <b>cell-type</b> attribute takes any of the following enumerated values:
     *
     * <b>Cell</b>
     *
     * Defines a regular (data) cell template. Must be a child of the @see:WjFlexGridColumn directive.
     * For example, this cell template shows flags in the Country column's cells:
     *
     * <pre>&lt;wj-flex-grid-column header="Country" binding="country"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="Cell"&gt;
     *     &lt;img ng-src="resources/{&#8203;{$item.country}}.png" /&gt;
     *     {&#8203;{$item.country}}
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid-column&gt;</pre>
     *
     * For a hierarchical @see:FlexGrid (that is, one with the <b>childItemsPath</b> property 
     * specified), if no <b>Group</b> template is provided, non-header cells in group rows in 
     * this @see:Column also use this template.
     *
     * <b>CellEdit</b>
     *
     * Defines a template for a cell in edit mode. Must be a child of the @see:WjFlexGridColumn directive. 
     * This cell type has an additional <b>$value</b> property available for binding. It contains the
     * original cell value before editing, and the updated value after editing.
 
     * For example, here is a template that uses the Wijmo @see:InputNumber control as an editor
     * for the "Sales" column:
     *
     * <pre>&lt;wj-flex-grid-column header="Sales" binding="sales"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="CellEdit"&gt;
     *     &lt;wj-input-number value="$value" step="1"&gt;&lt;/wj-input-number&gt;
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid-column&gt;</pre>
     *
     * <b>ColumnHeader</b>
     *
     * Defines a template for a column header cell. Must be a child of the @see:WjFlexGridColumn directive. 
     * For example, this template adds an image to the header of the "Country" column:
     *
     * <pre>&lt;wj-flex-grid-column header="Country" binding="country"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="ColumnHeader"&gt;
     *     &lt;img ng-src="resources/globe.png" /&gt;
     *     {&#8203;{$col.header}}
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid-column&gt;</pre>
     *
     * <b>RowHeader</b>
     *
     * Defines a template for a row header cell. Must be a child of the @see:WjFlexGrid directive.
     * For example, this template shows row indices in the row headers:
     *
     * <pre>&lt;wj-flex-grid items-source="data"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="RowHeader"&gt;
     *     {&#8203;{$row.index}}
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * Note that this template is applied to a row header cell, even if it is in a row that is 
     * in edit mode. In order to provide an edit-mode version of a row header cell with alternate 
     * content, define the <b>RowHeaderEdit</b> template.
     *
     * <b>RowHeaderEdit</b>
     *
     * Defines a template for a row header cell in edit mode. Must be a child of the 
     * @see:WjFlexGrid directive. For example, this template shows dots in the header
     * of rows being edited:
     *
     * <pre>&lt;wj-flex-grid items-source="data"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="RowHeaderEdit"&gt;
     *       ...
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * To add the standard edit-mode indicator to cells where the <b>RowHeader</b> template 
     * applies, use the following <b>RowHeaderEdit</b> template:
     *
     * <pre>&lt;wj-flex-grid items-source="data"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="RowHeaderEdit"&gt;
     *     {&#8203;{&amp;#x270e;}}
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * <b>TopLeft</b>
     *
     * Defines a template for the top left cell. Must be a child of the @see:WjFlexGrid directive. 
     * For example, this template shows a down/right glyph in the top-left cell of the grid:
     *
     * <pre>&lt;wj-flex-grid items-source="data"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="TopLeft"&gt;
     *     &lt;span class="wj-glyph-down-right"&gt;&lt;/span&gt;
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * <p><b>GroupHeader</b></p>
     *
     * Defines a template for a group header cell in a @see:GroupRow, Must be a child of the @see:WjFlexGridColumn directive.
     *
     * The <b>$row</b> variable contains an instance of the <b>GroupRow</b> class. If the grouping comes 
     * from the a @see:CollectionView, the <b>$item</b> variable references the @see:CollectionViewGroup object.
     *
     * For example, this template uses a checkbox element as an expand/collapse toggle:
     *
     * <pre>&lt;wj-flex-grid-column header="Country" binding="country"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="GroupHeader"&gt;
     *     &lt;input type="checkbox" ng-model="$row.isCollapsed"/&gt; 
     *     {&#8203;{$item.name}} ({&#8203;{$item.items.length}} items)
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid-column&gt;</pre>
     *
     * <b>Group</b>
     *
     * Defines a template for a regular cell (not a group header) in a @see:GroupRow. Must be a child of the 
     * @see:WjFlexGridColumn directive. This cell type has an additional <b>$value</b> varible available for 
     * binding. In cases where columns have the <b>aggregate</b> property specified, it contains the unformatted 
     * aggregate value.
     *
     * For example, this template shows an aggregate's value and kind for group row cells in the "Sales"
     * column:
     *
     * <pre>&lt;wj-flex-grid-column header="Sales" binding="sales" aggregate="Avg"&gt;
     *   &lt;wj-flex-grid-cell-template cell-type="Group"&gt;
     *     Average: {&#8203;{$value | number:2}}
     *   &lt;/wj-flex-grid-cell-template&gt;
     * &lt;/wj-flex-grid-column&gt;</pre>
    *
    * <b>ColumnFooter</b>
    *
    * Defines a template for a regular cell in a <b>columnFooters</b> panel. Must be a child of the
    * @see:WjFlexGridColumn directive. This cell type has an additional <b>$value</b>
    * property available for binding that contains a cell value.
    *
    * For example, this template shows aggregate's value and kind for a footer cell in the "Sales"
    * column:
    *
    * <pre>&lt;wj-flex-grid-column header="Sales" binding="sales" aggregate="Avg"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="ColumnFooter"&gt;
    *     Average: {&#8203;{$value | number:2}}
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid-column&gt;</pre>
    *
    * <b>BottomLeft</b>
    *
    * Defines a template for the bottom left cells (at the intersection of the row header and column footer cells).
    * Must be a child of the @see:WjFlexGrid directive.
    * For example, this template shows a sigma glyph in the bottom-left cell of the grid:
    *
    * <pre>&lt;wj-flex-grid items-source="data"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="BottomLeft"&gt;
    *    &amp;#931;
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid&gt;</pre>
     */
    class WjFlexGridCellTemplate extends WjDirective {

        static _tagName = 'wj-flex-grid-cell-template';

        // returns the name of the property on control instance that stores info for the specified cell template type.
        static _getTemplContextProp(templateType: CellTemplateType) {
            return '$__cellTempl' + CellTemplateType[templateType];
        }

        constructor() {
            super();

            this.require = ['?^wjFlexGridColumn', '?^wjFlexGrid'];

            // The same approach like in WjFlexGridColumn
            this['terminal'] = true;
            if (WjDirective._dynaTemplates) {
                this.transclude = false;
                this['priority'] = 100;
                this.template = function (tElement, tAttrs) {
                    tAttrs[WjFlexGridColumn._colTemplateProp] = tElement[0].innerHTML;
                    return '<div />';
                }
            } else {
                this.transclude = true;
                this.template = '<div ng-transclude/>';
            }
        }

        _initControl(element: any): any {
            return {};
        }

        _createLink(): WjLink {
            return new WjFlexGridCellTemplateLink();
        }

        _getMetaDataId(): any {
            return 'FlexGridCellTemplate';
        }

    }

    class WjFlexGridCellTemplateLink extends WjLink {

        public _initParent(): void {
            super._initParent();

            var cts: string = this.scope['cellType'],
                cellType: CellTemplateType;
            if (cts) {
                cellType = CellTemplateType[cts];
            } else {
                return;
            }

            // get column template (HTML content)
            var dynaTempl = this.tAttrs[WjFlexGridColumn._colTemplateProp],
                template = dynaTempl != null ? dynaTempl : WjDirective._removeTransclude(this.tElement[0].innerHTML),
                control = <_ICellTemplateContext>this.control;
            if (!wijmo.isNullOrWhiteSpace(template)) {
                control.cellTemplate = template;
            }

            // get column style
            var style = this.tAttrs['ngStyle'],
                ngClass = this.tAttrs['ngClass'];
            if (style) {
                control.cellStyle = style;
            }
            if (ngClass) {
                control.cellClass = ngClass;
            }

            if (control.cellTemplate || control.cellStyle || control.cellClass) {
                control.templLink = this;
                this.parent.control[WjFlexGridCellTemplate._getTemplContextProp(cellType)] = control;
            }

            WjFlexGridCellTemplateLink._invalidateGrid(this.parent.control);
        }

        public _destroy() {
            var parentControl = this.parent && this.parent.control,
                cts: string = this.scope['cellType'];
            super._destroy();
            if (cts) {
                parentControl[WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType[cts])] = undefined;
                WjFlexGridCellTemplateLink._invalidateGrid(parentControl);
            }
        }

        private static _invalidateGrid(parentControl: Control) {
            var grid = parentControl;
            if (grid) {
                if (grid instanceof wijmo.grid.Column) {
                    grid = (<wijmo.grid.Column><any>grid).grid;
                }
                if (grid) {
                    grid.invalidate();
                }
            }
        }


    }

    /**
     * AngularJS directive for the @see:FlexGridFilter object.
     *
     * The <b>wj-flex-grid-filter</b> directive must be contained in a @see:WjFlexGrid directive. For example:
     *
     * <pre>&lt;p&gt;Here is a FlexGrid control with column filters:&lt;/p&gt;
     * &lt;wj-flex-grid items-source="data"&gt;
     *   &lt;wj-flex-grid-filter filter-columns="['country', 'expenses']"&gt;&lt;/wj-flex-grid-filter&gt;
     * &nbsp;
     *   &lt;wj-flex-grid-column 
     *     header="Country" 
     *     binding="country"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Sales" 
     *     binding="sales"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Expenses" 
     *     binding="expenses"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Downloads" 
     *     binding="downloads"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *  &lt;/wj-flex-grid&gt;</pre>
     *
     * The <b>wj-flex-grid-filter</b> directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>filter-columns</dt>    <dd><code>=</code> An array containing the names or bindings of the columns
     *                              to filter.</dd>
     *   <dt>show-filter-icons</dt> <dd><code>@</code>  The value indicating whether filter editing buttons 
     *                              appear in the grid's column headers.</dd>
     *   <dt>filter-changing</dt>   <dd><code>&</code> Handler for the @see:FlexGridFilter.filterChanging event.</dd>
     *   <dt>filter-changed</dt>    <dd><code>&</code> Handler for the @see:FlexGridFilter.filterChanged event.</dd>
     *   <dt>filter-applied</dt>    <dd><code>&</code> Handler for the @see:FlexGridFilter.filterApplied event.</dd>
     * </dl>
     */
    class WjFlexGridFilter extends WjDirective {

        // Initializes a new instance of a WjGridColumn
        constructor() {
            super();

            this.require = '^wjFlexGrid';
            //this.transclude = true;
            this.template = '<div />';
        }

        get _controlConstructor() {
            return wijmo.grid.filter.FlexGridFilter;
        }

    }

    /**
     * AngularJS directive for the @see:GroupPanel control.
     *
     * The <b>wj-group-panel</b> directive connects to the <b>FlexGrid</b> control via the <b>grid</b> property. 
     * For example:
     *
     * <pre>&lt;p&gt;Here is a FlexGrid control with GroupPanel:&lt;/p&gt;
     * &nbsp;
     * &lt;wj-group-panel grid="flex" placeholder="Drag columns here to create groups."&gt;&lt;/wj-group-panel&gt;
     * &nbsp;
     * &lt;wj-flex-grid control="flex" items-source="data"&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Country" 
     *     binding="country"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Sales" 
     *     binding="sales"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Expenses" 
     *     binding="expenses"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column 
     *     header="Downloads" 
     *     binding="downloads"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * The <b>wj-group-panel</b> directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>grid</dt>                      <dd><code>@</code>The <b>FlexGrid</b> that is connected to this <b>GroupPanel</b>.</dd>
     *   <dt>hide-grouped-columns</dt>      <dd><code>@</code>A value indicating whether the panel hides grouped columns 
     *                                      in the owner grid.</dd>
     *   <dt>max-groups</dt>                <dd><code>@</code>The maximum number of groups allowed.</dd>
     *   <dt>placeholder</dt>               <dd><code>@</code>A string to display in the control when it 
     *                                      contains no groups.</dd>
     *   <dt>got-focus</dt>                 <dd><code>&</code> Handler for the @see:GroupPanel.gotFocus event.</dd>
     *   <dt>lost-focus</dt>                <dd><code>&</code> Handler for the @see:GroupPanel.lostFocus event.</dd>
     * </dl>
     *
     */
    class WjGroupPanel extends WjDirective {

        get _controlConstructor() {
            return wijmo.grid.grouppanel.GroupPanel;
        }

    }

    /**
     * AngularJS directive for @see:FlexGrid @see:DetailRow templates.
     *
     * The <b>wj-flex-grid-detail</b> directive must be contained in a 
     * <b>wj-flex-grid</b> directive.
     *
     * The <b>wj-flex-grid-detail</b> directive represents a @see:FlexGridDetailProvider
     * object that maintains detail rows visibility, with detail rows content defined as
     * an arbitrary HTML fragment within the directive tag. The fragment may contain 
     * AngularJS bindings and directives. 
     * In addition to any properties available in a controller, the local <b>$row</b> and 
     * <b>$item</b> template variables can be used in AngularJS bindings that refer to 
     * the detail row's parent @see:Row and <b>Row.dataItem</b> objects. For example:
     * 
     * <pre>&lt;p&gt;Here is a detail row with a nested FlexGrid:&lt;/p&gt;
     * &nbsp;
     * &lt;wj-flex-grid 
     *   items-source="categories"&gt;
     *   &lt;wj-flex-grid-column header="Name" binding="CategoryName"&gt;&lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column header="Description" binding="Description" width="*"&gt;&lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-detail max-height="250" detail-visibility-mode="detailMode"&gt;
     *     &lt;wj-flex-grid 
     *       items-source="getProducts($item.CategoryID)"
     *       headers-visibility="Column"&gt;
     *     &lt;/wj-flex-grid&gt;
     *   &lt;/wj-flex-grid-detail&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * A reference to a <b>FlexGridDetailProvider</b> object represented by the 
     * <b>wj-flex-grid-detail</b> directive can be retrieved in a usual way by binding
     * to the directive's <b>control</b> property. This makes all the API provided by 
     * <b>FlexGridDetailProvider</b> available for usage in the template, giving you total 
     * control over the user experience. The following example adds a custom show/hide toggle 
     * to the Name column cells, and a Hide Detail button to the detail row. These elements call 
     * the <b>FlexGridDetailProvider</b>, <b>hideDetail</b> and <b>showDetail</b> methods in 
     * their <b>ng-click</b> bindings to implement the custom show/hide logic:
     * 
     * <pre>&lt;p&gt;Here is a FlexGrid with custom show/hide detail elements:&lt;/p&gt;
     * &nbsp;
     * &lt;wj-flex-grid 
     *   items-source="categories"
     *   headers-visibility="Column"
     *   selection-mode="Row"&gt;
     *   &lt;wj-flex-grid-column header="Name" binding="CategoryName" is-read-only="true" width="200"&gt;
     *     &lt;img ng-show="dp.isDetailVisible($row)" ng-click="dp.hideDetail($row)" src="resources/hide.png" /&gt;
     *     &lt;img ng-hide="dp.isDetailVisible($row)" ng-click="dp.showDetail($row, true)" src="resources/show.png" /&gt;
     *     {&#8203;{$item.CategoryName}}
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column header="Description" binding="Description" width="2*"&gt;&lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-detail control="dp" detail-visibility-mode="Code"&gt;
     *     &lt;div style="padding:12px;background-color:#cee6f7"&gt;
     *       ID: &lt;b&gt;{&#8203;{$item.CategoryID}}&lt;/b&gt;&lt;br /&gt;
     *       Name: &lt;b&gt;{&#8203;{$item.CategoryName}}&lt;/b&gt;&lt;br /&gt;
     *       Description: &lt;b&gt;{&#8203;{$item.Description}}&lt;/b&gt;&lt;br /&gt;
     *       &lt;button class="btn btn-default" ng-click="dp.hideDetail($row)"&gt;Hide Detail&lt;/button&gt;
     *     &lt;/div&gt;
     *   &lt;/wj-flex-grid-detail&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     * 
     * The <b>wj-flex-grid-detail</b> directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>control</dt>                <dd><code>=</code> A reference to the @see:FlexGridDetailProvider object 
     *                                   created by this directive.</dd>
     *   <dt>detail-visibility-mode</dt> <dd><code>@</code>A @see:DetailVisibilityMode value that determines when 
     *                                   to display the row details.</dd>
     *   <dt>max-height</dt>             <dd><code>@</code>The maximum height of the detail rows, in pixels.</dd>
     *   <dt>row-has-detail</dt>         <dd><code>=</code>The callback function that determines whether a row 
     *                                       has details.</dd>
     * </dl>
     *
     */
    class WjFlexGridDetail extends WjDirective {

        static _detailTemplateProp = '$__wjDetailTemplate';
        static _detailScopeProp = '$_detailScope';

        _$compile: ng.ICompileService;

        constructor($compile: ng.ICompileService) {
            super();
            this._$compile = $compile;
            this.require = '^wjFlexGrid';

            // The same approach like in WjFlexGridColumn
            this['terminal'] = true;
            if (WjDirective._dynaTemplates) {
                this.transclude = false;
                this['priority'] = 100;
                this.template = function (tElement, tAttrs) {
                    tAttrs[WjFlexGridDetail._detailTemplateProp] = tElement[0].innerHTML;
                    return '<div />';
                }
            } else {
                this.transclude = true;
                this.template = '<div ng-transclude/>';
            }
        }

        get _controlConstructor() {
            return wijmo.grid.detail.FlexGridDetailProvider;
        }

        _createLink(): WjLink {
            return new WjFlexGridDetailLink();
        }
    }

    class WjFlexGridDetailLink extends WjLink {

        itemTemplate: string;

        private _tmplLink;

        public _initParent(): void {
            super._initParent();

            // get column template (HTML content)
            var self = this,
                dynaTempl = this.tAttrs[WjFlexGridDetail._detailTemplateProp],
                dp = <wijmo.grid.detail.FlexGridDetailProvider>this.control;
            this.itemTemplate = this._getCellTemplate(dynaTempl != null ? dynaTempl :
                WjDirective._removeTransclude(this.tElement[0].innerHTML));
            var tpl = this._getCellTemplate(this.itemTemplate);
            this._tmplLink = (<WjFlexGridDetail>this.directive)._$compile('<div>' + tpl + '</div>');

            // show detail when asked to
            dp.createDetailCell = function (row, col) {
                // create detail row scope and link it
                var cellScope = self._getCellScope(self.scope.$parent, row, col),
                    clonedElement = self._tmplLink(cellScope, function (clonedEl, scope) { })[0];
                // add the linked tree to the DOM tree, in order to get correct height in FlexGridDetailProvider's formatItem
                dp.grid.hostElement.appendChild(clonedElement);

                // apply the cell scope
                if (!cellScope.$root.$$phase) {
                    cellScope.$apply();
                }

                // remove cell element from the DOM tree and return it to caller
                clonedElement.parentElement.removeChild(clonedElement);
                return clonedElement;
            }

            // dispose detail scope when asked to
            dp.disposeDetailCell = function (row: wijmo.grid.detail.DetailRow) {
                if (row.detail) {
                    window['angular'].element(row.detail).scope().$destroy();
                }
            }

            if (this.parent._isInitialized && this.control) {
                this.control.invalidate();
            }
        }

        public _destroy() {
            var ownerControl = this.parent && this.parent.control,
                dp = <wijmo.grid.detail.FlexGridDetailProvider>this.control;
            dp.createDetailCell = null;
            dp.disposeDetailCell = null;
            super._destroy();
            this._tmplLink = null;
            if (ownerControl) {
                ownerControl.invalidate();
            }
        }

        // helper functions
        private _getCellScope(parentScope, row, col) {
            var ret = parentScope.$new();
            ret.$row = row;
            ret.$col = col;
            ret.$item = row.dataItem;
            return ret;
        }
        private _getCellTemplate(tpl) {
            if (tpl) {
                tpl = tpl.replace(/ng\-style/g, 'style');
                tpl = tpl.replace(/ class\=\"ng\-scope\"( \"ng\-binding\")?/g, '');
                tpl = tpl.replace(/<span>\s*<\/span>/g, '');
            }
            return tpl;
        }
    }


    /**
     * AngularJS directive for the @see:FlexSheet control.
     *
     * Use the <b>wj-flex-sheet</b> directive to add <b>FlexSheet</b> controls to your AngularJS applications. 
     * Note that directive and parameter names must be formatted as lower-case with dashes 
     * instead of camel-case. For example:
     * 
     * <pre>&lt;p&gt;Here is a FlexSheet control with one bound and two unbound sheets:&lt;/p&gt;
     * &lt;wj-flex-sheet&gt;
     *    &lt;wj-sheet name="Country" items-source="ctx.data"&gt;&lt;/wj-sheet&gt;
     *    &lt;wj-sheet name="Report" row-count="25" column-count="13"&gt;&lt;/wj-sheet&gt;
     *    &lt;wj-sheet name="Formulas" row-count="310" column-count="10"&gt;&lt;/wj-sheet&gt;
     * &lt;/wj-flex-sheet&gt;</pre>
     *
     * The <b>wj-flex-sheet</b> directive extends @see:WjFlexGrid with the following attributes:
     * 
     * <dl class="dl-horizontal">
     *   <dt>control</dt>                   <dd><code>=</code> A reference to the @see:FlexSheet control created by this directive.</dd>
     *   <dt>is-tab-holder-visible</dt>     <dd><code>@</code> A value indicating whether the sheet tabs holder is visible. </dd>
     *   <dt>selected-sheet-index</dt>      <dd><code>=</code> Gets or sets the index of the current sheet in the @see:FlexSheet. </dd>
     *   <dt>dragging-row-column</dt>       <dd><code>&</code> Handler for the @see:FlexSheet.draggingRowColumn event.</dd>
     *   <dt>dropping-row-column</dt>       <dd><code>&</code> Handler for the @see:FlexSheet.droppingRowColumn event.</dd>
     *   <dt>selected-sheet-changed</dt>    <dd><code>&</code> Handler for the @see:FlexSheet.selectedSheetChanged event.</dd>
     * </dl>
     *
     * The <b>wj-flex-sheet</b> directive may contain @see:WjSheet child directives.
     */
    class WjFlexSheet extends WjFlexGrid {
        constructor($compile: ng.ICompileService, $interpolate: ng.IInterpolateService) {
            super($compile, $interpolate);
        }

        // Gets the Wijmo FlexSheet control constructor
        get _controlConstructor() {
            return wijmo.grid.sheet.FlexSheet;
        }
    }

    /**
     * AngularJS directive for the @see:Sheet object.
     *
     * The <b>wj-sheet</b> directive must be contained in a @see:WjFlexSheet directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>name</dt>               <dd><code>@</code> The name of the sheet. 
     *   <dt>row-count</dt>          <dd><code>@</code> The initial number of rows in the unbound sheet.
     *                               Changes done to this attribute have no effect after the @see:Sheet was initialized by AngularJS.
     *   <dt>column-count</dt>       <dd><code>@</code> The initial number of columns in the unbound sheet.
     *                               Changes done to this attribute have no effect after the @see:Sheet was initialized by AngularJS.
     *   <dt>items-source</dt>       <dd><code>=</code> The data source for the data bound sheet.
     *                               Changes done to this attribute have no effect after the @see:Sheet was initialized by AngularJS.
     *   <dt>visible</dt>            <dd><code>@</code> A value indicating whether the sheet is visible.
     *   <dt>name-changed</dt>       <dd><code>&</code> Handler for the @see:Sheet.nameChanged event.</dd>
     * </dl>
     */
    class WjSheet extends WjDirective {
        constructor() {
            super();
            this.require = '^wjFlexSheet';
        }

        get _controlConstructor() {
            return wijmo.grid.sheet.Sheet;
        }

        _createLink(): WjLink {
            return new WjSheetLink();
        }
    }

    class WjSheetLink extends WjLink {
        _initControl(): any {
            var sheet = <wijmo.grid.sheet.Sheet>super._initControl(),
                scope = this.scope,
                flexSheet = <wijmo.grid.sheet.FlexSheet>this.parent.control;

            sheet.name = scope['name'];
            if (scope['itemsSource']) {
                sheet.itemsSource = scope['itemsSource'];
            } else {
                sheet.rowCount = +scope['rowCount'];
                sheet.columnCount = +scope['columnCount'];
            }
            flexSheet.sheets.push(sheet);

            sheet.selectionRanges.push(flexSheet.selection);

            return sheet;
        }
    }

    /**
     * AngularJS directive for the @see:MultiRow control.
     *
     * Use the <b>wj-multi-row</b> directive to add <b>MultiRow</b> controls to your AngularJS applications.
     * Note that directive and parameter names must be formatted as lower-case with dashes 
     * instead of camel-case.
     * 
     * The <b>wj-multi-row</b> directive extends @see:WjFlexGrid with the following attributes:
     * 
     * <dl class="dl-horizontal">
     *   <dt>control</dt>                    <dd><code>=</code> A reference to the @see:MultiRow control created by this directive.</dd>
     *   <dt>layout-definition</dt>          <dd><code>@</code> A value defines the layout of the rows used to display each data item.</dd>
     *   <dt>collapsed-headers</dt>          <dd><code>@</code> Gets or sets a value that determines whether column headers should be
     *                                       collapsed and displayed as a single row displaying the group headers.</dd>
     *   <dt>center-headers-vertically</dt>  <dd><code>@</code> Gets or sets a value that determines whether the content of cells
     *                                       that span multiple rows should be vertically centered.</dd>
     *   <dt>show-header-collapse-button</dt><dd><code>@</code> Gets or sets a value that determines whether the grid should
     *                                       display a button in the column header panel to allow users to collapse and expand the column headers.</dd>
     * </dl>
     */
    class WjMultiRow extends WjFlexGrid {
        constructor($compile: ng.ICompileService, $interpolate: ng.IInterpolateService) {
            super($compile, $interpolate);
        }

        // Gets the Wijmo MultiRow control constructor
        get _controlConstructor() {
            return wijmo.grid.multirow.MultiRow;
        }
    }

    //#endregion "Grid directives classes"
}