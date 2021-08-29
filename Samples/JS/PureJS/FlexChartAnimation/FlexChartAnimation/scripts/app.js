// generate some random data
function getData(numCount) {
    var data = new wijmo.collections.ObservableArray();
    //var data = [];

    for (var i = 0; i < numCount; i++) {
        data.push(getRandomData('random' + getRandomValue(1000)));
    }
    return data;
}

function getRandomData(idx) {
    return {
        //x: getRandomValue(100),
        x: idx,
        y0: getRandomValue(200),
        y1: getRandomValue(400),
        y2: getRandomValue(600),
        y3: getRandomValue(800),
        y4: getRandomValue(1000)
    };
}

function getRandomValue(max) {
    return Math.round(Math.random() * max);
}

function updateMenuHeader(menu, prefix, text) {
    menu.header = prefix + text;
}
var flexChartPoints = 10;
var flexPiePoints = 5;
var insertPieIdx = 1;


$(document).ready(function () {
    'use strict';

    // create FlexChart, FlexPie, InputNumbers and Menus
    var flexChart = new wijmo.chart.FlexChart('#flexChart'),
        chartType = new wijmo.input.Menu('#chartType'),
        chartAnimationMode = new wijmo.input.Menu('#chartAnimationMode'),
        chartEasing = new wijmo.input.Menu('#chartEasing'),
        chartDuration = new wijmo.input.InputNumber('#chartDuration'),
        chartAddMenu = new wijmo.input.Menu('#chartAddMenu'),
        chartRemoveMenu = new wijmo.input.Menu('#chartRemoveMenu'),

        flexPie = new wijmo.chart.FlexPie('#flexPie'),
        pieAnimationMode = new wijmo.input.Menu('#pieAnimationMode'),
        pieEasing = new wijmo.input.Menu('#pieEasing'),
        pieDuration = new wijmo.input.InputNumber('#pieDuration'),
        pieInnerRadius = new wijmo.input.InputNumber('#pieInnerRadius');

    //flex chart
    flexChart.beginUpdate();
    flexChart.chartType = wijmo.chart.ChartType.Line;
    flexChart.itemsSource = getData(flexChartPoints);
    flexChart.bindingX = 'x';
    // create data series
    for (var i = 0; i < 3; i++) {
        var series = new wijmo.chart.Series();
        series.binding = 'y' + i;
        flexChart.series.push(series);
    }
    flexChart.endUpdate();

    var chartAnimation = new wijmo.chart.animation.ChartAnimation(flexChart, {
        animationMode: wijmo.chart.animation.AnimationMode.All,
        easing: wijmo.chart.animation.Easing.Swing,
        duration: 400
    });

    //Chart Type
    chartType.selectedValue = 'Line';
    chartType.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;

        flexChart.chartType = wijmo.chart.ChartType[sender.selectedValue];
        updateMenuHeader(chartType, '<b>ChartType</b>: ', sender.text);
    });
    updateMenuHeader(chartType, '<b>ChartType</b>: ', chartType.text);

    //Chart Animation Mode
    chartAnimationMode.selectedValue = 'All';
    chartAnimationMode.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;

        chartAnimation.animationMode = wijmo.chart.animation.AnimationMode[sender.selectedValue];
        chartAnimation.animate();
        updateMenuHeader(chartAnimationMode, '<b>Animation Mode</b>: ', sender.text);
    });
    updateMenuHeader(chartAnimationMode, '<b>Animation Mode</b>: ', chartAnimationMode.text);

    //Chart Easing
    chartEasing.selectedValue = 'Swing';
    chartEasing.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;

        chartAnimation.easing = wijmo.chart.animation.Easing[sender.selectedValue];
        chartAnimation.animate();
        updateMenuHeader(chartEasing, '<b>Easing</b>: ', sender.text);
    });
    updateMenuHeader(chartEasing, '<b>Easing</b>: ', chartEasing.text);

    //Chart Duration
    chartDuration.value = 400;
    chartDuration.min = 200;
    chartDuration.max = 5000;
    chartDuration.step = 200;
    chartDuration.format = 'n0';
    chartDuration.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        chartAnimation.duration = sender.value;
        chartAnimation.animate();
    });

    //Chart Reset Data
    document.getElementById("chartResetData").addEventListener("click", function () {
        if (flexChart) {
            flexChart.itemsSource = getData(flexChartPoints);
        }
    })

    //Chart Adds
    chartAddMenu.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;
        chartChange[sender.selectedValue]();
    });
    updateMenuHeader(chartAddMenu, 'Add', '');

    //Chart Removes
    chartRemoveMenu.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;
        chartChange[sender.selectedValue]();
    });
    updateMenuHeader(chartRemoveMenu, 'Remove', '');

    var chartChange = {
        addSeries: function () {
            var len = flexChart.series.length;

            if (len >= 5) {
                return;
            }
            var series = new wijmo.chart.Series();
            series.binding = 'y' + len;
            flexChart.series.push(series);
        },
        addFirstPoint: function () {
            flexChart.itemsSource.insert(0, getRandomData('added' + getRandomValue(1000)));
        },
        addLastPoint: function () {
            flexChart.itemsSource.push(getRandomData('added' + getRandomValue(1000)));
        },
        removeSeries: function () {
            if (flexChart.series.length <= 0) {
                return;
            }
            flexChart.series.pop();
        },
        removeFirstPoint: function () {
            if (flexChart.itemsSource.length) {
                flexChart.itemsSource.removeAt(0);
            }
        },
        removeLastPoint: function () {
            if (flexChart.itemsSource.length) {
                flexChart.itemsSource.pop();
            }
        }
    };

    //flexPie
    flexPie.beginUpdate();
    flexPie.itemsSource = getData(flexPiePoints);
    flexPie.bindingName = 'x';
    flexPie.binding = 'y0';
    flexPie.innerRadius = 0;
    flexPie.endUpdate();

    var pieAnimation = new wijmo.chart.animation.ChartAnimation(flexPie, {
        animationMode: wijmo.chart.animation.AnimationMode.All,
        easing: wijmo.chart.animation.Easing.Swing,
        duration: 400
    });

    //Pie Animation Mode
    pieAnimationMode.selectedValue = 'All';
    pieAnimationMode.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;

        pieAnimation.animationMode = wijmo.chart.animation.AnimationMode[sender.selectedValue];
        pieAnimation.animate();
        updateMenuHeader(pieAnimationMode, '<b>Animation Mode</b>: ', sender.text);
    });
    updateMenuHeader(pieAnimationMode, '<b>Animation Mode</b>: ', pieAnimationMode.text);

    //Pie Easing
    pieEasing.selectedValue = 'Swing';
    pieEasing.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;

        pieAnimation.easing = wijmo.chart.animation.Easing[sender.selectedValue];
        pieAnimation.animate();
        updateMenuHeader(pieEasing, '<b>Easing</b>: ', sender.text);
    });
    updateMenuHeader(pieEasing, '<b>Easing</b>: ', pieEasing.text);

    //Pie Duration
    pieDuration.value = 400;
    pieDuration.min = 200;
    pieDuration.max = 5000;
    pieDuration.step = 200;
    pieDuration.format = 'n0';
    pieDuration.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        pieAnimation.duration = sender.value;
        pieAnimation.animate();
    });

    //Pie Inner Radius
    pieInnerRadius.min = 0;
    pieInnerRadius.max = 1;
    pieInnerRadius.step = 0.1;
    pieInnerRadius.format = 'n1';
    pieInnerRadius.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        flexPie.innerRadius = sender.value;
    });

    //Pie Reset Data
    document.getElementById("pieResetData").addEventListener("click", function () {
        if (flexPie) {
            flexPie.itemsSource = getData(flexPiePoints);
            insertPieIdx = 1;
        }
    });

    //Pie Add Slice
    document.getElementById("pieAddSlice").addEventListener("click", function () {
        if (flexPie) {
            flexPie.itemsSource.push(getRandomData('added' + insertPieIdx));
            insertPieIdx++;
        }
    });

    //Pie Remove Slice
    document.getElementById("pieRemoveSlice").addEventListener("click", function () {
        if (flexPie && flexPie.itemsSource.length) {
            flexPie.itemsSource.pop();
            insertPieIdx = insertPieIdx <= 1 ? 1 : insertPieIdx--;
        }
    });
});