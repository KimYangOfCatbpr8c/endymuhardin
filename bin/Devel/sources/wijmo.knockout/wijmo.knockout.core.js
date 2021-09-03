var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        /**
         * KnockoutJS binding for the @see:Tooltip class.
         *
         * Use the @see:wjTooltip binding to add tooltips to elements on the page.
         * The @see:wjTooltip supports HTML content, smart positioning, and touch.
         *
         * The @see:wjTooltip binding is specified on an
         * element that the tooltip applies to. The value is the tooltip
         * text or the id of an element that contains the text. For example:
         *
         * <pre>&lt;p data-bind="wjTooltip: '#fineprint'" &gt;
         *     Regular paragraph content...&lt;/p&gt;
         * ...
         * &lt;div id="fineprint" style="display:none" &gt;
         *   &lt;h3&gt;Important Note&lt;/h3&gt;
         *   &lt;p&gt;
         *     Data for the current quarter is estimated by pro-rating etc...&lt;/p&gt;
         * &lt;/div&gt;</pre>
         */
        var wjTooltip = (function (_super) {
            __extends(wjTooltip, _super);
            function wjTooltip() {
                _super.apply(this, arguments);
            }
            wjTooltip.prototype._getControlConstructor = function () {
                return wijmo.Tooltip;
            };
            wjTooltip.prototype._createWijmoContext = function () {
                return new WjTooltipContext(this);
            };
            return wjTooltip;
        }(knockout.WjBinding));
        knockout.wjTooltip = wjTooltip;
        var WjTooltipContext = (function (_super) {
            __extends(WjTooltipContext, _super);
            function WjTooltipContext() {
                _super.apply(this, arguments);
            }
            WjTooltipContext.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                _super.prototype.update.call(this, element, valueAccessor, allBindings, viewModel, bindingContext);
                this._updateTooltip();
            };
            WjTooltipContext.prototype._updateTooltip = function () {
                this.control.setTooltip(this.element, ko.unwrap(this.valueAccessor()));
            };
            return WjTooltipContext;
        }(knockout.WjContext));
        knockout.WjTooltipContext = WjTooltipContext;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
(ko.bindingHandlers).wjTooltip = new wijmo.knockout.wjTooltip();
//# sourceMappingURL=wijmo.knockout.core.js.map