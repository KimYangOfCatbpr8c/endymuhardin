'use strict';

var app = angular.module('app');

app.controller('boxwhiskerCtrl', function appCtrl($scope) {

    // data context
    $scope.ctx = {
        chart: null,
        boxwhisker: null,
        boxwhisker2: null,
        boxwhisker3: null,
        itemsSource: [],
        rotated: false,
        groupWidth: 0.8,
        gapWidth: 0.1,
        quartileCalculation: wijmo.chart.analytics.QuartileCalculation.InclusiveMedian,
        showMeanLine: true,
        showMeanMarker: true,
        showInnerPoints: true,
        showOutliers: true,
        showLabel: false
    };

    $scope.$watch('ctx.chart', function () {
        if ($scope.ctx.chart) {
            $scope.ctx.chart.tooltip.content = function (hti) {
                if (hti) {
                    return '<b>' + hti.name + '</b> - <b>' + hti.x + '</b></br>' +
                        '<b>min</b>: ' + hti.item.min + '</br>' +
                        '<b>firstQuartile</b>: ' + hti.item.firstQuartile + '</br>' +
                        '<b>median</b>: ' + hti.item.median + '</br>' +
                        '<b>thirdQuartile</b>: ' + hti.item.thirdQuartile + '</br>' +
                        '<b>max</b>: ' + hti.item.max + '</br>' +
                        '<b>mean</b>: ' + hti.item.mean + '</br>';
                }
            }
        }
    });

    $scope.$watch('ctx.groupWidth', function () {
        var p = $scope.inputGroupWidth;

        if (p == null || p.value < p.min || p.value > p.max) {
            return;
        }
        $scope.ctx.boxwhisker.groupWidth = p.value;
        $scope.ctx.boxwhisker2.groupWidth = p.value;
        $scope.ctx.boxwhisker3.groupWidth = p.value;
    });

    $scope.$watch('ctx.gapWidth', function () {
        var p = $scope.inputGapWidth;

        if (p == null || p.value < p.min || p.value > p.max) {
            return;
        }
        $scope.ctx.boxwhisker.gapWidth = p.value;
        $scope.ctx.boxwhisker2.gapWidth = p.value;
        $scope.ctx.boxwhisker3.gapWidth = p.value;
    });

    $scope.$watch('ctx.quartileCalculation', function () {
        if ($scope.ctx.quartileCalculation != null && $scope.ctx.quartileCalculation != '' && $scope.ctx.boxwhisker) {
            $scope.ctx.boxwhisker.quartileCalculation = wijmo.chart.analytics.QuartileCalculation[$scope.ctx.quartileCalculation];
            $scope.ctx.boxwhisker2.quartileCalculation = wijmo.chart.analytics.QuartileCalculation[$scope.ctx.quartileCalculation];
            $scope.ctx.boxwhisker3.quartileCalculation = wijmo.chart.analytics.QuartileCalculation[$scope.ctx.quartileCalculation];
        }
    });

    $scope.$watch('ctx.showMeanLine', function () {
        if ($scope.ctx.boxwhisker) {
            $scope.ctx.boxwhisker.showMeanLine = $scope.ctx.showMeanLine;
            $scope.ctx.boxwhisker2.showMeanLine = $scope.ctx.showMeanLine;
            $scope.ctx.boxwhisker3.showMeanLine = $scope.ctx.showMeanLine;
        }
    });

    $scope.$watch('ctx.showMeanMarker', function () {
        if ($scope.ctx.boxwhisker) {
            $scope.ctx.boxwhisker.showMeanMarker = $scope.ctx.showMeanMarker;
            $scope.ctx.boxwhisker2.showMeanMarker = $scope.ctx.showMeanMarker;
            $scope.ctx.boxwhisker3.showMeanMarker = $scope.ctx.showMeanMarker;
        }
    });

    $scope.$watch('ctx.showInnerPoints', function () {
        if ($scope.ctx.boxwhisker) {
            $scope.ctx.boxwhisker.showInnerPoints = $scope.ctx.showInnerPoints;
            $scope.ctx.boxwhisker2.showInnerPoints = $scope.ctx.showInnerPoints;
            $scope.ctx.boxwhisker3.showInnerPoints = $scope.ctx.showInnerPoints;
        }
    });

    $scope.$watch('ctx.showOutliers', function () {
        if ($scope.ctx.boxwhisker) {
            $scope.ctx.boxwhisker.showOutliers = $scope.ctx.showOutliers;
            $scope.ctx.boxwhisker2.showOutliers = $scope.ctx.showOutliers;
            $scope.ctx.boxwhisker3.showOutliers = $scope.ctx.showOutliers;
        }
    });

    $scope.$watch('ctx.rotated', function () {
        if ($scope.ctx.chart) {
            $scope.ctx.chart.rotated = $scope.ctx.rotated;
        }
    });

    $scope.$watch('ctx.showLabel', function () {
        if ($scope.ctx.chart) {
            $scope.ctx.chart.dataLabel.content = $scope.ctx.showLabel ? '{y}' : '';
        }
    });

    var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
        boxData = [];
    for (var i = 0; i < countries.length; i++) {
        boxData.push({
            country: countries[i],
            downloads: [getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData()],
            sales: [getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData()],
            expenses: [getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData()]
        });
    }
    $scope.ctx.itemsSource = boxData;

    function getData() {
        return Math.round(Math.random() * 100);
    }
});
