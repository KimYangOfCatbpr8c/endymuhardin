'use strict';

var app = angular.module('app');

// treeView controller: show how to use the grid as a tree 
app.controller('treeViewCtrl', function appCtrl($scope, $sce) {

    $scope.items = [
        {
            header: 'Electronics', img: 'resources/electronics.png', items: [
              { header: 'Trimmers/Shavers' },
              { header: 'Tablets' },
              {
                  header: 'Phones', img: 'resources/phones.png', items: [
                    { header: 'Apple' },
                    { header: 'Motorola', newItem: true },
                    { header: 'Nokia' },
                    { header: 'Samsung' }
                  ]
              },
              { header: 'Speakers', newItem: true },
              { header: 'Monitors' }
            ]
        },
        {
            header: 'Toys', img: 'resources/toys.png', items: [
              { header: 'Shopkins' },
              { header: 'Train Sets' },
              { header: 'Science Kit', newItem: true },
              { header: 'Play-Doh' },
              { header: 'Crayola' }
            ]
        },
        {
            header: 'Home', img: 'resources/home.png', items: [
              { header: 'Coffeee Maker' },
              { header: 'Breadmaker', newItem: true },
              { header: 'Solar Panel', newItem: true },
              { header: 'Work Table' },
              { header: 'Propane Grill' }
            ]
        }
    ];
    $scope.editableItems = JSON.parse(JSON.stringify($scope.items)); // separate copy for editing (TFS 242748)
    $scope.isAnimated = true;
    $scope.autoCollapse = true;
    $scope.expandOnClick = true;
    $scope.useCustomCss = true;

    // 'Navigation' display
    $scope.navStr = '';
    $scope.navTo = function (treeView) {
        $scope.navStr = $sce.trustAsHtml('Navigating to <b>*** ' + treeView.selectedItem.header + ' ***</b>');
        $scope.$apply();
    }

    $scope.lazyItems = [ // start with three lazy-loaded nodes
    { header: 'Lazy Node 1', items: [] },
    { header: 'Lazy Node 2', items: [] },
    { header: 'Lazy Node 3', items: [] }
    ];
    $scope.lazyLoadFunction = function (node, callback) {
        setTimeout(function () { // simulate http delay
            var result = [ // simulate result
                { header: 'Another lazy node...', items: [] },
                { header: 'A non-lazy node without children' },
                {
                    header: 'A non-lazy node with child nodes', items: [
                    { header: 'hello' },
                    { header: 'world' }
                    ]
                }
            ];
            callback(result); // return result to control
        }, 2500); // 2.5sec http delay
    }

    $scope.formatItem = function (s, e) {
        if (e.dataItem.newItem) {
            e.element.innerHTML +=
                '<img style="margin-left:6px;transform:rotate(-30deg)" src="resources/new.png"/>';
        }
    }
});
