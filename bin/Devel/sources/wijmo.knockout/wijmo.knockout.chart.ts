module wijmo.knockout {
    // Base abstract class for specific Chart type bindings
    export class WjFlexChartBaseBinding extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.FlexChartBase;
        }

        _initialize() {
            super._initialize();
            var tooltipDesc = MetaFactory.findProp('tooltipContent', <PropDesc[]>this._metaData.props);
            tooltipDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
                if (convertedValue != null) {
                    (<wijmo.chart.FlexChart>control).tooltip.content = convertedValue;
                }
                return true;
            };
        }
    }

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
    export class wjFlexChart extends WjFlexChartBaseBinding {
        _getControlConstructor(): any {
            return wijmo.chart.FlexChart;
        }

        _initialize() {
            super._initialize();

            var lblContentDesc = MetaFactory.findProp('labelContent', <PropDesc[]>this._metaData.props);
            lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
                if (convertedValue != null) {
                    (<wijmo.chart.FlexChart>control).dataLabel.content = convertedValue;
                }
                return true;
            };
        }
    }

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
    export class wjFlexPie extends WjFlexChartBaseBinding {
        _getControlConstructor(): any {
            return wijmo.chart.FlexPie;
        }

        _initialize() {
            super._initialize();

            var lblContentDesc = MetaFactory.findProp('labelContent', <PropDesc[]>this._metaData.props);
            lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
                if (convertedValue != null) {
                    (<wijmo.chart.FlexPie>control).dataLabel.content = convertedValue;
                }
                return true;
            };
        }
    }

    /**
     * KnockoutJS binding for the @see:FlexChart @see:Axis object.
     *
     * The @see:wjFlexChartAxis binding must be contained in a @see:wjFlexChart binding. Use the <b>wjProperty</b>
     * attribute to specify the property (<b>axisX</b> or <b>axisY</b>) to initialize with this binding.
     * 
     * The <b>wjFlexChartAxis</b> binding supports all read-write properties and events of 
     * the @see:Axis class.
     */
    export class wjFlexChartAxis extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.Axis;
        }
    }

    /**
     * KnockoutJS binding for the Charts' @see:Legend object.
     *
     * The @see:wjFlexChartLegend binding must be contained in one the following bindings:
     *  @see:wjFlexChart, @see:wjFlexPie. 
     * 
     * The <b>wjFlexChartLegend</b> binding supports all read-write properties and events of 
     * the @see:Legend class.
     */
    export class wjFlexChartLegend extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.Legend;
        }
    }

    /**
     * KnockoutJS binding for the @see:FlexChart @see:Series object.
     *
     * The @see:wjFlexChartSeries binding must be contained in a @see:wjFlexChart binding. 
     * 
     * The <b>wjFlexChartSeries</b> binding supports all read-write properties and events of 
     * the @see:Series class. The <b>visibility</b> property provides two-way binding mode.
     */
    export class wjFlexChartSeries extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.Series;
        }

        _createWijmoContext(): WjContext {
            return new WjFlexChartSeriesContext(this);
        }
    }

    export class WjFlexChartSeriesContext extends WjContext {
        _initControl() {
            super._initControl();
            //Update bindings to the visibility property on parent Chart seriesVisibilityChanged event.
            var parentCtrl = this.parentWjContext.control;
            if (parentCtrl instanceof wijmo.chart.FlexChart) {
                (<wijmo.chart.FlexChart>parentCtrl).seriesVisibilityChanged.addHandler((s, e) => {
                    this._updateSource();
                });
            }
        }
    }

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
    export class wjFinancialChart extends WjFlexChartBaseBinding {
        _getControlConstructor(): any {
            return wijmo.chart.finance.FinancialChart;
        }

        _initialize() {
            super._initialize();

            var lblContentDesc = MetaFactory.findProp('labelContent', <PropDesc[]>this._metaData.props);
            lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
                if (convertedValue != null) {
                    (<wijmo.chart.finance.FinancialChart>control).dataLabel.content = convertedValue;
                }
                return true;
            };
        }
    }

    /**
     * KnockoutJS binding for the @see:FinancialChart @see:FinancialSeries object.
     *
     * The @see:WjFinancialChartSeries binding must be contained in a @see:wjFinancialChart binding.
     * 
     * The <b>WjFinancialChartSeries</b> binding supports all read-write properties and events of
     * the @see:FinancialSeries class. The <b>visibility</b> property provides two-way binding mode.
     */
    export class wjFinancialChartSeries extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.finance.FinancialSeries;
        }

        _createWijmoContext(): WjContext {
            return new WjFinancialChartSeriesContext(this);
        }
    }

    export class WjFinancialChartSeriesContext extends WjContext {
        _initControl() {
            super._initControl();
            //Update bindings to the visibility property on parent Chart seriesVisibilityChanged event.
            var parentCtrl = this.parentWjContext.control;
            if (parentCtrl instanceof wijmo.chart.finance.FinancialChart) {
                (<wijmo.chart.finance.FinancialChart>parentCtrl).seriesVisibilityChanged.addHandler((s, e) => {
                    this._updateSource();
                });
            }
        }
    }

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
    export class wjFlexChartLineMarker extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.LineMarker;
        }
    }

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
    export class wjFlexChartRangeSelector extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.interaction.RangeSelector;
        }
    }

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
    export class wjFlexChartGestures extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.interaction.ChartGestures;
        }
    }

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
    export class wjFlexChartPlotArea extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.PlotArea;
        }
    }

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
    export class wjFlexChartDataPoint extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.DataPoint;
        }
    }

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
    export class wjFlexChartAnnotationLayer extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.annotation.AnnotationLayer;
        }
    }

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
    export class wjFlexChartAnnotation extends WjBinding {

        _context;

        _createControl(element: any): any {
            return this._context._createAnnotation();
        }

        _getMetaDataId(): any {
            return 'FlexChartAnnotation';
        }

        _createWijmoContext(): WjContext {
            this._context = new wjFlexChartAnnotationContext(this);
            return this._context;
        }
    }

    export class wjFlexChartAnnotationContext extends WjContext {

        _createAnnotation() {
            var valSet = this.valueAccessor(),
                type = ko.unwrap(valSet['type']);
            return new wijmo.chart.annotation[type]();
        }
    }

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
    export class wjFlexChartAnimation extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.animation.ChartAnimation;
        }
    }

    export class WjSeriesBase extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.chart.SeriesBase;
        }
    }

    export class WjTrendLineBase extends WjSeriesBase {
        _getControlConstructor(): any {
            return wijmo.chart.analytics.TrendLineBase;
        }
    }

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
    export class wjFlexChartTrendLine extends WjTrendLineBase {
        _getControlConstructor(): any {
            return wijmo.chart.analytics.TrendLine;
        }
    }

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
    export class wjFlexChartMovingAverage extends WjTrendLineBase {
        _getControlConstructor(): any {
            return wijmo.chart.analytics.MovingAverage;
        }
    }

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
    export class wjFlexChartYFunctionSeries extends WjTrendLineBase {
        _getControlConstructor(): any {
            return wijmo.chart.analytics.YFunctionSeries;
        }
    }

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
    export class wjFlexChartParametricFunctionSeries extends WjTrendLineBase {
        _getControlConstructor(): any {
            return wijmo.chart.analytics.ParametricFunctionSeries;
        }

        _initialize() {
            super._initialize();
            var funcDesc = MetaFactory.findProp('func', <PropDesc[]>this._metaData.props);
            funcDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
                if (convertedValue != null) {
                    (<wijmo.chart.analytics.ParametricFunctionSeries>control).xFunc = convertedValue;
                }
                return true;
            };
        }
    }

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
    export class wjFlexChartWaterfall extends WjSeriesBase {
        _getControlConstructor(): any {
            return wijmo.chart.analytics.Waterfall;
        }
    }

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
    export class wjFlexChartFibonacci extends WjSeriesBase {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.Fibonacci;
        }

        _createControl(element: any): any {
            return new wijmo.chart.finance.analytics.Fibonacci();
        }
    }

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
    export class wjFlexChartFibonacciArcs extends WjSeriesBase {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.FibonacciArcs;
        }
        _createControl(element: any): any {
            return new wijmo.chart.finance.analytics.FibonacciArcs();
        }
    }

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
    export class wjFlexChartFibonacciFans extends WjSeriesBase {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.FibonacciFans;
        }
        _createControl(element: any): any {
            return new wijmo.chart.finance.analytics.FibonacciFans();
        }
    }

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
    export class wjFlexChartFibonacciTimeZones extends WjSeriesBase {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.FibonacciTimeZones;
        }
        _createControl(element: any): any {
            return new wijmo.chart.finance.analytics.FibonacciTimeZones();
        }
    }


    // abstract for FinancialChart's overlays and indicators
    export class WjBaseOverlayIndicator extends WjSeriesBase {

         _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.OverlayIndicatorBase;
        }
    }

    // abstract for FinancialChart's overlays and indicators
    export class WjBaseSingleOverlayIndicator extends WjBaseOverlayIndicator {

        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.SingleOverlayIndicatorBase;
        }
    }

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
    export class wjFlexChartAtr extends WjBaseSingleOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.ATR;
        }
    }

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
    export class wjFlexChartCci extends WjBaseSingleOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.CCI;
        }
    }

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
    export class wjFlexChartRsi extends WjBaseSingleOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.RSI;
        }
    }

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
    export class wjFlexChartWilliamsR extends WjBaseSingleOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.WilliamsR;
        }
    }

    export class WjFlexChartMacdBase extends WjBaseOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.MacdBase;
        }
    }

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
    export class wjFlexChartMacd extends WjFlexChartMacdBase {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.Macd;
        }
    }

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
    export class wjFlexChartMacdHistogram extends WjFlexChartMacdBase {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.MacdHistogram;
        }
    }

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
    export class wjFlexChartStochastic extends WjBaseOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.Stochastic;
        }
    }

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
    export class wjFlexChartBollingerBands extends WjBaseOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.BollingerBands;
        }
    }


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
    export class wjFlexChartEnvelopes extends WjBaseOverlayIndicator {
        _getControlConstructor(): any {
            return wijmo.chart.finance.analytics.Envelopes;
        }
    }
} 

