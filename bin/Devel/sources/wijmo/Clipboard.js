var wijmo;
(function (wijmo) {
    'use strict';
    /**
     * Static class that provides utility methods for clipboard operations.
     *
     * The @see:Clipboard class provides static @see:copy and @see:paste methods
     * that can be used by controls to customize the clipboard content during
     * clipboard operations.
     *
     * For example, the code below shows how a control could intercept the
     * clipboard shortcut keys and provide custom clipboard handling:
     *
     * <pre>
     * rootElement.addEventListener('keydown', function(e) {
     *   // copy: ctrl+c or ctrl+Insert
     *   if (e.ctrlKey && (e.keyCode == 67 || e.keyCode == 45)) {
     *     var text = this.getClipString();
     *     Clipboard.copy(text);
     *     return;
     *   }
     *   // paste: ctrl+v or shift+Insert
     *   if ((e.ctrlKey && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45)) {
     *     Clipboard.paste(function (text) {
     *       this.setClipString(text);
     *     });
     *     return;
     *   }
     * });</pre>
     */
    var Clipboard = (function () {
        function Clipboard() {
        }
        /**
         * Copies a string to the clipboard.
         *
         * This method only works if invoked immediately after the user
         * pressed a clipboard copy command (such as ctrl+c).
         *
         * @param text Text to copy to the clipboard.
         */
        Clipboard.copy = function (text) {
            Clipboard._copyPasteInternal(text);
        };
        /**
         * Gets a string from the clipboard.
         *
         * This method only works if invoked immediately after the user
         * pressed a clipboard paste command (such as ctrl+v).
         *
         * @param callback Function called when the clipboard content
         * has been retrieved. The function receives the clipboard
         * content as a parameter.
         */
        Clipboard.paste = function (callback) {
            Clipboard._copyPasteInternal(callback);
        };
        // ** implementation
        Clipboard._copyPasteInternal = function (textOrCallback) {
            // get active element to restore later
            var activeElement = wijmo.getActiveElement();
            // find parent for temporary input element
            // (body may not be focusable when modal dialogs are used..., TFS 202992)
            // start with closest wijmo control
            var parent = wijmo.closest(activeElement, '.wj-control');
            // move on to non-control parent (since most controls handle the keyboard themselves)
            while (parent && wijmo.Control.getControl(parent)) {
                parent = parent.parentElement;
            }
            // fallback on body
            if (parent == null) {
                parent = document.body;
            }
            // create hidden input element, append it to parent
            if (parent) {
                var el = document.createElement('textarea');
                el.style.position = 'fixed';
                el.style.opacity = '0';
                parent.appendChild(el);
                // initialize text and give element the focus
                if (typeof (textOrCallback) == 'string') {
                    el.value = textOrCallback;
                }
                el.select();
                // prevent multiple ctrl+v's from getting to the hidden element (TFS 151939)
                el.onkeydown = function (e) {
                    if (el.value) {
                        e.preventDefault();
                    }
                };
                // when the clipboard operation is done, remove element, restore focus
                // and invoke the paste callback
                setTimeout(function () {
                    var text = el.value;
                    parent.removeChild(el);
                    activeElement.focus();
                    if (typeof (textOrCallback) == 'function') {
                        textOrCallback(text);
                    }
                }, 100); // Apple needs extra timeOut
            }
        };
        return Clipboard;
    }());
    wijmo.Clipboard = Clipboard;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Clipboard.js.map