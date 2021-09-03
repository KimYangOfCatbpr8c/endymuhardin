//
// IE9 polyfills
var wijmo;
(function (wijmo) {
    'use strict';
    // expose IE flag to callers that need it
    var _isIE = navigator.userAgent.match(/MSIE |Trident\/|Edge\//) != null;
    function isIE() {
        return _isIE;
    }
    wijmo.isIE = isIE;
    // expose IE9 flag to callers that need it
    var _isIE9;
    function isIE9() {
        return _isIE9;
    }
    wijmo.isIE9 = isIE9;
    // implement HTML5 drag-drop behavior in IE9.
    if (document.doctype && navigator.appVersion.indexOf('MSIE 9') > -1) {
        // remember this is IE9...
        _isIE9 = true;
        // TFS 140812: 'selectstart' does not work in popup dialogs, so use 'mousemove'
        // instead. It's less efficient but it works, and this only matters in IE9.
        document.addEventListener('mousemove', function (e) {
            if (e.which == 1) {
                for (var el = e.target; el; el = el.parentNode) {
                    if (el.attributes && el.attributes['draggable']) {
                        el.dragDrop();
                        return false;
                    }
                }
            }
        });
    }
    // implement requestAnimationFrame/cancelAnimationFrame in IE9.
    // https://gist.github.com/rma4ok/3371337
    if (!window['requestAnimationFrame']) {
        var expectedTime = 0;
        window['requestAnimationFrame'] = function (callback) {
            var currentTime = Date.now(), adjustedDelay = 16 - (currentTime - expectedTime), delay = adjustedDelay > 0 ? adjustedDelay : 0;
            expectedTime = currentTime + delay;
            return setTimeout(function () {
                callback(expectedTime);
            }, delay);
        };
        window['cancelAnimationFrame'] = clearTimeout;
    }
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_IE9Polyfills.js.map