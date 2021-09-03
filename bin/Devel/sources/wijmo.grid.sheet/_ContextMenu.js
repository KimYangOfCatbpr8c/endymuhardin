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
             * Defines the ContextMenu for a @see:FlexSheet control.
             */
            var _ContextMenu = (function (_super) {
                __extends(_ContextMenu, _super);
                /*
                 * Initializes a new instance of the _ContextMenu class.
                 *
                 * @param element The DOM element that will host the control, or a jQuery selector (e.g. '#theCtrl').
                 * @param owner The @see: FlexSheet control what the ContextMenu works with.
                 */
                function _ContextMenu(element, owner) {
                    _super.call(this, element);
                    this._owner = owner;
                    this.applyTemplate('', this.getTemplate(), {
                        _insRows: 'insert-rows',
                        _delRows: 'delete-rows',
                        _insCols: 'insert-columns',
                        _delCols: 'delete-columns',
                    });
                    this._init();
                }
                /*
                 * Show the context menu.
                 *
                 * @param e The mouse event.
                 * @param point The point indicates the position for the context menu.
                 */
                _ContextMenu.prototype.show = function (e, point) {
                    var posX = (point ? point.x : e.clientX) + (e ? window.pageXOffset : 0), //Left Position of Mouse Pointer
                    posY = (point ? point.y : e.clientY) + (e ? window.pageYOffset : 0); //Top Position of Mouse Pointer
                    this.hostElement.style.position = 'absolute';
                    this.hostElement.style.display = 'inline';
                    if (posY + this.hostElement.clientHeight > window.innerHeight) {
                        posY -= this.hostElement.clientHeight;
                    }
                    if (posX + this.hostElement.clientWidth > window.innerWidth) {
                        posX -= this.hostElement.clientWidth;
                    }
                    this.hostElement.style.top = posY + 'px';
                    this.hostElement.style.left = posX + 'px';
                };
                /*
                 * Hide the context menu.
                 */
                _ContextMenu.prototype.hide = function () {
                    this.hostElement.style.display = 'none';
                };
                // Initialize the context menu.
                _ContextMenu.prototype._init = function () {
                    var self = this;
                    self.hostElement.style.zIndex = '9999';
                    document.querySelector('body').appendChild(self.hostElement);
                    self.addEventListener(self.hostElement, 'contextmenu', function (e) {
                        e.preventDefault();
                    });
                    self.addEventListener(self._insRows, 'click', function (e) {
                        self._owner.insertRows();
                        self.hide();
                        self._owner.hostElement.focus();
                    });
                    self.addEventListener(self._delRows, 'click', function (e) {
                        self._owner.deleteRows();
                        self.hide();
                        self._owner.hostElement.focus();
                    });
                    self.addEventListener(self._insCols, 'click', function (e) {
                        self._owner.insertColumns();
                        self.hide();
                        self._owner.hostElement.focus();
                    });
                    self.addEventListener(self._delCols, 'click', function (e) {
                        self._owner.deleteColumns();
                        self.hide();
                        self._owner.hostElement.focus();
                    });
                };
                _ContextMenu.controlTemplate = '<div class="wj-context-menu" width="150px">' +
                    '<div class="wj-context-menu-item" wj-part="insert-rows">Insert Row</div>' +
                    '<div class="wj-context-menu-item" wj-part="delete-rows">Delete Rows</div>' +
                    '<div class="wj-context-menu-item" wj-part="insert-columns">Insert Column</div>' +
                    '<div class="wj-context-menu-item" wj-part="delete-columns">Delete Columns</div>' +
                    '</div>';
                return _ContextMenu;
            }(wijmo.Control));
            sheet._ContextMenu = _ContextMenu;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_ContextMenu.js.map