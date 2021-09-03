var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        var _PdfImageHelper = (function () {
            function _PdfImageHelper() {
            }
            _PdfImageHelper.getDataUri = function (url) {
                wijmo.assert(!!(url = wijmo.asString(url)), pdf._Errors.EmptyUrl);
                if (_PdfImageHelper.DATAURI_CACHE[url]) {
                    return _PdfImageHelper.DATAURI_CACHE[url];
                }
                var res = '';
                if (url.indexOf('data:') === 0) {
                    wijmo.assert(!!url.match(/^data:(image\/png|image\/jpg);base64,/), pdf._Errors.InvalidImageDataUri);
                    res = url;
                }
                else {
                    var xhrError, buffer = pdf._XhrHelper.arrayBuffer(url, function (xhr) { return xhrError = xhr.statusText; });
                    wijmo.assert(xhrError == null, xhrError);
                    try {
                        var arr = new Uint16Array(buffer, 0, 2);
                        if ((arr[0] === 0xD8FF) || (arr[0] === 0x5089 && arr[1] === 0x474E)) {
                            var base64 = _PdfImageHelper._toBase64(buffer);
                            res = 'data:' + ((arr[0] === 0xD8FF) ? 'image/jpg' : 'image/png') + ';base64,' + base64;
                        }
                        else {
                            throw '';
                        }
                    }
                    catch (ex) {
                        wijmo.assert(false, pdf._Errors.InvalidImageFormat);
                    }
                }
                return _PdfImageHelper.DATAURI_CACHE[url] = res;
            };
            _PdfImageHelper._toBase64 = function (buffer) {
                var binary = '', bytes = new Uint8Array(buffer);
                for (var i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            };
            _PdfImageHelper.DATAURI_CACHE = {};
            return _PdfImageHelper;
        }());
        pdf._PdfImageHelper = _PdfImageHelper;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PdfImageHelper.js.map