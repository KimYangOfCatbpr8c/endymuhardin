/*
 * Wijmo culture file: ar-AE (Arabic (United Arab Emirates))
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'ar-AE',
            displayName: 'Arabic (U.A.E.)',
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'د.إ.‏', pattern: ['$n-', '$ n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 6,
                days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                daysAbbr: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليه', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                monthsAbbr: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليه', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                am: ['ص', 'ص'],
                pm: ['م', 'م'],
                eras: ['م'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dd MMMM, yyyy',
                    f: 'dd MMMM, yyyy hh:mm tt', F: 'dd MMMM, yyyy hh:mm:ss tt',
                    t: 'hh:mm tt', T: 'hh:mm:ss tt',
                    m: 'dd MMMM', M: 'dd MMMM',
                    y: 'MMMM, yyyy', Y: 'MMMM, yyyy',
                    g: 'dd/MM/yyyy hh:mm tt', G: 'dd/MM/yyyy hh:mm:ss tt',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: 'العناصر المحددة  {count:n0}'
        },
        FlexGrid: {
            groupHeaderFormat: '(العناصر {count:n0})<b> {value}</b> :{name}'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 تصاعديًا',
            descending: '\u2193 تنازليًا',
            apply: 'تطبيق',
            clear: 'مسح',
            conditions: 'تصنيف حسب الحالة',
            values: 'تصنيف حسب القيمة',
            // value filter
            search: 'بحث',
            selectAll: 'تحديد الكل',
            null: '(لا شيء)',
            // condition filter
            header: 'عرض العناصر حيث توجد القيمة',
            and: 'و',
            or: 'أو',
            stringOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'لا تساوي', op: 1 },
                { name: 'يبدأ بـ', op: 6 },
                { name: 'ينتهي بـ', op: 7 },
                { name: 'يحتوي على', op: 8 },
                { name: 'لا يحتوى على', op: 9 }
            ],
            numberOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'لا تساوي', op: 1 },
                { name: 'أكبر من', op: 2 },
                { name: 'أكبر من أو يساوي', op: 3 },
                { name: 'أقل من', op: 4 },
                { name: 'أقل من أو يساوي', op: 5 }
            ],
            dateOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'قبل', op: 4 },
                { name: 'بعد', op: 3 }
            ],
            booleanOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'لا تساوي', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'Field settings:',
                header: 'Header:',
                summary: 'Summary:',
                showAs: 'Show As:',
                weighBy: 'Weigh by:',
                sort: 'Sort:',
                filter: 'Filter:',
                format: 'Format:',
                sample: 'Sample:',
                edit: 'Edit...',
                clear: 'Clear',
                ok: 'OK',
                cancel: 'Cancel',
                none: '(none)',
                sorts: {
                    asc: 'Ascending',
                    desc: 'Descending'
                },
                aggs: {
                    sum: 'Sum',
                    cnt: 'Count',
                    avg: 'Average',
                    max: 'Max',
                    min: 'Min',
                    rng: 'Range',
                    std: 'StdDev',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'No Calculation',
                    dRow: 'Difference from previous row',
                    dRowPct: '% Difference from previous row',
                    dCol: 'Difference from previous column',
                    dColPct: '% Difference from previous column'
                },
                formats: {
                    n0: 'Integer (n0)',
                    n2: 'Float (n2)',
                    c: 'Currency (c)',
                    p0: 'Percentage (p0)',
                    p2: 'Percentage (p2)',
                    n2c: 'Thousands (n2,)',
                    n2cc: 'Millions (n2,,)',
                    n2ccc: 'Billions (n2,,,)',
                    d: 'Date (d)',
                    MMMMddyyyy: 'Month Day Year (MMMM dd, yyyy)',
                    dMyy: 'Day Month Year (d/M/yy)',
                    ddMyy: 'Day Month Year (dd/M/yy)',
                    dMyyyy: 'Day Month Year (dd/M/yyyy)',
                    MMMyyyy: 'Month Year (MMM yyyy)',
                    MMMMyyyy: 'Month Year (MMMM yyyy)',
                    yyyyQq: 'Year Quarter (yyyy "Q"q)',
                    FYEEEEQU: 'Fiscal Year Quarter ("FY"EEEE "Q"U)'
                }
            },
            PivotEngine: {
                grandTotal: 'Grand Total',
                subTotal: 'Subtotal'
            },
            PivotPanel: {
                fields: 'Choose fields to add to report',
                drag: 'Drag fields between areas below:',
                filters: 'Filters',
                cols: 'Columns',
                rows: 'Rows',
                vals: 'Values',
                defer: 'Defer Updates',
                update: 'Update'
            },
            _ListContextMenu: {
                up: 'Move Up',
                down: 'Move Down',
                first: 'Move do Beginning',
                last: 'Move to End',
                filter: 'Move to Report Filter',
                rows: 'Move to Row Labels',
                cols: 'Move to Column Labels',
                vals: 'Move to Values',
                remove: 'Remove Field',
                edit: 'Field Settings...',
                detail: 'Show Detail...'
            },
            PivotChart: {
                by: 'by',
                and: 'and'
            },
            DetailDialog: {
                header: 'Detail View:',
                ok: 'OK',
                items: '{cnt:n0} items',
                item: '{cnt} item',
                row: 'Row',
                col: 'Column'
            }
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.ar-AE.js.map