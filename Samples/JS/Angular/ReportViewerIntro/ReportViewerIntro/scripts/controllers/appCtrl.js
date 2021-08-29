'use strict';

// get reference to app module
var app = angular.module('app');

// add controller to app module
app.controller('appCtrl', function appCtrl($scope) {

    $scope.viewerProps = {
        serviceUrl: 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/report',
        filePath: 'ReportsRoot/Formatting/AlternateBackground.flxr',
        reportName: 'AlternateBackground',
        ssrsFilePath : 'c1ssrs/AdventureWorks/Company Sales',
        fullScreen : false,
        selectMouseMode: true,
        zoomFactor: 1,
        continuousViewMode: false,
        chgFilePath: '',
        chgReportName: '',
        reports : [
            { name: 'Alternating Background', path: 'ReportsRoot/Formatting/AlternateBackground.flxr/AlternateBackground' },
            { name: 'All Charts', path: 'ReportsRoot/Controls/AllCharts.flxr/AllCharts' },
            { name: 'Check Box', path: 'ReportsRoot/Controls/CheckBox.flxr/CheckBox' },
            { name: 'Shapes', path: 'ReportsRoot/Controls/Shapes.flxr/Shapes' }
           ]
    };

    $scope.nameReportViewer = null;
    $scope.reportViewer = null;

    $scope.$watch('viewerProps.continuousViewMode', function () {
        var continuousViewMode = $scope.viewerProps.continuousViewMode;
        if ($scope.reportViewer) {
            $scope.reportViewer.viewMode = continuousViewMode ? wijmo.viewer.ViewMode.Continuous : wijmo.viewer.ViewMode.Single;
        }
    });

    $scope.changeReportPath = function (path) {
        var index = path.lastIndexOf('/');
        var filePath = path.substr(0, index);
        var reportName = path.substr(index + 1);
        if ($scope.nameReportViewer) {
            $scope.viewerProps.chgFilePath = filePath;
            $scope.viewerProps.chgReportName = reportName;
        }
    }

});
