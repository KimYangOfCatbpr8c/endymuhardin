'use strict';

// get reference to app module
var app = angular.module('app');

// add controller to app module
app.controller('appCtrl', function appCtrl($scope) {

    // generate some random data
    var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
        data = [], funnelData = [], sales = 10000;
    for (var i = 0; i < countries.length; i++) {
        data.push({
            country: countries[i],
            downloads: Math.round(Math.random() * 20000),
            sales: Math.random() * 10000,
            expenses: Math.random() * 5000
        });
        funnelData.push({
            country: countries[i],
            sales: sales
        });
        sales = sales - Math.round(Math.random() * 2000);
    }

    // add data array to scope
    $scope.data = data;
    $scope.funnelData = funnelData;

    // add chart properties to scope
    $scope.chartProps = {
        chartType: wijmo.chart.ChartType.Column,
        gradientChartType: wijmo.chart.ChartType.Column,
        stacking: wijmo.chart.Stacking.None,
        legendPosition: wijmo.chart.Position.Right,
        rotated: false,
        header: 'Sample Chart',
        footer: 'copyright (c) ComponentOne',
        titleX: 'country',
        titleY: 'amount',
        selectionMode: wijmo.chart.SelectionMode.Series,
        selection: null,
        gradientFill: '',
        gradientType: 'l',
        gradientDirection: 'horizontal',
        gradientPredefinedColor: { fill: 'l(0,0,1,0)#89f7fe-#66a6ff' },
        startColor: '#ff0000',
        startOffset: 0,
        startOpacity: 1,
        endColor: '#0000ff',
        endOffset: 1,
        endOpacity: 1
    };

    // series-toggling chart control
    $scope.toggleChart = null;
    $scope.funnelChart = null;
    $scope.inputNeckWidth = null;
    $scope.inputNeckHeight = null;
    $scope.neckWidth = 0.2;
    $scope.neckHeight = 0.2;
    $scope.funnelType = 'default';
    $scope.gradientPredefinedColorMenu = null;

    // dynamic data
    var toAddData;
    $scope.trafficData = new wijmo.collections.ObservableArray();
    $scope.setInterval = function (interval) {
        if (toAddData) {
            clearTimeout(toAddData);
            toAddData = null;
        }
        $scope.interval = interval;
        if (interval) {
            toAddData = setTimeout(addTrafficItem);
        }
    };
    $scope.setInterval(500);

    function addTrafficItem() {
        var len = $scope.trafficData.length,
            last = len ? $scope.trafficData[len - 1] : null,
            trucks = last ? last.trucks : 0,
            ships = last ? last.ships : 0,
            planes = last? last.planes : 0;
        trucks = Math.max(0, trucks + Math.round(Math.random() * 50 - 25));
        ships = Math.max(0, ships + Math.round(Math.random() * 10 - 5));
        planes = Math.max(0, planes + Math.round(Math.random() * 10 - 5));

        // add random data, limit array length
        $scope.trafficData.push({ time: new Date(), trucks: trucks, ships: ships, planes: planes });
        if ($scope.trafficData.length > 200) {
            $scope.trafficData.splice(0, 1);
        }

        // keep adding
        if ($scope.interval) {
            toAddData = setTimeout(addTrafficItem, $scope.interval);
        }
    }

    $scope.$watch('funnelChart', function () {
        var funnelChart = $scope.funnelChart;

        if (funnelChart != null) {
            funnelChart.options = {
                funnel: {
                    neckWidth: 0.2,
                    neckHeight: 0.2,
                    type: 'default'
                }
            };
            funnelChart.dataLabel.content = '{y}';
        }
    });

    $scope.$watch('neckWidth', function () {
        var neckWidth = $scope.inputNeckWidth,
            val = $scope.neckWidth;
        if (neckWidth != null) {
            if (val < neckWidth.min || val > neckWidth.max) {
                return;
            }
            $scope.funnelChart.options.funnel.neckWidth = val;
            $scope.funnelChart.refresh(true);
        }
    });

    $scope.$watch('neckHeight', function () {
        var neckHeight = $scope.inputNeckHeight,
            val = $scope.neckHeight;
        if (neckHeight != null) {
            if (val < neckHeight.min || val > neckHeight.max) {
                return;
            }
            $scope.funnelChart.options.funnel.neckHeight = val;
            $scope.funnelChart.refresh(true);
        }
    });

    $scope.funnelTypeChanged = function (sender) {
        $scope.funnelChart.options.funnel.type = sender.selectedValue;
        $scope.funnelChart.refresh(true);
        $scope.funnelType = sender.selectedValue;
    };
    
    $scope.$watch('gradientPredefinedColorMenu', function () {
        var gradientPredefinedColorMenu = $scope.gradientPredefinedColorMenu;

        if (gradientPredefinedColorMenu != null) {
            gradientPredefinedColorMenu.selectedIndex = 0;
        }
    });
    $scope.$watch('gradientChart', function () {
        var gradientChart = $scope.gradientChart;

        if (gradientChart != null) {
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.gradientType', function () {
        if ($scope.chartProps.gradientType != null) {
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.gradientDirection', function () {
        if ($scope.chartProps.gradientDirection != null) {
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.startColor', function () {
        if ($scope.chartProps.startColor != null) {
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.startOffset', function () {
        var inputStartOffset = $scope.inputStartOffset,
            val = $scope.chartProps.startOffset;
        if (inputStartOffset != null) {
            if (val < inputStartOffset.min || val > inputStartOffset.max || val >= $scope.chartProps.endOffset) {
                return;
            }
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.startOpacity', function () {
        var inputStartOpacity = $scope.inputStartOpacity,
            val = $scope.chartProps.startOpacity;
        if (inputStartOpacity != null) {
            if (val < inputStartOpacity.min || val > inputStartOpacity.max) {
                return;
            }
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.endColor', function () {
        if ($scope.chartProps.endColor != null) {
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.endOffset', function () {
        var inputEndOffset = $scope.inputEndOffset,
            val = $scope.chartProps.endOffset;
        if (inputEndOffset != null) {
            if (val < inputEndOffset.min || val > inputEndOffset.max || val <= $scope.chartProps.startOffset) {
                return;
            }
            applyGradientColor();
        }
    });
    $scope.$watch('chartProps.endOpacity', function () {
        var inputEndOpacity = $scope.inputEndOpacity,
            val = $scope.chartProps.endOpacity;
        if (inputEndOpacity != null) {
            if (val < inputEndOpacity.min || val > inputEndOpacity.max) {
                return;
            }
            applyGradientColor();
        }
    });

    function applyGradientColor() {
        if ($scope.gradientChart == null) {
            return;
        }

        var chart = $scope.gradientChart,
            color = '',
            props = $scope.chartProps,
            type = props.gradientType,
            direction = props.gradientDirection;

        color = type;
        if (type === 'l') {
            if (direction === 'horizontal') {
                color += '(0, 0, 1, 0)';
            } else {
                color += '(0, 0, 0, 1)';
            }
        } else {
            color += '(0.5, 0.5, 0.5)'
        }
        color += props.startColor;
        if (props.startOffset !== 0 || props.startOpacity !== 1) {
            color += ':' + props.startOffset;
        }
        if (props.startOpacity !== 1) {
            color += ':' + props.startOpacity;
        }
        color += '-' + props.endColor;
        if (props.endOffset !== 1 || props.endOpacity !== 1) {
            color += ':' + props.endOffset;
        }
        if (props.endOpacity !== 1) {
            color += ':' + props.endOpacity;
        }

        $scope.chartProps.gradientFill = color;
        chart.series[0].style = {
            fill: color
        };
    }
});
