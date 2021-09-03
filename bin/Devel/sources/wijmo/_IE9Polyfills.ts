//
// IE9 polyfills
module wijmo {
    'use strict';

    // expose IE flag to callers that need it
    var _isIE = navigator.userAgent.match(/MSIE |Trident\/|Edge\//) != null;
    export function isIE(): boolean {
        return _isIE;
    }
    
    // expose IE9 flag to callers that need it
    var _isIE9: boolean;
    export function isIE9(): boolean {
        return _isIE9;
    }

    // implement HTML5 drag-drop behavior in IE9.
    if (document.doctype && navigator.appVersion.indexOf('MSIE 9') > -1) {

        // remember this is IE9...
        _isIE9 = true;

        // TFS 140812: 'selectstart' does not work in popup dialogs, so use 'mousemove'
        // instead. It's less efficient but it works, and this only matters in IE9.
        document.addEventListener('mousemove', function (e: MouseEvent) {
            if (e.which == 1) {
                for (var el = <Node>e.target; el; el = el.parentNode) {
                    if (el.attributes && el.attributes['draggable']) {
                        (<HTMLElement>el).dragDrop();
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
            var
                currentTime = Date.now(),
                adjustedDelay = 16 - (currentTime - expectedTime),
                delay = adjustedDelay > 0 ? adjustedDelay : 0;
            expectedTime = currentTime + delay;
            return setTimeout(function () {
                callback(expectedTime);
            }, delay);
        };
        window['cancelAnimationFrame'] = clearTimeout;
    }
}