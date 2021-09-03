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
            /*
             * Defines the _TabHolder control.
             */
            var _TabHolder = (function (_super) {
                __extends(_TabHolder, _super);
                /*
                 * Initializes a new instance of the _TabHolder class.
                 *
                 * @param element The DOM element that will host the control, or a jQuery selector (e.g. '#theCtrl').
                 * @param owner The @see: FlexSheet control that the _TabHolder control is associated to.
                 */
                function _TabHolder(element, owner) {
                    _super.call(this, element);
                    this._splitterMousedownHdl = this._splitterMousedownHandler.bind(this);
                    this._owner = owner;
                    if (this.hostElement.attributes['tabindex']) {
                        this.hostElement.attributes.removeNamedItem('tabindex');
                    }
                    // instantiate and apply template
                    this.applyTemplate('', this.getTemplate(), {
                        _divSheet: 'left',
                        _divSplitter: 'splitter',
                        _divRight: 'right'
                    });
                    this._init();
                }
                Object.defineProperty(_TabHolder.prototype, "sheetControl", {
                    /*
                     * Gets the SheetTabs control
                     */
                    get: function () {
                        return this._sheetControl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_TabHolder.prototype, "visible", {
                    //get scrollBar(): ScrollBar {
                    //	return this._hScrollbar;
                    //}
                    /*
                     * Gets or sets the visibility of the TabHolder control
                     */
                    get: function () {
                        return this.hostElement.style.display !== 'none';
                    },
                    set: function (value) {
                        this.hostElement.style.display = value ? 'block' : 'none';
                        this._divSheet.style.display = value ? 'block' : 'none';
                    },
                    enumerable: true,
                    configurable: true
                });
                /*
                 * Gets the Blanket size for the TabHolder control.
                 */
                _TabHolder.prototype.getSheetBlanketSize = function () {
                    //var scrollBarSize = ScrollBar.getSize();
                    //return (scrollBarSize === 0 ? 20 : scrollBarSize + 3);
                    return 20;
                };
                /*
                 * Adjust the size of the TabHolder control
                 */
                _TabHolder.prototype.adjustSize = function () {
                    var hScrollDis = this._owner.scrollSize.width - this._owner.clientSize.width, vScrollDis = this._owner.scrollSize.height - this._owner.clientSize.height, eParent = this._divSplitter.parentElement, 
                    //totalWidth: number,
                    leftWidth;
                    if (hScrollDis <= 0) {
                        eParent.style.minWidth = '100px';
                        this._divSplitter.style.display = 'none';
                        this._divRight.style.display = 'none';
                        this._divSheet.style.width = '100%';
                        this._divSplitter.removeEventListener('mousedown', this._splitterMousedownHdl, true);
                    }
                    else {
                        eParent.style.minWidth = '300px';
                        this._divSplitter.style.display = 'none';
                        this._divRight.style.display = 'none';
                        //totalWidth = eParent.clientWidth - this._divSplitter.offsetWidth;
                        this._divSheet.style.width = '100%';
                        //leftWidth = Math.ceil(totalWidth / 2);
                        //this._divSheet.style.width = leftWidth + 'px';
                        //this._divRight.style.width = (totalWidth - leftWidth) + 'px';
                        //if (vScrollDis <= 0) {
                        //	this._divHScrollbar.style.marginRight = '0px';
                        //} else {
                        //	this._divHScrollbar.style.marginRight = '20px';
                        //}
                        //this._hScrollbar.scrollDistance = hScrollDis;
                        //this._hScrollbar.scrollValue = -this._owner.scrollPosition.x;
                        this._divSplitter.removeEventListener('mousedown', this._splitterMousedownHdl, true);
                        this._divSplitter.addEventListener('mousedown', this._splitterMousedownHdl, true);
                    }
                    this._sheetControl._adjustSize();
                };
                // Init the size of the splitter.
                // And init the ScrollBar, SheetTabs control 
                _TabHolder.prototype._init = function () {
                    var self = this;
                    self._funSplitterMousedown = function (e) {
                        self._splitterMouseupHandler(e);
                    };
                    self._divSplitter.parentElement.style.height = self.getSheetBlanketSize() + 'px';
                    //init scrollbar
                    //self._hScrollbar = new ScrollBar(self._divHScrollbar);
                    //init sheet
                    self._sheetControl = new sheet._SheetTabs(self._divSheet, this._owner);
                    //self._owner.scrollPositionChanged.addHandler(() => {
                    //	self._hScrollbar.scrollValue = -self._owner.scrollPosition.x;
                    //});
                };
                // Mousedown event handler for the splitter
                _TabHolder.prototype._splitterMousedownHandler = function (e) {
                    this._startPos = e.pageX;
                    document.addEventListener('mousemove', this._splitterMousemoveHandler.bind(this), true);
                    document.addEventListener('mouseup', this._funSplitterMousedown, true);
                    e.preventDefault();
                };
                // Mousemove event handler for the splitter
                _TabHolder.prototype._splitterMousemoveHandler = function (e) {
                    if (this._startPos === null || typeof (this._startPos) === 'undefined') {
                        return;
                    }
                    this._adjustDis(e.pageX - this._startPos);
                };
                // Mouseup event handler for the splitter
                _TabHolder.prototype._splitterMouseupHandler = function (e) {
                    document.removeEventListener('mousemove', this._splitterMousemoveHandler, true);
                    document.removeEventListener('mouseup', this._funSplitterMousedown, true);
                    this._adjustDis(e.pageX - this._startPos);
                    this._startPos = null;
                };
                // Adjust the distance for the splitter
                _TabHolder.prototype._adjustDis = function (dis) {
                    var rightWidth = this._divRight.offsetWidth - dis, leftWidth = this._divSheet.offsetWidth + dis;
                    if (rightWidth <= 100) {
                        rightWidth = 100;
                        dis = this._divRight.offsetWidth - rightWidth;
                        leftWidth = this._divSheet.offsetWidth + dis;
                    }
                    else if (leftWidth <= 100) {
                        leftWidth = 100;
                        dis = leftWidth - this._divSheet.offsetWidth;
                        rightWidth = this._divRight.offsetWidth - dis;
                    }
                    if (dis == 0) {
                        return;
                    }
                    this._divRight.style.width = rightWidth + 'px';
                    this._divSheet.style.width = leftWidth + 'px';
                    this._startPos = this._startPos + dis;
                    //this._hScrollbar.invalidate(false);
                };
                _TabHolder.controlTemplate = '<div>' +
                    '<div wj-part="left" style ="float:left;height:100%;overflow:hidden"></div>' +
                    '<div wj-part="splitter" style="float:left;height:100%;width:6px;background-color:#e9eaee;padding:2px;cursor:e-resize"><div style="background-color:#8a9eb2;height:100%"></div></div>' +
                    '<div wj-part="right" style="float:left;height:100%;background-color:#e9eaee">' +
                    // We will use the native scrollbar of the flexgrid instead of the custom scrollbar of flexsheet (TFS 121971)
                    //'<div wj-part="hscrollbar" style="float:none;height:100%;border-left:1px solid #8a9eb2; padding-top:1px; display: none;"></div>' + // right scrollbar
                    '</div>' +
                    '</div>';
                return _TabHolder;
            }(wijmo.Control));
            sheet._TabHolder = _TabHolder;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_TabHolder.js.map