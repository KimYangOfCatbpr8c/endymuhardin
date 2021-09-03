var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet) {
            'use strict';
            /**
             * Defines the @see:ScrollBar control.
             */
            var ScrollBar = (function (_super) {
                __extends(ScrollBar, _super);
                /**
                 * Initializes a new instance of the @see:ScrollBar class.
                 *
                 * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param options JavaScript object containing initialization data for the control.
                 */
                function ScrollBar(element, options) {
                    _super.call(this, element, options);
                    this._scrollDistance = 0;
                    this._size = 0;
                    this._scrollValue = 0;
                    this._scrollHdl = this._scrollEventHandler.bind(this);
                    /**
                     * Occurs when the ScrollBar is scrolled
                     */
                    this.scrolled = new wijmo.Event();
                    var self = this;
                    if (self.hostElement.attributes['tabindex']) {
                        self.hostElement.attributes.removeNamedItem('tabindex');
                    }
                    self.deferUpdate(function () {
                        self._initControl();
                        if (options) {
                            self.initialize(options);
                        }
                        self._adjustSize();
                    });
                }
                Object.defineProperty(ScrollBar.prototype, "scrollDistance", {
                    /**
                     * Gets or sets the scroll distance of the ScrollBar control.
                     *
                     * This value indicate the range that ScrollBar control can scroll.
                     */
                    get: function () {
                        return this._scrollDistance;
                    },
                    set: function (value) {
                        if (value !== this.scrollDistance && value >= 0) {
                            this._scrollDistance = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ScrollBar.prototype, "scrollValue", {
                    /**
                     * Gets or sets the scroll value of the ScrollBar control
                     *
                     * This value is for synchronizing the scroll position of the FlexSheet control.
                     */
                    get: function () {
                        return this._scrollValue;
                    },
                    set: function (value) {
                        if (value < 0 || value > this.scrollDistance) {
                            return;
                        }
                        if (value !== this._scrollValue) {
                            this._root.scrollLeft = value;
                            this._scrollValue = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ScrollBar.prototype, "size", {
                    /**
                     * Gets the size of the ScrollBar control
                     */
                    get: function () {
                        return this._size;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Override to refresh the control.
                 *
                 * @param fullUpdate Whether to update the control layout as well as the content.
                 */
                ScrollBar.prototype.refresh = function (fullUpdate) {
                    if (fullUpdate === void 0) { fullUpdate = true; }
                    _super.prototype.refresh.call(this, fullUpdate);
                    this._root.removeEventListener('mousedown', this._mousedownEventHandler);
                    this._root.removeEventListener('scroll', this._scrollHdl, true);
                    this._adjustSize(fullUpdate);
                    this._root.addEventListener('mousedown', this._mousedownEventHandler);
                    this._root.addEventListener('scroll', this._scrollHdl, true);
                };
                // The scroll event handler for the ScrollBar control.
                ScrollBar.prototype._scrollEventHandler = function () {
                    this._scrollValue = this._root.scrollLeft;
                    this.scrolled.raise(this);
                };
                // The mousedown event handler for the ScrollBar control.
                ScrollBar.prototype._mousedownEventHandler = function (e) {
                    e.preventDefault();
                };
                // Initialize the ScrollBar control.
                ScrollBar.prototype._initControl = function () {
                    this.applyTemplate('', this.getTemplate(), {
                        _fill: 'fill',
                        _root: 'root'
                    });
                    this._root.addEventListener('mousedown', this._mousedownEventHandler);
                    this._root.addEventListener('scroll', this._scrollHdl, true);
                };
                // Adjust the size for the ScrollBar control.
                ScrollBar.prototype._adjustSize = function (fullUpdate) {
                    if (fullUpdate === void 0) { fullUpdate = true; }
                    var size, dis;
                    if (fullUpdate) {
                        this._root.style.overflowX = 'auto';
                        this._root.style.overflowY = 'hidden';
                        size = ScrollBar.scrollbarSize;
                        if (!size) {
                            dis = this._root.offsetWidth + this._scrollDistance;
                            this._fill.style.width = dis + 'px';
                            size = this._root.offsetHeight - this._root.clientHeight;
                            ScrollBar.scrollbarSize = size;
                        }
                        this._root.style.height = '100%';
                        this._fill.style.height = size + 'px';
                        this._root.style.width = '100%';
                        this._size = size;
                    }
                    dis = this._root.offsetWidth + this._scrollDistance;
                    this._fill.style.width = dis + 'px';
                };
                /**
                 * Gets the size of the ScrollBar.
                 */
                ScrollBar.getSize = function () {
                    var size = ScrollBar.scrollbarSize, tmp, scrollbar;
                    if (size) {
                        return size;
                    }
                    tmp = document.createElement('div');
                    document.body.appendChild(tmp);
                    scrollbar = new ScrollBar(tmp, { scrollDistance: 100 });
                    size = scrollbar.size;
                    ScrollBar.scrollbarSize = size;
                    document.body.removeChild(tmp);
                    return size;
                };
                ScrollBar.scrollbarSize = 0;
                ScrollBar.controlTemplate = '<div wj-part="root" style="width:100px;height:100px">' +
                    '<div wj-part="fill" style="width:100%;height:100%"/>' +
                    '</div>';
                return ScrollBar;
            }(wijmo.Control));
            sheet.ScrollBar = ScrollBar;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ScrollBar.js.map