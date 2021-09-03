module wijmo {
    'use strict';

    /**
     * Provides a pop-up window that displays additional information about elements on the page.
     *
     * The @see:Tooltip class can be used in two modes:
     * 
     * <b>Automatic Mode:</b> Use the @see:setTooltip method to connect the @see:Tooltip to
     * one or more elements on the page. The @see:Tooltip will automatically monitor events
     * and display the tooltips when the user performs actions that trigger the tooltip.
     * For example:
     *
     * <pre>var tt = new wijmo.Tooltip();
     * tt.setTooltip('#menu', 'Select commands.');
     * tt.setTooltip('#tree', 'Explore the hierarchy.');
     * tt.setTooltip('#chart', '#idChartTooltip');</pre>
     *
     * <b>Manual Mode:</b> The caller is responsible for showing and hiding the tooltip
     * using the @see:show and @see:hide methods. For example:
     *
     * <pre>var tt = new wijmo.Tooltip();
     * element.addEventListener('click', function () {
     *   if (tt.isVisible) {
     *     tt.hide();
     *   } else {
     *     tt.show(element, 'This is an important element!');
     *   }
     * });</pre>
     */
    export class Tooltip {

        // tooltip element
        private static _eTip: HTMLElement;

        // private stuff
        private _toShow: number;
        private _toHide: number;
        private _showAutoTipBnd = this._showAutoTip.bind(this);
        private _hideAutoTipBnd = this._hideAutoTip.bind(this);

        // property storage
        private _html = true;
        private _gap = 6;
        private _showAtMouse = false;
        private _showDelay = 500; // http://msdn.microsoft.com/en-us/library/windows/desktop/bb760404(v=vs.85).aspx
        private _hideDelay = 0; // do not hide
        private _tips: ElementContent[] = [];

        /**
         * Initializes a new instance of the @see:Tooltip class.
         *
         * @param options JavaScript object containing initialization data for the @see:Tooltip.
         */
        constructor(options?: any) {
            copy(this, options);
        }

        // object model

        /**
         * Assigns tooltip content to a given element on the page.
         *
         * The same tooltip may be used to display information for any number
         * of elements on the page. To remove the tooltip from an element, 
         * call @see:setTooltip and specify null for the content.
         *
         * @param element Element, element ID, or control that the tooltip explains.
         * @param content Tooltip content or ID of the element that contains the tooltip content.
         */
        setTooltip(element: any, content: string) {

            // get element and tooltip content
            element = getElement(element);
            content = this._getContent(content);

            // remove old version from list
            var i = this._indexOf(element);
            if (i > -1) {
                this._detach(element);
                this._tips.splice(i, 1);
            }

            // add new version to list
            if (content) {
                this._attach(element);
                this._tips.push({ element: element, content: content });
            }
        }
        /**
         * Shows the tooltip with the specified content, next to the specified element.
         *
         * @param element Element, element ID, or control that the tooltip explains.
         * @param content Tooltip content or ID of the element that contains the tooltip content.
         * @param bounds Optional element that defines the bounds of the area that the tooltip 
         * targets. If not provided, the bounds of the element are used (as reported by the
         * <b>getBoundingClientRect</b> method).
         */
        show(element: any, content: string, bounds?: Rect) {

            // get element and tooltip content
            element = getElement(element);
            content = this._getContent(content);
            if (!bounds) {
                bounds = Rect.fromBoundingRect(element.getBoundingClientRect());
            }

            // create tooltip element if necessary
            var tip = Tooltip._eTip;
            if (!tip) {
                tip = Tooltip._eTip = document.createElement('div');
                addClass(tip, 'wj-tooltip');
                tip.style.visibility = 'none';
                document.body.appendChild(tip);
            }

            // set tooltip content
            this._setContent(content);

            // fire event to allow customization
            var e = new TooltipEventArgs(content);
            this.onPopup(e);

            // if not canceled and content is present, show tooltip
            if (e.content && !e.cancel) {

                // update tooltip content with customize content, if any
                this._setContent(e.content);
                tip.style.minWidth = '';

                // apply gap and align to the center of the reference element
                bounds = new Rect(
                    bounds.left - (tip.offsetWidth - bounds.width) / 2,
                    bounds.top - this.gap,
                    tip.offsetWidth,
                    bounds.height + 2 * this.gap);

                // show tooltip
                showPopup(tip, bounds, true);

                // hide when the mouse goes down
                document.addEventListener('mousedown', this._hideAutoTipBnd);
            }
        }
        /**
         * Hides the tooltip if it is currently visible.
         */
        hide() {
            if (Tooltip._eTip) {
                Tooltip._eTip.style.visibility = 'hidden';
                Tooltip._eTip.innerHTML = '';
            }
            document.removeEventListener('mousedown', this._hideAutoTipBnd);
        }
        /**
         * Gets whether the tooltip is currently visible. 
         */
        get isVisible(): boolean {
            return Tooltip._eTip && Tooltip._eTip.style.visibility != 'hidden';
        }
        /**
         * Gets or sets a value that determines whether the tooltip contents 
         * should be displayed as plain text or as HTML.
         */
        get isContentHtml(): boolean {
            return this._html;
        }
        set isContentHtml(value: boolean) {
            this._html = asBoolean(value);
        }
        /**
         * Gets or sets the distance between the tooltip and the target element.
         */
        get gap(): number {
            return this._gap;
        }
        set gap(value: number) {
            this._gap = asNumber(value);
        }
        /**
         * Gets or sets a value that determines whether the tooltip should be
         * positioned with respect to the mouse position rather than the
         * target element.
         */
        get showAtMouse(): boolean {
            return this._showAtMouse;
        }
        set showAtMouse(value: boolean) {
            this._showAtMouse = asBoolean(value);
        }
        /**
         * Gets or sets the delay, in milliseconds, before showing the tooltip after the 
         * mouse enters the target element.
         */
        get showDelay(): number {
            return this._showDelay;
        }
        set showDelay(value: number) {
            this._showDelay = asInt(value);
        }
        /**
         * Gets or sets the delay, in milliseconds, before hiding the tooltip after the 
         * mouse leaves the target element.
         */
        get hideDelay(): number {
            return this._hideDelay;
        }
        set hideDelay(value: number) {
            this._hideDelay = asInt(value);
        }

        /**
         * Occurs before the tooltip content is displayed.
         * 
         * The event handler may customize the tooltip content or suppress the 
         * tooltip display by changing the event parameters.
         */
        public popup = new Event();
        /**
         * Raises the @see:popup event.
         *
         * @param e @see:TooltipEventArgs that contains the event data.
         */
        onPopup(e: TooltipEventArgs) {
            if (this.popup) {
                this.popup.raise(this, e);
            }
        }

        // implementation

        // finds an element in the auto-tooltip list
        private _indexOf(e: Element): number {
            for (var i = 0; i < this._tips.length; i++) {
                if (this._tips[i].element == e) {
                    return i;
                }
            }
            return -1;
        }

        // add event listeners to show and hide tooltips for an element
        private _attach(e: HTMLElement) {
            e.addEventListener('mouseenter', this._showAutoTipBnd);
            e.addEventListener('mouseleave', this._hideAutoTipBnd);
            e.addEventListener('click', this._showAutoTipBnd);
        }

        // remove event listeners used to show and hide tooltips for an element
        private _detach(e: HTMLElement) {
            e.removeEventListener('mouseenter', this._showAutoTipBnd);
            e.removeEventListener('mouseleave', this._hideAutoTipBnd);
            e.removeEventListener('click', this._showAutoTipBnd);
        }

        // shows an automatic tooltip
        private _showAutoTip(e: MouseEvent) {
            var showDelay = e.type == 'mouseenter' ? this._showDelay : 0;
            this._clearTimeouts();
            this._toShow = setTimeout(() => {
                var i = this._indexOf(<Element>e.target);
                if (i > -1) {
                    var tip = this._tips[i],
                        bounds = this._showAtMouse ? new Rect(e.clientX, e.clientY, 0, 0) : null;
                    this.show(tip.element, tip.content, bounds);
                    if (this._hideDelay > 0) {
                        this._toHide = setTimeout(() => {
                            this.hide();
                        }, this._hideDelay);
                    }
                }
            }, showDelay);
        }

        // hides an automatic tooltip
        private _hideAutoTip() {
            this._clearTimeouts();
            this.hide();
        }

        // clears the timeouts used to show and hide automatic tooltips
        private _clearTimeouts() {
            if (this._toShow) {
                clearTimeout(this._toShow);
                this._toShow = null;
            }
            if (this._toHide) {
                clearTimeout(this._toHide);
                this._toHide = null;
            }
        }

        // gets content that may be a string or an element id
        private _getContent(content: string): string {
            content = asString(content);
            if (content && content[0] == '#') {
                var e = getElement(content);
                if (e) {
                    content = e.innerHTML;
                }
            }
            return content;
        }

        // assigns content to the tooltip element
        private _setContent(content: string) {
            var tip = Tooltip._eTip;
            if (tip) {
                if (this.isContentHtml) {
                    tip.innerHTML = content;
                } else {
                    tip.textContent = content;
                }
            }
        }
    }

    // helper class to hold element/tooltip information
    class ElementContent {
        element: HTMLElement;
        content: string;
    }

    /**
     * Provides arguments for the @see:Tooltip.popup event.
     */
    export class TooltipEventArgs extends CancelEventArgs {
        private _content: string;

        /**
         * Initializes a new instance of the @see:TooltipEventArgs class.
         *
         * @param content String to show in the tooltip.
         */
        constructor(content: string) {
            super();
            this._content = asString(content);
        }

        /**
         * Gets or sets the content to show in the tooltip.
         *
         * This parameter can be used while handling the @see:Tooltip.popup
         * event to modify the content of the tooltip.
         */
        get content(): string {
            return this._content;
        }
        set content(value: string) {
            this._content = asString(value);
        }
    }
} 