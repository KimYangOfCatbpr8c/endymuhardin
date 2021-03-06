/*
 * Wijmo culture file: th (Thai)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'th',
            displayName: 'Thai',
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '฿', pattern: ['-$n', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
                daysAbbr: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
                months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
                monthsAbbr: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['พ.ศ.'],
                patterns: {
                    d: 'd/M/yyyy', D: 'd MMMM yyyy',
                    f: 'd MMMM yyyy H:mm', F: 'd MMMM yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'd/M/yyyy H:mm', G: 'd/M/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                fiscalYearOffsets: [-3, -3],
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} รายการที่เลือก'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} รายการ)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 เรียงขึ้น',
            descending: '\u2193 เรียงลง',
            apply: 'ใช้',
            clear: 'ล้าง',
            conditions: 'กรองตามเงื่อนไข',
            values: 'กรองตามค่า',
            // value filter
            search: 'ค้นหา',
            selectAll: 'เลือกทั้งหมด',
            null: '(ไม่มี)',
            // condition filter
            header: 'แสดงรายการที่มีค่า',
            and: 'และ',
            or: 'หรือ',
            stringOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'ไม่เท่ากับ', op: 1 },
                { name: 'ขึ้นต้นด้วย', op: 6 },
                { name: 'ลงท้ายด้วย', op: 7 },
                { name: 'มี', op: 8 },
                { name: 'ไม่มี', op: 9 }
            ],
            numberOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'ไม่เท่ากับ', op: 1 },
                { name: 'มากกว่า', op: 2 },
                { name: 'มากกว่าหรือเท่ากับ', op: 3 },
                { name: 'น้อยกว่า', op: 4 },
                { name: 'น้อยกว่าหรือเท่ากับ', op: 5 }
            ],
            dateOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'มาก่อน', op: 4 },
                { name: 'มาหลัง', op: 3 }
            ],
            booleanOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'ไม่เท่ากับ', op: 1 }
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
//# sourceMappingURL=wijmo.culture.th.js.map