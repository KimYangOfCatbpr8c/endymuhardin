/*
    *
    * Wijmo Library 5.20171.282
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the Wijmo Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */
/*
 * Wijmo culture file: en-GB (English (United Kingdom))
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'en-GB',
            displayName: 'English (United Kingdom)',
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '£', pattern: ['-$n', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                daysAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthsAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['A.D.'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dd MMMM yyyy',
                    f: 'dd MMMM yyyy HH:mm', F: 'dd MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd/MM/yyyy HH:mm', G: 'dd/MM/yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                fiscalYearOffsets: [3, 3]
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} items selected'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} items)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Ascending',
            descending: '\u2193 Descending',
            apply: 'Apply',
            clear: 'Clear',
            conditions: 'Filter by Condition',
            values: 'Filter by Value',
            // value filter
            search: 'Search',
            selectAll: 'Select All',
            null: '(nothing)',
            // condition filter
            header: 'Show items where the value',
            and: 'And',
            or: 'Or',
            stringOperators: [
                { name: '(not set)', op: null },
                { name: 'Equals', op: 0 },
                { name: 'Does not equal', op: 1 },
                { name: 'Begins with', op: 6 },
                { name: 'Ends with', op: 7 },
                { name: 'Contains', op: 8 },
                { name: 'Does not contain', op: 9 }
            ],
            numberOperators: [
                { name: '(not set)', op: null },
                { name: 'Equals', op: 0 },
                { name: 'Does not equal', op: 1 },
                { name: 'Is greater than', op: 2 },
                { name: 'Is greater than or equal to', op: 3 },
                { name: 'Is less than', op: 4 },
                { name: 'Is less than or equal to', op: 5 }
            ],
            dateOperators: [
                { name: '(not set)', op: null },
                { name: 'Equals', op: 0 },
                { name: 'Is Before', op: 4 },
                { name: 'Is After', op: 3 }
            ],
            booleanOperators: [
                { name: '(not set)', op: null },
                { name: 'Equals', op: 0 },
                { name: 'Does not equal', op: 1 }
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
                edit: 'Edit…',
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
                    dColPct: '% Difference from previous column',
                    dPctGrand: '% of grand total',
                    dPctRow: '% of row total',
                    dPctCol: '% of column total',
                    dRunTot: 'Running total',
                    dRunTotPct: '% running total'
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
                fields: 'Choose fields to add to report:',
                drag: 'Drag fields between areas below:',
                filters: 'Filters',
                cols: 'Columns',
                rows: 'Rows',
                vals: 'Values',
                defer: 'Defer Updates',
                update: 'Update'
            },
            _ListContextMenu: {
                up: 'Move up',
                down: 'Move down',
                first: 'Move to Beginning',
                last: 'Move to End',
                filter: 'Move to Report Filter',
                rows: 'Move to Row Labels',
                cols: 'Move to Column Labels',
                vals: 'Move to Values',
                remove: 'Remove Field',
                edit: 'Field Settings…',
                detail: 'Show Detail…'
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
        },
        Viewer: {
            cancel: 'Cancel',
            ok: 'OK',
            bottom: 'Bottom:',
            top: 'Top:',
            right: 'Right:',
            left: 'Left:',
            margins: 'Margins (inches)',
            orientation: 'Orientation:',
            paperKind: 'Paper Kind:',
            pageSetup: 'Page Setup',
            landscape: 'Landscape',
            portrait: 'Portrait',
            pageNumber: 'Page number',
            zoomFactor: 'Zoom Factor',
            paginated: 'Print Layout',
            print: 'Print',
            search: 'Search',
            matchCase: 'Match case',
            wholeWord: 'Match whole word only',
            searchResults: 'Search Results',
            previousPage: 'Previous page',
            nextPage: 'Next page',
            firstPage: 'First page',
            lastPage: 'Last page',
            backwardHistory: 'Backward',
            forwardHistory: 'Forward',
            pageCount: 'Page Count',
            selectTool: 'Select Tool',
            moveTool: 'Move Tool',
            continuousMode: 'Continuous Page View',
            singleMode: 'Single Page View',
            wholePage: 'Fit Whole Page',
            pageWidth: 'Fit Page Width',
            zoomOut: 'Zoom out',
            zoomIn: 'Zoom in',
            exports: 'Export',
            fullScreen: 'Full Screen',
            exitFullScreen: 'Exit Full Screen',
            hamburgerMenu: 'Tools',
            showSearchBar: 'Show Search Bar',
            viewMenu: 'Layout Options',
            searchOptions: 'Search Options',
            matchCaseMenuItem: 'Match Case',
            wholeWordMenuItem: 'Match Whole Word',
            thumbnails: 'Page Thumbnails',
            outlines: 'Document Map',
            loading: 'Loading…',
            pdfExportName: 'Adobe PDF',
            docxExportName: 'Open XML Word',
            xlsxExportName: 'Open XML Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Web archive (MHTML)',
            htmlExportName: 'HTML document',
            rtfExportName: 'RTF document',
            metafileExportName: 'Compressed metafiles',
            csvExportName: 'CSV',
            tiffExportName: 'Tiff images',
            bmpExportName: 'BMP images',
            emfExportName: 'Enhanced metafile',
            gifExportName: 'GIF images',
            jpgExportName: 'JPEG images',
            jpegExportName: 'JPEG images',
            pngExportName: 'PNG images',
            abstractMethodException: 'This is an abstract method, please implement it.',
            cannotRenderPageNoViewPage: 'Cannot render page without document source and view page.',
            cannotRenderPageNoDoc: 'Cannot render page without document source and view page.',
            exportFormat: 'Export format',
            exportOptionTitle: 'Export options',
            documentRestrictionsGroup: 'Document restrictions',
            passwordSecurityGroup: 'Password security',
            outputRangeGroup: 'Output range',
            documentInfoGroup: 'Document info',
            generalGroup: 'General',
            docInfoTitle: 'Title',
            docInfoAuthor: 'Author',
            docInfoManager: 'Manager',
            docInfoOperator: 'Operator',
            docInfoCompany: 'Company',
            docInfoSubject: 'Subject',
            docInfoComment: 'Comment',
            docInfoCreator: 'Creator',
            docInfoProducer: 'Producer',
            docInfoCreationTime: 'Creation time',
            docInfoRevisionTime: 'Revision time',
            docInfoKeywords: 'Keywords',
            embedFonts: 'Embed TrueType fonts',
            pdfACompatible: 'PDF/A compatible (level 2B)',
            useCompression: 'Use Compression',
            useOutlines: 'Generate outlines',
            allowCopyContent: 'Allow content copying or extraction',
            allowEditAnnotations: 'Allow annotation editing',
            allowEditContent: 'Allow content editing',
            allowPrint: 'Allow printing',
            ownerPassword: 'Permissions (owner) password:',
            userPassword: 'Document open (user) password:',
            encryptionType: 'Encryption level:',
            paged: 'Paged',
            showNavigator: 'Show Navigator',
            singleFile: 'Single File',
            tolerance: 'Tolerance when detecting text bounds (points):',
            pictureLayer: 'Use separate picture layer',
            metafileType: 'Metafile Type:',
            monochrome: 'Monochrome',
            resolution: 'Resolution:',
            outputRange: 'Page range',
            outputRangeInverted: 'Inverted',
            showZoomBar: 'Zoom Bar',
            searchPrev: 'Search Previous',
            searchNext: 'Search Next',
            checkMark: '\u2713',
            exportOk: 'Export',
            parameters: 'Parameters',
            requiringParameters: 'Please input parameters.',
            nullParameterError: 'Value cannot be null.',
            invalidParameterError: 'Invalid input.',
            parameterNoneItemsSelected: '(none)',
            parameterAllItemsSelected: '(all)',
            parameterSelectAllItemText: '(Select all)',
            selectParameterValue: '(select value)',
            apply: 'Apply',
            errorOccured: 'An error has occurred.'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

