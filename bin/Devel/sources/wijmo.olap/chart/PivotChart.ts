module wijmo.olap {
    'use strict';

    // globalization
    wijmo.culture.olap = wijmo.culture.olap || {};
    wijmo.culture.olap.PivotChart = {
        by: 'by',
        and: 'and'
    }

    /**
     * Specifies constants that define the chart type.
     */
    export enum PivotChartType {
        /** Shows vertical bars and allows you to compare values of items across categories. */
        Column,
        /** Shows horizontal bars. */
        Bar,
        /** Shows patterns within the data using X and Y coordinates. */
        Scatter,
        /** Shows trends over a period of time or across categories. */
        Line,
        /** Shows line chart with the area below the line filled with color. */
        Area,
        /** Shows pie chart. */
        Pie
    }
    /**
     * Provides visual representations of @see:wijmo.olap pivot tables.
     *
     * To use the control, set its @see:itemsSource property to an instance of a 
     * @see:PivotPanel control or to a @see:PivotEngine.
     */
    export class PivotChart extends Control {

        static MAX_SERIES = 100;
        static MAX_POINTS = 100;
        static HRHAXISCSS = 'wj-hierarchicalaxes-line';

        private _ng: PivotEngine;
        private _chartType: PivotChartType = PivotChartType.Column;
        private _showHierarchicalAxes: boolean = true;
        private _showTotals: boolean = false;
        private _maxSeries: number = PivotChart.MAX_SERIES;
        private _maxPoints: number = PivotChart.MAX_POINTS;
        private _stacking: chart.Stacking = chart.Stacking.None;

        private _itemsSource: any;
        private _flexChart: chart.FlexChart;
        private _flexPie: chart.FlexPie;
        private _colMenu: input.Menu;

        private _colItms = [];
        private _dataItms = [];
        private _lblsSrc = [];
        private _grpLblsSrc = [];

        /**
         * Initializes a new instance of the @see:PivotChart class.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);

            // add class name to enable styling
            addClass(this.hostElement, 'wj-pivotchart');

            // add flex chart & flex pie
            if (!this._isPieChart()) {
                this._createFlexChart();
            } else {
                this._createFlexPie();
            }
            super.initialize(options);
        }

        /**
         * Gets a reference to the @see:PivotEngine that owns this @see:PivotChart.
         */
        get engine(): PivotEngine {
            return this._ng;
        }
        /**
         * Gets or sets the @see:PivotEngine or @see:PivotPanel that provides data 
         * for this @see:PivotChart.
         */
        get itemsSource(): any {
            return this._itemsSource;
        }
        set itemsSource(value: any) {
            if (value && this._itemsSource !== value) {
                var oldVal = this._itemsSource;
                if (value instanceof PivotPanel) {
                    value = (<PivotPanel>value).engine.pivotView;
                } else if (value instanceof PivotEngine) {
                    value = (<PivotEngine>value).pivotView;
                }
                this._itemsSource = asCollectionView(value);
                this._onItemsSourceChanged(oldVal);
            }
        }
        /**
         * Gets or sets the type of chart to create.
         */
        get chartType(): PivotChartType {
            return this._chartType;
        }
        set chartType(value: PivotChartType) {
            if (value != this._chartType) {
                this._chartType = asEnum(value, PivotChartType);
                this._changeChartType();
            }
        }
        /**
         * Gets or sets a value that determines whether the chart should group axis 
         * annotations for grouped data.
         */
        get showHierarchicalAxes(): boolean {
            return this._showHierarchicalAxes;
        }
        set showHierarchicalAxes(value: boolean) {
            if (value != this._showHierarchicalAxes) {
                this._showHierarchicalAxes = asBoolean(value, true);
                if (!this._isPieChart() && this._flexChart) {
                    this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                }
            }
        }
        /**
         * Gets or sets a value that determines whether the chart should include only totals.
         */
        get showTotals(): boolean {
            return this._showTotals;
        }
        set showTotals(value: boolean) {
            if (value != this._showTotals) {
                this._showTotals = asBoolean(value, true);
                this._updatedPivotChart();
            }
        }
        /**
         * Gets or sets a value that determines whether and how the series objects are stacked.
         */
        get stacking(): chart.Stacking {
            return this._stacking;
        }
        set stacking(value: chart.Stacking) {
            if (value != this._stacking) {
                this._stacking = asEnum(value, chart.Stacking);
                if (this._flexChart) {
                    this._flexChart.stacking = this._stacking;
                    this.refresh();
                }
            }
        }
        /**
         * Gets or sets the maximum number of data series to be shown in the chart.
         */
        get maxSeries(): number {
            return this._maxSeries;
        }
        set maxSeries(value: number) {
            if (value != this._maxSeries) {
                this._maxSeries = asNumber(value);
                this._updatedPivotChart();
            }
        }
        /**
         * Gets or sets the maximum number of points to be shown in each series.
         */
        get maxPoints(): number {
            return this._maxPoints;
        }
        set maxPoints(value: number) {
            if (value != this._maxPoints) {
                this._maxPoints = asNumber(value);
                this._updatedPivotChart();
            }
        }
        /**
         * Gets a reference to the inner <b>FlexChart</b> control.
         */
        get flexChart(): chart.FlexChart {
            return this._flexChart;
        }
        /**
         * Gets a reference to the inner <b>FlexPie</b> control.
         */
        get flexPie(): chart.FlexPie {
            return this._flexPie;
        }
        /**
         * Refreshes the control.
         *
         * @param fullUpdate Whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {
            super.refresh(fullUpdate); // always call the base class
            if (this._isPieChart()) {
                if (this._flexPie) {
                    this._flexPie.refresh(fullUpdate);
                }
            } else {
                if (this._flexChart) {
                    this._flexChart.refresh(fullUpdate);
                }
            }
        }

        // ** implementation

        // occur when items source changed
        private _onItemsSourceChanged(oldItemsSource?) {

            // disconnect old engine
            if (this._ng) {
                this._ng.updatedView.removeHandler(this._updatedPivotChart, this);
            }
            if (oldItemsSource) {
                (<PivotCollectionView>oldItemsSource).collectionChanged.removeHandler(this._updatedPivotChart, this);
            }

            // get new engine
            var cv = this._itemsSource;
            this._ng = cv instanceof PivotCollectionView
                ? (<PivotCollectionView>cv).engine
                : null;
            // connect new engine
            if (this._ng) {
                this._ng.updatedView.addHandler(this._updatedPivotChart, this);
            }
            if (this._itemsSource) {
                (<PivotCollectionView>this._itemsSource).collectionChanged.addHandler(this._updatedPivotChart, this);
            }

            this._updatedPivotChart();
        }

        // create flex chart
        private _createFlexChart() {
            var hostEle = document.createElement('div');
            this.hostElement.appendChild(hostEle);
            this._flexChart = new wijmo.chart.FlexChart(hostEle);
            this._flexChart.legend.position = chart.Position.Right;
            this._flexChart.bindingX = _PivotKey._ROW_KEY_NAME;
            this._flexChart.stacking = this._stacking;
            this._flexChart.tooltip.content = (ht) => {
                return '<b>' + ht.name + '</b> ' + '<br/>' + this._getLabel(ht.x) + ' ' + ht._yfmt;
            }
            this._flexChart.hostElement.style.visibility = 'hidden';
        }

        // create flex pie
        private _createFlexPie() {
            var menuHost = document.createElement('div');
            this.hostElement.appendChild(menuHost);
            this._colMenu = new wijmo.input.Menu(menuHost);
            this._colMenu.displayMemberPath = 'text';
            this._colMenu.selectedValuePath = 'prop';
            this._colMenu.hostElement.style.visibility = 'hidden';

            var hostEle = document.createElement('div');
            this.hostElement.appendChild(hostEle);
            this._flexPie = new wijmo.chart.FlexPie(hostEle);
            this._flexPie.bindingName = _PivotKey._ROW_KEY_NAME;
            this._flexPie.tooltip.content = (ht) => {
                return '<b>' + this._getLabel(this._dataItms[ht.pointIndex][_PivotKey._ROW_KEY_NAME]) + '</b> ' + '<br/>' + ht._yfmt;
            }
            this._flexPie.rendered.addHandler(this._updatePieInfo, this);
        }

        // update chart
        private _updatedPivotChart() {
            var view, rowFields,
                dataItms = [], lblsSrc = [], grpLblsSrc = [],
                lastLabelIndex = 0, rowKey, lastRowKey, itm,
                offsetWidth, mergeIndex, grpLbl;

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
                if (!this._isTotalRow(itm[_PivotKey._ROW_KEY_NAME])) {                  
                    dataItms.push(itm);
                    //organize the axis label data source
                    //1. _groupAnnotations  = false;
                    lblsSrc.push({ value: dataItms.length - 1, text: this._getLabel(itm[_PivotKey._ROW_KEY_NAME]) });
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
                        } else {
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
        }

        private _updateFlexChartOrPie() {
            var isPie = this._isPieChart();
            if (!isPie && this._flexChart) {
                // update FlexChart
                this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
            } else if (isPie && this._flexPie) {
                // update FlexPie
                this._updateFlexPie(this._dataItms, this._lblsSrc);
            }
        }

        // update FlexChart
        private _updateFlexChart(dataItms: any, labelsSource: any, grpLblsSrc: any) {

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
            } else {
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
                } else {
                    chart.axisY.labelAngle = undefined;
                    chart.axisY.itemsSource = labelsSource;
                }
                chart.axisX.itemsSource = undefined;
            } else {
                if (this._showHierarchicalAxes) {
                    chart.axisX.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                    if (grpLblsSrc.length >= 2) {       
                        for (var i = grpLblsSrc.length - 2; i >= 0; i--) {
                            this._createGroupAxes(grpLblsSrc[i]);
                        }
                    }
                } else {
                    chart.axisX.labelAngle = undefined;                    
                    chart.axisX.itemsSource = labelsSource;
                }
                chart.axisY.itemsSource = undefined;
            }
            chart.axisX.labelPadding = 6;
            chart.axisY.labelPadding = 6;
            if (this._ng.valueFields.length > 0 && this._ng.valueFields[0].format) {
                chart.axisY.format = this._ng.valueFields[0].format;
            } else {
                chart.axisY.format = '';
            }
            chart.endUpdate();
        }

        // update FlexPie
        private _updateFlexPie(dataItms: any, labelsSource: any) {
            var pie, colMenu, headerPrefix, host;
            if (!this._ng || !this._flexPie) {
                return;
            }
            pie = this._flexPie;
            host = pie.hostElement;
            colMenu = this._colMenu;

            if (this._colItms.length > 0 &&
                dataItms.length > 0 ) {
                host.style.visibility = 'visible';
            } else {
                host.style.visibility = 'hidden';
            }

            pie.beginUpdate();
            //updating pie: binding the first column
            pie.itemsSource = dataItms;
            pie.bindingName = _PivotKey._ROW_KEY_NAME;
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
                    executeCommand: (arg) => {
                        var selectedItem = colMenu.selectedItem;
                        colMenu.header = headerPrefix + selectedItem['text'];
                        pie.binding = selectedItem['prop'];
                    }
                }
                colMenu.selectedIndex = 0;
                colMenu.invalidate();
                colMenu.listBox.invalidate();
            } else {
                colMenu.hostElement.style.visibility = 'hidden';
            }
        }

        // create series
        private _createSeries() {
            var series, seriesCount = 0, colKey, colLbl;

            //clear the series
            if (this._flexChart) {
                this._flexChart.series.length = 0;
            }
            for (var i = 0; i < this._colItms.length; i++) {
                series = new chart.Series();
                series.binding = this._colItms[i]['prop'];
                series.name = this._colItms[i]['text'];
                this._flexChart.series.push(series);
            }
        }

        // get columns from item
        private _getColumns(itm: any) {
            var sersCount = 0, colKey, colLbl;
            if (!itm) {
                return;
            }
            this._colItms.length = 0;
            for (var prop in itm) {
                if (itm.hasOwnProperty(prop)) {
                    if (prop !== _PivotKey._ROW_KEY_NAME && sersCount < this._maxSeries) {
                        if ((this._showTotals && this._isTotalColumn(prop)) || (
                            (!this._showTotals && !this._isTotalColumn(prop)))) {
                            colKey = this._ng._getKey(prop);
                            colLbl = this._getLabel(colKey);
                            this._colItms.push({ prop: prop, text: this._getLabel(colKey) });
                            sersCount++;
                        }
                    }
                }
            }
        }

        // create group axes
        private _createGroupAxes(groups: any) {
            var chart = this._flexChart,
                rawAxis = this._isBarChart() ? chart.axisY : chart.axisX,
                ax;

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
            ax.itemFormatter = (engine, label) => {
                // find group
                var group = groups.filter(function (obj) {
                    return obj.value == label.val;
                })[0];
                // draw custom decoration
                var w, x, x1, x2, y, y1, y2;
                w = 0.5 * group.width;
                if (!this._isBarChart()) {
                    x1 = ax.convert(label.val - w) + 5;
                    x2 = ax.convert(label.val + w) - 5;
                    y = ax._axrect.top;
                    engine.drawLine(x1, y, x2, y, PivotChart.HRHAXISCSS);
                    engine.drawLine(x1, y, x1, y - 5, PivotChart.HRHAXISCSS);
                    engine.drawLine(x2, y, x2, y - 5, PivotChart.HRHAXISCSS);
                    engine.drawLine(label.pos.x, y, label.pos.x, y + 5, PivotChart.HRHAXISCSS);
                } else {
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
            } else {
                series.axisY = ax;
            }
            chart.series.push(series);
        }

        private _updateFlexPieBinding() {
            this._flexPie.binding = this._colMenu.selectedValue;
            this._flexPie.refresh();
        }

        private _updatePieInfo() {
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
        }

        // change chart type
        private _changeChartType() {
            var ct = null;

            if (this.chartType === PivotChartType.Pie) {
                if (!this._flexPie) {
                    this._createFlexPie();
                }
                this._updateFlexPie(this._dataItms, this._lblsSrc);
                this._swapChartAndPie(false);
            } else {
                switch (this.chartType) {
                    case PivotChartType.Column:
                        ct = chart.ChartType.Column;
                        break;
                    case PivotChartType.Bar:
                        ct = chart.ChartType.Bar;
                        break;
                    case PivotChartType.Scatter:
                        ct = chart.ChartType.Scatter;
                        break;
                    case PivotChartType.Line:
                        ct = chart.ChartType.Line;
                        break;
                    case PivotChartType.Area:
                        ct = chart.ChartType.Area;
                        break;
                }
                if (!this._flexChart) {
                    this._createFlexChart();
                    this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                } else {
                    // 1.from pie to flex chart
                    // 2.switch between bar chart and other flex charts
                    // then rebind the chart.
                    if (this._flexChart.hostElement.style.display === 'none' ||
                        ct === PivotChartType.Bar || this._flexChart.chartType === chart.ChartType.Bar) {
                        this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                    }
                }
                this._flexChart.chartType = ct;
                this._swapChartAndPie(true);
            }
        }

        private _swapChartAndPie(chartshow: boolean) {
            if (this._flexChart) {
                this._flexChart.hostElement.style.display = chartshow ? 'block' : 'none';
            }
            if (this._flexPie) {
                this._flexPie.hostElement.style.display = !chartshow ? 'block' : 'none';;
            }
            if (this._colMenu && this._colMenu.hostElement) {
                this._colMenu.hostElement.style.display = chartshow ? 'none' : 'block';
            }
        }

        private _getLabel(key: _PivotKey) {
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
                        if (i > 0) sb += "; ";
                        sb += key.getValue(i, true);
                    }
                    if (this._ng.valueFields.length > 1 &&
                        key.valueFields && key.valueFields.length > 0) {
                        sb += '; ' + key.valueFields[key._valueFieldIndex].header;
                    }
                    break;
            }
            return sb;
        }

        private _getChartTitle() {
            var ng = this._ng,
                value = this._getTitle(ng.valueFields),
                rows = this._getTitle(ng.rowFields),
                cols = this._getTitle(ng.columnFields);

            var title = '';
            if (this._dataItms.length > 0) {
                title = format('{value} {by} {rows}', {
                    value: value,
                    by: culture.olap.PivotChart.by,
                    rows: rows
                });
                if (cols) {
                    title += format(' {and} {cols}', {
                        and: culture.olap.PivotChart.and,
                        cols: cols
                    });
                }
            }
            return title;
        }

        private _getTitle(fields: PivotFieldCollection) {
            var sb = '';
            for (var i = 0; i < fields.length; i++) {
                if (sb.length > 0) sb += '; ';
                sb += fields[i].header;
            }
            return sb;
        }

        private _isTotalColumn(colKey: string): boolean {
            var kVals = colKey.split(';');
            if (kVals && (kVals.length - 2 < this._ng.columnFields.length)) {
                return true;
            }
            return false;
        }

        private _isTotalRow(rowKey: _PivotKey): boolean {
            if (rowKey.values.length < this._ng.rowFields.length) {
                return true;
            }
            return false;
        }

        private _isPieChart(): boolean {
            return this._chartType === PivotChartType.Pie;
        }

        private _isBarChart(): boolean {
            return this._chartType === PivotChartType.Bar;
        }

        private _getMergeIndex(key1: _PivotKey, key2: _PivotKey) {
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
        }

        private _getOffsetWidth(labels: any): number {
            var offsetWidth = 0;
            if (labels.length <= 1) {
                return offsetWidth;
            }
            for (var i = 0; i < labels.length - 1; i++) {
                offsetWidth += labels[i].width;
            }
            return offsetWidth;
        }
    }
}