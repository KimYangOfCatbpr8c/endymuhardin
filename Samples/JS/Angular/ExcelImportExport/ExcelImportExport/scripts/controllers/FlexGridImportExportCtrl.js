'use strict';

angular.module('app').controller('FlexGridImportExportCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.ctx = {
        flexGrid: null,
        data: dataService.getProductOrders(500),
        includeColumnHeader: true
    }

    // export
    $scope.exportExcel = function () {
        wijmo.grid.xlsx.FlexGridXlsxConverter.save($scope.ctx.flexGrid, { includeColumnHeaders: $scope.ctx.includeColumnHeader, includeCellStyles: false }, 'FlexGrid.xlsx');
    };

    // import
    $scope.importExcel = function () {
        if ($('#importFile')[0].files[0]) {
            wijmo.grid.xlsx.FlexGridXlsxConverter.load($scope.ctx.flexGrid, $('#importFile')[0].files[0], { includeColumnHeaders: $scope.ctx.includeColumnHeader });
        }
    }

    // export
    $scope.exportExcelAsync = function () {
        wijmo.grid.xlsx.FlexGridXlsxConverter.saveAsync($scope.ctx.flexGrid, { includeColumnHeaders: $scope.ctx.includeColumnHeader, includeCellStyles: false }, 'FlexGrid.xlsx');
    };

    // import
    $scope.importExcelAsync = function () {
        if ($('#importFile')[0].files[0]) {
            wijmo.grid.xlsx.FlexGridXlsxConverter.loadAsync($scope.ctx.flexGrid, $('#importFile')[0].files[0], { includeColumnHeaders: $scope.ctx.includeColumnHeader });
        }
    }

    // initialize the grid
    $scope.$watch('ctx.flexGrid', function () {
        updateGroup();
    });

    // enable dropping XLSX files into the grid
    // code based on:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    $scope.enableFileDrop = function (s, e) {
        var host = s.hostElement;
        host.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        host.addEventListener('drop', function (e) {
            e.preventDefault();
            var files = e.dataTransfer.files;
            for (var i = 0; i < files.length; i++) {
                importFile(files[i]);
                break;
            }
        });
        host.addEventListener('dragend', function (e) {
            e.dataTransfer.clearData();
        });
    }

    // import a file that was dropped onto the grid
    function importFile(f) {
        wijmo.grid.xlsx.FlexGridXlsxConverter.load($scope.ctx.flexGrid, f, {
            includeColumnHeaders: $scope.ctx.includeColumnHeader
        });
    }



    // update group setting for the flex grid
    function updateGroup() {
        var flex = $scope.ctx.flexGrid,
            groupNames = ['Product', 'Country', 'Amount'],
            cv,
            propName,
            groupDesc;

        if (flex) {

            // get the collection view, start update
            cv = flex.collectionView;
            cv.beginUpdate();

            // clear existing groups
            cv.groupDescriptions.clear();

            // add new groups
            for (var i = 0; i < groupNames.length; i++) {
                propName = groupNames[i].toLowerCase();
                if (propName == 'amount') {

                    // group amounts in ranges
                    // (could use the mapping function to group countries into continents, 
                    // names into initials, etc)
                    groupDesc = new wijmo.collections.PropertyGroupDescription(propName, function (item, prop) {
                        var value = item[prop];
                        if (value > 1000) return 'Large Amounts';
                        if (value > 100) return 'Medium Amounts';
                        if (value > 0) return 'Small Amounts';
                        return 'Negative';
                    });
                    cv.groupDescriptions.push(groupDesc);
                } else if (propName) {

                    // group other properties by their specific values
                    groupDesc = new wijmo.collections.PropertyGroupDescription(propName);
                    cv.groupDescriptions.push(groupDesc);
                }
            }

            // done updating
            cv.endUpdate();
        }
    }
}]);