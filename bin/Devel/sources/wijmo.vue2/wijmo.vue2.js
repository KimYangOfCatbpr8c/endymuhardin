/**
 * Wijmo interop module for <a href="https://vuejs.org/2016/04/27/announcing-2.0/">Vue 2</a>.
 *
 * This module provides Vue 2 components that encapsulate Wijmo controls.
 *
 * To use it, your application must include references to the Vue 2
 * framework (RC6 or later), as well as the regular Wijmo CSS and js files.
 *
 * To add Wijmo controls to Vue pages, include the appropriate
 * tags in your HTML files. For example, the code below adds
 * an @see:InputNumber control to a Vue page:
 *
 * <pre>&lt;wj-input-number
 *   format="c2"
 *   placeholder="Sales"
 *   :value="sales"
 *   :value-changed="salesChanged"
 *   :min="0"
 *   :max="10000"
 *   :step="100"
 *   :is-required="false"&gt;
 * &lt;/wj-input-number&gt;</pre>
 *
 * <pre>// Wijmo event handler
 * // update "sales" value to match the InputNumber value
 * function salesChanged(sender, eventArgs) {
 *   this.sales = sender.value;
 * }</pre>
 *
 * The example illustrates the following important points:
 *
 * <ol>
 *   <li>
 *      Wijmo controls have tag names that start with the "wj" prefix, followed by
 *      the control name using lower-case and hyphen separators.</li>
 *   <li>
 *      The tag attribute names match the control's properties and events.</li>
 *   <li>
 *      Colons before attribute names indicate the attribute value should be
 *      interpreted as JavaScript expressions (e.g. <code>:min="0"</code>).</li>
 *   <li>
 *      Event handlers are specified the same way as regular properties
 *      (e.g. <code>:value-changed="salesChanged"</code>).</li>
 *   <li>
 *      In Vue2, all bindings are one-way. In the example above, the "salesChanged"
 *      event handler is responsible for updating the value of the "sales"
 *      property in the model. This is a change from Vue 1, where two-way bindings
 *      could be created by adding the ".sync" suffix to any attribute.</li>
 * </ol>
 */
