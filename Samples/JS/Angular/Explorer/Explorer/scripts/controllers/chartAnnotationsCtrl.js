'use strict';

var app = angular.module('app');

app.controller('chartAnnotationsCtrl', function appCtrl($scope) {

    // generate some random data
    function getData() {
        var data = [], sales = [
            96, 19, 54, 83, 15, 56, 36, 4, 29, 93,
            38, 71, 50, 77, 69, 13, 79, 57, 29, 62,
            4, 27, 66, 96, 65, 12, 52, 3, 61, 48, 50,
            70, 39, 33, 25, 49, 69, 46, 44, 40, 35,
            72, 64, 10, 66, 63, 78, 19, 96, 26];

        for (var i = 0; i < 50; i++) {
            data.push({
                sale: sales[i],
                date: new Date(2014, 0, i),
            });
        }
        return data;
    }

    $scope.date1 = new Date(2014, 1, 10);
    $scope.date2 = new Date(2014, 0, 25);
    $scope.basicData = getData();
});
