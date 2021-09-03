var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        // Base abstract class for specific Chart type bindings
        var WjFlexChartBaseBinding = (function (_super) {
            __extends(WjFlexChartBaseBinding, _super);
            function WjFlexChartBaseBinding() {
                _super.apply(this, arguments);
            }
            WjFlexChartBaseBinding.prototype._getControlConstructor = function () {
                return wijmo.chart.FlexChartBase;
            };
            WjFlexChartBaseBinding.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var tooltipDesc = knockout.MetaFactory.findProp('tooltipContent', this._metaData.props);
                tooltipDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue) {
                    if (convertedValue != null) {
                        control.tooltip.content = convertedValue;
                    }
                    return true;
                };
            };
            return WjFlexChartBaseBinding;
        }(knockout.WjBinding));
        knockout.WjFlexChartBaseBinding = WjFlexChartBaseBinding;
        /**
         * KnockoutJS binding for the @see:FlexChart control.
         *
         * Use the @see:wjFlexChart binding to add @see:FlexChart controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a FlexChart control:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data }"&gt;
         *     &lt;div data-bind="wjFlexChartLegend : {
         *         position: 'Top' }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartAxis: {
         *         wjProperty: 'axisX',
         *         title: chartProps.titleX }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartAxis: {
         *         wjProperty: 'axisY',
         *         majorUnit: 5000 }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: {
         *         name: 'Sales',
         *         binding: 'sales' }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: {
         *         name: 'Expenses',
         *         binding: 'expenses' }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: {
         *         name: 'Downloads',
         *         binding: 'downloads',
         *         chartType: 'LineSymbols' }"&gt;
         *     &lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChart</b> binding may contain the following child bindings:
         * @see:wjFlexChartAxis, @see:wjFlexChartSeries, @see:wjFlexChartLegend.
         *
         * The <b>wjFlexChart</b> binding supports all read-write properties and events of
         * the @see:FlexChart control, and the additional <b>tooltipContent</b> property
         * that assigns a value to the <b>FlexChart.tooltip.content</b> property.
         * The <b>selection</b> property provides two-way binding mode.
         */
        var wjFlexChart = (function (_super) {
            __extends(wjFlexChart, _super);
            function wjFlexChart() {
                _super.apply(this, arguments);
            }
            wjFlexChart.prototype._getControlConstructor = function () {
                return wijmo.chart.FlexChart;
            };
            wjFlexChart.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var lblContentDesc = knockout.MetaFactory.findProp('labelContent', this._metaData.props);
                lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue) {
                    if (convertedValue != null) {
                        control.dataLabel.content = convertedValue;
                    }
                    return true;
                };
            };
            return wjFlexChart;
        }(WjFlexChartBaseBinding));
        knockout.wjFlexChart = wjFlexChart;
        /**
         * KnockoutJS binding for the @see:FlexPie control.
         *
         * Use the @see:wjFlexPie binding to add @see:FlexPie controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a FlexPie control:&lt;/p&gt;
         * &lt;div data-bind="wjFlexPie: {
         *         itemsSource: data,
         *         binding: 'value',
         *         bindingName: 'name',
         *         header: 'Fruit By Value' }"&gt;
         *     &lt;div data-bind="wjFlexChartLegend : { position: 'Top' }"&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexPie</b> binding may contain the @see:wjFlexChartLegend child binding.
         *
         * The <b>wjFlexPie</b> binding supports all read-write properties and events of
         * the @see:FlexPie control.
         */
        var wjFlexPie = (function (_super) {
            __extends(wjFlexPie, _super);
            function wjFlexPie() {
                _super.apply(this, arguments);
            }
            wjFlexPie.prototype._getControlConstructor = function () {
                return wijmo.chart.FlexPie;
            };
            wjFlexPie.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var lblContentDesc = knockout.MetaFactory.findProp('labelContent', this._metaData.props);
                lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue) {
                    if (convertedValue != null) {
                        control.dataLabel.content = convertedValue;
                    }
                    return true;
                };
            };
            return wjFlexPie;
        }(WjFlexChartBaseBinding));
        knockout.wjFlexPie = wjFlexPie;
        /**
         * KnockoutJS binding for the @see:FlexChart @see:Axis object.
         *
         * The @see:wjFlexChartAxis binding must be contained in a @see:wjFlexChart binding. Use the <b>wjProperty</b>
         * attribute to specify the property (<b>axisX</b> or <b>axisY</b>) to initialize with this binding.
         *
         * The <b>wjFlexChartAxis</b> binding supports all read-write properties and events of
         * the @see:Axis class.
         */
        var wjFlexChartAxis = (function (_super) {
            __extends(wjFlexChartAxis, _super);
            function wjFlexChartAxis() {
                _super.apply(this, arguments);
            }
            wjFlexChartAxis.prototype._getControlConstructor = function () {
                return wijmo.chart.Axis;
            };
            return wjFlexChartAxis;
        }(knockout.WjBinding));
        knockout.wjFlexChartAxis = wjFlexChartAxis;
        /**
         * KnockoutJS binding for the Charts' @see:Legend object.
         *
         * The @see:wjFlexChartLegend binding must be contained in one the following bindings:
         *  @see:wjFlexChart, @see:wjFlexPie.
         *
         * The <b>wjFlexChartLegend</b> binding supports all read-write properties and events of
         * the @see:Legend class.
         */
        var wjFlexChartLegend = (function (_super) {
            __extends(wjFlexChartLegend, _super);
            function wjFlexChartLegend() {
                _super.apply(this, arguments);
            }
            wjFlexChartLegend.prototype._getControlConstructor = function () {
                return wijmo.chart.Legend;
            };
            return wjFlexChartLegend;
        }(knockout.WjBinding));
        knockout.wjFlexChartLegend = wjFlexChartLegend;
        /**
         * KnockoutJS binding for the @see:FlexChart @see:Series object.
         *
         * The @see:wjFlexChartSeries binding must be contained in a @see:wjFlexChart binding.
         *
         * The <b>wjFlexChartSeries</b> binding supports all read-write properties and events of
         * the @see:Series class. The <b>visibility</b> property provides two-way binding mode.
         */
        var wjFlexChartSeries = (function (_super) {
            __extends(wjFlexChartSeries, _super);
            function wjFlexChartSeries() {
                _super.apply(this, arguments);
            }
            wjFlexChartSeries.prototype._getControlConstructor = function () {
                return wijmo.chart.Series;
            };
            wjFlexChartSeries.prototype._createWijmoContext = function () {
                return new WjFlexChartSeriesContext(this);
            };
            return wjFlexChartSeries;
        }(knockout.WjBinding));
        knockout.wjFlexChartSeries = wjFlexChartSeries;
        var WjFlexChartSeriesContext = (function (_super) {
            __extends(WjFlexChartSeriesContext, _super);
            function WjFlexChartSeriesContext() {
                _super.apply(this, arguments);
            }
            WjFlexChartSeriesContext.prototype._initControl = function () {
                var _this = this;
                _super.prototype._initControl.call(this);
                //Update bindings to the visibility property on parent Chart seriesVisibilityChanged event.
                var parentCtrl = this.parentWjContext.control;
                if (parentCtrl instanceof wijmo.chart.FlexChart) {
                    parentCtrl.seriesVisibilityChanged.addHandler(function (s, e) {
                        _this._updateSource();
                    });
                }
            };
            return WjFlexChartSeriesContext;
        }(knockout.WjContext));
        knockout.WjFlexChartSeriesContext = WjFlexChartSeriesContext;
        /**
         * KnockoutJS binding for the @see:FinancialChart control.
         *
         * Use the @see:wjFinancialChart binding to add @see:FinancialChart controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a FinancialChart control:&lt;/p&gt;
         * &lt;div data-bind="wjFinancialChart: { itemsSource: data, chartType: 'Candlestick' }"&gt;
         *     &lt;div data-bind="wjFlexChartLegend : {
         *         position: 'Top' }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjFinancialChartSeries: {
         *          name: 'close',
         *         binding: 'high,low,open,close' }"&gt;
         *     &lt;/div&gt;
         *     &lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFinancialChart</b> binding may contain the following child bindings:
         * @see:wjFlexChartAxis, @see:wjFinancialChartSeries, @see:wjFlexChartLegend.
         *
         * The <b>wjFinancialChart</b> binding supports all read-write properties and events of
         * the @see:FinancialChart control, and the additional <b>tooltipContent</b> property
         * that assigns a value to the <b>FinancialChart.tooltip.content</b> property.
         * The <b>selection</b> property provides two-way binding mode.
         */
        var wjFinancialChart = (function (_super) {
            __extends(wjFinancialChart, _super);
            function wjFinancialChart() {
                _super.apply(this, arguments);
            }
            wjFinancialChart.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.FinancialChart;
            };
            wjFinancialChart.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var lblContentDesc = knockout.MetaFactory.findProp('labelContent', this._metaData.props);
                lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue) {
                    if (convertedValue != null) {
                        control.dataLabel.content = convertedValue;
                    }
                    return true;
                };
            };
            return wjFinancialChart;
        }(WjFlexChartBaseBinding));
        knockout.wjFinancialChart = wjFinancialChart;
        /**
         * KnockoutJS binding for the @see:FinancialChart @see:FinancialSeries object.
         *
         * The @see:WjFinancialChartSeries binding must be contained in a @see:wjFinancialChart binding.
         *
         * The <b>WjFinancialChartSeries</b> binding supports all read-write properties and events of
         * the @see:FinancialSeries class. The <b>visibility</b> property provides two-way binding mode.
         */
        var wjFinancialChartSeries = (function (_super) {
            __extends(wjFinancialChartSeries, _super);
            function wjFinancialChartSeries() {
                _super.apply(this, arguments);
            }
            wjFinancialChartSeries.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.FinancialSeries;
            };
            wjFinancialChartSeries.prototype._createWijmoContext = function () {
                return new WjFinancialChartSeriesContext(this);
            };
            return wjFinancialChartSeries;
        }(knockout.WjBinding));
        knockout.wjFinancialChartSeries = wjFinancialChartSeries;
        var WjFinancialChartSeriesContext = (function (_super) {
            __extends(WjFinancialChartSeriesContext, _super);
            function WjFinancialChartSeriesContext() {
                _super.apply(this, arguments);
            }
            WjFinancialChartSeriesContext.prototype._initControl = function () {
                var _this = this;
                _super.prototype._initControl.call(this);
                //Update bindings to the visibility property on parent Chart seriesVisibilityChanged event.
                var parentCtrl = this.parentWjContext.control;
                if (parentCtrl instanceof wijmo.chart.finance.FinancialChart) {
                    parentCtrl.seriesVisibilityChanged.addHandler(function (s, e) {
                        _this._updateSource();
                    });
                }
            };
            return WjFinancialChartSeriesContext;
        }(knockout.WjContext));
        knockout.WjFinancialChartSeriesContext = WjFinancialChartSeriesContext;
        /**
         * KnockoutJS binding for the @see:LineMarker control.
         *
         * Use the @see:wjFlexChartLineMarker binding to add @see:LineMarker controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a LineMarker:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Expenses', binding: 'expenses' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Downloads', binding: 'downloads' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartLineMarker: { interaction: 'Move', lines: 'Both' }"&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         *
         * The <b>wjFlexChartLineMarker</b> binding supports all read-write properties and events of
         * the @see:LineMarker class.
         */
        var wjFlexChartLineMarker = (function (_super) {
            __extends(wjFlexChartLineMarker, _super);
            function wjFlexChartLineMarker() {
                _super.apply(this, arguments);
            }
            wjFlexChartLineMarker.prototype._getControlConstructor = function () {
                return wijmo.chart.LineMarker;
            };
            return wjFlexChartLineMarker;
        }(knockout.WjBinding));
        knockout.wjFlexChartLineMarker = wjFlexChartLineMarker;
        /**
         * KnockoutJS binding for the @see:RangeSelector control.
         *
         * Use the @see:wjFlexChartRangeSelector binding to add @see:RangeSelector controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a RangeSelector control:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Expenses', binding: 'expenses' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Downloads', binding: 'downloads' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartRangeSelector: { seamless: 'true',rangeChanged: rangeChanged }"&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartRangeSelector</b> binding supports all read-write properties and events of
         * the @see:RangeSelector class.
         */
        var wjFlexChartRangeSelector = (function (_super) {
            __extends(wjFlexChartRangeSelector, _super);
            function wjFlexChartRangeSelector() {
                _super.apply(this, arguments);
            }
            wjFlexChartRangeSelector.prototype._getControlConstructor = function () {
                return wijmo.chart.interaction.RangeSelector;
            };
            return wjFlexChartRangeSelector;
        }(knockout.WjBinding));
        knockout.wjFlexChartRangeSelector = wjFlexChartRangeSelector;
        /**
         * KnockoutJS binding for the @see:ChartGestures object.
         *
         * Use the @see:wjFlexChartGestures binding to add @see:ChartGestures controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a ChartGestures:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartGestures: { scaleX:0.5, posX:0.1 } "&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartGestures</b> binding supports all read-write properties and events of
         * the @see:ChartGestures class.
         */
        var wjFlexChartGestures = (function (_super) {
            __extends(wjFlexChartGestures, _super);
            function wjFlexChartGestures() {
                _super.apply(this, arguments);
            }
            wjFlexChartGestures.prototype._getControlConstructor = function () {
                return wijmo.chart.interaction.ChartGestures;
            };
            return wjFlexChartGestures;
        }(knockout.WjBinding));
        knockout.wjFlexChartGestures = wjFlexChartGestures;
        /**
         * KnockoutJS binding for the @see:PlotArea object.
         *
         * Use the @see:wjFlexChartPlotArea binding to add @see:PlotArea object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a PlotArea:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartPlotArea: { row:0, name:'plot1', style:{ fill: 'rgba(136,189,230,0.2)'} }  "&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartPlotArea</b> binding supports all read-write properties and events of
         * the @see:PlotArea class.
         */
        var wjFlexChartPlotArea = (function (_super) {
            __extends(wjFlexChartPlotArea, _super);
            function wjFlexChartPlotArea() {
                _super.apply(this, arguments);
            }
            wjFlexChartPlotArea.prototype._getControlConstructor = function () {
                return wijmo.chart.PlotArea;
            };
            return wjFlexChartPlotArea;
        }(knockout.WjBinding));
        knockout.wjFlexChartPlotArea = wjFlexChartPlotArea;
        /**
         * KnockoutJS binding for the @see:DataPoint object.
    
         * The <b>wjFlexChartDataPoint</b> must be contained in a
         * @see:wjFlexChartAnnotation. The property of the parent object
         * where <b>wjFlexChartDataPoint</b> should assign a value is specified in the
         * <b>wjProperty</b> attribute.
         *
         * Use the @see:wjFlexChartDataPoint binding to add @see:DataPoint object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a DataPoint:&lt;/p&gt;
         *   &lt;div data-bind="wjFlexChartDataPoint: { wjProperty: 'point', x: 0.9, y:0.4}" &gt;&lt;/div&gt;
         *  </pre>
         *
         * The <b>wjFlexChartDataPoint</b> binding supports all read-write properties and events of
         * the @see:DataPoint class.
         */
        var wjFlexChartDataPoint = (function (_super) {
            __extends(wjFlexChartDataPoint, _super);
            function wjFlexChartDataPoint() {
                _super.apply(this, arguments);
            }
            wjFlexChartDataPoint.prototype._getControlConstructor = function () {
                return wijmo.chart.DataPoint;
            };
            return wjFlexChartDataPoint;
        }(knockout.WjBinding));
        knockout.wjFlexChartDataPoint = wjFlexChartDataPoint;
        /**
         * KnockoutJS binding for the @see:AnnotationLayer object.
         *
         * Use the @see:wjFlexChartAnnotationLayer binding to add @see:AnnotationLayer object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a AnnotationLayer:&lt;/p&gt;
         *&lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
         *    &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
         *    &lt;div data-bind="wjFlexChartAnnotationLayer: {}"&gt;
         *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Rectangle', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 10}"&gt;&lt;/div&gt;
         *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Ellipse', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 30}"&gt;&lt;/div&gt;
         *    &lt;/div&gt;
          &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartAnnotationLayer</b> binding supports all read-write properties and events of
         * the @see:AnnotationLayer class.
         */
        var wjFlexChartAnnotationLayer = (function (_super) {
            __extends(wjFlexChartAnnotationLayer, _super);
            function wjFlexChartAnnotationLayer() {
                _super.apply(this, arguments);
            }
            wjFlexChartAnnotationLayer.prototype._getControlConstructor = function () {
                return wijmo.chart.annotation.AnnotationLayer;
            };
            return wjFlexChartAnnotationLayer;
        }(knockout.WjBinding));
        knockout.wjFlexChartAnnotationLayer = wjFlexChartAnnotationLayer;
        /**
         * KnockoutJS binding for annotations.
         *
         * The <b>wjFlexChartAnnotation</b> must be contained in a
         * @see:wjFlexChartAnnotationLayer binding.For example:
         * <pre>&lt;p&gt;Here is a AnnotationLayer:&lt;/p&gt;
         *&lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
         *    &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
         *    &lt;div data-bind="wjFlexChartAnnotationLayer: {}"&gt;
         *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Rectangle', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 10}"&gt;&lt;/div&gt;
         *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Ellipse', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 30}"&gt;&lt;/div&gt;
         *    &lt;/div&gt;
          &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartAnnotation</b> is used to represent all types of
         * possible annotation shapes like <b>Circle</b>, <b>Rectangle</b>, <b>Polygon</b>
         * and so on. The type of annotation shape is specified
         * in the <b>type</b> attribute.
         */
        var wjFlexChartAnnotation = (function (_super) {
            __extends(wjFlexChartAnnotation, _super);
            function wjFlexChartAnnotation() {
                _super.apply(this, arguments);
            }
            wjFlexChartAnnotation.prototype._createControl = function (element) {
                return this._context._createAnnotation();
            };
            wjFlexChartAnnotation.prototype._getMetaDataId = function () {
                return 'FlexChartAnnotation';
            };
            wjFlexChartAnnotation.prototype._createWijmoContext = function () {
                this._context = new wjFlexChartAnnotationContext(this);
                return this._context;
            };
            return wjFlexChartAnnotation;
        }(knockout.WjBinding));
        knockout.wjFlexChartAnnotation = wjFlexChartAnnotation;
        var wjFlexChartAnnotationContext = (function (_super) {
            __extends(wjFlexChartAnnotationContext, _super);
            function wjFlexChartAnnotationContext() {
                _super.apply(this, arguments);
            }
            wjFlexChartAnnotationContext.prototype._createAnnotation = function () {
                var valSet = this.valueAccessor(), type = ko.unwrap(valSet['type']);
                return new wijmo.chart.annotation[type]();
            };
            return wjFlexChartAnnotationContext;
        }(knockout.WjContext));
        knockout.wjFlexChartAnnotationContext = wjFlexChartAnnotationContext;
        /**
         * KnockoutJS binding for the @see:ChartAnimation object.
         *
         * Use the @see:wjFlexChartAnimation binding to add @see:ChartAnimation object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a ChartAnimation:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country',chartType:'Column' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartAnimation: { animationMode: 'Series',easing:'Swing',duration:2000 }  "&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartAnimation</b> binding supports all read-write properties and events of
         * the @see:ChartAnimation class.
         */
        var wjFlexChartAnimation = (function (_super) {
            __extends(wjFlexChartAnimation, _super);
            function wjFlexChartAnimation() {
                _super.apply(this, arguments);
            }
            wjFlexChartAnimation.prototype._getControlConstructor = function () {
                return wijmo.chart.animation.ChartAnimation;
            };
            return wjFlexChartAnimation;
        }(knockout.WjBinding));
        knockout.wjFlexChartAnimation = wjFlexChartAnimation;
        var WjSeriesBase = (function (_super) {
            __extends(WjSeriesBase, _super);
            function WjSeriesBase() {
                _super.apply(this, arguments);
            }
            WjSeriesBase.prototype._getControlConstructor = function () {
                return wijmo.chart.SeriesBase;
            };
            return WjSeriesBase;
        }(knockout.WjBinding));
        knockout.WjSeriesBase = WjSeriesBase;
        var WjTrendLineBase = (function (_super) {
            __extends(WjTrendLineBase, _super);
            function WjTrendLineBase() {
                _super.apply(this, arguments);
            }
            WjTrendLineBase.prototype._getControlConstructor = function () {
                return wijmo.chart.analytics.TrendLineBase;
            };
            return WjTrendLineBase;
        }(WjSeriesBase));
        knockout.WjTrendLineBase = WjTrendLineBase;
        /**
         * KnockoutJS binding for the @see:TrendLine object.
         *
         * Use the @see:wjFlexChartTrendLine binding to add @see:TrendLine object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a TrendLine:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country',chartType:'Column' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartAnimation: { animationMode: 'Series',easing:'Swing',duration:2000 }  "&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartTrendLine</b> binding supports all read-write properties and events of
         * the @see:TrendLine class.
         */
        var wjFlexChartTrendLine = (function (_super) {
            __extends(wjFlexChartTrendLine, _super);
            function wjFlexChartTrendLine() {
                _super.apply(this, arguments);
            }
            wjFlexChartTrendLine.prototype._getControlConstructor = function () {
                return wijmo.chart.analytics.TrendLine;
            };
            return wjFlexChartTrendLine;
        }(WjTrendLineBase));
        knockout.wjFlexChartTrendLine = wjFlexChartTrendLine;
        /**
         * KnockoutJS binding for the @see:MovingAverage object.
         *
         * Use the @see:wjFlexChartMovingAverage binding to add @see:MovingAverage object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a MovingAverage:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource, bindingX: 'x' }"&gt;
         *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { chartType: 'Scatter', name: 'Base Data', binding: 'y' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartMovingAverage: { binding: 'y', bindingX: 'x', period:2 }  "&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartMovingAverage</b> binding supports all read-write properties and events of
         * the @see:MovingAverage class.
         */
        var wjFlexChartMovingAverage = (function (_super) {
            __extends(wjFlexChartMovingAverage, _super);
            function wjFlexChartMovingAverage() {
                _super.apply(this, arguments);
            }
            wjFlexChartMovingAverage.prototype._getControlConstructor = function () {
                return wijmo.chart.analytics.MovingAverage;
            };
            return wjFlexChartMovingAverage;
        }(WjTrendLineBase));
        knockout.wjFlexChartMovingAverage = wjFlexChartMovingAverage;
        /**
         * KnockoutJS binding for the @see:YFunctionSeries object.
         *
         * Use the @see:wjFlexChartYFunctionSeries binding to add @see:YFunctionSeries object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a YFunctionSeries:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource, bindingX: 'x' }"&gt;
         *     &lt;div data-bind="wjFlexChartYFunctionSeries: {  min: 10, max: -10, sampleCount:100,func:func }"&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartYFunctionSeries</b> binding supports all read-write properties and events of
         * the @see:YFunctionSeries class.
         */
        var wjFlexChartYFunctionSeries = (function (_super) {
            __extends(wjFlexChartYFunctionSeries, _super);
            function wjFlexChartYFunctionSeries() {
                _super.apply(this, arguments);
            }
            wjFlexChartYFunctionSeries.prototype._getControlConstructor = function () {
                return wijmo.chart.analytics.YFunctionSeries;
            };
            return wjFlexChartYFunctionSeries;
        }(WjTrendLineBase));
        knockout.wjFlexChartYFunctionSeries = wjFlexChartYFunctionSeries;
        /**
         * KnockoutJS binding for the @see:ParametricFunctionSeries object.
         *
         * Use the @see:wjFlexChartParametricFunctionSeries binding to add @see:ParametricFunctionSeries object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a ParametricFunctionSeries:&lt;/p&gt;
         * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource, bindingX: 'x' }"&gt;
         *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
         *     &lt;div data-bind="wjFlexChartParametricFunctionSeries: {  sampleCount:1000, max: max,xFunc:xFunc,yFunc:yFunc  }"&gt;&lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartParametricFunctionSeries</b> binding supports all read-write properties and events of
         * the @see:ParametricFunctionSeries class.
         */
        var wjFlexChartParametricFunctionSeries = (function (_super) {
            __extends(wjFlexChartParametricFunctionSeries, _super);
            function wjFlexChartParametricFunctionSeries() {
                _super.apply(this, arguments);
            }
            wjFlexChartParametricFunctionSeries.prototype._getControlConstructor = function () {
                return wijmo.chart.analytics.ParametricFunctionSeries;
            };
            wjFlexChartParametricFunctionSeries.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var funcDesc = knockout.MetaFactory.findProp('func', this._metaData.props);
                funcDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue) {
                    if (convertedValue != null) {
                        control.xFunc = convertedValue;
                    }
                    return true;
                };
            };
            return wjFlexChartParametricFunctionSeries;
        }(WjTrendLineBase));
        knockout.wjFlexChartParametricFunctionSeries = wjFlexChartParametricFunctionSeries;
        /**
          * KnockoutJS binding for the @see:Waterfall object.
          *
          * Use the @see:wjFlexChartWaterfall binding to add @see:Waterfall object to your
          * KnockoutJS applications. For example:
          *
          * <pre>&lt;p&gt;Here is a Waterfall:&lt;/p&gt;
          * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource,  binding:'value',bindingX: 'name' }"&gt;
          *     &lt;div data-bind="wjFlexChartWaterfall: {  relativeData:true, connectorLines: true, start:1000,showIntermediateTotal: true,
          *                       intermediateTotalPositions: [3, 6, 9, 12], intermediateTotalLabels: ['Q1', 'Q2', 'Q3', 'Q4'],name:'Increase,Decrease,Total'}"&gt;&lt;/div&gt;
          * &lt;/div&gt;</pre>
          *
          * The <b>wjFlexChartWaterfall</b> binding supports all read-write properties and events of
          * the @see:Waterfall class.
          */
        var wjFlexChartWaterfall = (function (_super) {
            __extends(wjFlexChartWaterfall, _super);
            function wjFlexChartWaterfall() {
                _super.apply(this, arguments);
            }
            wjFlexChartWaterfall.prototype._getControlConstructor = function () {
                return wijmo.chart.analytics.Waterfall;
            };
            return wjFlexChartWaterfall;
        }(WjSeriesBase));
        knockout.wjFlexChartWaterfall = wjFlexChartWaterfall;
        /**
         * KnockoutJS binding for the @see:Fibonacci object.
         *
         * Use the @see:wjFlexChartFibonacci binding to add @see:Fibonacci object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Fibonacci:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
         *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
         *         &lt;div data-bind="wjFlexChartFibonacci: { binding:'close', symbolSize:1, labelPosition: 'Left',  uptrend: true}"&gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartFibonacci</b> binding supports all read-write properties and events of
         * the @see:Fibonacci class.
         */
        var wjFlexChartFibonacci = (function (_super) {
            __extends(wjFlexChartFibonacci, _super);
            function wjFlexChartFibonacci() {
                _super.apply(this, arguments);
            }
            wjFlexChartFibonacci.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.Fibonacci;
            };
            wjFlexChartFibonacci.prototype._createControl = function (element) {
                return new wijmo.chart.finance.analytics.Fibonacci();
            };
            return wjFlexChartFibonacci;
        }(WjSeriesBase));
        knockout.wjFlexChartFibonacci = wjFlexChartFibonacci;
        /**
         * KnockoutJS binding for the @see:FibonacciArcs object.
         *
         * Use the @see:wjFlexChartFibonacciArcs binding to add @see:FibonacciArcs object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a FibonacciArcs:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
         *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
         *         &lt;div data-bind="wjFlexChartFibonacciArcs: { binding:'close', start:start, end: end,  labelPosition: 'Top'}"&gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartFibonacciArcs</b> binding supports all read-write properties and events of
         * the @see:FibonacciArcs class.
         */
        var wjFlexChartFibonacciArcs = (function (_super) {
            __extends(wjFlexChartFibonacciArcs, _super);
            function wjFlexChartFibonacciArcs() {
                _super.apply(this, arguments);
            }
            wjFlexChartFibonacciArcs.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.FibonacciArcs;
            };
            wjFlexChartFibonacciArcs.prototype._createControl = function (element) {
                return new wijmo.chart.finance.analytics.FibonacciArcs();
            };
            return wjFlexChartFibonacciArcs;
        }(WjSeriesBase));
        knockout.wjFlexChartFibonacciArcs = wjFlexChartFibonacciArcs;
        /**
         * KnockoutJS binding for the @see:FibonacciFans object.
         *
         * Use the @see:wjFlexChartFibonacciFans binding to add @see:FibonacciFans object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a FibonacciFans:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
         *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
         *         &lt;div data-bind="wjFlexChartFibonacciFans: { binding:'close', start:start, end: end,  labelPosition: 'Top'}"&gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartFibonacciFans</b> binding supports all read-write properties and events of
         * the @see:FibonacciFans class.
         */
        var wjFlexChartFibonacciFans = (function (_super) {
            __extends(wjFlexChartFibonacciFans, _super);
            function wjFlexChartFibonacciFans() {
                _super.apply(this, arguments);
            }
            wjFlexChartFibonacciFans.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.FibonacciFans;
            };
            wjFlexChartFibonacciFans.prototype._createControl = function (element) {
                return new wijmo.chart.finance.analytics.FibonacciFans();
            };
            return wjFlexChartFibonacciFans;
        }(WjSeriesBase));
        knockout.wjFlexChartFibonacciFans = wjFlexChartFibonacciFans;
        /**
        * KnockoutJS binding for the @see:FibonacciTimeZones object.
        *
        * Use the @see:wjFlexChartFibonacciTimeZones binding to add @see:FibonacciTimeZones object to your
        * KnockoutJS applications. For example:
        *
        * <pre>&lt;p&gt;Here is a FibonacciTimeZones:&lt;/p&gt;
        *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
        *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
        *         &lt;div data-bind="wjFlexChartFibonacciTimeZones: { binding:'close', startX:zStart, endX: zEnd,  labelPosition: 'Right'}"&gt;&lt;/div&gt;
        *   &lt;/div&gt;</pre>
        *
        * The <b>wjFlexChartFibonacciTimeZones</b> binding supports all read-write properties and events of
        * the @see:FibonacciTimeZones class.
        */
        var wjFlexChartFibonacciTimeZones = (function (_super) {
            __extends(wjFlexChartFibonacciTimeZones, _super);
            function wjFlexChartFibonacciTimeZones() {
                _super.apply(this, arguments);
            }
            wjFlexChartFibonacciTimeZones.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.FibonacciTimeZones;
            };
            wjFlexChartFibonacciTimeZones.prototype._createControl = function (element) {
                return new wijmo.chart.finance.analytics.FibonacciTimeZones();
            };
            return wjFlexChartFibonacciTimeZones;
        }(WjSeriesBase));
        knockout.wjFlexChartFibonacciTimeZones = wjFlexChartFibonacciTimeZones;
        // abstract for FinancialChart's overlays and indicators
        var WjBaseOverlayIndicator = (function (_super) {
            __extends(WjBaseOverlayIndicator, _super);
            function WjBaseOverlayIndicator() {
                _super.apply(this, arguments);
            }
            WjBaseOverlayIndicator.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.OverlayIndicatorBase;
            };
            return WjBaseOverlayIndicator;
        }(WjSeriesBase));
        knockout.WjBaseOverlayIndicator = WjBaseOverlayIndicator;
        // abstract for FinancialChart's overlays and indicators
        var WjBaseSingleOverlayIndicator = (function (_super) {
            __extends(WjBaseSingleOverlayIndicator, _super);
            function WjBaseSingleOverlayIndicator() {
                _super.apply(this, arguments);
            }
            WjBaseSingleOverlayIndicator.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.SingleOverlayIndicatorBase;
            };
            return WjBaseSingleOverlayIndicator;
        }(WjBaseOverlayIndicator));
        knockout.WjBaseSingleOverlayIndicator = WjBaseSingleOverlayIndicator;
        /**
        * KnockoutJS binding for the @see:ATR object.
        *
        * Use the @see:wjFlexChartAtr binding to add @see:ATR object to your
        * KnockoutJS applications. For example:
        *
        * <pre>&lt;p&gt;Here is a ATR:&lt;/p&gt;
        *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
        *         &lt;div data-bind="wjFlexChartAtr: { binding: 'high,low,open,close',period:'14' }"&gt;&lt;/div&gt;
        *   &lt;/div&gt;</pre>
        *
        * The <b>wjFlexChartAtr</b> binding supports all read-write properties and events of
        * the @see:ATR class.
        */
        var wjFlexChartAtr = (function (_super) {
            __extends(wjFlexChartAtr, _super);
            function wjFlexChartAtr() {
                _super.apply(this, arguments);
            }
            wjFlexChartAtr.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.ATR;
            };
            return wjFlexChartAtr;
        }(WjBaseSingleOverlayIndicator));
        knockout.wjFlexChartAtr = wjFlexChartAtr;
        /**
         * KnockoutJS binding for the @see:CCI object.
         *
         * Use the @see:wjFlexChartCci binding to add @see:CCI object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a CCI:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="wjFlexChartCci: { binding: 'high,low,open,close',period:20 }"&gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartCci</b> binding supports all read-write properties and events of
         * the @see:CCI class.
         */
        var wjFlexChartCci = (function (_super) {
            __extends(wjFlexChartCci, _super);
            function wjFlexChartCci() {
                _super.apply(this, arguments);
            }
            wjFlexChartCci.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.CCI;
            };
            return wjFlexChartCci;
        }(WjBaseSingleOverlayIndicator));
        knockout.wjFlexChartCci = wjFlexChartCci;
        /**
         * KnockoutJS binding for the @see:RSI object.
         *
         * Use the @see:wjFlexChartRsi binding to add @see:RSI object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a RSI:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
         *         &lt;div data-bind="wjFlexChartRsi: { binding: 'high,low,open,close',period:20 }"&gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartRsi</b> binding supports all read-write properties and events of
         * the @see:RSI class.
         */
        var wjFlexChartRsi = (function (_super) {
            __extends(wjFlexChartRsi, _super);
            function wjFlexChartRsi() {
                _super.apply(this, arguments);
            }
            wjFlexChartRsi.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.RSI;
            };
            return wjFlexChartRsi;
        }(WjBaseSingleOverlayIndicator));
        knockout.wjFlexChartRsi = wjFlexChartRsi;
        /**
         * KnockoutJS binding for the @see:WilliamsR object.
         *
         * Use the @see:wjFlexChartWilliamsR binding to add @see:WilliamsR object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a WilliamsR:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="wjFlexChartWilliamsR: { binding: 'high,low,open,close',period:20 }"&gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartWilliamsR</b> binding supports all read-write properties and events of
         * the @see:WilliamsR class.
         */
        var wjFlexChartWilliamsR = (function (_super) {
            __extends(wjFlexChartWilliamsR, _super);
            function wjFlexChartWilliamsR() {
                _super.apply(this, arguments);
            }
            wjFlexChartWilliamsR.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.WilliamsR;
            };
            return wjFlexChartWilliamsR;
        }(WjBaseSingleOverlayIndicator));
        knockout.wjFlexChartWilliamsR = wjFlexChartWilliamsR;
        var WjFlexChartMacdBase = (function (_super) {
            __extends(WjFlexChartMacdBase, _super);
            function WjFlexChartMacdBase() {
                _super.apply(this, arguments);
            }
            WjFlexChartMacdBase.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.MacdBase;
            };
            return WjFlexChartMacdBase;
        }(WjBaseOverlayIndicator));
        knockout.WjFlexChartMacdBase = WjFlexChartMacdBase;
        /**
         * KnockoutJS binding for the @see:Macd object.
         *
         * Use the @see:wjFlexChartMacd binding to add @see:Macd object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Macd:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="wjFlexChartMacd: { binding: 'close',fastPeriod:12, slowPeriod: 26,smoothingPeriod: 9 }" &gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartMacd</b> binding supports all read-write properties and events of
         * the @see:Macd class.
         */
        var wjFlexChartMacd = (function (_super) {
            __extends(wjFlexChartMacd, _super);
            function wjFlexChartMacd() {
                _super.apply(this, arguments);
            }
            wjFlexChartMacd.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.Macd;
            };
            return wjFlexChartMacd;
        }(WjFlexChartMacdBase));
        knockout.wjFlexChartMacd = wjFlexChartMacd;
        /**
         * KnockoutJS binding for the @see:MacdHistogram object.
         *
         * Use the @see:wjFlexChartMacdHistogram binding to add @see:MacdHistogram object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a MacdHistogram:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="WjFlexChartMacdHistogram: { binding: 'close',fastPeriod:12, slowPeriod: 26,smoothingPeriod: 9 }" &gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartMacdHistogram</b> binding supports all read-write properties and events of
         * the @see:MacdHistogram class.
         */
        var wjFlexChartMacdHistogram = (function (_super) {
            __extends(wjFlexChartMacdHistogram, _super);
            function wjFlexChartMacdHistogram() {
                _super.apply(this, arguments);
            }
            wjFlexChartMacdHistogram.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.MacdHistogram;
            };
            return wjFlexChartMacdHistogram;
        }(WjFlexChartMacdBase));
        knockout.wjFlexChartMacdHistogram = wjFlexChartMacdHistogram;
        /**
         * KnockoutJS binding for the @see:Stochastic object.
         *
         * Use the @see:wjFlexChartStochastic binding to add @see:Stochastic object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Stochastic:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="wjFlexChartStochastic: { binding: 'high,low,open,close',kPeriod:14,dPeriod:3,smoothingPeriod: 1 }" &gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartStochastic</b> binding supports all read-write properties and events of
         * the @see:Stochastic class.
         */
        var wjFlexChartStochastic = (function (_super) {
            __extends(wjFlexChartStochastic, _super);
            function wjFlexChartStochastic() {
                _super.apply(this, arguments);
            }
            wjFlexChartStochastic.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.Stochastic;
            };
            return wjFlexChartStochastic;
        }(WjBaseOverlayIndicator));
        knockout.wjFlexChartStochastic = wjFlexChartStochastic;
        /**
         * KnockoutJS binding for the @see:BollingerBands object.
         *
         * Use the @see:wjFlexChartBollingerBands binding to add @see:BollingerBands object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a BollingerBands:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="wjFlexChartStochastic: { binding: 'high,low,open,close',kPeriod:14,dPeriod:3,smoothingPeriod: 1 }" &gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartBollingerBands</b> binding supports all read-write properties and events of
         * the @see:BollingerBands class.
         */
        var wjFlexChartBollingerBands = (function (_super) {
            __extends(wjFlexChartBollingerBands, _super);
            function wjFlexChartBollingerBands() {
                _super.apply(this, arguments);
            }
            wjFlexChartBollingerBands.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.BollingerBands;
            };
            return wjFlexChartBollingerBands;
        }(WjBaseOverlayIndicator));
        knockout.wjFlexChartBollingerBands = wjFlexChartBollingerBands;
        /**
         * KnockoutJS binding for the @see:Envelopes object.
         *
         * Use the @see:wjFlexChartEnvelopes binding to add @see:Envelopes object to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Envelopes:&lt;/p&gt;
         *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
         *         &lt;div data-bind="wjFlexChartEnvelopes: { binding:'close', type:'Simple', size: 0.03, period:20}" &gt;&lt;/div&gt;
         *   &lt;/div&gt;</pre>
         *
         * The <b>wjFlexChartEnvelopes</b> binding supports all read-write properties and events of
         * the @see:Envelopes class.
         */
        var wjFlexChartEnvelopes = (function (_super) {
            __extends(wjFlexChartEnvelopes, _super);
            function wjFlexChartEnvelopes() {
                _super.apply(this, arguments);
            }
            wjFlexChartEnvelopes.prototype._getControlConstructor = function () {
                return wijmo.chart.finance.analytics.Envelopes;
            };
            return wjFlexChartEnvelopes;
        }(WjBaseOverlayIndicator));
        knockout.wjFlexChartEnvelopes = wjFlexChartEnvelopes;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
