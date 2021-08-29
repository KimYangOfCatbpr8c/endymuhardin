'use strict';

var app = angular.module('app');

app.controller('errorbarCtrl', function appCtrl($scope) {

    // data context
    $scope.ctx = {
        chart: null,
        errorbar: null,
        itemsSource: [],
        rotated: false,
        chartType: 'Column',
        errorAmount: 'FixedValue',
        endStyle: 'Cap',
        direction: 'Both',
        value: 10
    };
    
    $scope.$watch('ctx.errorAmount', function () {
        if ($scope.ctx.errorAmount != null && $scope.ctx.errorAmount != '' && $scope.ctx.errorbar) {
            var errorBar = $scope.ctx.errorbar,
                errorAmount = $scope.ctx.errorAmount;

            switch(errorAmount) {
                case 'FixedValue':
                    errorBar.value = 10;
                    break;
                case 'Percentage':
                    errorBar.value = 0.1;
                    break;
                case 'StandardDeviation':
                    errorBar.value = 1;
                    break;
                case 'Custom':
                    errorBar.value = {
                        minus: 5,
                        plus: 10
                    };
                    break;
            }
            errorBar.errorAmount = wijmo.chart.analytics.ErrorAmount[$scope.ctx.errorAmount];
        }
    });

    $scope.$watch('ctx.endStyle', function () {
        if ($scope.ctx.endStyle != null && $scope.ctx.endStyle != '' && $scope.ctx.errorbar) {
            $scope.ctx.errorbar.endStyle = wijmo.chart.analytics.ErrorBarEndStyle[$scope.ctx.endStyle];
        }
    });

    $scope.$watch('ctx.direction', function () {
        if ($scope.ctx.direction != null && $scope.ctx.direction != '' && $scope.ctx.errorbar) {
            $scope.ctx.errorbar.direction = wijmo.chart.analytics.ErrorBarDirection[$scope.ctx.direction];
        }
    });

    $scope.$watch('ctx.rotated', function () {
        if ($scope.ctx.chart) {
            $scope.ctx.chart.rotated = $scope.ctx.rotated;
        }
    });

    $scope.$watch('ctx.chartType', function () {
        if ($scope.ctx.chart && $scope.ctx.chartType != null && $scope.ctx.chartType != '') {
            $scope.ctx.chart.chartType = $scope.ctx.chartType;
        }
    });

    var countries = 'US,Germany,UK,Japan,Italy,Greece,China,France,Russia'.split(','),
        appData = [];
    for (var i = 0; i < countries.length; i++) {
        appData.push({
            country: countries[i],
            downloads: getData(),
            sales: getData()
        });
    }
    $scope.ctx.itemsSource = appData;

    function getData() {
        var val = Math.round(Math.random() * 100);
        return val > 10 ? val : val + 10;
    }
});
