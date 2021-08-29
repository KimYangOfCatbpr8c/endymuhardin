var reportView = new wijmo.viewer.ReportViewer('#reportViewer'),
    serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20171.91/api/report',
    flexReportsCombo = document.querySelector('#flexReports'),
    ssrsReportsCombo = document.querySelector('#ssrsReports');

addNoneOption(flexReportsCombo);
addNoneOption(ssrsReportsCombo);

$(function () {
    $('.service-url').text(serviceUrl);
});

//Fill FlexReport combo.
$.get("flexReport.config.json", function (data) {
    fillFlexReportList(data);
    loadFlexReport();
});

//Fill SsrsReport combo.
$.get("ssrsReport.config.json", function (data) {
    fillSsrsReportList(data);
});

function fillFlexReportList(reports) {
    var selectedReport = reports.selectedReport,
        selectedCategoryName = selectedReport.categoryName,
        selectedReportName = selectedReport.reportName;

    reports.categories.forEach(function (category) {
        var categoryName = category.name,
            optGroup = createComboOptionGroup(category.text);

        category.reports.forEach(function (report) {
            var reportName = report.reportName,
                fileName = 'ReportsRoot/' + categoryName + '/' + report.fileName,
                option = createComboOption(report.reportTitle, fileName);

            option.setAttribute("ReportName", reportName);

            if (categoryName === selectedCategoryName && reportName === selectedReportName) {
                option.selected = true;
            }

            optGroup.appendChild(option);
        });

        flexReportsCombo.appendChild(optGroup);
    });
}

function fillSsrsReportList(reports) {
    reports.categories.forEach(function (category) {
        var optGroup = createComboOptionGroup(category.text);

        category.reports.forEach(function (report) {
            var option = createComboOption(report.reportTitle, 'c1ssrs/' + report.reportPath);
            optGroup.appendChild(option);
        });

        ssrsReportsCombo.appendChild(optGroup);
    });
}

function loadFlexReport() {
    if (isNoneOptionSelected(flexReportsCombo)) {
        return;
    }

    if (reportView) {
        reportView.serviceUrl = serviceUrl;
        reportView.filePath = flexReportsCombo.value;
        reportView.reportName = $(flexReportsCombo).find('option:selected').attr('ReportName');
        reportView.paginated = true;
    }
}

function loadSsrsReport() {
    if (isNoneOptionSelected(ssrsReportsCombo)) {
        return;
    }

    if (reportView) {
        reportView.serviceUrl = serviceUrl;
        reportView.filePath = ssrsReportsCombo.value;;
        reportView.reportName = '';
        reportView.paginated = false;
    }
}

function addNoneOption(combo) {
    var optNone = document.createElement('option');
    optNone.value = 'None';
    optNone.innerHTML = '(None)';
    combo.appendChild(optNone);
}

function selectNoneOption(combo) {
    combo.selectedIndex = 0;
}

function isNoneOptionSelected(combo) {
    return combo.selectedIndex === 0;
}

function createComboOptionGroup(text) {
    var optGroup = document.createElement('optgroup');
    optGroup.label = text;

    return optGroup;
}

function createComboOption(text, value) {
    var option = document.createElement('option');

    option.innerHTML = text;
    option.value = value;

    return option;
}

flexReportsCombo.onchange = function () {
    selectNoneOption(ssrsReportsCombo);
    loadFlexReport();
}

ssrsReportsCombo.onchange = function () {
    selectNoneOption(flexReportsCombo);
    loadSsrsReport();
}
