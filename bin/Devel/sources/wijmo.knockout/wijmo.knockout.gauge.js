var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        // Gauge control binding
        // Provides base setup for all bindings related to controls derived from Gauge
        // Abstract class, not for use in markup
        var WjGaugeBinding = (function (_super) {
            __extends(WjGaugeBinding, _super);
            function WjGaugeBinding() {
                _super.apply(this, arguments);
            }
            WjGaugeBinding.prototype._getControlConstructor = function () {
                return wijmo.gauge.Gauge;
            };
            return WjGaugeBinding;
        }(knockout.WjBinding));
        knockout.WjGaugeBinding = WjGaugeBinding;
        /**
         * KnockoutJS binding for the @see:LinearGauge control.
         *
         * Use the @see:wjLinearGauge binding to add @see:LinearGauge controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a LinearGauge control:&lt;/p&gt;
         * &lt;div data-bind="wjLinearGauge: {
         *         value: props.value,
         *         min: props.min,
         *         max: props.max,
         *         format: props.format,
         *         showRanges: props.showRanges }"
         *         &lt;class="linear-gauge"&gt;
         *     &lt;div data-bind="wjRange: {
         *             wjProperty: 'pointer',
         *             thickness: props.ranges.pointerThickness }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjRange: {
         *             min: props.ranges.lower.min,
         *             max: props.ranges.lower.max,
         *             color: props.ranges.lower.color }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjRange: {
         *             min: props.ranges.middle.min,
         *             max: props.ranges.middle.max,
         *             color: props.ranges.middle.color }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjRange: {
         *             min: props.ranges.upper.min,
         *             max: props.ranges.upper.max,
         *             color: props.ranges.upper.color }"&gt;
         *     &lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjLinearGauge</b> binding may contain the @see:wjRange child binding.
         *
         * The <b>wjLinearGauge</b> binding supports all read-write properties and events of
         * the @see:LinearGauge control. The <b>value</b> property provides two-way binding mode.
         */
        var wjLinearGauge = (function (_super) {
            __extends(wjLinearGauge, _super);
            function wjLinearGauge() {
                _super.apply(this, arguments);
            }
            wjLinearGauge.prototype._getControlConstructor = function () {
                return wijmo.gauge.LinearGauge;
            };
            return wjLinearGauge;
        }(WjGaugeBinding));
        knockout.wjLinearGauge = wjLinearGauge;
        /**
         * KnockoutJS binding for the @see:BulletGraph control.
         *
         * Use the @see:wjBulletGraph binding to add @see:BulletGraph controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a BulletGraph control:&lt;/p&gt;
         * &lt;div data-bind="wjBulletGraph: {
         *         value: props.value,
         *         min: props.min,
         *         max: props.max,
         *         format: props.format,
         *         good: props.ranges.middle.max,
         *         bad: props.ranges.middle.min,
         *         target: props.ranges.target,
         *         showRanges: props.showRanges }"
         *         class="linear-gauge"&gt;
         *     &lt;div data-bind="wjRange: {
         *             wjProperty: 'pointer',
         *             thickness: props.ranges.pointerThickness }"&gt;
         *     &lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjBulletGraph</b> binding may contain the @see:wjRange child binding.
         *
         * The <b>wjBulletGraph</b> binding supports all read-write properties and events of
         * the @see:BulletGraph control. The <b>value</b> property provides two-way binding mode.
         */
        var wjBulletGraph = (function (_super) {
            __extends(wjBulletGraph, _super);
            function wjBulletGraph() {
                _super.apply(this, arguments);
            }
            wjBulletGraph.prototype._getControlConstructor = function () {
                return wijmo.gauge.BulletGraph;
            };
            return wjBulletGraph;
        }(wjLinearGauge));
        knockout.wjBulletGraph = wjBulletGraph;
        /**
         * KnockoutJS binding for the @see:RadialGauge control.
         *
         * Use the @see:wjRadialGauge binding to add @see:RadialGauge controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a RadialGauge control:&lt;/p&gt;
         * &lt;div data-bind="wjRadialGauge: {
         *         value: props.value,
         *         min: props.min,
         *         max: props.max,
         *         format: props.format,
         *         showRanges: props.showRanges }"
         *         class="radial-gauge"&gt;
         *     &lt;div data-bind="wjRange: {
         *             wjProperty: 'pointer',
         *             thickness: props.ranges.pointerThickness }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjRange: {
         *             min: props.ranges.lower.min,
         *             max: props.ranges.lower.max,
         *             color: props.ranges.lower.color }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjRange: {
         *             min: props.ranges.middle.min,
         *             max: props.ranges.middle.max,
         *             color: props.ranges.middle.color }"&gt;
         *     &lt;/div&gt;
         *     &lt;div data-bind="wjRange: {
         *             min: props.ranges.upper.min,
         *             max: props.ranges.upper.max,
         *             color: props.ranges.upper.color }"&gt;
         *     &lt;/div&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjRadialGauge</b> binding may contain the @see:wjRange child binding.
         *
         * The <b>wjRadialGauge</b> binding supports all read-write properties and events of
         * the @see:RadialGauge control. The <b>value</b> property provides two-way binding mode.
         */
        var wjRadialGauge = (function (_super) {
            __extends(wjRadialGauge, _super);
            function wjRadialGauge() {
                _super.apply(this, arguments);
            }
            wjRadialGauge.prototype._getControlConstructor = function () {
                return wijmo.gauge.RadialGauge;
            };
            return wjRadialGauge;
        }(WjGaugeBinding));
        knockout.wjRadialGauge = wjRadialGauge;
        /**
         * KnockoutJS binding for the Gauge's @see:Range object.
         *
         * The @see:wjRange binding must be contained in one of the following bindings:
         * <ul>
         *     <li>@see:wjLinearGauge</li>
         *     <li>@see:wjRadialGauge</li>
         *     <li>@see:wjBulletGraph</li>
         * </ul>
         * By default, this binding adds a <b>Range</b> object to the <b>ranges</b>
         * collection of the Chart control. The <b>wjProperty</b> attribute allows
         * you to specify another Chart property, for example the <b>pointer</b>
         * property, to initialize with the binding.
         *
         * The <b>wjRange</b> binding supports all read-write properties and events of
         * the @see:Range class.
         */
        var wjRange = (function (_super) {
            __extends(wjRange, _super);
            function wjRange() {
                _super.apply(this, arguments);
            }
            wjRange.prototype._getControlConstructor = function () {
                return wijmo.gauge.Range;
            };
            return wjRange;
        }(knockout.WjBinding));
        knockout.wjRange = wjRange;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
// Register bindings
(ko.bindingHandlers).wjLinearGauge = new wijmo.knockout.wjLinearGauge();
(ko.bindingHandlers).wjBulletGraph = new wijmo.knockout.wjBulletGraph();
(ko.bindingHandlers).wjRadialGauge = new wijmo.knockout.wjRadialGauge();
(ko.bindingHandlers).wjRange = new wijmo.knockout.wjRange();
//# sourceMappingURL=wijmo.knockout.gauge.js.map