var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
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
    var Tooltip = (function () {
        /**
         * Initializes a new instance of the @see:Tooltip class.
         *
         * @param options JavaScript object containing initialization data for the @see:Tooltip.
         */
        function Tooltip(options) {
            this._showAutoTipBnd = this._showAutoTip.bind(this);
            this._hideAutoTipBnd = this._hideAutoTip.bind(this);
            // property storage
            this._html = true;
            this._gap = 6;
            this._showAtMouse = false;
            this._showDelay = 500; // http://msdn.microsoft.com/en-us/library/windows/desktop/bb760404(v=vs.85).aspx
            this._hideDelay = 0; // do not hide
            this._tips = [];
            /**
             * Occurs before the tooltip content is displayed.
             *
             * The event handler may customize the tooltip content or suppress the
             * tooltip display by changing the event parameters.
             */
            this.popup = new wijmo.Event();
            wijmo.copy(this, options);
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
        Tooltip.prototype.setTooltip = function (element, content) {
            // get element and tooltip content
            element = wijmo.getElement(element);
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
        };
        /**
         * Shows the tooltip with the specified content, next to the specified element.
         *
         * @param element Element, element ID, or control that the tooltip explains.
         * @param content Tooltip content or ID of the element that contains the tooltip content.
         * @param bounds Optional element that defines the bounds of the area that the tooltip
         * targets. If not provided, the bounds of the element are used (as reported by the
         * <b>getBoundingClientRect</b> method).
         */
        Tooltip.prototype.show = function (element, content, bounds) {
            // get element and tooltip content
            element = wijmo.getElement(element);
            content = this._getContent(content);
            if (!bounds) {
                bounds = wijmo.Rect.fromBoundingRect(element.getBoundingClientRect());
            }
            // create tooltip element if necessary
            var tip = Tooltip._eTip;
            if (!tip) {
                tip = Tooltip._eTip = document.createElement('div');
                wijmo.addClass(tip, 'wj-tooltip');
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
                bounds = new wijmo.Rect(bounds.left - (tip.offsetWidth - bounds.width) / 2, bounds.top - this.gap, tip.offsetWidth, bounds.height + 2 * this.gap);
                // show tooltip
                wijmo.showPopup(tip, bounds, true);
                // hide when the mouse goes down
                document.addEventListener('mousedown', this._hideAutoTipBnd);
            }
        };
        /**
         * Hides the tooltip if it is currently visible.
         */
        Tooltip.prototype.hide = function () {
            if (Tooltip._eTip) {
                Tooltip._eTip.style.visibility = 'hidden';
                Tooltip._eTip.innerHTML = '';
            }
            document.removeEventListener('mousedown', this._hideAutoTipBnd);
        };
        Object.defineProperty(Tooltip.prototype, "isVisible", {
            /**
             * Gets whether the tooltip is currently visible.
             */
            get: function () {
                return Tooltip._eTip && Tooltip._eTip.style.visibility != 'hidden';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip.prototype, "isContentHtml", {
            /**
             * Gets or sets a value that determines whether the tooltip contents
             * should be displayed as plain text or as HTML.
             */
            get: function () {
                return this._html;
            },
            set: function (value) {
                this._html = wijmo.asBoolean(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip.prototype, "gap", {
            /**
             * Gets or sets the distance between the tooltip and the target element.
             */
            get: function () {
                return this._gap;
            },
            set: function (value) {
                this._gap = wijmo.asNumber(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip.prototype, "showAtMouse", {
            /**
             * Gets or sets a value that determines whether the tooltip should be
             * positioned with respect to the mouse position rather than the
             * target element.
             */
            get: function () {
                return this._showAtMouse;
            },
            set: function (value) {
                this._showAtMouse = wijmo.asBoolean(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip.prototype, "showDelay", {
            /**
             * Gets or sets the delay, in milliseconds, before showing the tooltip after the
             * mouse enters the target element.
             */
            get: function () {
                return this._showDelay;
            },
            set: function (value) {
                this._showDelay = wijmo.asInt(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip.prototype, "hideDelay", {
            /**
             * Gets or sets the delay, in milliseconds, before hiding the tooltip after the
             * mouse leaves the target element.
             */
            get: function () {
                return this._hideDelay;
            },
            set: function (value) {
                this._hideDelay = wijmo.asInt(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Raises the @see:popup event.
         *
         * @param e @see:TooltipEventArgs that contains the event data.
         */
        Tooltip.prototype.onPopup = function (e) {
            if (this.popup) {
                this.popup.raise(this, e);
            }
        };
        // implementation
        // finds an element in the auto-tooltip list
        Tooltip.prototype._indexOf = function (e) {
            for (var i = 0; i < this._tips.length; i++) {
                if (this._tips[i].element == e) {
                    return i;
                }
            }
            return -1;
        };
        // add event listeners to show and hide tooltips for an element
        Tooltip.prototype._attach = function (e) {
            e.addEventListener('mouseenter', this._showAutoTipBnd);
            e.addEventListener('mouseleave', this._hideAutoTipBnd);
            e.addEventListener('click', this._showAutoTipBnd);
        };
        // remove event listeners used to show and hide tooltips for an element
        Tooltip.prototype._detach = function (e) {
            e.removeEventListener('mouseenter', this._showAutoTipBnd);
            e.removeEventListener('mouseleave', this._hideAutoTipBnd);
            e.removeEventListener('click', this._showAutoTipBnd);
        };
        // shows an automatic tooltip
        Tooltip.prototype._showAutoTip = function (e) {
            var _this = this;
            var showDelay = e.type == 'mouseenter' ? this._showDelay : 0;
            this._clearTimeouts();
            this._toShow = setTimeout(function () {
                var i = _this._indexOf(e.target);
                if (i > -1) {
                    var tip = _this._tips[i], bounds = _this._showAtMouse ? new wijmo.Rect(e.clientX, e.clientY, 0, 0) : null;
                    _this.show(tip.element, tip.content, bounds);
                    if (_this._hideDelay > 0) {
                        _this._toHide = setTimeout(function () {
                            _this.hide();
                        }, _this._hideDelay);
                    }
                }
            }, showDelay);
        };
        // hides an automatic tooltip
        Tooltip.prototype._hideAutoTip = function () {
            this._clearTimeouts();
            this.hide();
        };
        // clears the timeouts used to show and hide automatic tooltips
        Tooltip.prototype._clearTimeouts = function () {
            if (this._toShow) {
                clearTimeout(this._toShow);
                this._toShow = null;
            }
            if (this._toHide) {
                clearTimeout(this._toHide);
                this._toHide = null;
            }
        };
        // gets content that may be a string or an element id
        Tooltip.prototype._getContent = function (content) {
            content = wijmo.asString(content);
            if (content && content[0] == '#') {
                var e = wijmo.getElement(content);
                if (e) {
                    content = e.innerHTML;
                }
            }
            return content;
        };
        // assigns content to the tooltip element
        Tooltip.prototype._setContent = function (content) {
            var tip = Tooltip._eTip;
            if (tip) {
                if (this.isContentHtml) {
                    tip.innerHTML = content;
                }
                else {
                    tip.textContent = content;
                }
            }
        };
        return Tooltip;
    }());
    wijmo.Tooltip = Tooltip;
    // helper class to hold element/tooltip information
    var ElementContent = (function () {
        function ElementContent() {
        }
        return ElementContent;
    }());
    /**
     * Provides arguments for the @see:Tooltip.popup event.
     */
    var TooltipEventArgs = (function (_super) {
        __extends(TooltipEventArgs, _super);
        /**
         * Initializes a new instance of the @see:TooltipEventArgs class.
         *
         * @param content String to show in the tooltip.
         */
        function TooltipEventArgs(content) {
            _super.call(this);
            this._content = wijmo.asString(content);
        }
        Object.defineProperty(TooltipEventArgs.prototype, "content", {
            /**
             * Gets or sets the content to show in the tooltip.
             *
             * This parameter can be used while handling the @see:Tooltip.popup
             * event to modify the content of the tooltip.
             */
            get: function () {
                return this._content;
            },
            set: function (value) {
                this._content = wijmo.asString(value);
            },
            enumerable: true,
            configurable: true
        });
        return TooltipEventArgs;
    }(wijmo.CancelEventArgs));
    wijmo.TooltipEventArgs = TooltipEventArgs;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Tooltip.js.map