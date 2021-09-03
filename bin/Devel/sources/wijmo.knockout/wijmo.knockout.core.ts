module wijmo.knockout {

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
    export class wjTooltip extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.Tooltip;
        }

        _createWijmoContext(): WjContext {
            return new WjTooltipContext(this);
        }

    }

    export class WjTooltipContext extends WjContext {
        update(element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void {
            super.update(element, valueAccessor, allBindings, viewModel, bindingContext);
            this._updateTooltip();
        }

        private _updateTooltip() {
            (<wijmo.Tooltip><any>this.control).setTooltip(this.element, ko.unwrap(this.valueAccessor()));
        }
    }
} 

(<any>(ko.bindingHandlers)).wjTooltip = new wijmo.knockout.wjTooltip();
