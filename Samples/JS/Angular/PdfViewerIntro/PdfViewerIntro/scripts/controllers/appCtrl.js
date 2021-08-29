'use strict';

// get reference to app module
var app = angular.module('app');

// add controller to app module
app.controller('appCtrl', function appCtrl($scope) {
    $scope.viewerProps = {
        serviceUrl: 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/pdf',
        filePath: 'pdfroot/C1XapOptimizer.pdf',
        fullScreen : false,
        selectMouseMode: true,
        zoomFactor: 1,
        continuousViewMode: false
    };

    $scope.pdfViewer = null;

    $scope.$watch('viewerProps.continuousViewMode', function () {
        var continuousViewMode = $scope.viewerProps.continuousViewMode;
        if ($scope.pdfViewer) {
            $scope.pdfViewer.viewMode = continuousViewMode ? wijmo.viewer.ViewMode.Continuous : wijmo.viewer.ViewMode.Single;
        }
    });
});
