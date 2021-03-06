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
 * Wijmo culture file: sk (Slovak)
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'sk',
            displayName: 'Slovak',
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'],
                daysAbbr: ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so'],
                months: ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'],
                monthsAbbr: ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['po Kr.'],
                patterns: {
                    d: 'd.M.yyyy', D: 'dddd, d. MMMM yyyy',
                    f: 'dddd, d. MMMM yyyy H:mm', F: 'dddd, d. MMMM yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'd.M.yyyy H:mm', G: 'd.M.yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} položiek vybraného'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} položky)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Vzostupne',
            descending: '\u2193 Zostupne',
            apply: 'Použiť',
            clear: 'Vymazať',
            conditions: 'Filtrovať podľa podmienky',
            values: 'Filtrovať podľa hodnoty',
            // value filter
            search: 'Hľadať',
            selectAll: 'Vybrať všetko',
            null: '(nič)',
            // condition filter
            header: 'Zobraziť položky, kde hodnota',
            and: 'A',
            or: 'alebo',
            stringOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Nerovná sa', op: 1 },
                { name: 'Začína na', op: 6 },
                { name: 'Končí na', op: 7 },
                { name: 'Obsahuje', op: 8 },
                { name: 'Neobsahuje', op: 9 }
            ],
            numberOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Nerovná sa', op: 1 },
                { name: 'Je väčšia ako', op: 2 },
                { name: 'Je väčšie alebo rovné', op: 3 },
                { name: 'Je menej ako', op: 4 },
                { name: 'Je menšia alebo rovná', op: 5 }
            ],
            dateOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'je pred', op: 4 },
                { name: 'je za', op: 3 }
            ],
            booleanOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Nerovná sa', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'Nastavenie poľa:',
                header: 'Záhlavie:',
                summary: 'Súhrnné informácie:',
                showAs: 'Zobraziť ako:',
                weighBy: 'Odvážte do:',
                sort: 'Zoradiť:',
                filter: 'Filter:',
                format: 'Formátovanie:',
                sample: 'Vzorka:',
                edit: 'Upraviť…',
                clear: 'Vymazať',
                ok: 'OK',
                cancel: 'Zrušiť',
                none: '(žiadny)',
                sorts: {
                    asc: 'Vzostupne',
                    desc: 'Zostupne'
                },
                aggs: {
                    sum: 'Súčet',
                    cnt: 'Počet',
                    avg: 'Priemer',
                    max: 'Max.',
                    min: 'Min.',
                    rng: 'Rozsah',
                    std: 'Odhad smerodajnej odchýlky',
                    var: 'VAR',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'Bez výpočtu',
                    dRow: 'Rozdiel od predchádzajúceho riadka',
                    dRowPct: '% Rozdiel z predchádzajúceho riadka',
                    dCol: 'Rozdiel od predchádzajúceho stĺpca',
                    dColPct: '% Rozdiel od predchádzajúceho stĺpca',
                    dPctGrand: '% celkového súčtu',
                    dPctRow: '% riadka celkom',
                    dPctCol: '% stĺpca celkového',
                    dRunTot: 'Celkom beží',
                    dRunTotPct: '% beží celkovú'
                },
                formats: {
                    n0: 'Celé číslo (n0)',
                    n2: 'Float (n2)',
                    c: 'Meny (c)',
                    p0: 'Percento (p0)',
                    p2: 'Percento (p2)',
                    n2c: 'Tisíc (n2)',
                    n2cc: 'Milióny (n2,,)',
                    n2ccc: 'Miliardy (n2,,,)',
                    d: 'Dátum (d)',
                    MMMMddyyyy: 'Mesiac deň rok (MMMM dd rrrr)',
                    dMyy: 'Deň mesiac rok (d/M/RR)',
                    ddMyy: 'Deň mesiac rok (M/dd/RR)',
                    dMyyyy: 'Deň mesiac rok (dd/M/rrrr)',
                    MMMyyyy: 'Mesiac rok (MMM yyyy)',
                    MMMMyyyy: 'Mesiac rok (MMMM rrrr)',
                    yyyyQq: 'Štvrť rok (yyyy "Q" q)',
                    FYEEEEQU: 'Štvrťrok fiškálneho roka (ďalej len "fr" EEEE "Q" U)'
                }
            },
            PivotEngine: {
                grandTotal: 'Celkový súčet',
                subTotal: 'Medzisúčet'
            },
            PivotPanel: {
                fields: 'Vyberte polia, ktoré chcete pridať k správe:',
                drag: 'Presuňte polia medzi nižšie uvedenými oblasťami:',
                filters: 'Filtre',
                cols: 'Stĺpce',
                rows: 'Riadky',
                vals: 'Hodnoty',
                defer: 'Odložiť aktualizácie',
                update: 'Aktualizovať'
            },
            _ListContextMenu: {
                up: 'Posunúť nahor',
                down: 'Posunúť nadol',
                first: 'Premiestniť na začiatok',
                last: 'Premiestniť na koniec',
                filter: 'Presunúť do filtra zostavy',
                rows: 'Presunúť do menoviek riadka',
                cols: 'Presunúť do menoviek stĺpca',
                vals: 'Presunúť do hodnôt',
                remove: 'Odstrániť pole',
                edit: 'Nastavenie poľa…',
                detail: 'Zobraziť Detail…'
            },
            PivotChart: {
                by: 'podľa',
                and: 'a'
            },
            DetailDialog: {
                header: 'Zobrazenie podrobností:',
                ok: 'OK',
                items: 'položky {cnt:n0}',
                item: '{cnt} položka',
                row: 'Riadok',
                col: 'Stĺpec'
            }
        },
        Viewer: {
            cancel: 'Zrušiť',
            ok: 'OK',
            bottom: 'Dno:',
            top: 'Horný:',
            right: 'Právo:',
            left: 'Vľavo:',
            margins: 'Okraje (")',
            orientation: 'Orientácia:',
            paperKind: 'Typ papiera:',
            pageSetup: 'Strana - nastavenie',
            landscape: 'Na šírku',
            portrait: 'Na výšku',
            pageNumber: 'Číslo strany',
            zoomFactor: 'Voľbu faktora zväčšenia',
            paginated: 'Rozloženie pri tlači',
            print: 'Tlač',
            search: 'Hľadať',
            matchCase: 'Rozlišovať malé/veľké',
            wholeWord: 'Iba celé slová',
            searchResults: 'Výsledky hľadania',
            previousPage: 'Predchádzajúca strana',
            nextPage: 'Ďalšia strana',
            firstPage: 'Prvá strana',
            lastPage: 'Posledná strana',
            backwardHistory: 'Spätne',
            forwardHistory: 'Dopredu',
            pageCount: 'Počet strán',
            selectTool: 'Vyberte nástroj',
            moveTool: 'Nástroj presun',
            continuousMode: 'Nepretržité zobrazenie stránky',
            singleMode: 'Jedna strana',
            wholePage: 'Fit celú stránku',
            pageWidth: 'Prispôsobiť šírke strany',
            zoomOut: 'Vzdialiť',
            zoomIn: 'Priblížiť',
            exports: 'Exportovať',
            fullScreen: 'Celá obrazovka',
            exitFullScreen: 'Skončiť režim celej obrazovky',
            hamburgerMenu: 'Nástroje',
            showSearchBar: 'Zobraziť panel vyhľadávania',
            viewMenu: 'Možnosti rozloženia',
            searchOptions: 'Možnosti hľadania',
            matchCaseMenuItem: 'Rozlišovať malé a VEĽKÉ písmená',
            wholeWordMenuItem: 'Celé slová',
            thumbnails: 'Miniatúry strán',
            outlines: 'Štruktúra dokumentu',
            loading: 'Prebieha načítavanie…',
            pdfExportName: 'Adobe PDF',
            docxExportName: 'Word Open XML',
            xlsxExportName: 'Open XML programu Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Webový Archív (MHTML)',
            htmlExportName: 'Dokument vo formáte HTML',
            rtfExportName: 'Dokument vo formáte RTF',
            metafileExportName: 'Komprimované metasúbory',
            csvExportName: 'CSV',
            tiffExportName: 'Obrázky TIFF',
            bmpExportName: 'BMP obrázkov',
            emfExportName: 'Rozšírený metasúbor',
            gifExportName: 'Obrázky vo formáte GIF',
            jpgExportName: 'Obrázky vo formáte JPEG',
            jpegExportName: 'Obrázky vo formáte JPEG',
            pngExportName: 'PNG obrázky',
            abstractMethodException: 'Toto je abstraktná metóda, prosím implementovať.',
            cannotRenderPageNoViewPage: 'Nemôže vykresliť stránku bez zdrojového dokumentu a zobraziť stránku.',
            cannotRenderPageNoDoc: 'Nemôže vykresliť stránku bez zdrojového dokumentu a zobraziť stránku.',
            exportFormat: 'Formát pre exportovanie:',
            exportOptionTitle: 'Export – možnosti',
            documentRestrictionsGroup: 'Dokument obmedzenia',
            passwordSecurityGroup: 'Zabezpečenie hesla',
            outputRangeGroup: 'Výstupný rozsah',
            documentInfoGroup: 'Informácie o dokumente',
            generalGroup: 'Všeobecné',
            docInfoTitle: 'Názov',
            docInfoAuthor: 'Autor',
            docInfoManager: 'Vedúci pracovník',
            docInfoOperator: 'Prevádzkovateľ',
            docInfoCompany: 'Spoločnosť',
            docInfoSubject: 'Držiteľ',
            docInfoComment: 'Komentovať',
            docInfoCreator: 'Vytvoril',
            docInfoProducer: 'Producent',
            docInfoCreationTime: 'Čas vytvorenia',
            docInfoRevisionTime: 'Revízie čas',
            docInfoKeywords: 'Kľúčové slová',
            embedFonts: 'Vložiť písma TrueType',
            pdfACompatible: 'Kompatibilné s PDF/A (úrovne 2B)',
            useCompression: 'Použiť kompresiu',
            useOutlines: 'Vytvorenie obrysy',
            allowCopyContent: 'Povoliť obsah kopírovanie alebo extrakcia',
            allowEditAnnotations: 'Povoliť úpravy komentára',
            allowEditContent: 'Povoliť úpravy obsahu',
            allowPrint: 'Povoliť tlač',
            ownerPassword: 'Heslo pre povolenia (majiteľ):',
            userPassword: 'Dokument otvoriť (užívateľ) heslo:',
            encryptionType: 'Úroveň šifrovania:',
            paged: 'Stránkovaná',
            showNavigator: 'Zobraziť navigátor',
            singleFile: 'Jeden súbor',
            tolerance: 'Tolerancie pri detekcii text hranice (bodov):',
            pictureLayer: 'Použitie samostatný obrázok layer',
            metafileType: 'Typu metasúbor:',
            monochrome: 'Čiernobielo',
            resolution: 'Rozlíšenie:',
            outputRange: 'Rozsah strán:',
            outputRangeInverted: 'Obrátený',
            showZoomBar: 'Lišta priblíženia/oddialenia',
            searchPrev: 'Hľadať predchádzajúce',
            searchNext: 'Hľadať ďalej',
            checkMark: '\u2713',
            exportOk: 'Exportovať…',
            parameters: 'Parametre',
            requiringParameters: 'Prosím udajte parametre.',
            nullParameterError: 'Hodnota nemôže mať hodnotu null.',
            invalidParameterError: 'Neplatný vstup.',
            parameterNoneItemsSelected: '(žiadny)',
            parameterAllItemsSelected: '(všetky)',
            parameterSelectAllItemText: '(Vybrať všetko)',
            selectParameterValue: '(vyberte hodnotu)',
            apply: 'Použiť',
            errorOccured: 'Vyskytla sa chyba.'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