var wijmo;
(function (wijmo) {
    var vue2;
    (function (vue2) {
        // ** Include component
        /**
         * Vue component that includes a given HTML fragment into the document.
         *
         * The <b>wj-include</b> component takes a <b>src</b> attribute that
         * specifies a file to load and include into the document. For example:
         *
         * <pre>&lt;wj-popup control="modalDialog" :modal="true" :hide-trigger="None"&gt;
         *   &lt;wj-include src="includes/dialog.htm"&gt;&lt;/wj-include&gt;
         * &lt;/wj-popup&gt;</pre>
         */
        vue2.WjInclude = Vue.component('wj-include', {
            template: '<div/>',
            props: ['src'],
            mounted: function () {
                var _this = this;
                wijmo.httpRequest(this.src, {
                    success: function (xhr) {
                        _this.$el.innerHTML = xhr.response;
                    }
                });
            }
        });
        // ** Globalization filter
        /**
         * Vue filter that applies globalized formatting to dates and numbers.
         *
         * For example, the code below uses the <b>wj-format</b> filter to format
         * a number as a currency value and a date as a short date using the
         * current Wijmo culture:
         *
         * <pre>&lt;p&gt;value: {&#8203;{ theAmount | wj-format('c') }}&lt;/p&gt;
         * &lt;p&gt;date: {&#8203;{ theDate | wj-format('d') }}&lt;/p&gt;</pre>
         */
        vue2.WjFormat = Vue.filter('wj-format', function (value, format) {
            return wijmo.Globalize.format(value, format);
        });
        // ** wijmo.input components
        /**
         * Vue component that encapsulates the @see:wijmo.input.AutoComplete control.
         */
        vue2.WjAutoComplete = Vue.component('wj-auto-complete', {
            template: '<div/>',
            props: _getProps('wijmo.input.AutoComplete'),
            mounted: function () {
                _initialize(this, new wijmo.input.AutoComplete(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.Calendar control.
         */
        vue2.WjCalendar = Vue.component('wj-calendar', {
            template: '<div/>',
            props: _getProps('wijmo.input.Calendar'),
            mounted: function () {
                _initialize(this, new wijmo.input.Calendar(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.ColorPicker control.
         */
        vue2.WjColorPicker = Vue.component('wj-color-picker', {
            template: '<div/>',
            props: _getProps('wijmo.input.ColorPicker'),
            mounted: function () {
                _initialize(this, new wijmo.input.ColorPicker(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.ComboBox control.
         */
        vue2.WjComboBox = Vue.component('wj-combo-box', {
            template: '<div/>',
            props: _getProps('wijmo.input.ComboBox'),
            mounted: function () {
                _initialize(this, new wijmo.input.ComboBox(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputColor control.
         */
        vue2.WjInputColor = Vue.component('wj-input-color', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputColor'),
            mounted: function () {
                _initialize(this, new wijmo.input.InputColor(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputDate control.
         */
        vue2.WjInputDate = Vue.component('wj-input-date', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputDate'),
            mounted: function () {
                _initialize(this, new wijmo.input.InputDate(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputDateTime control.
         */
        vue2.WjInputDateTime = Vue.component('wj-input-date-time', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputDateTime'),
            mounted: function () {
                _initialize(this, new wijmo.input.InputDateTime(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputMask control.
         */
        vue2.WjInputMask = Vue.component('wj-input-mask', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputMask'),
            mounted: function () {
                _initialize(this, new wijmo.input.InputMask(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputNumber control.
         */
        vue2.WjInputNumber = Vue.component('wj-input-number', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputNumber'),
            mounted: function () {
                _initialize(this, new wijmo.input.InputNumber(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputTime control.
         */
        vue2.WjInputTime = Vue.component('wj-input-time', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputTime'),
            mounted: function () {
                _initialize(this, new wijmo.input.InputTime(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.ListBox control.
         */
        vue2.WjListBox = Vue.component('wj-list-box', {
            template: '<div/>',
            props: _getProps('wijmo.input.ListBox'),
            mounted: function () {
                _initialize(this, new wijmo.input.ListBox(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.MultiSelect control.
         */
        vue2.WjMultiSelect = Vue.component('wj-multi-select', {
            template: '<div/>',
            props: _getProps('wijmo.input.MultiSelect'),
            mounted: function () {
                _initialize(this, new wijmo.input.MultiSelect(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.Menu control.
         */
        vue2.WjMenu = Vue.component('wj-menu', {
            template: '<div/>',
            props: _getProps('wijmo.input.Menu'),
            mounted: function () {
                _initialize(this, new wijmo.input.Menu(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.Popup control.
         */
        vue2.WjPopup = Vue.component('wj-popup', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.input.Popup'),
            mounted: function () {
                _initialize(this, new wijmo.input.Popup(this.$el));
            }
        });
        // ** wijmo.grid components
        /**
         * Vue component that encapsulates the @see:wijmo.grid.FlexGrid control.
         *
         * The example below shows how to instantiate and initialize a
         * @see:wijmo.grid.FlexGrid control using Vue markup:
         *
         * <pre>&lt;wj-flex-grid
         *   :items-source="data"&gt;
         *   &lt;wj-flex-grid-column binding="name" header="Name"&gt;
         *   &lt;/wj-flex-grid-column&gt;
         *   &lt;wj-flex-grid-column binding="sales" header="Sales" format="c0"&gt;
         *   &lt;/wj-flex-grid-column&gt;
         *   &lt;wj-flex-grid-column binding="expenses" header="Expenses" format="c0"&gt;
         *   &lt;/wj-flex-grid-column&gt;
         *   &lt;wj-flex-grid-column binding="active" header="Active"&gt;
         *   &lt;/wj-flex-grid-column&gt;
         *   &lt;wj-flex-grid-column binding="date" header="Date"&gt;
         *   &lt;/wj-flex-grid-column&gt;
         * &lt;/wj-flex-grid&gt;</pre>
         *
         * The code sets the <b>itemsSource</b> property to a collection that contains the grid
         * data, then specifies the columns to display using <b>wj-flex-grid-column</b>
         * components.
         */
        vue2.WjFlexGrid = Vue.component('wj-flex-grid', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.grid.FlexGrid'),
            mounted: function () {
                var _this = this;
                // check whether we have any columns
                var autoGenerateColumns = true;
                this.$children.forEach(function (item) {
                    switch (item.$options.name) {
                        case 'wj-flex-grid-column':
                            autoGenerateColumns = false;
                            break;
                    }
                });
                // instantiate the control
                var ctl = new wijmo.grid.FlexGrid(this.$el, {
                    autoGenerateColumns: autoGenerateColumns
                });
                // add columns, filter
                this.$children.forEach(function (item) {
                    switch (item.$options.name) {
                        case 'wj-flex-grid-column':
                            var col = _initialize(item, new wijmo.grid.Column());
                            ctl.columns.push(col);
                            break;
                        case 'wj-flex-grid-filter':
                            var filter = _initialize(item, new wijmo.grid.filter.FlexGridFilter(ctl));
                            break;
                    }
                    _this.$el.removeChild(item.$el);
                });
                // initialize the control
                _initialize(this, ctl);
            }
        });
        /**
         * Vue component that represents a @see:wijmo.grid.Column in a
         * @see:wijmo.grid.FlexGrid control.
         */
        vue2.WjFlexGridColumn = Vue.component('wj-flex-grid-column', {
            template: '<div/>',
            props: _getProps('wijmo.grid.Column')
        });
        /**
         * Vue component that represents a @see:wijmo.grid.filter.FlexGridFilter in a
         * @see:wijmo.grid.FlexGrid control.
         *
         * The example below shows how to instantiate and initialize a
         * @see:wijmo.grid.FlexGrid control with a filter using Vue markup:
         *
         * <pre>&lt;wj-flex-grid
         *   :items-source="data"&gt;
         *   &lt;wj-flex-grid-filter&gt;&lt;/wj-flex-grid-filter&gt;
         * &lt;/wj-flex-grid&gt;</pre>
         */
        vue2.WjFlexGridFilter = Vue.component('wj-flex-grid-filter', {
            template: '<div/>',
            props: _getProps('wijmo.grid.filter.FlexGridFilter')
        });
        // ** wijmo.chart components
        /**
         * Vue component that encapsulates the @see:wijmo.chart.FlexChart control.
         *
         * The example below shows how to instantiate and initialize a
         * @see:wijmo.chart.FlexChart control using Vue markup:
         *
         * <pre>&lt;wj-flex-chart
         *     :items-source="data"
         *     binding-x="country"
         *     :header="props.header"
         *     :footer="props.footer"&gt;
         *
         *     &lt;wj-flex-chart-legend :position="props.legendPosition"&gt;
         *     &lt;/wj-flex-chart-legend&gt;
         *     &lt;wj-flex-chart-axis wj-property="axisX" :title="props.titleX"&gt;
         *     &lt;/wj-flex-chart-axis&gt;
         *     &lt;wj-flex-chart-axis wj-property="axisY" :title="props.titleY"&gt;
         *     &lt;/wj-flex-chart-axis&gt;
         *
         *     &lt;wj-flex-chart-series name="Sales" binding="sales"&gt;
         *     &lt;/wj-flex-chart-series&gt;
         *     &lt;wj-flex-chart-series name="Expenses" binding="expenses"&gt;
         *     &lt;/wj-flex-chart-series&gt;
         *     &lt;wj-flex-chart-series name="Downloads" binding="downloads"&gt;
         *     &lt;/wj-flex-chart-series&gt;
         * &lt;/wj-flex-chart&gt;</pre>
         *
         * The code sets the <b>itemsSource</b> property to a collection that contains the chart
         * data and the <b>bindingX</b> property to the data property that contains the chart X values.
         * It also sets the chart's <b>header</b> and <b>footer</b> properties to define titles to
         * show above and below the chart.
         *
         * The <b>wj-flex-chart-legend</b> and <b>wj-flex-chart-axis</b> components are used to
         * customize the chart's legend and axes.
         *
         * Finally, three <b>wj-flex-chart-series</b> components are used to specify the data
         * properties to be shown on the chart.
         */
        vue2.WjFlexChart = Vue.component('wj-flex-chart', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.chart.FlexChart', ['tooltipContent']),
            mounted: function () {
                var _this = this;
                // instantiate the control
                var ctl = new wijmo.chart.FlexChart(this.$el);
                // add series, axes, legend
                this.$children.forEach(function (item) {
                    switch (item.$options.name) {
                        case 'wj-flex-chart-series':
                            var series = _initialize(item, new wijmo.chart.Series());
                            // special case: get 'style' property from series host element
                            // note: can't simply assign the style because that won't work in Chrome
                            if (item.$el.style.cssText.length) {
                                var style = {};
                                item.$el.style.cssText.split(';').forEach(function (prop) {
                                    var kv = prop.split(':');
                                    if (kv.length == 2) {
                                        style[kv[0].trim()] = kv[1].trim();
                                    }
                                });
                                series.style = style;
                            }
                            ctl.series.push(series);
                            break;
                        case 'wj-flex-chart-legend':
                            var legend = _initialize(item, new wijmo.chart.Legend(null));
                            ctl.legend = legend;
                            break;
                        case 'wj-flex-chart-axis':
                            var axis = _initialize(item, new wijmo.chart.Axis());
                            if (item.wjProperty) {
                                ctl[item.wjProperty] = axis;
                            }
                            else {
                                ctl.axes.push(axis);
                            }
                            break;
                    }
                    _this.$el.removeChild(item.$el);
                });
                // add tooltip
                if (this.tooltipContent) {
                    ctl.tooltip.content = this.tooltipContent;
                }
                // initialize the control
                _initialize(this, ctl);
            }
        });
        /**
         * Vue component that represents a @see:wijmo.chart.Series in a
         * @see:wijmo.chart.FlexChart control.
         */
        vue2.WjFlexChartSeries = Vue.component('wj-flex-chart-series', {
            template: '<div/>',
            props: _getProps('wijmo.chart.Series')
        });
        /**
         * Vue component that represents the @see:wijmo.chart.Legend in a
         * @see:wijmo.chart.FlexChart control.
         */
        vue2.WjFlexChartLegend = Vue.component('wj-flex-chart-legend', {
            template: '<div/>',
            props: _getProps('wijmo.chart.Legend')
        });
        /**
         * Vue component that represents a @see:wijmo.chart.Axis in a
         * @see:wijmo.chart.FlexChart control.
         */
        vue2.WjFlexChartAxis = Vue.component('wj-flex-chart-axis', {
            template: '<div/>',
            props: _getProps('wijmo.chart.Axis', ['wjProperty'])
        });
        // ** wijmo.gauge components
        /**
         * Vue component that encapsulates the @see:wijmo.gauge.RadialGauge control.
         *
         * The example below shows how to instantiate and initialize a
         * @see:wijmo.gauge.RadialGauge control using Vue markup:
         *
         * <pre>&lt;wj-radial-gauge
         *     :min="0" :max="1000" :step="50" :is-read-only="false"
         *     format="c0" :thumb-size="12" :show-text="Value"
         *     :show-ranges="false"
         *     :value="sales"
         *     :value-changed="salesChanged"&gt;
         *     &lt;wj-range wj-property="face" :thickness="0.5"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range wj-property="pointer" :thickness="0.5"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range :min="0" :max="333" color="red"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range :min="333" :max="666" color="gold"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range :min="666" :max="1000" color="green"&gt;
         *     &lt;/wj-range&gt;
         * &lt;/wj-radial-gauge&gt;</pre>
         *
         * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
         * to define the range of the gauge and to allow users to edit its value.
         * Next, it binds the gauge's <b>value</b> property to a <b>sales</b> variable
         * in the controller.
         *
         * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
         * properties to define the appearance of the gauge. Finally, the markup sets
         * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
         * that will control the color of the <b>value</b> range depending on the gauge's
         * current value.
         */
        vue2.WjRadialGauge = Vue.component('wj-radial-gauge', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.gauge.RadialGauge'),
            mounted: function () {
                var ctl = new wijmo.gauge.RadialGauge(this.$el);
                _addRanges(this, ctl);
                _initialize(this, ctl);
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.gauge.LinearGauge control.
         *
         * The example below shows how to instantiate and initialize a
         * @see:wijmo.gauge.LinearGauge control using Vue markup:
         *
         * <pre>&lt;wj-linear-gauge
         *     :min="0" :max="1000" :step="50" :is-read-only="false"
         *     format="c0" :thumb-size="20"
         *     :show-ranges="false"
         *     :value="sales"
         *     :value-changed="salesChanged"&gt;
         *     &lt;wj-range wj-property="face" :thickness="0.5"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range wj-property="pointer" :thickness="0.5"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range :min="0" :max="333" color="red"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range :min="333" :max="666" color="gold"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range :min="666" :max="1000" color="green"&gt;
         *     &lt;/wj-range&gt;
         * &lt;/wj-linear-gauge&gt;</pre>
         *
         * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
         * to define the range of the gauge and to allow users to edit its value.
         * Next, it binds the gauge's <b>value</b> property to a <b>sales</b> variable
         * in the controller.
         *
         * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
         * properties to define the appearance of the gauge. Finally, the markup sets
         * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
         * that will control the color of the <b>value</b> range depending on the gauge's
         * current value.
         */
        vue2.WjLinearGauge = Vue.component('wj-linear-gauge', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.gauge.LinearGauge'),
            mounted: function () {
                var ctl = new wijmo.gauge.LinearGauge(this.$el);
                _addRanges(this, ctl);
                _initialize(this, ctl);
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.gauge.BulletGraph control.
         */
        vue2.WjBulletGraph = Vue.component('wj-bullet-graph', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.gauge.BulletGraph'),
            mounted: function () {
                var ctl = new wijmo.gauge.BulletGraph(this.$el);
                _addRanges(this, ctl);
                _initialize(this, ctl);
            }
        });
        /**
         * Vue component that represents a @see:wijmo.gauge.Range in a
         * @see:wijmo.gauge.Gauge control.
         */
        vue2.WjRange = Vue.component('wj-range', {
            template: '<div/>',
            props: _getProps('wijmo.gauge.Range', ['wjProperty']),
        });
        // add ranges to a gauge component
        function _addRanges(component, ctl) {
            component.$children.forEach(function (item) {
                switch (item.$options.name) {
                    case 'wj-range':
                        var range = _initialize(item, new wijmo.gauge.Range());
                        if (item.wjProperty) {
                            ctl[item.wjProperty] = range;
                        }
                        else {
                            ctl.ranges.push(range);
                        }
                        break;
                }
                component.$el.removeChild(item.$el);
            });
        }
        // ** wijmo.olap components
        /**
         * Vue component that encapsulates the @see:wijmo.olap.PivotPanel control.
         */
        vue2.WjPivotPanel = Vue.component('wj-pivot-panel', {
            template: '<div/>',
            props: _getProps('wijmo.olap.PivotPanel'),
            mounted: function () {
                _initialize(this, new wijmo.olap.PivotPanel(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.olap.PivotGrid control.
         */
        vue2.WjPivotGrid = Vue.component('wj-pivot-grid', {
            template: '<div/>',
            props: _getProps('wijmo.olap.PivotGrid'),
            mounted: function () {
                _initialize(this, new wijmo.olap.PivotGrid(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.olap.PivotChart control.
         */
        vue2.WjPivotChart = Vue.component('wj-pivot-chart', {
            template: '<div/>',
            props: _getProps('wijmo.olap.PivotChart'),
            mounted: function () {
                _initialize(this, new wijmo.olap.PivotChart(this.$el));
            }
        });
        // ** utilities
        // get an array with a control's properties and events
        function _getProps(ctlClass, extraProps) {
            // resolve control class (in case the module hasn't been loaded)
            var cls = window, ns = ctlClass.split('.');
            for (var i = 0; i < ns.length && cls != null; i++) {
                cls = cls[ns[i]];
            }
            if (!cls)
                return null;
            // start with 'special' members
            var p = ['control', 'initialized'];
            // add properties and events on this class and all ancestors
            for (var proto = cls.prototype; proto != Object.prototype; proto = Object.getPrototypeOf(proto)) {
                var props = Object.getOwnPropertyNames(proto);
                for (var i = 0; i < props.length; i++) {
                    var prop = props[i], pd = Object.getOwnPropertyDescriptor(proto, prop), eventRaiser = prop.match(/^on[A-Z]/);
                    if (pd.set || eventRaiser) {
                        if (eventRaiser) {
                            prop = prop[2].toLowerCase() + prop.substr(3);
                        }
                        if (p.indexOf(prop) < 0 && !prop.match(/disabled|required/)) {
                            p.push(prop);
                        }
                    }
                }
            }
            // add extra properties
            if (extraProps) {
                Array.prototype.push.apply(p, extraProps);
            }
            // done
            return p;
        }
        // initialize control properties from component, add watchers to keep the control in sync
        function _initialize(component, ctl) {
            // build list of sorted property names
            // do this so itemsSource is set before selectedItem, text, value, etc.
            // it would be better if Vue allowed us to use the argument order, 
            // but it doesn't seem to allow that...
            var props = [];
            for (var prop in component.$options.propsData) {
                props.push(prop);
            }
            props.sort();
            // initialize properties (before setting up event handlers)
            props.forEach(function (prop) {
                if (prop in ctl && !(ctl[prop] instanceof wijmo.Event) && !wijmo.isUndefined(component[prop])) {
                    ctl[prop] = component[prop];
                    component.$watch(prop, _updateControl.bind({ ctl: ctl, prop: prop }));
                }
            });
            function _updateControl(newValue) {
                this.ctl[this.prop] = newValue;
            }
            // hook up event handlers
            props.forEach(function (prop) {
                if (ctl[prop] instanceof wijmo.Event) {
                    var event = ctl[prop];
                    if (wijmo.isFunction(component[prop])) {
                        event.addHandler(component[prop], ctl);
                    }
                }
            });
            // set 'control' pseudo-property so it's accessible to parent component
            if (component.control && component.$parent) {
                component.$parent[component.control] = ctl;
            }
            // invoke 'initialized' event
            if (wijmo.isFunction(component.initialized)) {
                component.initialized(ctl);
            }
            // done, return a reference to the control
            return ctl;
        }
    })(vue2 = wijmo.vue2 || (wijmo.vue2 = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.vue2.js.map