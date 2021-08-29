'use strict';

// get reference to app (defined in app.js)
var app = angular.module('app');

// define app's single controller
app.controller('appCtrl', function ($scope, $http) {

    var flexReports = null,
        ssrsReports = null,
        _reportItems = [],
        _ssrsItems = [],
        initReport = {};

    $http.get("flexReport.config.json")
        .then(function (response) {
            flexReports = response.data;
            _fillFlexReports();
            //init reports
            $scope.reportInfo = initReport;
        });

    $http.get("ssrsReport.config.json")
        .then(function (response) {
            ssrsReports = response.data;
            _fillSsrsReports();
            $scope.ssrsReportInfo = { text: 'None', value: 'None' };
        });

    $scope.reportItems = null;
    $scope.ssrsItems = null;
    $scope.viewerProps = {
        filePath: null,
        reportName: null,
        serviceUrl: 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/report',
        paginated: null
    };
    
    $scope.$watch('reportInfo', function () {
        if (!$scope.reportInfo || $scope.reportInfo.value === 'None') {
            return;
        }
        $scope.ssrsReportInfo = { text: 'None', value: 'None' };
        var reportInfo = $scope.reportInfo.value.split('*');
        var viewerProps = $scope.viewerProps;
        viewerProps.filePath = reportInfo[0];
        viewerProps.reportName = reportInfo[1];        
        viewerProps.paginated = true;
    });

    $scope.$watch('ssrsReportInfo', function () {
        if (!$scope.ssrsReportInfo || $scope.ssrsReportInfo.value === 'None') {
            return;
        }
        $scope.reportInfo = { text: 'None', value: 'None' };
        var viewerProps = $scope.viewerProps;
        viewerProps.filePath = $scope.ssrsReportInfo.value;
        viewerProps.reportName = '';
        viewerProps.paginated = false;
    });

    function _fillFlexReports(){
        _reportItems.push({ text: 'None', value: 'None' });
        flexReports.categories.forEach(function (category, i) {
            var categoryName = category.name,
                optGroup = category.text;

            category.reports.forEach(function (report, i) {
                _reportItems.push({
                    'text': report.reportTitle,
                    'value': 'ReportsRoot/' + categoryName
                        + '/' + report.fileName + '*' + report.reportName,
                    'optGroup': optGroup
                });
                if (categoryName === flexReports.selectedReport.categoryName &&
                        report.reportName === flexReports.selectedReport.reportName) {
                    initReport.text = report.reportTitle;
                    initReport.value = 'ReportsRoot/' + categoryName
                        + '/' + report.fileName + '*' + report.reportName;
                }
            });
            $scope.reportItems = _reportItems;
        })
    }

    function _fillSsrsReports() {
        _ssrsItems.push({ text: 'None', value: 'None' });
        ssrsReports.categories.forEach(function (category, i) {
            var categoryName = category.name,
                optGroup = category.text;
            category.reports.forEach(function (report, i) {
                _ssrsItems.push({
                    'text': report.reportTitle,
                    'value': 'c1ssrs/' + report.reportPath,
                    'optGroup': optGroup
                })               
            });
            $scope.ssrsItems = _ssrsItems;
        })
    }
});
