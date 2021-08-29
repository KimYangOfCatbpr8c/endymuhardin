"use strict";
var wjcSelf = require('./FlexGridColumnPicker');
window['FlexGridColumnPicker'] = wjcSelf;
'use strict';
/**
 * Provides column picker for FlexGrid.
 */
var FlexGridColumnPicker = (function () {
    /**
     * Initializes a new instance of the @see:FlexGridColumnPicker class.
     *
     * @param flex @see:FlexGrid that will receive the column picker.
     */
    function FlexGridColumnPicker(flex, columnPicker) {
        this._flex = flex;
        this.columnPicker = columnPicker;
        // add picker icon to column header element
        this._createPickerImg();
        // create frame element for column list
        this._createPopIframe();
        // close frame when user clicks anywhere else
        this._initMouseDownOnBody();
    }
    // create picker icon
    FlexGridColumnPicker.prototype._createPickerImg = function () {
        var _this = this;
        var host = this._flex.hostElement, colHdr = host.querySelector('[wj-part="ch"]'), img = document.createElement('img');
        this._img = img;
        img.className = "wj-col-picker-icon";
        img.style.position = 'absolute';
        img.style.top = '0px';
        img.style.right = '0px';
        img.style.height = this._flex.rows.defaultSize + 'px';
        img.src = this.columnPicker;
        colHdr.appendChild(img);
        img.addEventListener('mousedown', function (e) {
            var fs = _this._frame.style;
            // we're done with this event
            e.preventDefault();
            e.stopImmediatePropagation();
            // if frame is visible, hide it
            if (fs.display != 'none') {
                fs.display = 'none';
                return;
            }
            // populate frame with checkboxes for the columns
            _this._populateFrame();
            var root = host.querySelector('[wj-part="root"]');
            // show frame
            fs.top = _this._flex.rows.defaultSize + 'px';
            fs.right = (root.offsetWidth - root.clientWidth) + 'px';
            fs.maxHeight = (root.clientHeight - _this._flex.rows.defaultSize) * 0.65 + 'px';
            fs.display = '';
            _this._frame.focus();
        });
    };
    // create pop iframe
    FlexGridColumnPicker.prototype._createPopIframe = function () {
        var _this = this;
        var host = this._flex.hostElement, frame = document.createElement("div");
        this._frame = frame;
        frame.className = "wj-col-picker-dropdown";
        frame.style.position = "absolute";
        frame.style.outline = "none";
        frame.style.display = "none";
        frame.tabIndex = 0;
        var root = host.querySelector('[wj-part="root"]');
        root.parentElement.appendChild(frame);
        // handle checkbox changes to show/hide columns
        frame.addEventListener('change', function (e) {
            var sender = e.target;
            if (sender instanceof HTMLInputElement &&
                sender.type == 'checkbox' &&
                sender.value != null) {
                var col = _this._flex.columns[parseInt(sender.value)];
                col.visible = sender.checked;
            }
        });
    };
    // populate the frame with checkboxes for each column
    FlexGridColumnPicker.prototype._populateFrame = function () {
        this._frame.innerHTML = '';
        // create two divs to hold the checkboxes
        for (var i = 0; i < 2; i++) {
            var d = document.createElement('div');
            d.style.cssFloat = "left";
            this._frame.appendChild(d);
        }
        // add one checkbox for each grid column
        for (var i = 0; i < this._flex.columns.length; i++) {
            // create checkbox
            var col = this._flex.columns[i], hdr = col.header ? col.header : col.binding, checked = col.visible ? 'checked' : '', chk = document.createElement("label");
            chk.className = "wj-col-picker-item";
            chk.innerHTML = '<input type="checkbox" value= "' + i + '" ' + checked + '>' + hdr;
            // append to first or second div
            var fc = i <= this._flex.columns.length / 2 ? 0 : 1;
            this._frame.children[fc].appendChild(chk);
        }
    };
    FlexGridColumnPicker.prototype._initMouseDownOnBody = function () {
        var _this = this;
        document.body.addEventListener('mousedown', function (e) {
            var mde = document.elementFromPoint(e.clientX, e.clientY);
            if (mde != _this._img) {
                if (_this._contains(_this._frame, mde)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    _this._frame.focus();
                }
                else {
                    _this._frame.style.display = 'none';
                }
            }
        }, true);
    };
    FlexGridColumnPicker.prototype._contains = function (parent, child) {
        for (var e = child; e; e = e.parentElement) {
            if (e == parent)
                return true;
        }
        return false;
    };
    return FlexGridColumnPicker;
}());
exports.FlexGridColumnPicker = FlexGridColumnPicker;
//# sourceMappingURL=FlexGridColumnPicker.js.map