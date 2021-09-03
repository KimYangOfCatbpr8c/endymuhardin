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
        // globalization
        wijmo.culture.olap = wijmo.culture.olap || {};
        wijmo.culture.olap.PivotPanel = {
            fields: 'Choose fields to add to report',
            drag: 'Drag fields between areas below:',
            filters: 'Filters',
            cols: 'Columns',
            rows: 'Rows',
            vals: 'Values',
            defer: 'Defer Updates',
            update: 'Update'
        };
        /**
         * Provides a user interface for interactively transforming regular data tables into Olap
         * pivot tables.
         *
         * Olap pivot tables group data into one or more dimensions. The dimensions are represented
         * by rows and columns on a grid, and the summarized data is stored in the grid cells.
         *
         * Use the @see:itemsSource property to set the source data, and the @see:pivotView
         * property to get the output table containing the summarized data.
         */
        var PivotPanel = (function (_super) {
            __extends(PivotPanel, _super);
            /**
             * Initializes a new instance of the @see:PivotPanel class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function PivotPanel(element, options) {
                var _this = this;
                _super.call(this, element, null, true);
                /**
                 * Occurs after the value of the @see:itemsSource property changes.
                 */
                this.itemsSourceChanged = new wijmo.Event();
                /**
                 * Occurs after the view definition changes.
                 */
                this.viewDefinitionChanged = new wijmo.Event();
                /**
                 * Occurs when the engine starts updating the @see:pivotView list.
                 */
                this.updatingView = new wijmo.Event();
                /**
                 * Occurs after the engine has finished updating the @see:pivotView list.
                 */
                this.updatedView = new wijmo.Event();
                // check dependencies
                var depErr = 'Missing dependency: PivotPanel requires ';
                wijmo.assert(wijmo.input != null, depErr + 'wijmo.input.');
                wijmo.assert(wijmo.grid != null && wijmo.grid.filter != null, depErr + 'wijmo.grid.filter.');
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-content wj-pivotpanel', tpl, {
                    _dFields: 'd-fields',
                    _dFilters: 'd-filters',
                    _dRows: 'd-rows',
                    _dCols: 'd-cols',
                    _dVals: 'd-vals',
                    _dProgress: 'd-prog',
                    _btnUpdate: 'btn-update',
                    _chkDefer: 'chk-defer',
                    _gFlds: 'g-flds',
                    _gDrag: 'g-drag',
                    _gFlt: 'g-flt',
                    _gCols: 'g-cols',
                    _gRows: 'g-rows',
                    _gVals: 'g-vals',
                    _gDefer: 'g-defer'
                });
                // globalization
                this._globalize();
                // connect drag/drop event handlers
                this._dragstartBnd = this._dragstart.bind(this);
                this._dragoverBnd = this._dragover.bind(this);
                this._dropBnd = this._drop.bind(this);
                this._dragendBnd = this._dragend.bind(this);
                // create child controls
                this._lbFields = this._createFieldListBox(this._dFields);
                this._lbFilters = this._createFieldListBox(this._dFilters);
                this._lbRows = this._createFieldListBox(this._dRows);
                this._lbCols = this._createFieldListBox(this._dCols);
                this._lbVals = this._createFieldListBox(this._dVals);
                // add context menus to the controls
                var ctx = this._ctxMenuShort = new olap._ListContextMenu(false);
                ctx.attach(this._lbFields);
                ctx = this._ctxMenuFull = new olap._ListContextMenu(true);
                ctx.attach(this._lbFilters);
                ctx.attach(this._lbRows);
                ctx.attach(this._lbCols);
                ctx.attach(this._lbVals);
                // add checkboxes to main field list
                this._lbFields.checkedMemberPath = 'isActive';
                // create target indicator element
                this._dMarker = wijmo.createElement('<div class="wj-marker" style="display:none">&nbsp;</div>');
                this.hostElement.appendChild(this._dMarker);
                // handle defer update/update buttons
                this.addEventListener(this._btnUpdate, 'click', function (e) {
                    _this._ng.refresh(true);
                    e.preventDefault();
                });
                this.addEventListener(this._chkDefer, 'click', function (e) {
                    wijmo.enable(_this._btnUpdate, _this._chkDefer.checked);
                    if (_this._chkDefer.checked) {
                        _this._ng.beginUpdate();
                    }
                    else {
                        _this._ng.endUpdate();
                    }
                });
                // create default engine
                this.engine = new olap.PivotEngine();
                // apply options
                this.initialize(options);
            }
            Object.defineProperty(PivotPanel.prototype, "engine", {
                // ** object model
                /**
                 * Gets or sets the @see:PivotEngine being controlled by this @see:PivotPanel.
                 */
                get: function () {
                    return this._ng;
                },
                set: function (value) {
                    // remove old handlers
                    if (this._ng) {
                        this._ng.itemsSourceChanged.removeHandler(this._itemsSourceChanged);
                        this._ng.viewDefinitionChanged.removeHandler(this._viewDefinitionChanged);
                        this._ng.updatingView.removeHandler(this._updatingView);
                        this._ng.updatedView.removeHandler(this._updatedView);
                    }
                    // save the new value
                    value = wijmo.asType(value, olap.PivotEngine, false);
                    this._ng = value;
                    // add new handlers
                    this._ng.itemsSourceChanged.addHandler(this._itemsSourceChanged, this);
                    this._ng.viewDefinitionChanged.addHandler(this._viewDefinitionChanged, this);
                    this._ng.updatingView.addHandler(this._updatingView, this);
                    this._ng.updatedView.addHandler(this._updatedView, this);
                    // update listbox sources
                    this._lbFields.itemsSource = value.fields;
                    this._lbFilters.itemsSource = value.filterFields;
                    this._lbRows.itemsSource = value.rowFields;
                    this._lbCols.itemsSource = value.columnFields;
                    this._lbVals.itemsSource = value.valueFields;
                    // hide field copies in fields list
                    this._lbFields.collectionView.filter = function (item) {
                        return item.parentField == null;
                    };
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "itemsSource", {
                /**
                 * Gets or sets the array or @see:ICollectionView that contains the raw data.
                 */
                get: function () {
                    return this._ng.itemsSource;
                },
                set: function (value) {
                    this._ng.itemsSource = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "collectionView", {
                /**
                 * Gets the @see:ICollectionView that contains the raw data.
                 */
                get: function () {
                    return this._ng.collectionView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "pivotView", {
                /**
                 * Gets the @see:ICollectionView containing the output pivot view.
                 */
                get: function () {
                    return this._ng.pivotView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "autoGenerateFields", {
                /**
                 * Gets or sets a value that determines whether the engine should populate
                 * the @see:fields collection automatically based on the @see:itemsSource.
                 */
                get: function () {
                    return this.engine.autoGenerateFields;
                },
                set: function (value) {
                    this._ng.autoGenerateFields = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "fields", {
                /**
                 * Gets the list of fields available for building views.
                 */
                get: function () {
                    return this._ng.fields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "rowFields", {
                /**
                 * Gets the list of fields that define the rows in the output table.
                 */
                get: function () {
                    return this._ng.rowFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "columnFields", {
                /**
                 * Gets the list of fields that define the columns in the output table.
                 */
                get: function () {
                    return this._ng.columnFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "valueFields", {
                /**
                 * Gets the list of fields that define the values shown in the output table.
                 */
                get: function () {
                    return this._ng.valueFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "filterFields", {
                /**
                 * Gets the list of fields that define filters applied while generating the output table.
                 */
                get: function () {
                    return this._ng.filterFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "viewDefinition", {
                /**
                 * Gets or sets the current pivot view definition as a JSON string.
                 *
                 * This property is typically used to persist the current view as
                 * an application setting.
                 *
                 * For example, the code below implements two functions that save
                 * and load view definitions using local storage:
                 *
                 * <pre>// save/load views
                 * function saveView() {
                 *   localStorage.viewDefinition = pivotPanel.viewDefinition;
                 * }
                 * function loadView() {
                 *   pivotPanel.viewDefinition = localStorage.viewDefinition;
                 * }</pre>
                 */
                get: function () {
                    return this._ng.viewDefinition;
                },
                set: function (value) {
                    this._ng.viewDefinition = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "isViewDefined", {
                /**
                 * Gets a value that determines whether a pivot view is currently defined.
                 *
                 * A pivot view is defined if the @see:valueFields list is not empty and
                 * either the @see:rowFields or @see:columnFields lists are not empty.
                 */
                get: function () {
                    return this._ng.isViewDefined;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:itemsSourceChanged event.
             */
            PivotPanel.prototype.onItemsSourceChanged = function (e) {
                this.itemsSourceChanged.raise(this, e);
            };
            /**
             * Raises the @see:viewDefinitionChanged event.
             */
            PivotPanel.prototype.onViewDefinitionChanged = function (e) {
                this.viewDefinitionChanged.raise(this, e);
            };
            /**
             * Raises the @see:updatingView event.
             *
             * @param e @see:ProgressEventArgs that provides the event data.
             */
            PivotPanel.prototype.onUpdatingView = function (e) {
                this.updatingView.raise(this, e);
            };
            /**
             * Raises the @see:updatedView event.
             */
            PivotPanel.prototype.onUpdatedView = function (e) {
                this.updatedView.raise(this, e);
            };
            // ** overrides
            // refresh field lists and culture strings when refreshing the control
            PivotPanel.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this._lbFields.refresh();
                this._lbFilters.refresh();
                this._lbRows.refresh();
                this._lbCols.refresh();
                this._lbVals.refresh();
                if (fullUpdate) {
                    this._globalize();
                    this._ctxMenuShort.refresh();
                    this._ctxMenuFull.refresh();
                }
                _super.prototype.refresh.call(this, fullUpdate);
            };
            // ** implementation
            // apply/refresh culture-specific strings
            PivotPanel.prototype._globalize = function () {
                var g = wijmo.culture.olap.PivotPanel;
                this._gFlds.textContent = g.fields;
                this._gDrag.textContent = g.drag;
                this._gFlt.textContent = g.filters;
                this._gCols.textContent = g.cols;
                this._gRows.textContent = g.rows;
                this._gVals.textContent = g.vals;
                this._gDefer.textContent = g.defer;
                this._btnUpdate.textContent = g.update;
            };
            // handle and forward events raised by the engine
            PivotPanel.prototype._itemsSourceChanged = function (s, e) {
                this.onItemsSourceChanged(e);
            };
            PivotPanel.prototype._viewDefinitionChanged = function (s, e) {
                if (!s.isUpdating) {
                    this.invalidate();
                    this.onViewDefinitionChanged(e);
                }
            };
            PivotPanel.prototype._updatingView = function (s, e) {
                var pct = e.progress % 100;
                this._dProgress.style.width = pct + '%';
                this.onUpdatingView(e);
            };
            PivotPanel.prototype._updatedView = function (s, e) {
                this.onUpdatedView(e);
            };
            // create a listbox for showing olap fields (draggable)
            PivotPanel.prototype._createFieldListBox = function (host) {
                var _this = this;
                // create the listbox
                var lb = new wijmo.input.ListBox(host);
                // show field headers
                lb.displayMemberPath = 'header';
                // make items draggable, show filter indicator
                lb.formatItem.addHandler(function (s, e) {
                    e.item.setAttribute('draggable', 'true');
                    var fld = e.data;
                    wijmo.assert(e.data instanceof olap.PivotField, 'expecting a PivotField here...');
                    if (s == _this._lbVals) {
                        e.item.innerHTML += ' <span class="wj-aggregate">(' + wijmo.Aggregate[fld.aggregate] + ')</span>';
                    }
                    if (fld.filter.isActive) {
                        e.item.innerHTML += '&nbsp;&nbsp;<span class="wj-glyph-filter"></span>';
                    }
                });
                // make items draggable
                this.addEventListener(host, 'dragstart', this._dragstartBnd);
                this.addEventListener(host, 'dragover', this._dragoverBnd);
                this.addEventListener(host, 'dragleave', this._dragoverBnd);
                this.addEventListener(host, 'drop', this._dropBnd);
                this.addEventListener(host, 'dragend', this._dragendBnd);
                // return the listbox
                return lb;
            };
            // drag/drop event handlers
            PivotPanel.prototype._dragstart = function (e) {
                var target = this._getListBoxTarget(e);
                if (target) {
                    // select field under the mouse, save drag source
                    this._dragSource = null;
                    var host = target.hostElement;
                    for (var i = 0; i < host.children.length; i++) {
                        if (wijmo.contains(host.children[i], e.target)) {
                            target.selectedIndex = i;
                            this._dragSource = host;
                            break;
                        }
                    }
                    // start drag operation
                    if (this._dragSource && e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'copyMove';
                        e.dataTransfer.setData('text', '');
                        e.stopPropagation();
                    }
                    else {
                        e.preventDefault();
                    }
                }
            };
            PivotPanel.prototype._dragover = function (e) {
                var target = this._getListBoxTarget(e);
                if (target) {
                    // check whether the move is valid
                    var valid = false;
                    // dragging from main list to view (valid if the target does not contain the item)
                    if (this._dragSource == this._dFields && target != this._lbFields) {
                        // check that the target is not full
                        if (target.itemsSource.maxItems == null || target.itemsSource.length < target.itemsSource.maxItems) {
                            // check that the target does not contain the item (or is the values list)
                            var srcList = wijmo.Control.getControl(this._dragSource), field = srcList.selectedItem;
                            if (target == this._lbVals || target.itemsSource.indexOf(field) < 0) {
                                valid = true;
                            }
                        }
                    }
                    // dragging view to main list (to delete the field) or within view lists
                    if (this._dragSource && this._dragSource != this._dFields) {
                        valid = true;
                    }
                    // if valid, prevent default to allow drop
                    if (valid) {
                        e.dataTransfer.dropEffect = this._dragSource == this._dFields ? 'copy' : 'move';
                        e.preventDefault();
                        this._showDragMarker(e);
                    }
                    else {
                        this._showDragMarker(null);
                    }
                }
            };
            PivotPanel.prototype._drop = function (e) {
                var _this = this;
                // perform drop operation
                var target = this._getListBoxTarget(e);
                if (target) {
                    var srcList = wijmo.Control.getControl(this._dragSource), fld = (srcList ? srcList.selectedItem : null), items = target.itemsSource;
                    if (fld) {
                        // if dragging a duplicate from main list to value list, 
                        // make a clone, add it do the main list, and continue as usual
                        if (srcList == this._lbFields && target == this._lbVals) {
                            if (target.itemsSource.indexOf(fld) > -1) {
                                fld = fld._clone();
                                this.engine.fields.push(fld);
                            }
                        }
                        // if the target is the main list, remove from source
                        // otherwise, add to or re-position field in target list
                        if (target == this._lbFields) {
                            fld.isActive = false;
                        }
                        else {
                            this._ng.deferUpdate(function () {
                                var index = items.indexOf(fld);
                                if (index != _this._dropIndex) {
                                    if (index > -1) {
                                        items.removeAt(index);
                                        if (index < _this._dropIndex) {
                                            _this._dropIndex--;
                                        }
                                    }
                                    items.insert(_this._dropIndex, fld);
                                }
                            });
                        }
                    }
                }
                // always reset the mouse state when done
                this._resetMouseState();
            };
            PivotPanel.prototype._dragend = function (e) {
                this._resetMouseState();
            };
            // reset the mouse state after a drag operation
            PivotPanel.prototype._resetMouseState = function () {
                this._dragSource = null;
                this._showDragMarker(null);
            };
            // gets the listbox that contains the target of a drag event
            PivotPanel.prototype._getListBoxTarget = function (e) {
                for (var el = e.target; el; el = el.parentElement) {
                    var lb = wijmo.Control.getControl(el);
                    if (lb instanceof wijmo.input.ListBox) {
                        return lb;
                    }
                }
                return null;
            };
            // show the drag/drop marker
            PivotPanel.prototype._showDragMarker = function (e) {
                var rc, target, item;
                if (e) {
                    // get item at the mouse (listbox item or listbox itself)
                    target = document.elementFromPoint(e.clientX, e.clientY);
                    item = target;
                    while (item && !wijmo.hasClass(item, 'wj-listbox-item')) {
                        item = item.parentElement;
                    }
                    if (!item && wijmo.hasClass(target, 'wj-listbox')) {
                        var last = target.lastElementChild;
                        if (wijmo.hasClass(last, 'wj-listbox-item')) {
                            item = last;
                        }
                    }
                    // get marker position
                    rc = item ? item.getBoundingClientRect() :
                        wijmo.hasClass(target, 'wj-listbox') ? target.getBoundingClientRect() :
                            null;
                }
                // update marker
                if (rc) {
                    // calculate drop position/index
                    var top = rc.top;
                    this._dropIndex = 0;
                    if (item) {
                        var items = item.parentElement.children;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i] == item) {
                                this._dropIndex = i;
                                if (e.clientY > rc.top + rc.height / 2) {
                                    top = rc.bottom;
                                    this._dropIndex++;
                                }
                                break;
                            }
                        }
                    }
                    // show the drop marker
                    var rcHost = this.hostElement.getBoundingClientRect();
                    wijmo.setCss(this._dMarker, {
                        left: Math.round(rc.left - rcHost.left),
                        top: Math.round(top - rcHost.top - 2),
                        width: Math.round(rc.width),
                        height: 4,
                        display: ''
                    });
                }
                else {
                    // hide the drop marker
                    this._dMarker.style.display = 'none';
                }
            };
            /**
             * Gets or sets the template used to instantiate @see:PivotPanel controls.
             */
            PivotPanel.controlTemplate = '<div>' +
                // fields
                '<label wj-part="g-flds">Choose fields to add to report</label>' +
                '<div wj-part="d-fields"></div>' +
                // drag/drop area
                '<label wj-part="g-drag">Drag fields between areas below:</label>' +
                '<table>' +
                '<tr>' +
                '<td width="50%">' +
                '<label><span class="wj-glyph wj-glyph-filter"></span> <span wj-part="g-flt">Filters</span></label>' +
                '<div wj-part="d-filters"></div>' +
                '</td>' +
                '<td width= "50%" style= "border-left-style:solid">' +
                '<label><span class="wj-glyph">&#10996;</span> <span wj-part="g-cols">Columns</span></label>' +
                '<div wj-part="d-cols"></div>' +
                '</td>' +
                '</tr>' +
                '<tr style= "border-top-style:solid">' +
                '<td width="50%">' +
                '<label><span class="wj-glyph">&#8801;</span> <span wj-part="g-rows">Rows</span></label>' +
                '<div wj-part="d-rows"></div>' +
                '</td>' +
                '<td width= "50%" style= "border-left-style:solid">' +
                '<label><span class="wj-glyph">&#931;</span> <span wj-part="g-vals">Values</span></label>' +
                '<div wj-part="d-vals"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                // progress indicator
                '<div wj-part="d-prog" class="wj-state-selected" style="width:0px;height:3px"></div>' +
                // update panel
                '<div style="display:table">' +
                '<label style="display:table-cell;vertical-align:middle">' +
                '<input wj-part="chk-defer" type="checkbox"/> <span wj-part="g-defer">Defer Updates</span>' +
                '</label>' +
                '<a wj-part="btn-update" href="" draggable="false" disabled class="wj-state-disabled">Update</a>' +
                '</div>' +
                '</div>';
            return PivotPanel;
        }(wijmo.Control));
        olap.PivotPanel = PivotPanel;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotPanel.js.map