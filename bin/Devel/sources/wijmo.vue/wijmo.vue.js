/**
 * Wijmo interop module for <a href="https://vuejs.org/">Vue</a>.
 *
 * This module provides Vue components that encapsulate Wijmo controls.
 *
 * To use it, your application must include references to the Vue
 * framework, as well as the regular Wijmo CSS and js files.
 *
 * To add Wijmo controls to Vue pages, include the appropriate
 * tags in your HTML files. For example, the code below adds
 * an @see:InputNumber control to a Vue page:
 *
 * <pre>&lt;wj-input-number
 *   format="c2"
 *   placeholder="Sales"
 *   :value.sync="view.currentItem.sales"
 *   :value-changed="refreshView"
 *   :min="0"
 *   :max="10000"
 *   :step="100"
 *   :is-required="false"&gt;
 * &lt;/wj-input-number&gt;</pre>
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
 *      The <code>.sync</code> suffix after attribute names indicate the binding
 *      it two-way (e.g. <code>:value.sync="view.currentItem.sales"</code>).</li>
 *   <li>
 *      Event handlers are specified the same way as regular one-way properties
 *      (e.g. <code>:value-changed="refreshView"</code>).</li>
 * </ol>
 *
 * All Wijmo Vue components include a "control" pseudo-property that allow you
 * to use the control's properties in the markup. For example:
 *
 * &lt;wj-list-box style="height:150px;width:250px;"
 *   :items-source="countries"
 *   control="listBox"&gt;
 * &lt;/wj-list-box&gt;
 * &lt;p&gt;
 *   selectedIndex: {{ listBox.selectedIndex }}&lt;/p&gt;
 * &lt;p&gt;
 *   selectedValue: {{ listBox.selectedValue }}&lt;/p&gt;
 *
 * The markup sets the controller's <b>listBox</b> property to the instance of
 * the <b>ListBox</b> control, so it can be used in markup.
 *
 * It is important that the <b>listBox</b> property be defined in <b>data</b>
 * object of the containing Vue context, or the component properties will not
 * be updated properly. For example:
 *
 * <pre>// Vue application
 * var app = new Vue({
 *   el: '#app',
 *   data: {
 *     listBox: null // will receive a reference to the ListBox control
 *   }
 * });</pre>
 */
