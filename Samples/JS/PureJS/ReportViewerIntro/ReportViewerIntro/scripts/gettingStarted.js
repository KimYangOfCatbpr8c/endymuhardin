var serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/report';

$(function () {
    $('.service-url').text(serviceUrl);
});

(function (wijmo) {
    'use strict';

    // create controls
    var viewer = new wijmo.viewer.ReportViewer('#introReportViewer');

    // initialize ReportViewer's properties
    viewer.serviceUrl = serviceUrl;
    viewer.filePath = 'ReportsRoot/Formatting/AlternateBackground.flxr';
    viewer.reportName = 'AlternateBackground';

})(wijmo);