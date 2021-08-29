(function (wijmo) {
    'use strict';

    // create FlexChart and Menus
    var predefinedChart = new wijmo.chart.FlexChart('#predefinedChart'),
        predefinedColorMenu = new wijmo.input.Menu('#predefinedColorMenu'),
        chart = new wijmo.chart.FlexChart('#chartGradientColors'),
        gredientLabel = document.getElementById('gradientColorsLabel'),
        gradientChartType = new wijmo.input.Menu('#gradientChartType'),
        type = new wijmo.input.Menu('#gradientTypeMenu'),
        dtDirection = document.getElementById('dtGradientDirection'),
        ddDirection = document.getElementById('ddGradientDirection'),
        direction = new wijmo.input.Menu('#gradientDirectionMenu'),
        startColor = new wijmo.input.InputColor('#gradientStartColor'),
        startOffset = new wijmo.input.InputNumber('#gradientStartOffset'),
        startOpacity = new wijmo.input.InputNumber('#gradientStartOpacity'),
        endColor = new wijmo.input.InputColor('#gradientEndColor'),
        endOffset = new wijmo.input.InputNumber('#gradientEndOffset'),
        endOpacity = new wijmo.input.InputNumber('#gradientEndOpacity');

    // initialize FlexChart's properties
    predefinedChart.initialize({
        itemsSource: appData,
        bindingX: 'country',
        series: [
            { binding: 'sales' }
        ]
    });
    chart.initialize({
        itemsSource: appData,
        bindingX: 'country',
        series: [
            { binding: 'sales' }
        ]
    });

    updateMenuHeader(predefinedColorMenu, 'Color');
    predefinedColorMenu.selectedIndexChanged.addHandler(function () {
        if (predefinedColorMenu.selectedValue) {
            applyBasicGradientColor();
            updateMenuHeader(predefinedColorMenu, 'Color');
        }
    });
    applyBasicGradientColor();
    
    function applyBasicGradientColor() {
        predefinedChart.series[0].style = {
            fill: predefinedColorMenu.selectedValue
        };
        predefinedChart.refresh(true);
    }

    applyGradientColor();

    //chart type - initialize Menu's properties
    updateMenuHeader(gradientChartType, 'Chart Type');
    gradientChartType.selectedIndexChanged.addHandler(function () {
        if (gradientChartType.selectedValue) {
            chart.chartType = +gradientChartType.selectedValue;
            updateMenuHeader(gradientChartType, 'Chart Type');
        }
    });

    //startColor - initialize InputColor's properties
    startColor.valueChanged.addHandler(function (sender) {
        applyGradientColor();
    });
    startColor.value = '#ff0000';

    // startOffset - initialize InputNumber's properties
    startOffset.min = 0;
    startOffset.max = 1;
    startOffset.step = 0.1;
    startOffset.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        applyGradientColor();
    });
    startOffset.value = 0;

    // startOpacity - initialize InputNumber's properties
    startOpacity.min = 0;
    startOpacity.max = 1;
    startOpacity.step = 0.1;
    startOpacity.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        applyGradientColor();
    });
    startOpacity.value = 1;

    //endColor - initialize InputColor's properties
    endColor.valueChanged.addHandler(function (sender) {
        applyGradientColor();
    });
    endColor.value = '#0000ff';

    // endOffset - initialize InputNumber's properties
    endOffset.min = 0;
    endOffset.max = 1;
    endOffset.step = 0.1;
    endOffset.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        applyGradientColor();
    });
    endOffset.value = 1;

    // endOpacity - initialize InputNumber's properties
    endOpacity.min = 0;
    endOpacity.max = 1;
    endOpacity.step = 0.1;
    endOpacity.valueChanged.addHandler(function (sender) {
        if (sender.value < sender.min || sender.value > sender.max) {
            return;
        }
        applyGradientColor();
    });
    endOpacity.value = 1;

    updateMenuHeader(type, 'Type');
    type.selectedIndexChanged.addHandler(function () {
        if (type.selectedValue) {
            updateMenuHeader(type, 'Type');
            applyGradientColor();
        }
    });

    updateMenuHeader(direction, 'Direction');
    direction.selectedIndexChanged.addHandler(function () {
        if (direction.selectedValue) {
            updateMenuHeader(direction, 'Direction');
            applyGradientColor();
        }
    });

    // helper function for Menu headers
    function updateMenuHeader(menu, prefix) {
        menu.header = '<b>' + prefix + '</b>: ' + menu.text;
    }

    function applyGradientColor() {
        
        var color = '',
            t = type.selectedValue,
            d = direction.selectedValue;

        color = t;
        if (t === 'l') {
            dtDirection.style.display = 'block';
            ddDirection.style.display = 'block';
            if (d === 'horizontal') {
                color += '(0, 0, 1, 0)';
            } else {
                color += '(0, 0, 0, 1)';
            }
        } else {
            dtDirection.style.display = 'none';
            ddDirection.style.display = 'none';
            color += '(0.5, 0.5, 0.5)'
        }
        color += startColor.value;
        if (startOffset.value !== 0 || startOpacity.value !== 1) {
            color += ':' + startOffset.value;
        }
        if (startOpacity.value !== 1) {
            color += ':' + startOpacity.value;
        }
        color += '-' + endColor.value;
        if (endOffset.value !== 1 || endOpacity.value !== 1) {
            color += ':' + endOffset.value;
        }
        if (endOpacity.value !== 1) {
            color += ':' + endOpacity.value;
        }

        gradientColorsLabel.innerHTML = color;
        chart.series[0].style = {
            fill: color
        };
        chart.refresh(true);
    }
})(wijmo);