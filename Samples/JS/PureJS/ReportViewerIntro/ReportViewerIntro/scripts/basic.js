(function (wijmo) {
    'use strict';

    // create controls
    var viewer = new wijmo.viewer.ReportViewer('#basicReportViewer'),
        fullScreen = document.getElementById('basicFullScreen'),
        selectMouseMode = document.getElementById('basicSelectMouseMode'),
        zoomFactor = new wijmo.input.InputNumber('#basicZoomFactor'),
        continuousViewMode = document.getElementById('basicContinuousViewMode');

    // initialize ReportViewer's properties
    viewer.serviceUrl = serviceUrl;
    viewer.filePath = 'ReportsRoot/Formatting/AlternateBackground.flxr';
    viewer.reportName = 'AlternateBackground';

    // fullScreen
    fullScreen.checked = viewer.fullScreen;
    fullScreen.addEventListener('change', function () {
        viewer.fullScreen = this.checked;
    });

    // selectMouseMode
    selectMouseMode.checked = viewer.selectMouseMode;
    selectMouseMode.addEventListener('change', function () {
        viewer.selectMouseMode = this.checked;
    });

    // continousViewMode
    continuousViewMode.checked = viewer.viewMode == wijmo.viewer.ViewMode.Continuous;
    continuousViewMode.addEventListener('change', function () {
        viewer.viewMode = this.checked ? wijmo.viewer.ViewMode.Continuous : wijmo.viewer.ViewMode.Single;
    });

    // zoomFactor - initialize InputNumber's properties
    zoomFactor.min = 0.05;
    zoomFactor.max = 10;
    zoomFactor.step = 0.1;
    zoomFactor.format = 'n2';
    zoomFactor.value = viewer.zoomFactor;
    zoomFactor.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        viewer.zoomFactor = sender.value;
    });

})(wijmo);