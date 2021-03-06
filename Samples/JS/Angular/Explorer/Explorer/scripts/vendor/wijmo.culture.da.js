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
 * Wijmo culture file: da (Danish)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'da',
            displayName: 'Danish',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'kr.', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '-',
                ':': ':',
                firstDay: 1,
                days: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
                daysAbbr: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
                months: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
                monthsAbbr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['A.D.'],
                patterns: {
                    d: 'dd-MM-yyyy', D: 'd. MMMM yyyy',
                    f: 'd. MMMM yyyy HH:mm', F: 'd. MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd-MM-yyyy HH:mm', G: 'dd-MM-yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} varer valgt'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} emner)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Stigende',
            descending: '\u2193 Faldende',
            apply: 'Anvend',
            clear: 'Ryd',
            conditions: 'Filtrer efter betingelse',
            values: 'Filtrer efter værdi',
            // value filter
            search: 'Søg',
            selectAll: 'Markér alt',
            null: '(intet)',
            // condition filter
            header: 'Vis emner med værdien',
            and: 'Og',
            or: 'Eller',
            stringOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Ikke lig med', op: 1 },
                { name: 'Begynder med', op: 6 },
                { name: 'Slutter med', op: 7 },
                { name: 'Indeholder', op: 8 },
                { name: 'Indeholder ikke', op: 9 }
            ],
            numberOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Ikke lig med', op: 1 },
                { name: 'Større end', op: 2 },
                { name: 'Større end eller lig med', op: 3 },
                { name: 'Mindre end', op: 4 },
                { name: 'Mindre end eller lig med', op: 5 }
            ],
            dateOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Før', op: 4 },
                { name: 'Efter', op: 3 }
            ],
            booleanOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Ikke lig med', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'Indstillinger for feltet:',
                header: 'Overskrift:',
                summary: 'Resumé:',
                showAs: 'Vis som:',
                weighBy: 'Vejes af:',
                sort: 'Sorter:',
                filter: 'Filter:',
                format: 'Format:',
                sample: 'Prøve:',
                edit: 'Rediger…',
                clear: 'Ryd',
                ok: 'OK',
                cancel: 'Annuller',
                none: '(ingen)',
                sorts: {
                    asc: 'Stigende',
                    desc: 'Faldende'
                },
                aggs: {
                    sum: 'Sum',
                    cnt: 'Antal',
                    avg: 'Gennemsnit',
                    max: 'Maks.',
                    min: 'Min',
                    rng: 'Område',
                    std: 'Stdafv',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'Ingen beregning',
                    dRow: 'Forskellen fra forrige række',
                    dRowPct: '% Forskel fra forrige række',
                    dCol: 'Forskellen fra forrige kolonne',
                    dColPct: '% Forskel fra forrige kolonne',
                    dPctGrand: '% af hovedtotal',
                    dPctRow: '% af rækken total',
                    dPctCol: '% af kolonnen total',
                    dRunTot: 'Løbende total',
                    dRunTotPct: '% løbende samlede'
                },
                formats: {
                    n0: 'Heltal (n0)',
                    n2: 'Decimal (n2)',
                    c: 'Valuta (c)',
                    p0: 'Procentdel (p0)',
                    p2: 'Procentdel (p2)',
                    n2c: 'Tusinder (n2,)',
                    n2cc: 'Millioner (n2,,)',
                    n2ccc: 'Milliarder (n2,,,)',
                    d: 'Dato (d)',
                    MMMMddyyyy: 'Måned dag år (MMMM dd, yyyy)',
                    dMyy: 'Dag måned år (d/M/yy)',
                    ddMyy: 'Dag måned år (dd/M/yy)',
                    dMyyyy: 'Dag måned år (dd/M/yyyy)',
                    MMMyyyy: 'Måned år (MMM yyyy)',
                    MMMMyyyy: 'Måned år (MMMM yyyy)',
                    yyyyQq: 'År kvartal (yyyy"Q" q)',
                    FYEEEEQU: 'Regnskabsår kvartal ("FY" EEEE "Q" U)'
                }
            },
            PivotEngine: {
                grandTotal: 'Hovedtotal',
                subTotal: 'Subtotal'
            },
            PivotPanel: {
                fields: 'Vælg felter for at føje til rapport:',
                drag: 'Træk felter mellem områder nedenfor:',
                filters: 'Filtre',
                cols: 'Kolonner',
                rows: 'Rækker',
                vals: 'Værdier',
                defer: 'Udsætte opdateringer',
                update: 'Opdater'
            },
            _ListContextMenu: {
                up: 'Flyt op',
                down: 'Flyt ned',
                first: 'Flyt til start',
                last: 'Flytte til slutningen',
                filter: 'Flyt til rapportfilter',
                rows: 'Flyt til rækkenavne',
                cols: 'Flyt til kolonnenavne',
                vals: 'Flyt til værdier',
                remove: 'Fjern felt',
                edit: 'Feltindstillinger…',
                detail: 'Vis detalje…'
            },
            PivotChart: {
                by: 'efter',
                and: 'og'
            },
            DetailDialog: {
                header: 'Detaljevisning:',
                ok: 'OK',
                items: '{cnt:n0} elementer',
                item: '{cnt} vare',
                row: 'Række',
                col: 'Kolonne'
            }
        },
        Viewer: {
            cancel: 'Annuller',
            ok: 'OK',
            bottom: 'Bund:',
            top: 'Top:',
            right: 'Højre:',
            left: 'Venstre:',
            margins: 'Margener (tommer)',
            orientation: 'Orientering:',
            paperKind: 'Papir form:',
            pageSetup: 'Sideopsætning',
            landscape: 'Liggende',
            portrait: 'Stående',
            pageNumber: 'Sidetal',
            zoomFactor: 'Zoomfaktor',
            paginated: 'Udskriftslayout',
            print: 'Udskriv',
            search: 'Søg',
            matchCase: 'Forskel på store og små bogstaver',
            wholeWord: 'Søg kun efter hele ord',
            searchResults: 'Søgeresultater',
            previousPage: 'Forrige side',
            nextPage: 'Næste side',
            firstPage: 'Første side',
            lastPage: 'Sidste side',
            backwardHistory: 'Tilbage',
            forwardHistory: 'Fremad',
            pageCount: 'Antal sider',
            selectTool: 'Vælg værktøj',
            moveTool: 'Flytte-værktøj',
            continuousMode: 'Kontinuerlig sidevisning',
            singleMode: 'Enkelt sidevisning',
            wholePage: 'Fit hele siden',
            pageWidth: 'Passe til sidebredden',
            zoomOut: 'Zoom',
            zoomIn: 'Zoom ind',
            exports: 'Eksportér',
            fullScreen: 'Fuld skærm',
            exitFullScreen: 'Afslut fuld skærm',
            hamburgerMenu: 'Funktioner',
            showSearchBar: 'Vis søgelinje',
            viewMenu: 'Indstillinger for layout',
            searchOptions: 'Søgekriterier',
            matchCaseMenuItem: 'Forskel på store og små bogstaver',
            wholeWordMenuItem: 'Kun hele ord',
            thumbnails: 'Sideminiaturebilleder',
            outlines: 'dokumentoversigt',
            loading: 'Indlæser…',
            pdfExportName: 'Adobe PDF',
            docxExportName: 'Open XML-Word',
            xlsxExportName: 'Open XML-Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Webarkiv (MHTML)',
            htmlExportName: 'HTML-dokument',
            rtfExportName: 'RTF-dokument',
            metafileExportName: 'Komprimeret metafiler',
            csvExportName: 'CSV',
            tiffExportName: 'TIFF-billeder',
            bmpExportName: 'BMP-billeder',
            emfExportName: 'Udvidet metafil',
            gifExportName: 'GIF-billeder',
            jpgExportName: 'JPEG-billeder',
            jpegExportName: 'JPEG-billeder',
            pngExportName: 'PNG-billeder',
            abstractMethodException: 'Dette er en abstrakt metode, skal du gennemføre den.',
            cannotRenderPageNoViewPage: 'Kan ikke gengives side uden dokument kilde og se side.',
            cannotRenderPageNoDoc: 'Kan ikke gengives side uden dokument kilde og se side.',
            exportFormat: 'Eksportformat:',
            exportOptionTitle: 'Eksportindstillinger',
            documentRestrictionsGroup: 'Dokument restriktioner',
            passwordSecurityGroup: 'Adgangskodesikkerhed',
            outputRangeGroup: 'Outputområdet',
            documentInfoGroup: 'Dokumentinfo',
            generalGroup: 'Generelt',
            docInfoTitle: 'Titel',
            docInfoAuthor: 'Forfatter',
            docInfoManager: 'Chef',
            docInfoOperator: 'Operatør',
            docInfoCompany: 'Firma',
            docInfoSubject: 'Emne',
            docInfoComment: 'Kommentar',
            docInfoCreator: 'Oprettet af',
            docInfoProducer: 'Producer',
            docInfoCreationTime: 'Oprettelsestidspunkt',
            docInfoRevisionTime: 'Revision tid',
            docInfoKeywords: 'Nøgleord',
            embedFonts: 'Integrer TrueType-skrifttyper',
            pdfACompatible: 'PDF/A kompatibel (niveau 2B)',
            useCompression: 'Brug komprimering',
            useOutlines: 'Generere konturer',
            allowCopyContent: 'Tillad indhold kopiering eller udvinding',
            allowEditAnnotations: 'Tillad redigering af anmærkning',
            allowEditContent: 'Tillad redigering af indhold',
            allowPrint: 'Tillad udskrivning',
            ownerPassword: '(Ejeren) tilladelsesadgangskode:',
            userPassword: 'Dokument åbent (brugeren) password:',
            encryptionType: 'Krypteringsniveau:',
            paged: 'Sideinddelt',
            showNavigator: 'Vis Navigator',
            singleFile: 'Enkelt fil',
            tolerance: 'Tolerance når afsløre tekst grænser (point):',
            pictureLayer: 'Brug separate billede lag',
            metafileType: 'Metafil Type:',
            monochrome: 'Monokrom',
            resolution: 'Opløsning:',
            outputRange: 'Sideområde:',
            outputRangeInverted: 'Inverteret',
            showZoomBar: 'Zoom-bjælken',
            searchPrev: 'Søg tidligere',
            searchNext: 'Søg næste',
            checkMark: '\u2713',
            exportOk: 'Eksport…',
            parameters: 'parameters',
            requiringParameters: 'Venligst input parametre.',
            nullParameterError: 'En værdi må ikke være null.',
            invalidParameterError: 'Inputtet er ugyldigt.',
            parameterNoneItemsSelected: '(ingen)',
            parameterAllItemsSelected: '(alle)',
            parameterSelectAllItemText: '(Markér alle)',
            selectParameterValue: '(Vælg værdi)',
            apply: 'Anvend',
            errorOccured: 'Der opstod en fejl.'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

