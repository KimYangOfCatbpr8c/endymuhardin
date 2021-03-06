/*
 * Wijmo culture file: ca (Catalan)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            name: 'ca',
            displayName: 'Catalan',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],
                daysAbbr: ['dg.', 'dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.'],
                months: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
                monthsAbbr: ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'],
                am: ['a. m.', 'a'],
                pm: ['p. m.', 'p'],
                eras: ['dC'],
                patterns: {
                    d: 'd/M/yyyy', D: 'dddd, d MMMM "de" yyyy',
                    f: 'dddd, d MMMM "de" yyyy H:mm', F: 'dddd, d MMMM "de" yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM', 
                    y: 'MMMM "de" yyyy', Y: 'MMMM "de" yyyy', 
                    g: 'd/M/yyyy H:mm', G: 'd/M/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} articles seleccionats'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} elements)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Ascendent',
            descending: '\u2193 Descendent',
            apply: 'Aplica',
            clear: 'Esborra',
            conditions: 'Filtra per condició',
            values: 'Filtra per valor',

            // value filter
            search: 'Cerca',
            selectAll: 'Selecciona-ho tot',
            null: '(res)',

            // condition filter
            header: 'Mostra elements amb el valor',
            and: 'I',
            or: 'O',
            stringOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'No és igual a', op: 1 },
                { name: 'Comença amb', op: 6 },
                { name: 'Acaba amb', op: 7 },
                { name: 'Conté', op: 8 },
                { name: 'No conté', op: 9 }
            ],
            numberOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'No és igual a', op: 1 },
                { name: 'És més gran que', op: 2 },
                { name: 'És més gran o igual que', op: 3 },
                { name: 'És més petit que', op: 4 },
                { name: 'És més petit o igual que', op: 5 }
            ],
            dateOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'És anterior a', op: 4 },
                { name: 'És posterior a', op: 3 }
            ],
            booleanOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'No és igual a', op: 1 }
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