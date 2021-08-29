'use strict';

// get reference to app module
var app = angular.module('app');

// controller
var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
app.controller('appCtrl', function ($scope, $http) {

    // enable/disable grid validation
    $scope.showErrors = true;
    $scope.validateEdits = true;
    $scope.customValidation = false;

    // create some random data
    var customers = [
        { id: 0, firstName: 'John', lastName: 'Lennon' },
        { id: 1, firstName: 'Paul', lastName: 'McCartney' },
        { id: 2, firstName: 'Ringo', lastName: 'Starr' },
        { id: 3, firstName: 'George', lastName: 'Harrison' },
    ]
    var data = [];
    for (var i = 0; i < 10 * countries.length; i++) {
        data.push({
            customer: customers[i % customers.length],
            country: countries[i % countries.length],
            downloads: Math.round(Math.random() * 20000),
            sales: Math.random() * 10000,
            expenses: Math.random() * 5000,
            active: i % 2 == 0
        });
    }
    $scope.data = new wijmo.collections.CollectionView(data, {

        // initialize new items
        newItemCreator: function() {
            return {
                customer: customers[0],
                country: countries[0],
                downloads: 0,
                sales: 0,
                expenses: 0,
                active: false
            }
        },

        // validation code (logic only!)
        getError: function (item, property) {
            switch (property) {
                case 'country':
                    return countries.indexOf(item.country) < 0
                        ? 'Invalid Country'
                        : null;
                case 'downloads':
                case 'sales':
                case 'expenses':
                    return item[property] < 1000
                        ? 'Cannot be less than 1,000!'
                        : null;
                case 'active':
                    return item.active && item.country.match(/US|UK/)
                        ? 'Active items are not allowed in the US or UK!'
                        : null;
                case 'customer.firstName':
                    return item.customer.firstName.match(/^(John|Paul|Ringo|George)$/)
                        ? null
                        : 'That\'s not a Beatle!!';
                case 'customer.lastName':
                    return item.customer.lastName.match(/^(Lennon|McCartney|Starr|Harrison)$/)
                        ? null
                        : 'That\'s not a Beatle!!';
            }
            return null;
        }
    });

    // additional custom validation behavior:
    // when the user finishes editing a cell, check each column for errors
    // if there are any, get back into edit mode and go fix the error
    $scope.customValidation = false;
    $scope.enableCustomValidation = function (s) {
        s.cellEditEnded.addHandler(function (s, e) {
            if ($scope.customValidation && !s.activeEditor) {
                $scope.showErrors = true; // show errors so user knows what's going on
                $scope.validateEdits = true; // customValidation (row) implies validateEdits (cell)
                var item = s.rows[e.row].dataItem;
                s.columns.forEach(function (col) {
                    if (s.collectionView.getError(item, col.binding)) {
                        s.startEditing(true, e.row, col.index);
                        return;
                    }
                });
            }
        })
    }
});
