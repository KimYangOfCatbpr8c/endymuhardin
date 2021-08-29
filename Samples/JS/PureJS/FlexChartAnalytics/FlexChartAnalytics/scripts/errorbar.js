(function (wijmo) {
    'use strict';
    //create chart
    var errorbarChart = new wijmo.chart.FlexChart('#errorbarChart'),
        chartType = new wijmo.input.Menu('#ebChartType'),
        errorAmount = new wijmo.input.Menu('#ebErrorAmount'),
        endStyle = new wijmo.input.Menu('#ebEndStyle'),
        direction = new wijmo.input.Menu('#ebDirection');

    var countries = 'US,Germany,UK,Japan,Italy,Greece,China,France,Russia'.split(','),
        appData = [];
    for (var i = 0; i < countries.length; i++) {
        appData.push({
            country: countries[i],
            downloads: getData(),
            sales: getData()
        });
    }

    function getData() {
        var val = Math.round(Math.random() * 100);
        return val > 10 ? val : val + 10;
    }

    //create Box & Whisker series
    errorbarChart.beginUpdate();
    errorbarChart.tooltip.content = '{y}';

    errorbarChart.itemsSource = appData;
    errorbarChart.bindingX = 'country';
    var errorBar = new wijmo.chart.analytics.ErrorBar();
    errorBar.binding = 'downloads';
    errorBar.value = 10;
    errorbarChart.series.push(errorBar);
    errorbarChart.endUpdate();

    var ebRotated = document.getElementById('ebRotated');
    ebRotated.addEventListener('click', function () {
        errorbarChart.rotated = this.checked;
        errorbarChart.refresh(true);
    });

    updateMenuHeader(chartType);
    chartType.selectedIndexChanged.addHandler(function () {
        if (chartType.selectedValue) {
            var val = +chartType.selectedValue;
            errorbarChart.chartType = val;
            updateMenuHeader(chartType);
            errorbarChart.refresh(true);
        }
    });

    updateMenuHeader(errorAmount);
    errorAmount.selectedIndexChanged.addHandler(function () {
        if (errorAmount.selectedValue) {
            var val = +errorAmount.selectedValue;
            errorBar.errorAmount = val;
            if (val === 0) {
                errorBar.value = 10;
            } else if (val === 1) {
                errorBar.value = 0.1;
            } else if (val === 2) {
                errorBar.value = 1;
            } else if (val === 4) {
                errorBar.value = {
                    minus: 5,
                    plus: 10
                };
            }
            updateMenuHeader(errorAmount);
            errorbarChart.refresh(true);
        }
    });

    updateMenuHeader(endStyle);
    endStyle.selectedIndexChanged.addHandler(function () {
        if (endStyle.selectedValue) {
            var val = +endStyle.selectedValue;
            errorBar.endStyle = val;
            updateMenuHeader(endStyle);
            errorbarChart.refresh(true);
        }
    });

    updateMenuHeader(direction);
    direction.selectedIndexChanged.addHandler(function () {
        if (direction.selectedValue) {
            var val = +direction.selectedValue;
            errorBar.direction = val;
            updateMenuHeader(direction);
            errorbarChart.refresh(true);
        }
    });

    // helper function for Menu headers
    function updateMenuHeader(menu) {
        menu.header = menu.text;
    }
})(wijmo);