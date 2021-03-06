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
 * Wijmo culture file: lv (Latvian)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'lv',
            displayName: 'Latvian',
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['svētdiena', 'pirmdiena', 'otrdiena', 'trešdiena', 'ceturtdiena', 'piektdiena', 'sestdiena'],
                daysAbbr: ['Sv', 'Pr', 'Ot', 'Tr', 'Ce', 'Pk', 'Se'],
                months: ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'],
                monthsAbbr: ['Janv.', 'Febr.', 'Marts', 'Apr.', 'Maijs', 'Jūn.', 'Jūl.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dec.'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['m.ē.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'dddd, yyyy. "gada" d. MMMM',
                    f: 'dddd, yyyy. "gada" d. MMMM HH:mm', F: 'dddd, yyyy. "gada" d. MMMM HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'yyyy. "g". MMMM', Y: 'yyyy. "g". MMMM',
                    g: 'dd.MM.yyyy HH:mm', G: 'dd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} priekšmeti izvēlēts'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} vienumi)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Augošā secībā',
            descending: '\u2193 Dilstošā secībā',
            apply: 'Lietot',
            clear: 'Notīrīt',
            conditions: 'Filtrēt pēc stāvokļa',
            values: 'Filtrēt pēc vērtības',
            // value filter
            search: 'Meklēt',
            selectAll: 'Atlasīt visu',
            null: '(nekas)',
            // condition filter
            header: 'Rādīt vienumus, kur vērtība',
            and: 'Un',
            or: 'Vai',
            stringOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'nav vienāda ar', op: 1 },
                { name: 'sākas ar', op: 6 },
                { name: 'beidzas ar', op: 7 },
                { name: 'satur', op: 8 },
                { name: 'nesatur', op: 9 }
            ],
            numberOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'nav vienāda ar', op: 1 },
                { name: 'ir lielāka nekā', op: 2 },
                { name: 'ir lielāka nekā vai vienāda ar', op: 3 },
                { name: 'ir mazāka nekā', op: 4 },
                { name: 'ir mazāka nekā vai vienāda ar', op: 5 }
            ],
            dateOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'ir pirms', op: 4 },
                { name: 'ir pēc', op: 3 }
            ],
            booleanOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'nav vienāda ar', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'Lauka iestatījumi:',
                header: 'Galvene:',
                summary: 'Kopsavilkums:',
                showAs: 'Rādīt kā:',
                weighBy: 'Nosver ar:',
                sort: 'Kārtot:',
                filter: 'Filtrs:',
                format: 'Formāts:',
                sample: 'Paraugs:',
                edit: 'Labot…',
                clear: 'Notīrīt',
                ok: 'Labi',
                cancel: 'Atcelt',
                none: '(neviens)',
                sorts: {
                    asc: 'Augošā secībā',
                    desc: 'Dilstošā secībā'
                },
                aggs: {
                    sum: 'Summa',
                    cnt: 'Skaits',
                    avg: 'Vidējais',
                    max: 'Maks',
                    min: 'Min',
                    rng: 'Diapazons',
                    std: 'Standartnovirze',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'Bez aprēķina',
                    dRow: 'Atšķirība no iepriekšējā rindā',
                    dRowPct: 'Atšķirība no iepriekšējās rindas %',
                    dCol: 'Atšķirība no iepriekšējā kolonnā',
                    dColPct: 'Atšķirība no iepriekšējā kolonnā %',
                    dPctGrand: '% no kopsummas',
                    dPctRow: '% no kopsummas rindu',
                    dPctCol: 'kolonnas kopsumma %',
                    dRunTot: 'Pašreizējās kopsummas',
                    dRunTotPct: 'pašreizējās kopsummas %'
                },
                formats: {
                    n0: 'Vesels skaitlis (n0)',
                    n2: 'Numurs (n2)',
                    c: 'Valūtas (c)',
                    p0: 'Procents (p0)',
                    p2: 'Procents (p2)',
                    n2c: 'Tūkstoši (n2,)',
                    n2cc: 'Miljoniem (n2,,)',
                    n2ccc: 'Miljardiem (n2,,,)',
                    d: 'Datums (d)',
                    MMMMddyyyy: 'Mēneša dienu gadā (MMMM dd, yyyy)',
                    dMyy: 'Diena mēnesis gads (d/M/yy)',
                    ddMyy: 'Diena mēnesis gads (dd/M/yy)',
                    dMyyyy: 'Diena mēnesis gads (dd/M/yyyy)',
                    MMMyyyy: 'Mēnesis, gads (MMM yyyy)',
                    MMMMyyyy: 'Mēnesis, gads (MMMM yyyy)',
                    yyyyQq: 'Gada ceturksni (yyyy "Q"q)',
                    FYEEEEQU: 'Finanšu gada ceturksni ("FY"EEEE "Q"U)'
                }
            },
            PivotEngine: {
                grandTotal: 'Gala summa',
                subTotal: 'Starpsumma'
            },
            PivotPanel: {
                fields: 'Izvēlieties laukus, lai pievienotu atskaitei:',
                drag: 'Velciet laukus no viena tālāk norādītā apgabala uz citu:',
                filters: 'Filtri',
                cols: 'Kolonnas',
                rows: 'Rindas',
                vals: 'Vērtības',
                defer: 'Atlikt atjauninājumus',
                update: 'Atjaunināt'
            },
            _ListContextMenu: {
                up: 'Pārvietot augšup',
                down: 'Pārvietot lejup',
                first: 'Pārvietot uz sākumu',
                last: 'Pārvietot uz beigām',
                filter: 'Pārvietot uz atskaišu filtru',
                rows: 'Pārvietot uz rindu etiķetēm',
                cols: 'Pārvietot uz kolonnu etiķetēm',
                vals: 'Pārvietot uz vērtībām',
                remove: 'Noņemt lauku',
                edit: 'Lauka iestatījumi…',
                detail: 'Parādīt detaļas…'
            },
            PivotChart: {
                by: 'pēc',
                and: '–'
            },
            DetailDialog: {
                header: 'Detalizētajā skatā:',
                ok: 'Labi',
                items: '{cnt:n0} vienumi',
                item: 'vienuma {cnt}',
                row: 'Rinda',
                col: 'Kolonna'
            }
        },
        Viewer: {
            cancel: 'Atcelt',
            ok: 'Labi',
            bottom: 'Apakšējā:',
            top: 'Augšmala:',
            right: 'Labā:',
            left: 'No kreisās:',
            margins: 'Piemales (collās)',
            orientation: 'Orientācija:',
            paperKind: 'Papīra veida:',
            pageSetup: 'Lappuses iestatīšana',
            landscape: 'Ainava',
            portrait: 'Portrets',
            pageNumber: 'Lappuses numurs',
            zoomFactor: 'Palielinājums',
            paginated: 'Drukas izkārtojums',
            print: 'Drukāšana',
            search: 'Meklēt',
            matchCase: 'Sērkociņu kārbiņu',
            wholeWord: 'Salīdzināt tikai pilnu vārdu',
            searchResults: 'Meklēšanas rezultāti',
            previousPage: 'Iepriekšējā lapa',
            nextPage: 'Nākamā lapa',
            firstPage: 'Pirmā lapa',
            lastPage: 'Pēdējā lapa',
            backwardHistory: 'Atmuguriski',
            forwardHistory: 'Uz priekšu',
            pageCount: 'Lapu skaits',
            selectTool: 'Atlases rīks',
            moveTool: 'Pārvietošanas rīks',
            continuousMode: 'Nepārtrauktu lapu skats',
            singleMode: 'Vienas lappuses skatu',
            wholePage: 'Ietilpināt visu lappusi',
            pageWidth: 'Atbilstoši lappuses platumam',
            zoomOut: 'Tālināt',
            zoomIn: 'Tuvināt',
            exports: 'Eksportēt',
            fullScreen: 'Pilnekrāna režīms',
            exitFullScreen: 'Iziet no pilnekrāna režīma',
            hamburgerMenu: 'Rīki',
            showSearchBar: 'Rādīt meklēšanas joslu',
            viewMenu: 'Izkārtojuma opcijas',
            searchOptions: 'Meklēšanas opcijas',
            matchCaseMenuItem: 'Saskaņot reģistru',
            wholeWordMenuItem: 'Visu vārdu atbilstība',
            thumbnails: 'Lappušu sīktēlus',
            outlines: 'Dokumenta karte',
            loading: 'Notiek ielāde…',
            pdfExportName: 'Adobe PDF',
            docxExportName: 'Open XML Word',
            xlsxExportName: 'Open XML Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Web arhīvs (MHTML)',
            htmlExportName: 'HTML dokuments',
            rtfExportName: 'RTF dokuments',
            metafileExportName: 'Saspiestu metafaili',
            csvExportName: 'CSV',
            tiffExportName: 'TIFF attēliem',
            bmpExportName: 'BMP attēlus',
            emfExportName: 'Paplašināta metafaila',
            gifExportName: 'GIF attēlus',
            jpgExportName: 'JPEG FORMĀTA attēli',
            jpegExportName: 'JPEG FORMĀTA attēli',
            pngExportName: 'PNG attēlu',
            abstractMethodException: 'Tas ir abstrakts metodi, lūdzu to īstenot.',
            cannotRenderPageNoViewPage: 'Nevar atveidot bez dokumenta avots un skatīt lappusi.',
            cannotRenderPageNoDoc: 'Nevar atveidot bez dokumenta avots un skatīt lappusi.',
            exportFormat: 'Eksportēšanas formāts:',
            exportOptionTitle: 'Eksportēšanas opcijas',
            documentRestrictionsGroup: 'Dokumenta ierobežojumus',
            passwordSecurityGroup: 'Paroles drošība',
            outputRangeGroup: 'Izvades diapazons',
            documentInfoGroup: 'Dokumenta informācijas',
            generalGroup: 'Vispārīgi',
            docInfoTitle: 'Virsraksts',
            docInfoAuthor: 'Autors',
            docInfoManager: 'Pārvaldnieks',
            docInfoOperator: 'Operators',
            docInfoCompany: 'Uzņēmums',
            docInfoSubject: 'Objekts',
            docInfoComment: 'Comment',
            docInfoCreator: 'Izveidojis',
            docInfoProducer: 'producents',
            docInfoCreationTime: 'Izveides laiks',
            docInfoRevisionTime: 'Pārskatīšanas laikā',
            docInfoKeywords: 'Atslēgvārdi',
            embedFonts: 'Iegult TrueType fontus',
            pdfACompatible: 'PDF/A saderīgs (līmenis 2)',
            useCompression: 'Lietot saspiešanu',
            useOutlines: 'Ģenerēt kontūras',
            allowCopyContent: 'Atļaut satura kopēšana vai izgūšana',
            allowEditAnnotations: 'Atļaut rediģēšanu anotācija',
            allowEditContent: 'Atļaut satura rediģēšanu',
            allowPrint: 'Ļauj drukāt',
            ownerPassword: '(Īpašnieka) atļauju paroli:',
            userPassword: 'Dokumentu atvērtu (lietotājs) parole:',
            encryptionType: 'Šifrēšanas līmenis:',
            paged: 'Lapots',
            showNavigator: 'Navigators',
            singleFile: 'Vienā failā',
            tolerance: 'Pielaide, kad atklāšanā teksta robežas (punkti):',
            pictureLayer: 'Izmantot atsevišķu attēlu slāni',
            metafileType: 'Metafile tips:',
            monochrome: 'Vienkrāsains',
            resolution: 'Izšķirtspēja:',
            outputRange: 'Lappušu diapazons:',
            outputRangeInverted: 'Invertētā',
            showZoomBar: 'Tālummaiņas josla',
            searchPrev: 'Meklēt iepriekšējo',
            searchNext: 'Blakus meklēšanas',
            checkMark: '\u2713',
            exportOk: 'Eksportēt…',
            parameters: 'Parametri',
            requiringParameters: 'Lūdzu, vai ievades parametriem.',
            nullParameterError: 'Vērtība nevar būt nulle.',
            invalidParameterError: 'Nederīga ievade.',
            parameterNoneItemsSelected: '(neviens)',
            parameterAllItemsSelected: '(visi)',
            parameterSelectAllItemText: '(Atlasīt visu)',
            selectParameterValue: '(atlasiet vērtību)',
            apply: 'Lietot',
            errorOccured: 'Radās kļūda.'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

