'use strict';

// get reference to the app
var app = angular.module('app');

app.controller('appCtrl', function ($scope) {

    // remove space from percentage values
    wijmo.culture.Globalize.numberFormat.percent.pattern = ['-n%', 'n%'];

    // create raw data set
    var data = [],
        countries = 'Spain,Russia,Austria,Denmark,Germany'.split(','),
        colors = 'Red,Green,Blue'.split(','),
        products = 'Banana,Apple'.split(',');
    for (var i = 0; i <= 25; i++) {
        data.push({
            id: i,
            country: countries[i % countries.length],
            color: colors[i % colors.length],
            product: products[i % products.length],
            sales: 10 * i + 100,
            expenses: 5 * i + 30
        });
    }
    $scope.data = data;

    // create pivot view
    var ng = new wijmo.olap.PivotEngine({
        autoGenerateFields: false,
        itemsSource: data,
        showColumnTotals: wijmo.olap.ShowTotals.Subtotals,
        showRowTotals: wijmo.olap.ShowTotals.Subtotals,
        fields: [
            { binding: 'country', header: 'Country' },
            { binding: 'color', header: 'Color' },
            { binding: 'product', header: 'Product' },
            { binding: 'sales', header: 'Sales' },

            { binding: 'sales', header: 'DiffRow', showAs: 'DiffRow' },
            { binding: 'sales', header: 'DiffRowPct', showAs: 'DiffRowPct', format: 'p2' },
            { binding: 'sales', header: 'DiffCol', showAs: 'DiffCol' },
            { binding: 'sales', header: 'DiffColPct', showAs: 'DiffColPct', format: 'p2' },

            { binding: 'sales', header: 'PctGrand', showAs: 'PctGrand', format: 'p2' },
            { binding: 'sales', header: 'PctRow', showAs: 'PctRow', format: 'p2' },
            { binding: 'sales', header: 'PctCol', showAs: 'PctCol', format: 'p2' },
            { binding: 'sales', header: 'RunTot', showAs: 'RunTot' },
            { binding: 'sales', header: 'RunTotPct', showAs: 'RunTotPct', format: 'p2' },
        ],
        rowFields: ['Country', 'Color'],
        columnFields: ['Product'],
        valueFields: [
            'Sales',
            'PctGrand', 'PctCol', 'PctRow', 'RunTot', 'RunTotPct',
            'DiffRow', 'DiffRowPct', 'DiffCol', 'DiffColPct'
        ]
    });
    $scope.ng = ng;
});
