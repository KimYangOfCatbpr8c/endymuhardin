var serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/pdf';

$(function () {
    $('.service-url').text(serviceUrl);
});

(function (wijmo) {
    'use strict';

    // create controls
    var viewer = new wijmo.viewer.PdfViewer('#introPdfViewer');

    // initialize PdfViewer's properties
    viewer.serviceUrl = serviceUrl;
    viewer.filePath = 'PdfRoot/C1XapOptimizer.pdf';

})(wijmo);