var wijmo;
(function (wijmo) {
    var vue;
    (function (vue) {
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
        vue.WjInclude = Vue.component('wj-include', {
            template: '<div/>',
            props: ['src'],
            attached: function () {
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
         * <pre>&lt;p&gt;value: {&#8203;{ theAmount | wj-format 'c' }}&lt;/p&gt;
         * &lt;p&gt;date: {&#8203;{ theDate | wj-format 'd' }}&lt;/p&gt;</pre>
         */
        vue.WjFormat = Vue.filter('wj-format', function (value, format) {
            return wijmo.Globalize.format(value, format);
        });
        // ** wijmo.input components
        /**
         * Vue component that encapsulates the @see:wijmo.input.AutoComplete control.
         */
        vue.WjAutoComplete = Vue.component('wj-auto-complete', {
            template: '<div/>',
            props: _getProps('wijmo.input.AutoComplete'),
            attached: function () {
                _initialize(this, new wijmo.input.AutoComplete(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.Calendar control.
         */
        vue.WjCalendar = Vue.component('wj-calendar', {
            template: '<div/>',
            props: _getProps('wijmo.input.Calendar'),
            attached: function () {
                _initialize(this, new wijmo.input.Calendar(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.ColorPicker control.
         */
        vue.WjColorPicker = Vue.component('wj-color-picker', {
            template: '<div/>',
            props: _getProps('wijmo.input.ColorPicker'),
            attached: function () {
                _initialize(this, new wijmo.input.ColorPicker(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.ComboBox control.
         */
        vue.WjComboBox = Vue.component('wj-combo-box', {
            template: '<div/>',
            props: _getProps('wijmo.input.ComboBox'),
            attached: function () {
                _initialize(this, new wijmo.input.ComboBox(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputColor control.
         */
        vue.WjInputColor = Vue.component('wj-input-color', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputColor'),
            attached: function () {
                _initialize(this, new wijmo.input.InputColor(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputDate control.
         */
        vue.WjInputDate = Vue.component('wj-input-date', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputDate'),
            attached: function () {
                _initialize(this, new wijmo.input.InputDate(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputDateTime control.
         */
        vue.WjInputDateTime = Vue.component('wj-input-date-time', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputDateTime'),
            attached: function () {
                _initialize(this, new wijmo.input.InputDateTime(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputMask control.
         */
        vue.WjInputMask = Vue.component('wj-input-mask', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputMask'),
            attached: function () {
                _initialize(this, new wijmo.input.InputMask(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputNumber control.
         */
        vue.WjInputNumber = Vue.component('wj-input-number', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputNumber'),
            attached: function () {
                _initialize(this, new wijmo.input.InputNumber(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.InputTime control.
         */
        vue.WjInputTime = Vue.component('wj-input-time', {
            template: '<div/>',
            props: _getProps('wijmo.input.InputTime'),
            attached: function () {
                _initialize(this, new wijmo.input.InputTime(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.ListBox control.
         */
        vue.WjListBox = Vue.component('wj-list-box', {
            template: '<div/>',
            props: _getProps('wijmo.input.ListBox'),
            attached: function () {
                _initialize(this, new wijmo.input.ListBox(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.MultiSelect control.
         */
        vue.WjMultiSelect = Vue.component('wj-multi-select', {
            template: '<div/>',
            props: _getProps('wijmo.input.MultiSelect'),
            attached: function () {
                _initialize(this, new wijmo.input.MultiSelect(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.Menu control.
         */
        vue.WjMenu = Vue.component('wj-menu', {
            template: '<div/>',
            props: _getProps('wijmo.input.Menu'),
            attached: function () {
                _initialize(this, new wijmo.input.Menu(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.input.Popup control.
         */
        vue.WjPopup = Vue.component('wj-popup', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.input.Popup'),
            attached: function () {
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
        vue.WjFlexGrid = Vue.component('wj-flex-grid', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.grid.FlexGrid'),
            attached: function () {
                var ctl = new wijmo.grid.FlexGrid(this.$el, {
                    autoGenerateColumns: this.$children.length == 0
                });
                _initialize(this, ctl);
            }
        });
        /**
         * Vue component that represents a @see:wijmo.grid.Column in a
         * @see:wijmo.grid.FlexGrid control.
         */
        vue.WjFlexGridColumn = Vue.component('wj-flex-grid-column', {
            template: '<div/>',
            props: _getProps('wijmo.grid.Column'),
            attached: function () {
                var grid = wijmo.Control.getControl(this.$parent.$el), col = new wijmo.grid.Column();
                _initialize(this, col);
                grid.columns.push(col);
                this.$parent.$el.removeChild(this.$el);
            }
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
        vue.WjFlexChart = Vue.component('wj-flex-chart', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.chart.FlexChart', ['tooltipContent']),
            attached: function () {
                _initialize(this, new wijmo.chart.FlexChart(this.$el));
                if (this.tooltipContent) {
                    var chart = wijmo.Control.getControl(this.$el);
                    chart.tooltip.content = this.tooltipContent;
                }
            }
        });
        /**
         * Vue component that represents a @see:wijmo.chart.Series in a
         * @see:wijmo.chart.FlexChart control.
         */
        vue.WjFlexChartSeries = Vue.component('wj-flex-chart-series', {
            template: '<div/>',
            props: _getProps('wijmo.chart.Series'),
            attached: function () {
                var chart = wijmo.Control.getControl(this.$parent.$el), series = new wijmo.chart.Series();
                _initialize(this, series);
                chart.series.push(series);
                this.$parent.$el.removeChild(this.$el);
            }
        });
        /**
         * Vue component that represents the @see:wijmo.chart.Legend in a
         * @see:wijmo.chart.FlexChart control.
         */
        vue.WjFlexChartLegend = Vue.component('wj-flex-chart-legend', {
            template: '<div/>',
            props: _getProps('wijmo.chart.Legend'),
            attached: function () {
                var chart = wijmo.Control.getControl(this.$parent.$el), legend = chart.legend;
                _initialize(this, legend);
                this.$parent.$el.removeChild(this.$el);
            }
        });
        /**
         * Vue component that represents a @see:wijmo.chart.Axis in a
         * @see:wijmo.chart.FlexChart control.
         */
        vue.WjFlexChartAxis = Vue.component('wj-flex-chart-axis', {
            template: '<div/>',
            props: _getProps('wijmo.chart.Axis', ['wjProperty']),
            attached: function () {
                var chart = wijmo.Control.getControl(this.$parent.$el), axis = chart[this.wjProperty];
                _initialize(this, axis);
                this.$parent.$el.removeChild(this.$el);
            }
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
         *     :value.sync="sales"&gt;
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
        vue.WjRadialGauge = Vue.component('wj-radial-gauge', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.gauge.RadialGauge'),
            attached: function () {
                _initialize(this, new wijmo.gauge.RadialGauge(this.$el));
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
         *     :value.sync="sales"&gt;
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
        vue.WjLinearGauge = Vue.component('wj-linear-gauge', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.gauge.LinearGauge'),
            attached: function () {
                _initialize(this, new wijmo.gauge.LinearGauge(this.$el));
            }
        });
        /**
         * Vue component that encapsulates the @see:wijmo.gauge.BulletGraph control.
         */
        vue.WjBulletGraph = Vue.component('wj-bullet-graph', {
            template: '<div><slot/></div>',
            props: _getProps('wijmo.gauge.BulletGraph'),
            attached: function () {
                _initialize(this, new wijmo.gauge.BulletGraph(this.$el));
            }
        });
        /**
         * Vue component that represents a @see:wijmo.gauge.Range in a
         * @see:wijmo.gauge.Gauge control.
         */
        vue.WjRange = Vue.component('wj-range', {
            template: '<div/>',
            props: _getProps('wijmo.gauge.Range', ['wjProperty']),
            attached: function () {
                var gauge = wijmo.Control.getControl(this.$parent.$el), rng = new wijmo.gauge.Range();
                _initialize(this, rng);
                if (this.wjProperty) {
                    gauge[this.wjProperty] = rng;
                }
                else {
                    gauge.ranges.push(rng);
                }
                this.$parent.$el.removeChild(this.$el);
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
        function _initialize(component, control) {
            // build list of sorted property names
            // do this so itemsSource is set before selectedItem, text, value, etc.
            // it would be better if Vue allowed us to use the argument order, 
            // but it doesn't seem to allow that...
            var props = [];
            for (var prop in component.$options.props) {
                if (!wijmo.isUndefined(component[prop])) {
                    props.push(prop);
                }
            }
            props.sort();
            // initialize and watch control properties to update control
            props.forEach(function (prop) {
                if (!(control[prop] instanceof wijmo.Event)) {
                    control[prop] = component[prop];
                    component.$watch(prop, _updateControl.bind({ control: control, prop: prop }));
                }
            });
            function _updateControl(newValue) {
                this.control[this.prop] = newValue;
            }
            // call event handlers and update component in response to control events
            props.forEach(function (prop) {
                // call event handlers
                if (control[prop] instanceof wijmo.Event) {
                    var event = control[prop];
                    if (wijmo.isFunction(component[prop])) {
                        event.addHandler(component[prop], control);
                    }
                }
                else {
                    var event = control[prop + 'Changed'];
                    if (event instanceof wijmo.Event) {
                        event.addHandler(_updateComponent.bind({
                            component: component,
                            control: control,
                            prop: prop
                        }));
                    }
                }
            });
            function _updateComponent() {
                this.component[this.prop] = this.control[this.prop];
            }
            // set 'control' pseudo-property so it's accessible to parent component
            if (component.control && component.$parent) {
                component.$parent[component.control] = control;
            }
            // invoke 'initialized' event
            if (wijmo.isFunction(component.initialized)) {
                component.initialized(control);
            }
        }
    })(vue = wijmo.vue || (wijmo.vue = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.vue.js.map