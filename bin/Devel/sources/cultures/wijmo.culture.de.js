/*
 * Wijmo culture file: de (German)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'de',
            displayName: 'German',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                daysAbbr: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                monthsAbbr: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['n. Chr.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'dddd, d. MMMM yyyy',
                    f: 'dddd, d. MMMM yyyy HH:mm', F: 'dddd, d. MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd.MM.yyyy HH:mm', G: 'dd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} Artikel ausgewählt'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} Elemente)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Aufsteigend',
            descending: '\u2193 Absteigend',
            apply: 'Anwenden',
            clear: 'Löschen',
            conditions: 'Nach Zustand filtern',
            values: 'Nach Wert filtern',
            // value filter
            search: 'Suche',
            selectAll: 'Alles auswählen',
            null: '(nichts)',
            // condition filter
            header: 'Zeige Elemente mit dem Wert',
            and: 'Und',
            or: 'Oder',
            stringOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist nicht gleich', op: 1 },
                { name: 'Fängt an mit', op: 6 },
                { name: 'Endet mit', op: 7 },
                { name: 'Enthält', op: 8 },
                { name: 'Enthält nicht', op: 9 }
            ],
            numberOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist nicht gleich', op: 1 },
                { name: 'Größer als', op: 2 },
                { name: 'Größer oder gleich', op: 3 },
                { name: 'ist weniger als', op: 4 },
                { name: 'Kleiner oder gleich', op: 5 }
            ],
            dateOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist vor', op: 4 },
                { name: 'Ist nach', op: 3 }
            ],
            booleanOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist nicht gleich', op: 1 }
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
//# sourceMappingURL=wijmo.culture.de.js.map