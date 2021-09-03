var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * Specifies actions that trigger showing and hiding @see:Popup controls.
         */
        (function (PopupTrigger) {
            /** No triggers; popups must be shown and hidden using code. */
            PopupTrigger[PopupTrigger["None"] = 0] = "None";
            /** Show or hide when the owner element is clicked. */
            PopupTrigger[PopupTrigger["Click"] = 1] = "Click";
            /** Hide the popup when it loses focus. */
            PopupTrigger[PopupTrigger["Blur"] = 2] = "Blur";
        })(input.PopupTrigger || (input.PopupTrigger = {}));
        var PopupTrigger = input.PopupTrigger;
        /**
         * Class that shows an element as a popup.
         *
         * Popups may be have @see:owner elements, in which case they behave
         * as rich tooltips that may be shown or hidden based on actions
         * specified by the @see:Popup.showTrigger and @see:Popup.hideTrigger
         * properties.
         *
         * Popups with no owner elements behave like dialogs. They are centered
         * on the screen and displayed using the @see:show method.
         *
         * To close a @see:Popup, call the @see:Popup.hide method.
         *
         * Alternatively, any clickable elements within a @see:Popup that have
         * the classes starting with the 'wj-hide' string will hide the @see:Popup
         * when clicked and will set the @see:Popup.dialogResult property to the
         * class name so the caller may take appropriate action.
         *
         * For example, the @see:Popup below will be hidden when the user presses
         * the OK or Cancel buttons, and the @see:Popup.dialogResult property will
         * be set to either 'wj-hide-cancel' or 'wj-hide-ok':
         *
         * <pre>&lt;button id="btnPopup"&gt;Show Popup&lt;/button&gt;
         * &lt;wj-popup owner="#btnPopup" style="padding:12px"&gt;
         *   &lt;p&gt;Press one of the buttons below to hide the Popup.&lt;/p&gt;
         *   &lt;hr/&gt;
         *   &lt;button class="wj-hide-ok" ng-click="handleOK()"&gt;OK&lt;/button&gt;
         *   &lt;button class="wj-hide-cancel"&gt;Cancel&lt;/button&gt;
         * &lt;/wj-popup&gt;</pre>
         */
        var Popup = (function (_super) {
            __extends(Popup, _super);
            /**
             * Initializes a new instance of the @see:Popup class.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function Popup(element, options) {
                var _this = this;
                _super.call(this, element, null, true);
                this._showTrigger = PopupTrigger.Click;
                this._hideTrigger = PopupTrigger.Blur;
                this._fadeIn = true;
                this._fadeOut = true;
                this._click = this._handleClick.bind(this);
                this._visible = false; // to report correctly while fading out
                /**
                 * Occurs before the @see:Popup is shown.
                 */
                this.showing = new wijmo.Event();
                /**
                 * Occurs after the @see:Popup has been shown.
                 */
                this.shown = new wijmo.Event();
                /**
                 * Occurs before the @see:Popup is hidden.
                 */
                this.hiding = new wijmo.Event();
                /**
                 * Occurs after the @see:Popup has been hidden.
                 */
                this.hidden = new wijmo.Event();
                var host = this.hostElement;
                // add classes
                wijmo.addClass(host, 'wj-control wj-content wj-popup');
                // ensure the host element can get the focus (TFS 199312)
                if (!host.getAttribute('tabindex')) {
                    host.tabIndex = 0;
                }
                // start hidden
                wijmo.hidePopup(host, false);
                // hide Popup when user presses Escape or Enter keys
                this.addEventListener(host, 'keydown', function (e) {
                    if (!e.defaultPrevented) {
                        // Escape: hide the popup with no dialogResult
                        if (e.keyCode == wijmo.Key.Escape) {
                            e.preventDefault();
                            _this.hide();
                        }
                        // Enter: hide the popup and provide a dialogResult
                        if (e.keyCode == wijmo.Key.Enter) {
                            var result = _this.dialogResultEnter;
                            if (result) {
                                e.preventDefault();
                                _this._validateAndHide(result);
                            }
                        }
                    }
                });
                // keep focus within popup when modal
                this.addEventListener(host, 'keydown', function (e) {
                    if (!e.defaultPrevented && _this.modal && e.keyCode == wijmo.Key.Tab) {
                        e.preventDefault();
                        wijmo.moveFocus(_this.hostElement, e.shiftKey ? -1 : +1);
                    }
                }); //, true);
                // hide Popup when user clicks an element with the 'wj-hide' class
                this.addEventListener(host, 'click', function (e) {
                    if (e.target instanceof HTMLElement) {
                        var target = e.target, match = target.className.match(/\bwj-hide[\S]*\b/);
                        if (match && match.length > 0) {
                            e.preventDefault(); // cancel any navigation
                            e.stopPropagation();
                            _this.hide(match[0]); // hide and pass the attribute as the dialogResult
                        }
                    }
                });
                // limit wheel propagation while modals are open
                this.addEventListener(document, 'wheel', function (e) {
                    if (_this.isVisible && _this._modal) {
                        for (var t = e.target; t && t != document.body; t = t.parentElement) {
                            if (t.scrollHeight > t.clientHeight) {
                                return;
                            }
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                // apply options after control is fully initialized
                this.initialize(options);
            }
            Object.defineProperty(Popup.prototype, "owner", {
                // ** object model
                /**
                 * Gets or sets the element that owns this @see:Popup.
                 *
                 * If the @see:owner is null, the @see:Popup behaves like a dialog.
                 * It is centered on the screen and must be shown using the
                 * @see:show method.
                 */
                get: function () {
                    return this._owner;
                },
                set: function (value) {
                    // disconnect previous owner
                    if (this._owner) {
                        this.removeEventListener(this._owner, 'click');
                    }
                    // set new owner
                    this._owner = value != null ? wijmo.getElement(value) : null;
                    // connect new owner
                    if (this._owner) {
                        this.addEventListener(this._owner, 'click', this._click, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "content", {
                /**
                 * Gets or sets the HTML element contained in this @see:Popup.
                 */
                get: function () {
                    return this.hostElement.firstElementChild;
                },
                set: function (value) {
                    if (value != this.content) {
                        this.hostElement.innerHTML = '';
                        if (value instanceof HTMLElement) {
                            this.hostElement.appendChild(value);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "showTrigger", {
                /**
                 * Gets or sets the actions that show the @see:Popup.
                 *
                 * By default, the @see:showTrigger property is set to @see:PopupTrigger.Click,
                 * which causes the popup to appear when the user clicks the owner element.
                 *
                 * If you set the @see:showTrigger property to @see:PopupTrigger.None, the popup
                 * will be shown only when the @see:show method is called.
                 */
                get: function () {
                    return this._showTrigger;
                },
                set: function (value) {
                    this._showTrigger = wijmo.asEnum(value, PopupTrigger);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "hideTrigger", {
                /**
                 * Gets or sets the actions that hide the @see:Popup.
                 *
                 * By default, the @see:hideTrigger property is set to @see:PopupTrigger.Blur,
                 * which hides the popup when it loses focus.
                 *
                 * If you set the @see:hideTrigger property to @see:PopupTrigger.Click, the popup
                 * will be hidden only when the owner element is clicked.
                 *
                 * If you set the @see:hideTrigger property to @see:PopupTrigger.None, the popup
                 * will be hidden only when the @see:hide method is called.
                 */
                get: function () {
                    return this._hideTrigger;
                },
                set: function (value) {
                    this._hideTrigger = wijmo.asEnum(value, PopupTrigger);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "fadeIn", {
                /**
                 * Gets or sets a value that determines whether the @see:Popup should
                 * use a fade-out animation when it is shown.
                 */
                get: function () {
                    return this._fadeIn;
                },
                set: function (value) {
                    this._fadeIn = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "fadeOut", {
                /**
                 * Gets or sets a value that determines whether the @see:Popup should
                 * use a fade-out animation when it is hidden.
                 */
                get: function () {
                    return this._fadeOut;
                },
                set: function (value) {
                    this._fadeOut = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "modal", {
                /**
                 * Gets or sets a value that determines whether the @see:Popup should
                 * be displayed as a modal dialog.
                 *
                 * Modal dialogs show a dark backdrop that makes the @see:Popup stand
                 * out from other content on the page.
                 *
                 * If you want to make a dialog truly modal, also set the @see:Popup.hideTrigger
                 * property to @see:PopupTrigger.None, so users won't be able to click the
                 * backdrop to dismiss the dialog. In this case, the dialog will close only
                 * if the @see:Popup.hide method is called or if the user presses the Escape
                 * key.
                 */
                get: function () {
                    return this._modal;
                },
                set: function (value) {
                    this._modal = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "dialogResult", {
                /**
                 * Gets or sets a value that can be used for handling the content of the @see:Popup
                 * after it is hidden.
                 *
                 * This property is set to null when the @see:Popup is displayed, and it can be
                 * set in response to button click events or in the call to the @see:hide method.
                 */
                get: function () {
                    return this._result;
                },
                set: function (value) {
                    this._result = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "dialogResultEnter", {
                /**
                 * Gets or sets a value to be used as a @see:dialogResult when the user presses
                 * the Enter key while the @see:Popup is visible.
                 *
                 * If the user presses Enter and the @see:dialogResultEnter property is not null,
                 * the popup checks whether all its child elements are in a valid state.
                 * If so, the popup is closed and the @see:dialogResult property is set to
                 * the value of the @see:dialogResultEnter property.
                 */
                get: function () {
                    return this._resultEnter;
                },
                set: function (value) {
                    this._resultEnter = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "isVisible", {
                /**
                 * Gets a value that determines whether the @see:Popup is currently visible.
                 */
                get: function () {
                    var host = this.hostElement;
                    return this._visible && host && host.style.display != 'none';
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Shows the @see:Popup.
             *
             * @param modal Whether to show the popup as a modal dialog. If provided, this
             * sets the value of the @see:modal property.
             * @param handleResult Callback invoked when the popup is hidden. If provided,
             * this should be a function that receives the popup as a parameter.
             *
             * The <b>handleResult</b> callback allows callers to handle the result of modal
             * dialogs without attaching handlers to the @see:hidden event. For example,
             * the code below shows a dialog used to edit the current item in a
             * @see:CollectionView. The edits are committed or canceled depending on the
             * @see:Popup.dialogResult value. For example:
             *
             * <pre>$scope.editCurrentItem = function () {
             *   $scope.data.editItem($scope.data.currentItem);
             *   $scope.itemEditor.show(true, function (e) {
             *     if (e.dialogResult == 'wj-hide-ok') {
             *       $scope.data.commitEdit();
             *     } else {
             *       $scope.data.cancelEdit();
             *     }
             *   });
             * }</pre>
             */
            Popup.prototype.show = function (modal, handleResult) {
                var _this = this;
                if (!this.isVisible) {
                    // reset dialog result/callback
                    this.dialogResult = null;
                    this._callback = null;
                    // raise the event
                    var e = new wijmo.CancelEventArgs();
                    if (this.onShowing(e)) {
                        // honor parameters
                        if (modal != null) {
                            this.modal = wijmo.asBoolean(modal);
                        }
                        if (handleResult != null) {
                            this._callback = wijmo.asFunction(handleResult);
                        }
                        // show the popup using a rectangle as reference (to avoid copying styles)
                        var ref = this._owner ? this._owner.getBoundingClientRect() : null;
                        wijmo.showPopup(this.hostElement, ref, false, this._fadeIn);
                        // show modal backdrop behind the popup
                        if (this._modal) {
                            this._showBackdrop();
                        }
                        // raise shown event
                        this._visible = true;
                        this.onShown(e);
                        // move focus to the popup
                        setTimeout(function () {
                            // if this is not a touch event, set the focus to the 'autofocus' element 
                            // or to the first focusable element on the popup
                            if (!_this.isTouching) {
                                var el = _this.hostElement.querySelector('input[autofocus]');
                                if (el && el.clientHeight > 0 &&
                                    !el.disabled && el.tabIndex > -1 &&
                                    !wijmo.closest(el, '[disabled],.wj-state-disabled')) {
                                    el.focus();
                                    el.select(); // TFS 190336
                                }
                                else {
                                    wijmo.moveFocus(_this.hostElement, 0);
                                }
                            }
                            // make sure the popup has the focus (no input elements/touch: TFS 143114)
                            if (!_this.containsFocus()) {
                                _this.hostElement.tabIndex = 0;
                                _this.hostElement.focus();
                            }
                        }, 200);
                    }
                }
            };
            /**
             * Hides the @see:Popup.
             * @param dialogResult Optional value assigned to the @see:dialogResult property
             * before closing the @see:Popup.
             */
            Popup.prototype.hide = function (dialogResult) {
                if (this.isVisible) {
                    if (!wijmo.isUndefined(dialogResult)) {
                        this.dialogResult = dialogResult;
                    }
                    var e = new wijmo.CancelEventArgs();
                    if (this.onHiding(e)) {
                        if (this._modal) {
                            wijmo.hidePopup(this._bkdrop, true, this.fadeOut);
                        }
                        wijmo.hidePopup(this.hostElement, true, this.fadeOut);
                        this._visible = false;
                        this.onHidden(e);
                        if (this._callback) {
                            this._callback(this);
                        }
                    }
                }
            };
            /**
             * Raises the @see:showing event.
             */
            Popup.prototype.onShowing = function (e) {
                this.showing.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the @see:shown event.
             */
            Popup.prototype.onShown = function (e) {
                this.shown.raise(this, e);
            };
            /**
             * Raises the @see:hiding event.
             */
            Popup.prototype.onHiding = function (e) {
                this.hiding.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the @see:hidden event.
             */
            Popup.prototype.onHidden = function (e) {
                this.hidden.raise(this, e);
            };
            // ** overrides
            // release owner when disposing
            Popup.prototype.dispose = function () {
                this._owner = null;
                _super.prototype.dispose.call(this);
            };
            // hide popup when popup loses focus
            Popup.prototype.onLostFocus = function (e) {
                if (this.isVisible && (this._hideTrigger & PopupTrigger.Blur)) {
                    if (!this.containsFocus()) {
                        this.hide();
                    }
                }
                _super.prototype.onLostFocus.call(this, e);
            };
            // reposition Popup when refreshing
            Popup.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.isVisible && !this._refreshing) {
                    this._refreshing = true;
                    var ae = wijmo.getActiveElement(), ref = this._owner ? this._owner.getBoundingClientRect() : null;
                    wijmo.showPopup(this.hostElement, ref);
                    if (this._modal && ae instanceof HTMLElement && ae != wijmo.getActiveElement()) {
                        ae.focus();
                    }
                    this._refreshing = false;
                }
            };
            // ** implementation
            // reposition Popup when window size changes
            Popup.prototype._handleResize = function () {
                if (this.isVisible) {
                    this.refresh();
                }
            };
            // toggle Popup when user clicks the owner element
            Popup.prototype._handleClick = function (e) {
                if (this.isVisible) {
                    if (this._hideTrigger & PopupTrigger.Click) {
                        this.hide();
                    }
                }
                else {
                    if (this._showTrigger & PopupTrigger.Click) {
                        // don't show while fading out (in this case, visible == false 
                        // but host element is still visible on the page)
                        var host = this.hostElement;
                        if (host && host.style.display == 'none') {
                            this.show();
                        }
                    }
                }
            };
            // show/hide modal popup backdrop
            Popup.prototype._showBackdrop = function () {
                var _this = this;
                if (!this._bkdrop) {
                    // create backdrop element
                    this._bkdrop = document.createElement('div');
                    this._bkdrop.tabIndex = -1;
                    wijmo.addClass(this._bkdrop, 'wj-popup-backdrop');
                    // background is not clickable
                    this.addEventListener(this._bkdrop, 'mousedown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.hostElement.focus(); // close any open menus/popups TFS 152950
                    });
                }
                this._bkdrop.style.display = '';
                // insert background behind the popup (TFS 205400)
                var host = this.hostElement;
                host.parentElement.insertBefore(this._bkdrop, host);
            };
            // validate the dialog and hide it if there are no errors
            Popup.prototype._validateAndHide = function (result) {
                var invalid = this.hostElement.querySelector(':invalid');
                if (invalid) {
                    invalid.focus(); // focus to invalid field
                }
                else {
                    this.hide(result); // no errors
                }
            };
            return Popup;
        }(wijmo.Control));
        input.Popup = Popup;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Popup.js.map