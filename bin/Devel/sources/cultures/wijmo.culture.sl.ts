/*
 * Wijmo culture file: sl (Slovenian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            name: 'sl',
            displayName: 'Slovenian',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '. ',
                ':': ':',
                firstDay: 1,
                days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
                daysAbbr: ['ned.', 'pon.', 'tor.', 'sre.', 'čet.', 'pet.', 'sob.'],
                months: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
                monthsAbbr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
                am: ['dop.', 'd'],
                pm: ['pop.', 'p'],
                eras: ['po Kr.'],
                patterns: {
                    d: 'd. MM. yyyy', D: 'dddd, dd. MMMM yyyy',
                    f: 'dddd, dd. MMMM yyyy HH:mm', F: 'dddd, dd. MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'd. MM. yyyy HH:mm', G: 'd. MM. yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} postavke izbrali'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} artikli)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Naraščajoče',
            descending: '\u2193 Padajoče',
            apply: 'Uporabi',
            clear: 'Počisti',
            conditions: 'Filtriraj glede na pogoj',
            values: 'Filtriraj glede na vrednost',

            // value filter
            search: 'Iskanje',
            selectAll: 'Izberi vse',
            null: '(prazno)',

            // condition filter
            header: 'Prikaži elemente, kjer je vrednost',
            and: 'In',
            or: 'Ali',
            stringOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Ni enako', op: 1 },
                { name: 'Se začne z', op: 6 },
                { name: 'Se konča z', op: 7 },
                { name: 'Vsebuje', op: 8 },
                { name: 'Ne vsebuje', op: 9 }
            ],
            numberOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Ni enako', op: 1 },
                { name: 'Je večje od', op: 2 },
                { name: 'Je večje ali enako', op: 3 },
                { name: 'Je manjše od', op: 4 },
                { name: 'Je manjše ali enako', op: 5 }
            ],
            dateOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Je pred', op: 4 },
                { name: 'Je po', op: 3 }
            ],
            booleanOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Ni enako', op: 1 }
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
};