(function () {
    'use strict';

    // get reference to app module
    var app = angular.module('app');

    // add controller to app module
    app.controller('appCtrl', function appCtrl($scope, $sce) {

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

        $scope.tvAccordion = null;
        $scope.accordionItems = [
            {
                header: 'Angular', items: [
                  { header: '<a href="ng/intro">Introduction</a>' },
                  { header: '<a href="ng/samples">Samples</a>' },
                  { header: '<a href="ng/perf">Performance</a>' }
                ]
            },
            {
                header: 'React', items: [
                  { header: '<a href="rc/intro">Introduction</a>' },
                  { header: '<a href="rc/samples">Samples</a>' },
                  { header: '<a href="rc/perf">Performance</a>' }
                ]
            },
            {
                header: 'Vue', items: [
                  { header: '<a href="vue/intro">Introduction</a>' },
                  { header: '<a href="vue/samples">Samples</a>' },
                  { header: '<a href="vue/perf">Performance</a>' }
                ]
            },
            {
                header: 'Knockout', items: [
                  { header: '<a href="ko/intro">Introduction</a>' },
                  { header: '<a href="ko/samples">Samples</a>' },
                  { header: '<a href="ko/perf">Performance</a>' }
                ]
            },
        ];

        $scope.tvAccordionStr = '';
        $scope.$watch('tvAccordion', function () {
            /* handle clicks on accordion items */
            if (!$scope.tvAccordion) {
                return;
            }
            $scope.tvAccordion.hostElement.addEventListener('click', function (e) {
                if (e.target.tagName == 'A') {
                    $scope.tvAccordionStr = $sce.trustAsHtml('Navigating to <b>*** ' + e.target.href + ' ***</b>');
                    $scope.$apply();
                    e.preventDefault();
                }
            });
        });

        $scope.tvChkStatusStr = '';
        $scope.checkedItems = function (treeView) {

            var items = treeView.checkedItems,
                msg = '';
            if (items.length) {
                msg = '<p><b>Checked Items:</b></p><ol>\r\n';
                for (var i = 0; i < items.length; i++) {
                    msg += '<li>' + items[i].header + '</li>\r\n';
                }
                msg += '</ol>';
            }
            $scope.tvChkStatusStr = $sce.trustAsHtml(msg);

            if (!$scope.$$phase) { // TFS 244581
                $scope.$apply();
            }
        }

        // save checked items
        var checkedItems = [];
        $scope.saveCheckedItems = function(treeView) {
            checkedItems = treeView.checkedItems;
        }

        // restore checked items
        $scope.restoreCheckedItems = function (treeView) {
            treeView.checkedItems = checkedItems || [];
        }

        // disable node
        $scope.disableNode= function (treeView) {
            var nd = treeView.selectedNode;
            if (nd) {
                nd.isDisabled = true;
            }
        }

        // enable all nodes
        $scope.enableAllNodes = function (treeView) {
            for (var nd = treeView.getFirstNode(); nd; nd = nd.next()) {
                nd.isDisabled = false;
            }
        }

        $scope.formatItem = function (s, e) {
            if (e.dataItem.newItem) {
                e.element.innerHTML +=
                    '<img style="margin-left:6px;transform:rotate(-30deg)" src="resources/new.png"/>';
            }
        }

        $scope.lazyItems = [ // start with three lazy-loaded nodes
            { header: 'Lazy Node 1', items: [] },
            { header: 'Lazy Node 2', items: [] },
            { header: 'Lazy Node 3', items: [] }
        ];
        $scope.lazyLoadFunction =function (node, callback) {
            setTimeout(function () { // simulate http delay
                var result = [ // simulate result
                    { header: 'Another lazy node...', items: [] },
                    { header: 'A non-lazy node without children' },
                    { header: 'A non-lazy node with child nodes', items: [
                      { header: 'hello' },
                      { header: 'world' }
                    ]}
                ];
                callback(result); // return result to control
            }, 2500); // 2.5sec http delay
        }

        var nwindService = 'http://services.odata.org/V4/Northwind/Northwind.svc';
        $scope.tvLazyLoadOData = null;
        
        $scope.dmp = ['FullName', 'ShipName', 'Summary'];
        $scope.cip = ['Orders', 'Order_Details'];      
        $scope.lazyLoadODataFunction = function (node, callback) {
            switch (node.level) {

                // load orders for an employee
                case 0:
                    var url = 'Employees(' + node.dataItem.EmployeeID + ')/Orders';
                    var orders = new wijmo.odata.ODataCollectionView(nwindService, url, {
                        fields: 'OrderID,ShipName,ShipCountry'.split(','),
                        loaded: function () {
                            var items = orders.items.map(function (e) {
                                e.Order_Details = []; // lazy-order details
                                return e;
                            });
                            callback(items);
                        }
                    });
                    break;

                    // load extended details for an order
                case 1:
                    var url = "Order_Details_Extendeds/?$filter=OrderID eq " + node.dataItem.OrderID;
                    var details = new wijmo.odata.ODataCollectionView(nwindService, url, {
                        fields: 'ProductName,ExtendedPrice'.split(','),
                        loaded: function () {
                            var items = details.items.map(function (e) {
                                e.Summary = wijmo.format('{ProductName}: {ExtendedPrice:c}', e);
                                return e;
                            });
                            callback(items);
                        }
                    });
                    break;

                    // default
                default:
                    callback(null);
            }
        }

        $scope.$watch('tvLazyLoadOData', function () {
            if (!$scope.tvLazyLoadOData) {
                return;
            }
            // first level: employees
            var employees = new wijmo.odata.ODataCollectionView(nwindService, 'Employees', {
                fields: 'EmployeeID,FirstName,LastName'.split(','),
                loaded: function () {
                    var items = employees.items.map(function (e) {
                        e.FullName = e.FirstName + ' ' + e.LastName;
                        e.Orders = []; // lazy-load orders
                        return e;
                    });
                    $scope.tvLazyLoadOData.itemsSource = items;
                }
            });
        });


        $scope.allowDraggingParentNodes = true;
        $scope.allowDroppingIntoEmpty = true;
         // use dragStart event to honor the allowDraggingParentNodes setting
         // by setting the 'cancel' event parameter to true
        $scope.dragStart = function (sender, e) {
            if (e && e.node && e.node.hasChildren) {
                if (!$scope.allowDraggingParentNodes) {
                    e.cancel = true; // prevent dragging parent nodes
                } else {
                    e.node.isCollapsed = true; // collapse parent nodes when dragging
                }
            }
        }

        // use dragOver event to honor the allowDroppingIntoEmpty setting
        // by changing the 'position' event parameter to 'Before'
        $scope.dragOver = function (s, e) {
            if (!$scope.allowDroppingIntoEmpty &&
                !e.dropTarget.hasChildren &&
                 e.position == wijmo.nav.DropPosition.Into) {
                e.position = wijmo.nav.DropPosition.Before;
            }
        }

        $scope.dragItems1 = [ 
            { header: 'Item 1.1' },
            { header: 'Item 1.2' },
            { header: 'Item 1.3' },
        ];

        $scope.dragItems2 = [
            { header: 'Item 2.1' },
            { header: 'Item 2.2' },
            { header: 'Item 2.3' },
        ];

        $scope.tvDragDrop1 = null;
        $scope.tvDragDrop2 = null;

        // allow drag/drop between tvDragDrop1 and tvDragDrop2
        $scope.dragOverBetweenTrees = function (sender, e) {
            var t1 = e.dragSource.treeView;
            var t2 = e.dropTarget.treeView;
            if (t1 == $scope.tvDragDrop1 || t1 == $scope.tvDragDrop2) {
                if (t2 == $scope.tvDragDrop1 || t2 == $scope.tvDragDrop2) {
                    e.cancel = false;
                }
            }
        }

        $scope.nodeEditStarting = function (s, e) {
            if (e.node.hasChildren) {
                e.cancel = true;
            }
        }
    });

})();