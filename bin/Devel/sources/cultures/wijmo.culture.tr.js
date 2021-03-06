/*
 * Wijmo culture file: tr (Turkish)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'tr',
            displayName: 'Turkish',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-%n', '%n'] },
                currency: { decimals: 2, symbol: '₺', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                daysAbbr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
                months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                monthsAbbr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                am: ['ÖÖ', 'ÖÖ'],
                pm: ['ÖS', 'ÖS'],
                eras: ['MS'],
                patterns: {
                    d: 'd.MM.yyyy', D: 'd MMMM yyyy dddd',
                    f: 'd MMMM yyyy dddd HH:mm', F: 'd MMMM yyyy dddd HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'dd MMMM', M: 'dd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'd.MM.yyyy HH:mm', G: 'd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} ürün seçilen'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} öğe)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Artan',
            descending: '\u2193 Azalan',
            apply: 'Uygula',
            clear: 'Temizle',
            conditions: 'Koşula Göre Filtrele',
            values: 'Değere Göre Filtrele',
            // value filter
            search: 'Ara',
            selectAll: 'Tümünü Seç',
            null: '(yok)',
            // condition filter
            header: 'Şu değere sahip öğeleri göster:',
            and: 'Ve',
            or: 'Veya',
            stringOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Eşit değildir', op: 1 },
                { name: 'İle başlayan', op: 6 },
                { name: 'Son harfi', op: 7 },
                { name: 'İçerir', op: 8 },
                { name: 'İçermez', op: 9 }
            ],
            numberOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Eşit değildir', op: 1 },
                { name: 'Büyüktür', op: 2 },
                { name: 'Büyük veya eşittir', op: 3 },
                { name: 'Küçüktür', op: 4 },
                { name: 'Küçük veya eşittir', op: 5 }
            ],
            dateOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Öncesinde', op: 4 },
                { name: 'Sonrasında', op: 3 }
            ],
            booleanOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Eşit değildir', op: 1 }
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
//# sourceMappingURL=wijmo.culture.tr.js.map