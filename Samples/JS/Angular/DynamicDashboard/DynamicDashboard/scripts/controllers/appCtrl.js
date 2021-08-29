// get application
var app = angular.module('app');

// add controller
// note: the controller provides data and creates tiles
// the drag/drop code used to re-order tiles
app.controller('appCtrl', function appCtrl($scope, $compile) {

    // define tile types
    var tileTypes = 'Grid,Radial Gauge,Linear Gauge,Bar Chart,Column Chart,Line Chart,Bubble Chart,Bullet Graph,Blank'.split(',');

    // expose tile types to scope
    $scope.tileTypes = new wijmo.collections.CollectionView(tileTypes);

    // expose some random data to show in the tiles
    $scope.data = getData();

    // allow user to reorder items in the dashboard by dragging
    var dashboard = document.querySelector('.dashboard');
    enableItemReorder(dashboard);

    // add a tile of a given type to the dashboard
    $scope.addTile = function (tileType) {

        // get the html fragment for a new tile
        var htmlTile = wijmo.httpRequest('./partials/tile.htm', { async: false }).responseText,
            htmlContent = wijmo.httpRequest('./partials/' + tileType.replace(' ', '') + '.htm', { async: false }).responseText;

        // initialize tile header and content
        htmlTile = htmlTile.replace('{{header}}', tileType);
        htmlTile = htmlTile.replace('{{content}}', htmlContent);

        // compile tile to instantiate controls
        // this steps converts directives added to the tile into controls
        var tile = wijmo.createElement(htmlTile);
        tile = $compile(tile.outerHTML)($scope)[0];

        // append it to the dashboard
        dashboard.appendChild(tile);
        tile.focus();
    }

    // add some tiles to start with
    for (var i = 0; i < tileTypes.length && i < 4; i++) {
        $scope.addTile(tileTypes[i]);
    }

    // handle tile buttons
    dashboard.addEventListener('click', function (e) {
        if (wijmo.closest(e.target, '.glyphicon-remove') != null) {
            var tile = wijmo.closest(e.target, '.tile');
            if (tile != null) {
                dashboard.removeChild(tile);
            }
        }
        if (wijmo.closest(e.target, '.glyphicon-pencil') != null) {
            var tile = wijmo.closest(e.target, '.tile');
            if (tile != null) {
                alert('edit tile parameters...')
            }
        }
    });

    // allow users to re-order elements within a panel element
    function enableItemReorder(panel) {
        var dragSource = null,
            dropTarget = null;

        // add drag/drop event listeners
        panel.addEventListener('dragstart', function (e) {
            var target = wijmo.closest(e.target, '.tile');
            if (target && target.parentElement == panel) {
                dragSource = target;
                wijmo.addClass(dragSource, 'drag-source');
                var dt = e.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('text', dragSource.innerHTML);
            }
        });
        panel.addEventListener('dragover', function (e) {
            if (dragSource) {
                var tile = wijmo.closest(e.target, '.tile');
                if (tile == dragSource) {
                    tile = null;
                }
                if (dragSource && tile && tile != dragSource) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                }
                if (dropTarget != tile) {
                    wijmo.removeClass(dropTarget, 'drag-over');
                    dropTarget = tile;
                    wijmo.addClass(dropTarget, 'drag-over');
                }
            }
        });
        panel.addEventListener('drop', function (e) {
            if (dragSource && dropTarget) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                var srcIndex = getIndex(dragSource),
                    dstIndex = getIndex(dropTarget),
                    refChild = srcIndex > dstIndex ? dropTarget : dropTarget.nextElementSibling;
                dragSource.parentElement.insertBefore(dragSource, refChild);

                // focus and view on the tile that was dragged
                dragSource.focus();

                // invalidate Wijmo controls after layout updates
                wijmo.Control.invalidateAll();
            }
        });
        panel.addEventListener('dragend', function (e) {
            wijmo.removeClass(dragSource, 'drag-source');
            wijmo.removeClass(dropTarget, 'drag-over');
            dragSource = dropTarget = null;
        });

        function getIndex(e) {
            var p = e.parentElement;
            for (var i = 0; i < p.children.length; i++) {
                if (p.children[i] == e) return i;
            }
            return -1;
        }
    }

    // some random data
    function getData(count) {
        var data = [],
            today = new Date();
        for (var i = 0; i < 12; i++) {
            var sales = 100 + Math.random() * 800 + i * 50,
                expenses = 50 + Math.random() * 300 + i * 5;
            data.push({
                id: i,
                date: wijmo.DateTime.addMonths(today, 12 - i),
                sales: sales,
                expenses: expenses,
                profit: sales - expenses
            });
        }
        return new wijmo.collections.CollectionView(data);
    }
});
