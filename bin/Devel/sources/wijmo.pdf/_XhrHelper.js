var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        var _XhrOverrideMimeTypeSupported = !!new XMLHttpRequest().overrideMimeType;
        /* XMLHttpRequest helper. */
        var _XhrHelper = (function () {
            function _XhrHelper() {
            }
            /*
            * Asynchronously retrieves an ArrayBuffer from the URL using XMLHttpRequest.
            *
            * @param url The URL to send the request to.
            * @param success A function to be called if the request succeeds.
            * @param error A function to be called if the request fails.
            */
            _XhrHelper.arrayBufferAsync = function (url, success, error) {
                var settings = {
                    method: 'GET',
                    responseType: 'arraybuffer',
                    async: true
                };
                this._getData(url, settings, success, error);
            };
            /*
            * Synchronously retrieves an ArrayBuffer from a URL using XMLHttpRequest.
            *
            * @param url The URL to send the request to.
            * @param error A function to be called if the request fails.
            */
            _XhrHelper.arrayBuffer = function (url, error) {
                var buffer, settings = {
                    method: 'GET',
                    async: false
                };
                if (_XhrOverrideMimeTypeSupported) {
                    // Note: the responseType parameter must be empty in case of synchronous request (http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute)
                    settings.overrideMimeType = 'text/plain; charset=x-user-defined'; // retrieve unprocessed data as a binary string
                    this._getData(url, settings, function (xhr, response) {
                        // convert string to ArrayBuffer
                        buffer = new ArrayBuffer(response.length);
                        var byteView = new Uint8Array(buffer);
                        for (var i = 0, len = response.length; i < len; i++) {
                            byteView[i] = response.charCodeAt(i) & 0xFF;
                        }
                    }, error);
                }
                else {
                    // We can retrieve binary data synchronously using xhr.responseType in case of IE10.
                    settings.responseType = 'arraybuffer';
                    this._getData(url, settings, function (xhr, response) {
                        buffer = response;
                    }, error);
                }
                return buffer;
            };
            /*
            * Synchronously retrieves a text from a URL using XMLHttpRequest.
            *
            * @param url The URL to send the request to.
            * @param error A function to be called if the request fails.
            */
            _XhrHelper.text = function (url, error) {
                var settings = {
                    method: 'GET',
                    async: false
                }, res = "";
                this._getData(url, settings, function (xhr, response) { return res = response; }, error);
                return res;
            };
            /*
            * Retrieves data from a URL using XMLHttpRequest.
            *
            * @param url The URL to send the request to.
            * @param settings Request settings.
            * @param success A function to be called if the request succeeds.
            * @param error A function to be called if the request fails.
            */
            _XhrHelper._getData = function (url, settings, success, error) {
                var xhr = new XMLHttpRequest();
                settings = settings || {};
                xhr.open(settings.method, url, settings.async, settings.user, settings.password);
                xhr.addEventListener('load', function () {
                    if (xhr.readyState === 4) {
                        var status = xhr.status;
                        if (status >= 200 && status < 300 || status === 304) {
                            if (success) {
                                success(xhr, xhr.response);
                            }
                        }
                        else {
                            if (error) {
                                error(xhr);
                            }
                        }
                    }
                });
                if (settings.headers) {
                    for (var key in settings.headers) {
                        xhr.setRequestHeader(key, settings.headers[key]);
                    }
                }
                if (settings.responseType) {
                    xhr.responseType = settings.responseType;
                }
                if (settings.overrideMimeType && xhr.overrideMimeType) {
                    xhr.overrideMimeType(settings.overrideMimeType);
                }
                xhr.send(settings.data);
            };
            return _XhrHelper;
        }());
        pdf._XhrHelper = _XhrHelper;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_XhrHelper.js.map