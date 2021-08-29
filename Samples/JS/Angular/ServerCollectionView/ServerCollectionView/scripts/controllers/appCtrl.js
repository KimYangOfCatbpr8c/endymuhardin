'use strict';

// get reference to app module
var app = angular.module('app');

// add controller to app module
app.controller('appCtrl', function appCtrl($scope) {

    // load data from the server using our ServerCollectionView
    // this CollectionView performs sorting and paging on the server.
    // it does not support filtering or write operations.
    $scope.view = new wijmo.collections.ServerCollectionView('DataHandler.ashx', {
        pageSize: 12
    });

});
