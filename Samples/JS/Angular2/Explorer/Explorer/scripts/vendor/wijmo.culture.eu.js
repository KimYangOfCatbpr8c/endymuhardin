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
 * Wijmo culture file: eu (Basque)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'eu',
            displayName: 'Basque',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-% n', '% n'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'],
                daysAbbr: ['ig.', 'al.', 'ar.', 'az.', 'og.', 'or.', 'lr.'],
                months: ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'],
                monthsAbbr: ['Urt.', 'Ots.', 'Mar.', 'Api.', 'Mai.', 'Eka.', 'Uzt.', 'Abu.', 'Ira.', 'Urr.', 'Aza.', 'Abe.'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['K.o.'],
                patterns: {
                    d: 'yyyy/MM/dd', D: 'dddd, yyyy"(e)ko" MMMM"ren" d"a"',
                    f: 'dddd, yyyy"(e)ko" MMMM"ren" d"a" H:mm', F: 'dddd, yyyy"(e)ko" MMMM"ren" d"a" H:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'MMMM"ren" d"a"', M: 'MMMM"ren" d"a"',
                    y: 'yyyy"(e)ko" MMMM', Y: 'yyyy"(e)ko" MMMM',
                    g: 'yyyy/MM/dd HH:mm', G: 'yyyy/MM/dd HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} elementurik hautatu'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} gaiak)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Goranzkoa',
            descending: '\u2193 Beheranzkoa',
            apply: 'Aplikatu',
            clear: 'Garbitu',
            conditions: 'Iragazi egoeraren arabera',
            values: 'Iragazi balioaren arabera',
            // value filter
            search: 'Bilatu',
            selectAll: 'Hautatu denak',
            null: '(ezer ez)',
            // condition filter
            header: 'Erakutsi gaiak balioaren lekuan',
            and: 'eta',
            or: 'Edo',
            stringOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Ezberdina', op: 1 },
                { name: 'Honela hasten da', op: 6 },
                { name: 'Honela bukatzen da', op: 7 },
                { name: 'Barne dauka', op: 8 },
                { name: 'Ez dauka barne', op: 9 }
            ],
            numberOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Ezberdina', op: 1 },
                { name: 'Handiagoa da', op: 2 },
                { name: 'Handiagoa edo berdina da', op: 3 },
                { name: 'Txikiagoa da', op: 4 },
                { name: 'Txikiagoa edo berdina da', op: 5 }
            ],
            dateOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Honen aurretik', op: 4 },
                { name: 'Honen ondoren', op: 3 }
            ],
            booleanOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Ezberdina', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'Eremu-ezarpenak:',
                header: 'Goiburua:',
                summary: 'Laburpena:',
                showAs: 'Erakutsi honela:',
                weighBy: 'Pisatzen arabera:',
                sort: 'Ordenatu:',
                filter: 'Iragazkia:',
                format: 'Formatua:',
                sample: 'Adibidea:',
                edit: 'Editatu…',
                clear: 'Garbitu',
                ok: 'Ados',
                cancel: 'Utzi',
                none: '(bat ere ez)',
                sorts: {
                    asc: 'Gorantz',
                    desc: 'Beherantz'
                },
                aggs: {
                    sum: 'Batura',
                    cnt: 'Kopurua',
                    avg: 'Batez bestekoa',
                    max: 'Max.',
                    min: 'Min',
                    rng: 'Barrutia',
                    std: 'DesbEst',
                    var: 'Bar',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'Kalkulurik ez',
                    dRow: 'Aurreko lerroa aldea',
                    dRowPct: '% Difference from previous row',
                    dCol: 'Aurreko zutabean aldea',
                    dColPct: '% Difference from previous column',
                    dPctGrand: '% of grand total',
                    dPctRow: '% of row total',
                    dPctCol: '% of column total',
                    dRunTot: 'Pilatutako guztira',
                    dRunTotPct: '% running total'
                },
                formats: {
                    n0: 'Zenbaki oso (n0)',
                    n2: 'Hamartar (n2)',
                    c: 'Moneta (c)',
                    p0: 'Ehunekoa (p0)',
                    p2: 'Ehunekoa (p2)',
                    n2c: 'Milaka (n2,)',
                    n2cc: 'Milioika (n2,,)',
                    n2ccc: 'Milioiak (n2,,,)',
                    d: 'Data (d)',
                    MMMMddyyyy: 'Hilabetea Eguna Urtea (MMMM dd, yyyy)',
                    dMyy: 'Eguna Hilabetea Urtea (d/M/yy)',
                    ddMyy: 'Eguna Hilabetea Urtea (dd/M/yy)',
                    dMyyyy: 'Eguna Hilabetea Urtea (dd/M/yyyy)',
                    MMMyyyy: 'Hilabetea Urtea (MMM yyyy)',
                    MMMMyyyy: 'Hilabetea Urtea (MMMM yyyy)',
                    yyyyQq: 'Urtea Quarter (yyyy "Q"q)',
                    FYEEEEQU: 'Zerga Urtea Quarter ("FY"EEEE "Q"U)'
                }
            },
            PivotEngine: {
                grandTotal: 'Total orokorra',
                subTotal: 'Azpitotala'
            },
            PivotPanel: {
                fields: 'Aukeratu eremuak txostenari gehitzeko:',
                drag: 'Arrastatu beheko areen arteko eremuak:',
                filters: 'Iragazkiak',
                cols: 'Zutabeetan',
                rows: 'Errenkadak',
                vals: 'Balioak',
                defer: 'Atzeratu Eguneraketak',
                update: 'Eguneratu'
            },
            _ListContextMenu: {
                up: 'Eraman gora',
                down: 'Eraman behera',
                first: 'Eraman hasierara',
                last: '&Eraman amaierara',
                filter: 'Eraman txosten-iragazkira',
                rows: 'Eraman errenkada-etiketetara',
                cols: 'Eraman zutabe-etiketetara',
                vals: 'Eraman balioetara',
                remove: 'Kendu eremua',
                edit: 'Eremu-ezarpenak…',
                detail: 'Erakutsi xehetasuna…'
            },
            PivotChart: {
                by: 'by',
                and: 'eta'
            },
            DetailDialog: {
                header: 'Xehetasunen ikuspegia:',
                ok: 'Ados',
                items: '{cnt:n0} items',
                item: '{cnt} item',
                row: 'Errenkada',
                col: 'Zutabea'
            }
        },
        Viewer: {
            cancel: 'Utzi',
            ok: 'Ados',
            bottom: 'Behetik:',
            top: 'Goitik:',
            right: 'Eskuinetik:',
            left: 'Ezkerrean:',
            margins: 'Marjinak (hazbeteak)',
            orientation: 'Orientazioa:',
            paperKind: 'Paper Mota:',
            pageSetup: 'Prestatu orrialdea',
            landscape: 'Horizontala',
            portrait: 'Bertikala',
            pageNumber: 'Orri zenbakia',
            zoomFactor: 'Zoom faktorea',
            paginated: 'Orrialde-diseinua',
            print: 'Inprimatu',
            search: 'Bilatu',
            matchCase: 'Maiuskulak/Minuskulak',
            wholeWord: 'Esaldi osoa bakarrik',
            searchResults: 'Bilaketaren emaitzak',
            previousPage: 'Aurreko orria',
            nextPage: 'Hurrengo orria',
            firstPage: 'Lehen orria',
            lastPage: 'Azken orria',
            backwardHistory: 'Atzerantz',
            forwardHistory: 'Aurrera',
            pageCount: 'Orrialde kopurua',
            selectTool: 'Hautatu Tresna',
            moveTool: 'Move Tool',
            continuousMode: 'Etengabeko orria ikuspegia',
            singleMode: 'Bakar Orria Ikuspegia',
            wholePage: 'Fit Page Osoa',
            pageWidth: 'Hurrengo Orria',
            zoomOut: 'Txikiagotu',
            zoomIn: 'Handiagotu',
            exports: 'Esportatu',
            fullScreen: 'Pantaila osoa',
            exitFullScreen: 'Irten pantaila osotik',
            hamburgerMenu: 'Tresnak',
            showSearchBar: 'Show Search Bar',
            viewMenu: 'Diseinu-aukerak',
            searchOptions: 'Bilaketarako aukerak',
            matchCaseMenuItem: 'Maiuskulak/Minuskulak',
            wholeWordMenuItem: 'Match Whole Word',
            thumbnails: 'Page Thumbnails',
            outlines: 'Dokumentu-mapa',
            loading: 'Kargatzen…',
            pdfExportName: 'Adobe-ren PDF',
            docxExportName: 'Open XML Word',
            xlsxExportName: 'Open XML Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Web archive (MHTML)',
            htmlExportName: 'HTML dokumentu',
            rtfExportName: 'RTF dokumentu',
            metafileExportName: 'Compressed metafiles',
            csvExportName: 'CSV',
            tiffExportName: 'Tiff irudiak',
            bmpExportName: 'BMP irudiak',
            emfExportName: 'Enhanced metafile',
            gifExportName: 'GIF irudiak',
            jpgExportName: 'JPG irudiak',
            jpegExportName: 'JPEG irudiak',
            pngExportName: 'PNG irudien',
            abstractMethodException: 'This is an abstract method, please implement it.',
            cannotRenderPageNoViewPage: 'Cannot render page without document source and view page.',
            cannotRenderPageNoDoc: 'Cannot render page without document source and view page.',
            exportFormat: 'Export format:',
            exportOptionTitle: 'Export options',
            documentRestrictionsGroup: 'Document restrictions',
            passwordSecurityGroup: 'Password security',
            outputRangeGroup: 'Output range',
            documentInfoGroup: 'Document info',
            generalGroup: 'Orokorra',
            docInfoTitle: 'Lanpostua',
            docInfoAuthor: 'Egilea',
            docInfoManager: 'Zuzendaria',
            docInfoOperator: 'Operadorea',
            docInfoCompany: 'Enpresa',
            docInfoSubject: 'Subject',
            docInfoComment: 'Iruzkindu',
            docInfoCreator: 'Sortzailea',
            docInfoProducer: 'Produktorea',
            docInfoCreationTime: 'Sortze-data',
            docInfoRevisionTime: 'Revision time',
            docInfoKeywords: 'Gako-hitzak',
            embedFonts: 'Kapsulatu TrueType letra-tipoak',
            pdfACompatible: 'PDF/A compatible (level 2B)',
            useCompression: 'Use compression',
            useOutlines: 'Generate outlines',
            allowCopyContent: 'Allow content copying or extraction',
            allowEditAnnotations: 'Allow annotation editing',
            allowEditContent: 'Allow content editing',
            allowPrint: 'Allow printing',
            ownerPassword: 'Permissions (owner) password:',
            userPassword: 'Document open (user) password:',
            encryptionType: 'Encryption level:',
            paged: 'Orrialdekatuta',
            showNavigator: 'Show Navigator',
            singleFile: 'Single File',
            tolerance: 'Tolerance when detecting text bounds (points):',
            pictureLayer: 'Use separate picture layer',
            metafileType: 'Metafile Type:',
            monochrome: 'Monokromoa',
            resolution: 'Bereizmena',
            outputRange: 'Orrialde-bitartea:',
            outputRangeInverted: 'Inverted',
            showZoomBar: 'Zoom Bar',
            searchPrev: 'Search Previous',
            searchNext: 'Search Next',
            checkMark: '\u2713',
            exportOk: 'Esportatu',
            parameters: 'Parametroak',
            requiringParameters: 'Sartu parametroak.',
            nullParameterError: 'Balioa ezin da null izan.',
            invalidParameterError: 'Sarrera baliogabea.',
            parameterNoneItemsSelected: '(bat ere ez)',
            parameterAllItemsSelected: '(guztiak)',
            parameterSelectAllItemText: '(Hautatu dena)',
            selectParameterValue: '(select value)',
            apply: 'Aplikatu',
            errorOccured: 'Errorea gertatu da.'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