// Register bindings
(ko.bindingHandlers).wjFlexChart = new wijmo.knockout.wjFlexChart();
(ko.bindingHandlers).wjFlexPie = new wijmo.knockout.wjFlexPie();
(ko.bindingHandlers).wjFlexChartAxis = new wijmo.knockout.wjFlexChartAxis();
(ko.bindingHandlers).wjFlexChartLegend = new wijmo.knockout.wjFlexChartLegend();
(ko.bindingHandlers).wjFlexChartSeries = new wijmo.knockout.wjFlexChartSeries();
(ko.bindingHandlers).wjFinancialChart = new wijmo.knockout.wjFinancialChart();
(ko.bindingHandlers).wjFinancialChartSeries = new wijmo.knockout.wjFinancialChartSeries();
(ko.bindingHandlers).wjFlexChartLineMarker = new wijmo.knockout.wjFlexChartLineMarker();
(ko.bindingHandlers).wjFlexChartRangeSelector = new wijmo.knockout.wjFlexChartRangeSelector();
(ko.bindingHandlers).wjFlexChartGestures = new wijmo.knockout.wjFlexChartGestures();
(ko.bindingHandlers).wjFlexChartPlotArea = new wijmo.knockout.wjFlexChartPlotArea();
(ko.bindingHandlers).wjFlexChartDataPoint = new wijmo.knockout.wjFlexChartDataPoint();
(ko.bindingHandlers).wjFlexChartAnnotationLayer = new wijmo.knockout.wjFlexChartAnnotationLayer();
(ko.bindingHandlers).wjFlexChartAnnotation = new wijmo.knockout.wjFlexChartAnnotation();
(ko.bindingHandlers).wjFlexChartAnimation = new wijmo.knockout.wjFlexChartAnimation();
(ko.bindingHandlers).wjFlexChartTrendLine = new wijmo.knockout.wjFlexChartTrendLine();
(ko.bindingHandlers).wjFlexChartMovingAverage = new wijmo.knockout.wjFlexChartMovingAverage();
(ko.bindingHandlers).wjFlexChartYFunctionSeries = new wijmo.knockout.wjFlexChartYFunctionSeries();
(ko.bindingHandlers).wjFlexChartParametricFunctionSeries = new wijmo.knockout.wjFlexChartParametricFunctionSeries();
(ko.bindingHandlers).wjFlexChartWaterfall = new wijmo.knockout.wjFlexChartWaterfall();
(ko.bindingHandlers).wjFlexChartFibonacci = new wijmo.knockout.wjFlexChartFibonacci();
(ko.bindingHandlers).wjFlexChartFibonacciArcs = new wijmo.knockout.wjFlexChartFibonacciArcs();
(ko.bindingHandlers).wjFlexChartFibonacciFans = new wijmo.knockout.wjFlexChartFibonacciFans();
(ko.bindingHandlers).wjFlexChartFibonacciTimeZones = new wijmo.knockout.wjFlexChartFibonacciTimeZones();
(ko.bindingHandlers).wjFlexChartAtr = new wijmo.knockout.wjFlexChartAtr();
(ko.bindingHandlers).wjFlexChartCci = new wijmo.knockout.wjFlexChartCci();
(ko.bindingHandlers).wjFlexChartRsi = new wijmo.knockout.wjFlexChartRsi();
(ko.bindingHandlers).wjFlexChartWilliamsR = new wijmo.knockout.wjFlexChartWilliamsR();
(ko.bindingHandlers).wjFlexChartMacd = new wijmo.knockout.wjFlexChartMacd();
(ko.bindingHandlers).wjFlexChartMacdHistogram = new wijmo.knockout.wjFlexChartMacdHistogram();
(ko.bindingHandlers).wjFlexChartStochastic = new wijmo.knockout.wjFlexChartStochastic();
(ko.bindingHandlers).wjFlexChartBollingerBands = new wijmo.knockout.wjFlexChartBollingerBands();
(ko.bindingHandlers).wjFlexChartEnvelopes = new wijmo.knockout.wjFlexChartEnvelopes();
//# sourceMappingURL=wijmo.knockout.chart.js.map