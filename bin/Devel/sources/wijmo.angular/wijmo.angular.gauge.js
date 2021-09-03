var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//
// AngularJS directives for wijmo.gauge module
//
var wijmo;
(function (wijmo) {
    var angular;
    (function (angular) {
        //#region "Gauge directives registration"
        var wijmoGauge = window['angular'].module('wj.gauge', []);
        // register only if module is loaded
        if (wijmo.gauge && wijmo.gauge.LinearGauge) {
            wijmoGauge.directive('wjLinearGauge', [function () {
                    return new WjLinearGauge();
                }]);
            wijmoGauge.directive('wjBulletGraph', [function () {
                    return new WjBulletGraph();
                }]);
            wijmoGauge.directive('wjRadialGauge', [function () {
                    return new WjRadialGauge();
                }]);
            wijmoGauge.directive('wjRange', [function () {
                    return new WjRange();
                }]);
        }
        //#endregion "Gauge directives definitions"
        //#region "Gauge directives classes"
        // Gauge control directive
        // Provides base setup for all directives related to controls derived from Gauge
        // Abstract class, not for use in markup
        var WjGauge = (function (_super) {
            __extends(WjGauge, _super);
            // Creates a new instance of a WjGauge
            function WjGauge() {
                _super.call(this);
                this.template = '<div ng-transclude />';
                this.transclude = true;
            }
            Object.defineProperty(WjGauge.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.gauge.Gauge;
                },
                enumerable: true,
                configurable: true
            });
            return WjGauge;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:LinearGauge control.
         *
         * Use the <b>wj-linear-gauge</b> directive to add linear gauges to your AngularJS applications.
         * Note that directive and parameter names must be formatted in lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;wj-linear-gauge
         *   value="ctx.gauge.value"
         *   show-text="Value"
         *   is-read-only="false"&gt;
         *   &lt;wj-range
         *     wj-property="pointer"
         *     thickness="0.2"&gt;
         *     &lt;wj-range
         *       min="0"
         *       max="33"
         *       color="green"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range
         *       min="33"
         *       max="66"
         *       color="yellow"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range
         *       min="66"
         *       max="100"
         *       color="red"&gt;
         *     &lt;/wj-range&gt;
         *   &lt;/wj-range&gt;
         * &lt;/wj-linear-gauge&gt;</pre>
         *
         * The <b>wj-linear-gauge</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the
         *                               <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>       <dd><code>=</code> A reference to the @see:LinearGauge
         *                          control created by this directive.</dd>
         *   <dt>direction</dt>     <dd><code>@</code> The @see:GaugeDirection value in
         *                          which the gauge fills as the value grows.</dd>
         *   <dt>format</dt>        <dd><code>@</code> The format string used for displaying
         *                          the gauge values as text.</dd>
         *   <dt>has-shadow</dt>    <dd><code>@</code> A value indicating whether the gauge
         *                          displays a shadow effect.</dd>
         *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
         *                          initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
         *                           initializing the control with attribute values. </dd>
         *   <dt>is-animated</dt>   <dd><code>@</code> A value indicating whether the gauge
         *                          animates value changes.</dd>
         *   <dt>is-read-only</dt>  <dd><code>@</code> A value indicating whether users are
         *                          prevented from editing the value.</dd>
         *   <dt>min</dt>           <dd><code>@</code> The minimum value that the gauge
         *                          can display.</dd>
         *   <dt>max</dt>           <dd><code>@</code> The maximum value that the gauge
         *                          can display.</dd>
         *   <dt>show-text</dt>     <dd><code>@</code> The @see:ShowText value indicating
         *                          which values display as text within the gauge.</dd>
         *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the value
         *                          property when the user presses the arrow keys.</dd>
         *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the gauge, on a scale
         *                          of zero to one.</dd>
         *   <dt>value</dt>         <dd><code>=</code> The value displayed on the gauge.</dd>
         *   <dt>got-focus</dt>     <dd><code>&</code> The @see:LinearGauge.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>    <dd><code>&</code> The @see:LinearGauge.lostFocus event handler.</dd>
         * </dl>
         *
         * The <b>wj-linear-gauge</b> directive may contain one or more @see:WjRange directives.
         *
         * @fiddle:t842jozb
         */
        var WjLinearGauge = (function (_super) {
            __extends(WjLinearGauge, _super);
            // Initializes a new instance of a WjLinearGauge
            function WjLinearGauge() {
                _super.call(this);
            }
            Object.defineProperty(WjLinearGauge.prototype, "_controlConstructor", {
                // gets the Wijmo LinearGauge control constructor
                get: function () {
                    return wijmo.gauge.LinearGauge;
                },
                enumerable: true,
                configurable: true
            });
            return WjLinearGauge;
        }(WjGauge));
        /**
         * AngularJS directive for the @see:BulletGraph control.
         *
         * Use the <b>wj-bullet-graph</b> directive to add bullet graphs to your AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;wj-bullet-graph
         *   value="ctx.gauge.value"
         *   min="0" max="10"
         *   target="{&#8203;{item.target}}"
         *   bad="{&#8203;{item.target * .75}}"
         *   good="{&#8203;{item.target * 1.25}}"&gt;
         * &lt;/wj-bullet-graph&gt;</pre>
         *
         * The <b>wj-bullet-graph</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>control</dt>       <dd><code>=</code> A reference to the BulletGraph control
         *                          created by this directive.</dd>
         *   <dt>direction</dt>     <dd><code>@</code> The @see:GaugeDirection value
         *                          indicating which direction the gauge fills as the value grows.</dd>
         *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
         *                          initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
         *                           initializing the control with attribute values. </dd>
         *   <dt>target</dt>        <dd><code>@</code> The target value for the measure.</dd>
         *   <dt>good</dt>          <dd><code>@</code> A reference value considered good for the
         *                          measure.</dd>
         *   <dt>bad</dt>           <dd><code>@</code> A reference value considered bad for the
         *                          measure.</dd>
         *   <dt>value</dt>         <dd><code>=</code> The actual value of the measure.</dd>
         * </dl>
         *
         * The <b>wj-bullet-graph</b> directive may contain one or more @see:WjRange directives.
         *
         * @fiddle:8uxb1vwf
         */
        var WjBulletGraph = (function (_super) {
            __extends(WjBulletGraph, _super);
            // Initializes a new instance of a WjBulletGraph
            function WjBulletGraph() {
                _super.call(this);
            }
            Object.defineProperty(WjBulletGraph.prototype, "_controlConstructor", {
                // gets the Wijmo BulletGraph control constructor
                get: function () {
                    return wijmo.gauge.BulletGraph;
                },
                enumerable: true,
                configurable: true
            });
            return WjBulletGraph;
        }(WjLinearGauge));
        /**
         * AngularJS directive for the @see:RadialGauge control.
         *
         * Use the <b>wj-radial-gauge</b> directive to add radial gauges to your AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>Here is a &lt;b&gt;RadialGauge&lt;/b&gt; control:&lt;/p&gt;
         * &lt;wj-radial-gauge
         *   style="height:300px"
         *   value="count"
         *   min="0" max="10"
         *   is-read-only="false"&gt;
         * &lt;/wj-radial-gauge&gt;</pre>
         *
         * The <b>wj-radial-gauge</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the
         *                               <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>       <dd><code>=</code> A reference to the RadialGauge
         *                          control created by this directive.</dd>
         *   <dt>auto-scale</dt>    <dd><code>@</code> A value indicating whether the gauge
         *                          scales the display to fill the host element.</dd>
         *   <dt>format</dt>        <dd><code>@</code> The format string used for displaying
         *                          gauge values as text.</dd>
         *   <dt>has-shadow</dt>    <dd><code>@</code> A value indicating whether the gauge
         *                          displays a shadow effect.</dd>
         *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
         *                          initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
         *                           initializing the control with attribute values. </dd>
         *   <dt>is-animated</dt>   <dd><code>@</code> A value indicating whether the gauge
         *                          animates value changes.</dd>
         *   <dt>is-read-only</dt>  <dd><code>@</code> A value indicating whether users are
         *                          prevented from editing the value.</dd>
         *   <dt>min</dt>           <dd><code>@</code> The minimum value that the gauge
         *                          can display.</dd>
         *   <dt>max</dt>           <dd><code>@</code> The maximum value that the gauge
         *                          can display.</dd>
         *   <dt>show-text</dt>     <dd><code>@</code> A @see:ShowText value indicating
         *                          which values display as text within the gauge.</dd>
         *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the
         *                          value property when the user presses the arrow keys.</dd>
         *   <dt>start-angle</dt>   <dd><code>@</code> The starting angle for the gauge, in
         *                          degreees, measured clockwise from the 9 o'clock position.</dd>
         *   <dt>sweep-angle</dt>   <dd><code>@</code> The sweeping angle for the gauge in degrees
         *                          (may be positive or negative).</dd>
         *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the gauge, on a scale
         *                          of zero to one.</dd>
         *   <dt>value</dt>         <dd><code>=</code> The value displayed on the gauge.</dd>
         *   <dt>got-focus</dt>     <dd><code>&</code> The @see:RadialGauge.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>    <dd><code>&</code> The @see:RadialGauge.lostFocus event handler.</dd>
         * </dl>
         *
         * The <b>wj-radial-gauge</b> directive may contain one or more @see:WjRange directives.
         *
         * @fiddle:7ec2144u
         */
        var WjRadialGauge = (function (_super) {
            __extends(WjRadialGauge, _super);
            // Initializes a new instance of a WjRadialGauge
            function WjRadialGauge() {
                _super.call(this);
            }
            Object.defineProperty(WjRadialGauge.prototype, "_controlConstructor", {
                // gets the Wijmo RadialGauge control constructor
                get: function () {
                    return wijmo.gauge.RadialGauge;
                },
                enumerable: true,
                configurable: true
            });
            return WjRadialGauge;
        }(WjGauge));
        /**
         * AngularJS directive for the @see:Range object.
         *
         * The <b>wj-range</b> directive must be contained in a @see:WjLinearGauge, @see:WjRadialGauge
         * or @see:WjBulletGraph directive. It adds the Range object to the 'ranges' array property
         * of the parent directive. You may also initialize other Range type properties of the parent
         * directive by specifying the property name with the wj-property attribute.
         *
         * For example:
         * <pre>&lt;wj-radial-gauge
         *     min="0"
         *     max="200"
         *     step="20"
         *     value="theValue"
         *     is-read-only="false"&gt;
         *     &lt;wj-range
         *       min="0"
         *       max="100"
         *       color="red"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range
         *       min="100"
         *       max="200"
         *       color="green"&gt;
         *     &lt;/wj-range&gt;
         *     &lt;wj-range
         *       wj-property="pointer"
         *       color="blue"&gt;
         *     &lt;/wj-range&gt;
         * &lt;/wj-radial-gauge&gt;</pre>
         *
         * The <b>wj-range</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>min</dt>           <dd><code>@</code> The minimum value in the range.</dd>
         *   <dt>max</dt>           <dd><code>@</code> The maximum value in the range.</dd>
         *   <dt>color</dt>         <dd><code>@</code> The color used to display the range.</dd>
         *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the range, on a scale
         *                          of zero to one.</dd>
         *   <dt>name</dt>          <dd><code>@</code> The name of the range.</dd>
         *   <dt>wj-property</dt>   <dd><code>@</code> The name of the property to initialize
         *                          with this directive.</dd>
         * </dl>
         */
        var WjRange = (function (_super) {
            __extends(WjRange, _super);
            // Initializes a new instance of a WjRange
            function WjRange() {
                _super.call(this);
                this.require = ['?^wjLinearGauge', '?^wjRadialGauge', '?^wjBulletGraph'];
                this.template = '<div ng-transclude />';
                this.transclude = true;
                // set up as a child directive
                this._property = 'ranges';
                this._isPropertyArray = true;
            }
            Object.defineProperty(WjRange.prototype, "_controlConstructor", {
                // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
                get: function () {
                    return wijmo.gauge.Range;
                },
                enumerable: true,
                configurable: true
            });
            return WjRange;
        }(angular.WjDirective));
    })(angular = wijmo.angular || (wijmo.angular = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.gauge.js.map