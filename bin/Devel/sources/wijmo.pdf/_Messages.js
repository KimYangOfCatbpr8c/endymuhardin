var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        pdf._Errors = {
            InvalidArg: function (name) {
                return 'Invalid argument: "' + name + '".';
            },
            InvalidFormat: function (value) {
                return '"' + value + '" is not in the correct format.';
            },
            ValueCannotBeEmpty: function (name) {
                return 'Value cannot be empty: "' + name + '".';
            },
            PathStarted: 'This method can not be used until the current path is finished.',
            BufferPagesMustBeEnabled: 'The bufferPages property must be enabled to render headers and footers.',
            AbstractMethod: 'This is an abstract method, it should not be called.',
            FontNameMustBeSet: 'The font name must be set.',
            FontSourceMustBeStringArrayBuffer: 'The font source must be of type string or ArrayBuffer.',
            FontSourceMustBeString: 'The font source must be of type string.',
            FontSourceMustBeArrayBuffer: 'The font source must be of type ArrayBuffer.',
            EmptyUrl: 'URL can not be empty.',
            UndefinedMimeType: 'MIME-type must be set.',
            InvalidImageDataUri: 'Invalid Data URI. It should be base64 encoded string that represents JPG or PNG image.',
            InvalidImageFormat: 'Invalid image format. Only JPG and PNG formats are supported.'
        };
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Messages.js.map