// Register bindings
(<any>(ko.bindingHandlers)).wjFlexChart = new wijmo.knockout.wjFlexChart();
(<any>(ko.bindingHandlers)).wjFlexPie = new wijmo.knockout.wjFlexPie();
(<any>(ko.bindingHandlers)).wjFlexChartAxis = new wijmo.knockout.wjFlexChartAxis();
(<any>(ko.bindingHandlers)).wjFlexChartLegend = new wijmo.knockout.wjFlexChartLegend();
(<any>(ko.bindingHandlers)).wjFlexChartSeries = new wijmo.knockout.wjFlexChartSeries();
(<any>(ko.bindingHandlers)).wjFinancialChart = new wijmo.knockout.wjFinancialChart();
(<any>(ko.bindingHandlers)).wjFinancialChartSeries = new wijmo.knockout.wjFinancialChartSeries();
(<any>(ko.bindingHandlers)).wjFlexChartLineMarker = new wijmo.knockout.wjFlexChartLineMarker();
(<any>(ko.bindingHandlers)).wjFlexChartRangeSelector = new wijmo.knockout.wjFlexChartRangeSelector();
(<any>(ko.bindingHandlers)).wjFlexChartGestures = new wijmo.knockout.wjFlexChartGestures();
(<any>(ko.bindingHandlers)).wjFlexChartPlotArea = new wijmo.knockout.wjFlexChartPlotArea();
(<any>(ko.bindingHandlers)).wjFlexChartDataPoint = new wijmo.knockout.wjFlexChartDataPoint();
(<any>(ko.bindingHandlers)).wjFlexChartAnnotationLayer = new wijmo.knockout.wjFlexChartAnnotationLayer();
(<any>(ko.bindingHandlers)).wjFlexChartAnnotation = new wijmo.knockout.wjFlexChartAnnotation();
(<any>(ko.bindingHandlers)).wjFlexChartAnimation = new wijmo.knockout.wjFlexChartAnimation();
(<any>(ko.bindingHandlers)).wjFlexChartTrendLine = new wijmo.knockout.wjFlexChartTrendLine();
(<any>(ko.bindingHandlers)).wjFlexChartMovingAverage = new wijmo.knockout.wjFlexChartMovingAverage();
(<any>(ko.bindingHandlers)).wjFlexChartYFunctionSeries = new wijmo.knockout.wjFlexChartYFunctionSeries();
(<any>(ko.bindingHandlers)).wjFlexChartParametricFunctionSeries = new wijmo.knockout.wjFlexChartParametricFunctionSeries();
(<any>(ko.bindingHandlers)).wjFlexChartWaterfall = new wijmo.knockout.wjFlexChartWaterfall();
(<any>(ko.bindingHandlers)).wjFlexChartFibonacci = new wijmo.knockout.wjFlexChartFibonacci();
(<any>(ko.bindingHandlers)).wjFlexChartFibonacciArcs = new wijmo.knockout.wjFlexChartFibonacciArcs();
(<any>(ko.bindingHandlers)).wjFlexChartFibonacciFans = new wijmo.knockout.wjFlexChartFibonacciFans();
(<any>(ko.bindingHandlers)).wjFlexChartFibonacciTimeZones = new wijmo.knockout.wjFlexChartFibonacciTimeZones();
(<any>(ko.bindingHandlers)).wjFlexChartAtr = new wijmo.knockout.wjFlexChartAtr();
(<any>(ko.bindingHandlers)).wjFlexChartCci = new wijmo.knockout.wjFlexChartCci();
(<any>(ko.bindingHandlers)).wjFlexChartRsi = new wijmo.knockout.wjFlexChartRsi();
(<any>(ko.bindingHandlers)).wjFlexChartWilliamsR = new wijmo.knockout.wjFlexChartWilliamsR();
(<any>(ko.bindingHandlers)).wjFlexChartMacd = new wijmo.knockout.wjFlexChartMacd();
(<any>(ko.bindingHandlers)).wjFlexChartMacdHistogram = new wijmo.knockout.wjFlexChartMacdHistogram();
(<any>(ko.bindingHandlers)).wjFlexChartStochastic = new wijmo.knockout.wjFlexChartStochastic();
(<any>(ko.bindingHandlers)).wjFlexChartBollingerBands = new wijmo.knockout.wjFlexChartBollingerBands();
(<any>(ko.bindingHandlers)).wjFlexChartEnvelopes = new wijmo.knockout.wjFlexChartEnvelopes();
