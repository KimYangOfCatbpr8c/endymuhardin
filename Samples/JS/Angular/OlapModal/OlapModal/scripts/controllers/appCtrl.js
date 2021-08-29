'use strict';

// add controller to app
angular.module('app').controller('appCtrl', function appCtrl($scope) {

    // invalidate panel when shown on Bootstrap modal (TFS 247358)
    $('#dlgPivotPanel').on('shown.bs.modal', function (e) {
        wijmo.Control.invalidateAll(e.target);
    });

    // create and initialize pivot engine used by all controls on the page
    var ng = new wijmo.olap.PivotEngine();
    $scope.theEngine = ng;

    // give the engine a data source and some fields
    ng.autoGenerateFields = false;
    ng.itemsSource = getData(20000);
    ng.fields.push(new wijmo.olap.PivotField(ng, 'person.name', 'Name'));
    ng.fields.push(new wijmo.olap.PivotField(ng, 'person.first', 'First Name'));
    ng.fields.push(new wijmo.olap.PivotField(ng, 'person.last', 'Last Name'));
    ng.fields.push(new wijmo.olap.PivotField(ng, 'timeInHours', 'Time (hrs)', { format: 'n3', dataType: wijmo.DataType.Number, aggregate: 'Sum' }));
    ng.fields.push(new wijmo.olap.PivotField(ng, 'bug.fogbugzId', 'Fogbugz #', { format: 'f0', dataType: wijmo.DataType.Number }));
    ng.fields.push(new wijmo.olap.PivotField(ng, 'bug.severity', 'Severity', { format: 'f0', dataType: wijmo.DataType.Number }));

    // build the initial view
    ng.rowFields.push('Last Name');
    ng.columnFields.push('Severity');
    ng.valueFields.push('Time (hrs)');

    // sample data
    function getData(cnt) {
        var data = [];
        for (var i = 0; i < cnt; i++) {
            var minutes = Math.round(Math.random() * 160);
            var firstNames = 'Liam,Dylan,Jacob,Noah,Jayden,Ethan,Matthew,Sebastian,Alexander,Daniel,Angel'.split(',');
            var lastNames = 'Smith,Lam,Martin,Brown,Roy,Tremblay,Lee,Gagnon,Wilson,Navin'.split(',');
            data.push({
                id: i,
                person: getPerson(i, firstNames, lastNames),
                bug: getBug(i),
                timeInMinutes: minutes,
                timeInHours: minutes / 60,
            });
        }
        return data;
    }
    function getPerson(i, firstNames, lastNames) {
        var first = firstNames[i % firstNames.length];
        var last = lastNames[i % lastNames.length];
        return {
            id: i,
            name: first + ' ' + last,
            first: first,
            last: last,
            email: first[0] + last + '@componentone.com',
            value: Math.random() * 400
        }
    }
    function getBug(i) {
        return {
            id: i,
            fogbugzId: Math.round(100000 + Math.random() * 200000),
            severity: i % 4 == 0 ? 'High' : i % 4 == 1 ? 'Average' : 'Low'
        }
    }
});
