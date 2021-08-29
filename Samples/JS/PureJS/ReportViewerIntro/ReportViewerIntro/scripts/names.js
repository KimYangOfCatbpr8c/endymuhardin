(function (wijmo) {
    'use strict';

    // create controls
    var viewer = new wijmo.viewer.ReportViewer('#namesReportViewer'),
        namesReportPath = new wijmo.input.ComboBox('#namesReportPath');

    // initialize ReportViewer's properties
    viewer.serviceUrl = serviceUrl;
    viewer.filePath = 'ReportsRoot/Formatting/AlternateBackground.flxr';
    viewer.reportName = 'AlternateBackground';

    // names report path
    namesReportPath.selectedIndex = 0;
    namesReportPath.selectedIndexChanged.addHandler(function (sender, args) {
        if (!sender.selectedValue) return;

        var reportPath = sender.selectedValue;
        var index = reportPath.lastIndexOf('/');
        var filePath = reportPath.substr(0, index);
        var reportName = reportPath.substr(index + 1);
        
        viewer.filePath = filePath;
        viewer.reportName = reportName;
    });

})(wijmo);