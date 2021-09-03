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
        wijmo.culture.olap.PivotChart = {
            by: 'by',
            and: 'and'
        };
        /**
         * Specifies constants that define the chart type.
         */
        (function (PivotChartType) {
            /** Shows vertical bars and allows you to compare values of items across categories. */
            PivotChartType[PivotChartType["Column"] = 0] = "Column";
            /** Shows horizontal bars. */
            PivotChartType[PivotChartType["Bar"] = 1] = "Bar";
            /** Shows patterns within the data using X and Y coordinates. */
            PivotChartType[PivotChartType["Scatter"] = 2] = "Scatter";
            /** Shows trends over a period of time or across categories. */
            PivotChartType[PivotChartType["Line"] = 3] = "Line";
            /** Shows line chart with the area below the line filled with color. */
            PivotChartType[PivotChartType["Area"] = 4] = "Area";
            /** Shows pie chart. */
            PivotChartType[PivotChartType["Pie"] = 5] = "Pie";
        })(olap.PivotChartType || (olap.PivotChartType = {}));
        var PivotChartType = olap.PivotChartType;
        /**
         * Provides visual representations of @see:wijmo.olap pivot tables.
         *
         * To use the control, set its @see:itemsSource property to an instance of a
         * @see:PivotPanel control or to a @see:PivotEngine.
         */
        var PivotChart = (function (_super) {
            __extends(PivotChart, _super);
            /**
             * Initializes a new instance of the @see:PivotChart class.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function PivotChart(element, options) {
                _super.call(this, element);
                this._chartType = PivotChartType.Column;
                this._showHierarchicalAxes = true;
                this._showTotals = false;
                this._maxSeries = PivotChart.MAX_SERIES;
                this._maxPoints = PivotChart.MAX_POINTS;
                this._stacking = wijmo.chart.Stacking.None;
                this._colItms = [];
                this._dataItms = [];
                this._lblsSrc = [];
                this._grpLblsSrc = [];
                // add class name to enable styling
                wijmo.addClass(this.hostElement, 'wj-pivotchart');
                // add flex chart & flex pie
                if (!this._isPieChart()) {
                    this._createFlexChart();
                }
                else {
                    this._createFlexPie();
                }
                _super.prototype.initialize.call(this, options);
            }
            Object.defineProperty(PivotChart.prototype, "engine", {
                /**
                 * Gets a reference to the @see:PivotEngine that owns this @see:PivotChart.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "itemsSource", {
                /**
                 * Gets or sets the @see:PivotEngine or @see:PivotPanel that provides data
                 * for this @see:PivotChart.
                 */
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    if (value && this._itemsSource !== value) {
                        var oldVal = this._itemsSource;
                        if (value instanceof olap.PivotPanel) {
                            value = value.engine.pivotView;
                        }
                        else if (value instanceof olap.PivotEngine) {
                            value = value.pivotView;
                        }
                        this._itemsSource = wijmo.asCollectionView(value);
                        this._onItemsSourceChanged(oldVal);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "chartType", {
                /**
                 * Gets or sets the type of chart to create.
                 */
                get: function () {
                    return this._chartType;
                },
                set: function (value) {
                    if (value != this._chartType) {
                        this._chartType = wijmo.asEnum(value, PivotChartType);
                        this._changeChartType();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "showHierarchicalAxes", {
                /**
                 * Gets or sets a value that determines whether the chart should group axis
                 * annotations for grouped data.
                 */
                get: function () {
                    return this._showHierarchicalAxes;
                },
                set: function (value) {
                    if (value != this._showHierarchicalAxes) {
                        this._showHierarchicalAxes = wijmo.asBoolean(value, true);
                        if (!this._isPieChart() && this._flexChart) {
                            this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "showTotals", {
                /**
                 * Gets or sets a value that determines whether the chart should include only totals.
                 */
                get: function () {
                    return this._showTotals;
                },
                set: function (value) {
                    if (value != this._showTotals) {
                        this._showTotals = wijmo.asBoolean(value, true);
                        this._updatedPivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "stacking", {
                /**
                 * Gets or sets a value that determines whether and how the series objects are stacked.
                 */
                get: function () {
                    return this._stacking;
                },
                set: function (value) {
                    if (value != this._stacking) {
                        this._stacking = wijmo.asEnum(value, wijmo.chart.Stacking);
                        if (this._flexChart) {
                            this._flexChart.stacking = this._stacking;
                            this.refresh();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "maxSeries", {
                /**
                 * Gets or sets the maximum number of data series to be shown in the chart.
                 */
                get: function () {
                    return this._maxSeries;
                },
                set: function (value) {
                    if (value != this._maxSeries) {
                        this._maxSeries = wijmo.asNumber(value);
                        this._updatedPivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "maxPoints", {
                /**
                 * Gets or sets the maximum number of points to be shown in each series.
                 */
                get: function () {
                    return this._maxPoints;
                },
                set: function (value) {
                    if (value != this._maxPoints) {
                        this._maxPoints = wijmo.asNumber(value);
                        this._updatedPivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "flexChart", {
                /**
                 * Gets a reference to the inner <b>FlexChart</b> control.
                 */
                get: function () {
                    return this._flexChart;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "flexPie", {
                /**
                 * Gets a reference to the inner <b>FlexPie</b> control.
                 */
                get: function () {
                    return this._flexPie;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Whether to update the control layout as well as the content.
             */
            PivotChart.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate); // always call the base class
                if (this._isPieChart()) {
                    if (this._flexPie) {
                        this._flexPie.refresh(fullUpdate);
                    }
                }
                else {
                    if (this._flexChart) {
                        this._flexChart.refresh(fullUpdate);
                    }
                }
            };
            // ** implementation
            // occur when items source changed
            PivotChart.prototype._onItemsSourceChanged = function (oldItemsSource) {
                // disconnect old engine
                if (this._ng) {
                    this._ng.updatedView.removeHandler(this._updatedPivotChart, this);
                }
                if (oldItemsSource) {
                    oldItemsSource.collectionChanged.removeHandler(this._updatedPivotChart, this);
                }
                // get new engine
                var cv = this._itemsSource;
                this._ng = cv instanceof olap.PivotCollectionView
                    ? cv.engine
                    : null;
                // connect new engine
                if (this._ng) {
                    this._ng.updatedView.addHandler(this._updatedPivotChart, this);
                }
                if (this._itemsSource) {
                    this._itemsSource.collectionChanged.addHandler(this._updatedPivotChart, this);
                }
                this._updatedPivotChart();
            };
            // create flex chart
            PivotChart.prototype._createFlexChart = function () {
                var _this = this;
                var hostEle = document.createElement('div');
                this.hostElement.appendChild(hostEle);
                this._flexChart = new wijmo.chart.FlexChart(hostEle);
                this._flexChart.legend.position = wijmo.chart.Position.Right;
                this._flexChart.bindingX = olap._PivotKey._ROW_KEY_NAME;
                this._flexChart.stacking = this._stacking;
                this._flexChart.tooltip.content = function (ht) {
                    return '<b>' + ht.name + '</b> ' + '<br/>' + _this._getLabel(ht.x) + ' ' + ht._yfmt;
                };
                this._flexChart.hostElement.style.visibility = 'hidden';
            };
            // create flex pie
            PivotChart.prototype._createFlexPie = function () {
                var _this = this;
                var menuHost = document.createElement('div');
                this.hostElement.appendChild(menuHost);
                this._colMenu = new wijmo.input.Menu(menuHost);
                this._colMenu.displayMemberPath = 'text';
                this._colMenu.selectedValuePath = 'prop';
                this._colMenu.hostElement.style.visibility = 'hidden';
                var hostEle = document.createElement('div');
                this.hostElement.appendChild(hostEle);
                this._flexPie = new wijmo.chart.FlexPie(hostEle);
                this._flexPie.bindingName = olap._PivotKey._ROW_KEY_NAME;
                this._flexPie.tooltip.content = function (ht) {
                    return '<b>' + _this._getLabel(_this._dataItms[ht.pointIndex][olap._PivotKey._ROW_KEY_NAME]) + '</b> ' + '<br/>' + ht._yfmt;
                };
                this._flexPie.rendered.addHandler(this._updatePieInfo, this);
            };
            // update chart
            PivotChart.prototype._updatedPivotChart = function () {
                var view, rowFields, dataItms = [], lblsSrc = [], grpLblsSrc = [], lastLabelIndex = 0, rowKey, lastRowKey, itm, offsetWidth, mergeIndex, grpLbl;
                if (!this._ng || !this._ng.pivotView) {
                    return;
                }
                view = this._ng.pivotView;
                rowFields = this._ng.rowFields;
                //prepare data for chart
                for (var i = 0; i < view.items.length; i++) {
                    itm = view.items[i];
                    rowKey = itm.$rowKey;
                    //get columns
                    if (i === 0) {
                        this._getColumns(itm);
                    }
                    //max points
                    if (dataItms.length >= this._maxPoints) {
                        break;
                    }
                    //skip total row
                    if (!this._isTotalRow(itm[olap._PivotKey._ROW_KEY_NAME])) {
                        dataItms.push(itm);
                        //organize the axis label data source
                        //1. _groupAnnotations  = false;
                        lblsSrc.push({ value: dataItms.length - 1, text: this._getLabel(itm[olap._PivotKey._ROW_KEY_NAME]) });
                        //2. _groupAnnotations  = true;
                        for (var j = 0; j < rowFields.length; j++) {
                            if (grpLblsSrc.length <= j) {
                                grpLblsSrc.push([]);
                            }
                            mergeIndex = this._getMergeIndex(rowKey, lastRowKey);
                            if (mergeIndex < j) {
                                // center previous label based on values
                                lastLabelIndex = grpLblsSrc[j].length - 1;
                                grpLbl = grpLblsSrc[j][lastLabelIndex];
                                //first group label
                                if (lastLabelIndex === 0 && j < rowFields.length - 1) {
                                    grpLbl.value = (grpLbl.width - 1) / 2;
                                }
                                if (lastLabelIndex > 0 && j < rowFields.length - 1) {
                                    offsetWidth = this._getOffsetWidth(grpLblsSrc[j]);
                                    grpLbl.value = offsetWidth + (grpLbl.width - 1) / 2;
                                }
                                grpLblsSrc[j].push({ value: dataItms.length - 1, text: rowKey.getValue(j, true), width: 1 });
                            }
                            else {
                                //calculate the width
                                lastLabelIndex = grpLblsSrc[j].length - 1;
                                grpLblsSrc[j][lastLabelIndex].width = grpLblsSrc[j][lastLabelIndex].width + 1;
                            }
                        }
                        lastRowKey = rowKey;
                    }
                    // center last label
                    if (i === view.items.length - 1) {
                        for (var j = 0; j < rowFields.length; j++) {
                            if (j < this._ng.rowFields.length - 1) {
                                var lastIndex = grpLblsSrc[j].length - 1;
                                grpLblsSrc[j][lastIndex].value = this._getOffsetWidth(grpLblsSrc[j]) + (grpLblsSrc[j][lastIndex].width - 1) / 2;
                            }
                        }
                    }
                }
                this._dataItms = dataItms;
                this._lblsSrc = lblsSrc;
                this._grpLblsSrc = grpLblsSrc;
                this._updateFlexChartOrPie();
            };
            PivotChart.prototype._updateFlexChartOrPie = function () {
                var isPie = this._isPieChart();
                if (!isPie && this._flexChart) {
                    // update FlexChart
                    this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                }
                else if (isPie && this._flexPie) {
                    // update FlexPie
                    this._updateFlexPie(this._dataItms, this._lblsSrc);
                }
            };
            // update FlexChart
            PivotChart.prototype._updateFlexChart = function (dataItms, labelsSource, grpLblsSrc) {
                if (!this._ng || !this._flexChart) {
                    return;
                }
                var chart = this._flexChart, host = chart.hostElement;
                chart.beginUpdate();
                chart.itemsSource = dataItms;
                this._createSeries();
                if (chart.series &&
                    chart.series.length > 0 &&
                    dataItms.length > 0) {
                    host.style.visibility = 'visible';
                }
                else {
                    host.style.visibility = 'hidden';
                }
                chart.header = this._getChartTitle();
                if (this._isBarChart()) {
                    if (this._showHierarchicalAxes) {
                        chart.axisY.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                        chart.axisX.labelAngle = undefined;
                        if (grpLblsSrc.length >= 2) {
                            for (var i = grpLblsSrc.length - 2; i >= 0; i--) {
                                this._createGroupAxes(grpLblsSrc[i]);
                            }
                        }
                    }
                    else {
                        chart.axisY.labelAngle = undefined;
                        chart.axisY.itemsSource = labelsSource;
                    }
                    chart.axisX.itemsSource = undefined;
                }
                else {
                    if (this._showHierarchicalAxes) {
                        chart.axisX.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                        if (grpLblsSrc.length >= 2) {
                            for (var i = grpLblsSrc.length - 2; i >= 0; i--) {
                                this._createGroupAxes(grpLblsSrc[i]);
                            }
                        }
                    }
                    else {
                        chart.axisX.labelAngle = undefined;
                        chart.axisX.itemsSource = labelsSource;
                    }
                    chart.axisY.itemsSource = undefined;
                }
                chart.axisX.labelPadding = 6;
                chart.axisY.labelPadding = 6;
                if (this._ng.valueFields.length > 0 && this._ng.valueFields[0].format) {
                    chart.axisY.format = this._ng.valueFields[0].format;
                }
                else {
                    chart.axisY.format = '';
                }
                chart.endUpdate();
            };
            // update FlexPie
            PivotChart.prototype._updateFlexPie = function (dataItms, labelsSource) {
                var pie, colMenu, headerPrefix, host;
                if (!this._ng || !this._flexPie) {
                    return;
                }
                pie = this._flexPie;
                host = pie.hostElement;
                colMenu = this._colMenu;
                if (this._colItms.length > 0 &&
                    dataItms.length > 0) {
                    host.style.visibility = 'visible';
                }
                else {
                    host.style.visibility = 'hidden';
                }
                pie.beginUpdate();
                //updating pie: binding the first column
                pie.itemsSource = dataItms;
                pie.bindingName = olap._PivotKey._ROW_KEY_NAME;
                if (this._colItms && this._colItms.length > 0) {
                    pie.binding = this._colItms[0]['prop'];
                }
                pie.header = this._getChartTitle();
                pie.endUpdate();
                //updating column selection menu
                headerPrefix = this._getTitle(this._ng.columnFields);
                if (headerPrefix !== '') {
                    headerPrefix = '<b>' + headerPrefix + ': </b>';
                }
                if (this._colItms && this._colItms.length > 1 && dataItms.length > 0) {
                    colMenu.hostElement.style.visibility = 'visible';
                    colMenu.header = headerPrefix + this._colItms[0]['text'];
                    colMenu.itemsSource = this._colItms;
                    colMenu.command = {
                        executeCommand: function (arg) {
                            var selectedItem = colMenu.selectedItem;
                            colMenu.header = headerPrefix + selectedItem['text'];
                            pie.binding = selectedItem['prop'];
                        }
                    };
                    colMenu.selectedIndex = 0;
                    colMenu.invalidate();
                    colMenu.listBox.invalidate();
                }
                else {
                    colMenu.hostElement.style.visibility = 'hidden';
                }
            };
            // create series
            PivotChart.prototype._createSeries = function () {
                var series, seriesCount = 0, colKey, colLbl;
                //clear the series
                if (this._flexChart) {
                    this._flexChart.series.length = 0;
                }
                for (var i = 0; i < this._colItms.length; i++) {
                    series = new wijmo.chart.Series();
                    series.binding = this._colItms[i]['prop'];
                    series.name = this._colItms[i]['text'];
                    this._flexChart.series.push(series);
                }
            };
            // get columns from item
            PivotChart.prototype._getColumns = function (itm) {
                var sersCount = 0, colKey, colLbl;
                if (!itm) {
                    return;
                }
                this._colItms.length = 0;
                for (var prop in itm) {
                    if (itm.hasOwnProperty(prop)) {
                        if (prop !== olap._PivotKey._ROW_KEY_NAME && sersCount < this._maxSeries) {
                            if ((this._showTotals && this._isTotalColumn(prop)) || ((!this._showTotals && !this._isTotalColumn(prop)))) {
                                colKey = this._ng._getKey(prop);
                                colLbl = this._getLabel(colKey);
                                this._colItms.push({ prop: prop, text: this._getLabel(colKey) });
                                sersCount++;
                            }
                        }
                    }
                }
            };
            // create group axes
            PivotChart.prototype._createGroupAxes = function (groups) {
                var _this = this;
                var chart = this._flexChart, rawAxis = this._isBarChart() ? chart.axisY : chart.axisX, ax;
                if (!groups) {
                    return;
                }
                // create auxiliary series
                ax = new wijmo.chart.Axis();
                ax.labelAngle = 0;
                ax.labelPadding = 6;
                ax.position = this._isBarChart() ? wijmo.chart.Position.Left : wijmo.chart.Position.Bottom;
                ax.majorTickMarks = wijmo.chart.TickMark.None;
                // set axis data source
                ax.itemsSource = groups;
                // custom item formatting
                ax.itemFormatter = function (engine, label) {
                    // find group
                    var group = groups.filter(function (obj) {
                        return obj.value == label.val;
                    })[0];
                    // draw custom decoration
                    var w, x, x1, x2, y, y1, y2;
                    w = 0.5 * group.width;
                    if (!_this._isBarChart()) {
                        x1 = ax.convert(label.val - w) + 5;
                        x2 = ax.convert(label.val + w) - 5;
                        y = ax._axrect.top;
                        engine.drawLine(x1, y, x2, y, PivotChart.HRHAXISCSS);
                        engine.drawLine(x1, y, x1, y - 5, PivotChart.HRHAXISCSS);
                        engine.drawLine(x2, y, x2, y - 5, PivotChart.HRHAXISCSS);
                        engine.drawLine(label.pos.x, y, label.pos.x, y + 5, PivotChart.HRHAXISCSS);
                    }
                    else {
                        y1 = ax.convert(label.val + w) + 5;
                        y2 = ax.convert(label.val - w) - 5;
                        x = ax._axrect.left + ax._axrect.width - 5;
                        engine.drawLine(x, y1, x, y2, PivotChart.HRHAXISCSS);
                        engine.drawLine(x, y1, x + 5, y1, PivotChart.HRHAXISCSS);
                        engine.drawLine(x, y2, x + 5, y2, PivotChart.HRHAXISCSS);
                        engine.drawLine(x, label.pos.y, x - 5, label.pos.y, PivotChart.HRHAXISCSS);
                    }
                    return label;
                };
                ax.min = rawAxis.actualMin;
                ax.max = rawAxis.actualMax;
                // sync axis limits with main x-axis
                rawAxis.rangeChanged.addHandler(function () {
                    ax.min = rawAxis.actualMin;
                    ax.max = rawAxis.actualMax;
                });
                var series = new wijmo.chart.Series();
                series.visibility = wijmo.chart.SeriesVisibility.Hidden;
                if (!this._isBarChart()) {
                    series.axisX = ax;
                }
                else {
                    series.axisY = ax;
                }
                chart.series.push(series);
            };
            PivotChart.prototype._updateFlexPieBinding = function () {
                this._flexPie.binding = this._colMenu.selectedValue;
                this._flexPie.refresh();
            };
            PivotChart.prototype._updatePieInfo = function () {
                var lgdLbs, hostEle, refRect, box, y;
                if (!this._flexPie) {
                    return;
                }
                // update Pie's legend label
                hostEle = this._flexPie.hostElement;
                lgdLbs = hostEle.querySelectorAll('.wj-legend .wj-label');
                for (var i = 0; i < lgdLbs.length; i++) {
                    lgdLbs[i].textContent = this._lblsSrc[i].text;
                }
                // Thinking of the legend's position is uncertain, so put the column selection menu
                // on left-top corner of FlexPie, removed the original code.           
            };
            // change chart type
            PivotChart.prototype._changeChartType = function () {
                var ct = null;
                if (this.chartType === PivotChartType.Pie) {
                    if (!this._flexPie) {
                        this._createFlexPie();
                    }
                    this._updateFlexPie(this._dataItms, this._lblsSrc);
                    this._swapChartAndPie(false);
                }
                else {
                    switch (this.chartType) {
                        case PivotChartType.Column:
                            ct = wijmo.chart.ChartType.Column;
                            break;
                        case PivotChartType.Bar:
                            ct = wijmo.chart.ChartType.Bar;
                            break;
                        case PivotChartType.Scatter:
                            ct = wijmo.chart.ChartType.Scatter;
                            break;
                        case PivotChartType.Line:
                            ct = wijmo.chart.ChartType.Line;
                            break;
                        case PivotChartType.Area:
                            ct = wijmo.chart.ChartType.Area;
                            break;
                    }
                    if (!this._flexChart) {
                        this._createFlexChart();
                        this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                    }
                    else {
                        // 1.from pie to flex chart
                        // 2.switch between bar chart and other flex charts
                        // then rebind the chart.
                        if (this._flexChart.hostElement.style.display === 'none' ||
                            ct === PivotChartType.Bar || this._flexChart.chartType === wijmo.chart.ChartType.Bar) {
                            this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                        }
                    }
                    this._flexChart.chartType = ct;
                    this._swapChartAndPie(true);
                }
            };
            PivotChart.prototype._swapChartAndPie = function (chartshow) {
                if (this._flexChart) {
                    this._flexChart.hostElement.style.display = chartshow ? 'block' : 'none';
                }
                if (this._flexPie) {
                    this._flexPie.hostElement.style.display = !chartshow ? 'block' : 'none';
                    ;
                }
                if (this._colMenu && this._colMenu.hostElement) {
                    this._colMenu.hostElement.style.display = chartshow ? 'none' : 'block';
                }
            };
            PivotChart.prototype._getLabel = function (key) {
                var sb = '';
                if (!key || !key.values) {
                    return sb;
                }
                switch (key.values.length) {
                    case 0:
                        if (key._valueFields) {
                            sb += key.valueFields[key._valueFieldIndex].header;
                        }
                        break;
                    case 1:
                        sb += key.getValue(0, true);
                        if (this._ng.valueFields.length > 1 &&
                            key.valueFields && key.valueFields.length > 0) {
                            sb += '; ' + key.valueFields[key._valueFieldIndex].header;
                        }
                        break;
                    default:
                        for (var i = 0; i < key.values.length; i++) {
                            if (i > 0)
                                sb += "; ";
                            sb += key.getValue(i, true);
                        }
                        if (this._ng.valueFields.length > 1 &&
                            key.valueFields && key.valueFields.length > 0) {
                            sb += '; ' + key.valueFields[key._valueFieldIndex].header;
                        }
                        break;
                }
                return sb;
            };
            PivotChart.prototype._getChartTitle = function () {
                var ng = this._ng, value = this._getTitle(ng.valueFields), rows = this._getTitle(ng.rowFields), cols = this._getTitle(ng.columnFields);
                var title = '';
                if (this._dataItms.length > 0) {
                    title = wijmo.format('{value} {by} {rows}', {
                        value: value,
                        by: wijmo.culture.olap.PivotChart.by,
                        rows: rows
                    });
                    if (cols) {
                        title += wijmo.format(' {and} {cols}', {
                            and: wijmo.culture.olap.PivotChart.and,
                            cols: cols
                        });
                    }
                }
                return title;
            };
            PivotChart.prototype._getTitle = function (fields) {
                var sb = '';
                for (var i = 0; i < fields.length; i++) {
                    if (sb.length > 0)
                        sb += '; ';
                    sb += fields[i].header;
                }
                return sb;
            };
            PivotChart.prototype._isTotalColumn = function (colKey) {
                var kVals = colKey.split(';');
                if (kVals && (kVals.length - 2 < this._ng.columnFields.length)) {
                    return true;
                }
                return false;
            };
            PivotChart.prototype._isTotalRow = function (rowKey) {
                if (rowKey.values.length < this._ng.rowFields.length) {
                    return true;
                }
                return false;
            };
            PivotChart.prototype._isPieChart = function () {
                return this._chartType === PivotChartType.Pie;
            };
            PivotChart.prototype._isBarChart = function () {
                return this._chartType === PivotChartType.Bar;
            };
            PivotChart.prototype._getMergeIndex = function (key1, key2) {
                var index = -1;
                if (key1 != null && key2 != null && key1.values.length == key2.values.length) {
                    for (var i = 0; i < key1.values.length; i++) {
                        if (key1.values[i] === key2.values[i]) {
                            index = i;
                        }
                        else {
                            return index;
                        }
                    }
                }
                return index;
            };
            PivotChart.prototype._getOffsetWidth = function (labels) {
                var offsetWidth = 0;
                if (labels.length <= 1) {
                    return offsetWidth;
                }
                for (var i = 0; i < labels.length - 1; i++) {
                    offsetWidth += labels[i].width;
                }
                return offsetWidth;
            };
            PivotChart.MAX_SERIES = 100;
            PivotChart.MAX_POINTS = 100;
            PivotChart.HRHAXISCSS = 'wj-hierarchicalaxes-line';
            return PivotChart;
        }(wijmo.Control));
        olap.PivotChart = PivotChart;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotChart.js.map