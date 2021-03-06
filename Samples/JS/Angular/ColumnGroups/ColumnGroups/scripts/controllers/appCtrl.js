// get application
var app = angular.module('app');

// add controller
app.controller('appCtrl', function ($scope) {

    // initialize grids
    $scope.initW3C = function (s, e) {

        // create FlexGridFilter *before* the ColumnGroupProvider
        // so the filter icons will center-align properly in merged header cells:
        var f = new wijmo.grid.filter.FlexGridFilter(s);
        var g = new wijmo.grid.columngroups.ColumnGroupProvider(s, w3Columns);

        // select column groups on clicks (as opposed to sorting)
        g.selectOnClick = true;

        // set data source *after* creating the ColumnGroupProvider
        // to avoid automatic column generation:
        s.itemsSource = w3Data;
    }
    $scope.initFinancial = function (s, e) {
        var f = new wijmo.grid.filter.FlexGridFilter(s);
        var g = new wijmo.grid.columngroups.ColumnGroupProvider(s, fundColumns);
        g.selectOnClick = true;
        s.itemsSource = fundData;
    }


    //////////////////////////////////////////////////////////////////////////////////
    // W3C example data

    var w3Data = [{
        gender: 'Males',
        height: 1.9,
        weight: 0.003,
        red: .4
    }, {
        gender: 'Females',
        height: 1.7,
        weight: 0.002,
        red: .43
    }, ];
    var w3Columns = [{
        header: ' ',
        binding: 'gender'
    }, {
        header: 'Average',
        columns: [{
            header: 'Height',
            binding: 'height',
            format: 'n1'
        }, {
            header: 'Weight',
            binding: 'weight',
            format: 'n3'
        }]
    }, {
        header: 'Red Eyes',
        binding: 'red',
        format: 'p0'
    }];

    //////////////////////////////////////////////////////////////////////////////////
    // financial example data

    var fundData = [{
        name: 'Constant Growth IXTR',
        currency: 'USD',
        perf: {
            ytd: .0523,
            m1: 0.0142,
            m6: 0.0443,
            m12: 0.0743
        },
        alloc: {
            stock: 0.17,
            bond: 0.32,
            cash: 0.36,
            other: 0.15
        }
    }, {
        name: 'Optimus Prime MMCT',
        currency: 'EUR',
        perf: {
            ytd: .0343,
            m1: 0.043,
            m6: 0.0244,
            m12: 0.0543
        },
        alloc: {
            stock: 0.61,
            bond: 0.8,
            cash: 0.9,
            other: 0.22
        }
    }, {
        name: 'Serenity Now ZTZZZ',
        currency: 'YEN',
        perf: {
            ytd: .0522,
            m1: 0.0143,
            m6: 0.0458,
            m12: 0.0732
        },
        alloc: {
            stock: 0.66,
            bond: 0.09,
            cash: 0.19,
            other: 0.06
        }
    }];
    var fundColumns = [{
        header: 'Name',
        binding: 'name',
        width: '2*'
    }, {
        header: 'Curr',
        binding: 'currency',
        width: '*'
    }, {
        header: 'Performance',
        columns: [{
            header: 'YTD',
            binding: 'perf.ytd',
            format: 'p2',
            width: '*'
        }, {
            header: '1 M',
            binding: 'perf.m1',
            format: 'p2',
            width: '*'
        }, {
            header: '6 M',
            binding: 'perf.m6',
            format: 'p2',
            width: '*'
        }, {
            header: '12 M',
            binding: 'perf.m12',
            format: 'p2',
            width: '*'
        }]
    }, {
        header: 'Allocation',
        columns: [{
            header: 'Stocks',
            binding: 'alloc.stock',
            format: 'p0',
            width: '*'
        }, {
            header: 'Bonds',
            binding: 'alloc.bond',
            format: 'p0',
            width: '*'
        }, {
            header: 'Cash',
            binding: 'alloc.cash',
            format: 'p0',
            width: '*'
        }, {
            header: 'Other',
            binding: 'alloc.other',
            format: 'p0',
            width: '*'
        }]
    }];

});