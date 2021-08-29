(function (wijmo) {
    'use strict';

    // create controls
    var viewer = new wijmo.viewer.ReportViewer('#ssrsReportViewer');

    // initialize ReportViewer's properties
    viewer.serviceUrl = serviceUrl;
    viewer.filePath = 'c1ssrs/AdventureWorks/Company Sales';

})(wijmo);