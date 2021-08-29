(function (wijmo, app) {
    'use strict';

    // create controls
    var chart = new wijmo.chart.hierarchical.Sunburst('#groupCVChart');

    // initialize Sunburst's properties
    chart.beginUpdate();
    chart.binding = 'value';
    chart.itemsSource = app.getGroupCVData();
    chart.dataLabel.position = wijmo.chart.PieLabelPosition.Center;
    chart.dataLabel.content = '{name}';
    chart.endUpdate();

})(wijmo, app);