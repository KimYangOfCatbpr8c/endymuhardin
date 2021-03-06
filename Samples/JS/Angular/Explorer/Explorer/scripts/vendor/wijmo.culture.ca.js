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
 * Wijmo culture file: ca (Catalan)
 */
var wijmo;
(function (wijmo) {
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
                    d: 'd/M/yyyy', D: 'dddd, d MMMM" de "yyyy',
                    f: 'dddd, d MMMM" de "yyyy H:mm', F: 'dddd, d MMMM" de "yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM" de "yyyy', Y: 'MMMM" de "yyyy',
                    g: 'dd/MM/yyyy H:mm', G: 'dd/MM/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} articles seleccionats'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} elements)'
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
                dialogHeader: 'Configuració del camp:',
                header: 'Capçal.:',
                summary: 'Resum:',
                showAs: 'Mostra com:',
                weighBy: 'Per un pes:',
                sort: 'Tipus:',
                filter: 'Filtre:',
                format: 'Format de:',
                sample: 'Exemple:',
                edit: 'Edita…',
                clear: 'Esborra',
                ok: 'OK',
                cancel: 'Cancel·la',
                none: '(cap)',
                sorts: {
                    asc: 'Ascendent',
                    desc: 'Descendent'
                },
                aggs: {
                    sum: 'Suma',
                    cnt: 'Recompte',
                    avg: 'Mitjana',
                    max: 'Màxim',
                    min: 'min.',
                    rng: 'Range',
                    std: 'DesvEst',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'Cap càlcul',
                    dRow: 'Diferència de la fila anterior',
                    dRowPct: '% Diferència des de la fila anterior',
                    dCol: 'Diferència de la columna anterior',
                    dColPct: '% Diferència de la columna anterior',
                    dPctGrand: '% del total de gran',
                    dPctRow: '% del total de fila',
                    dPctCol: '% del total de columna',
                    dRunTot: 'Corrent total',
                    dRunTotPct: 'corrent total %'
                },
                formats: {
                    n0: 'Enter (n0)',
                    n2: 'Decimal (n2)',
                    c: 'Moneda (c)',
                    p0: 'Percentatge (p0)',
                    p2: 'Percentatge (p2)',
                    n2c: 'Milers (n2)',
                    n2cc: 'Milions (n2,,)',
                    n2ccc: 'Milers de milions (n2,,,)',
                    d: 'Data (d)',
                    MMMMddyyyy: 'Dia mes any (MMMM dd, yyyy)',
                    dMyy: 'Dia mes any (d/M/yy)',
                    ddMyy: 'Dia mes any (dd/M/yy)',
                    dMyyyy: 'Dia mes any (dd/M/yyyy)',
                    MMMyyyy: 'Mes any (MMM de yyyy)',
                    MMMMyyyy: 'Mes any (MMMM yyyy)',
                    yyyyQq: 'Quart any (yyyy "Q"q)',
                    FYEEEEQU: 'Quart exercici fiscal ("FY"EEEE "Q"U )'
                }
            },
            PivotEngine: {
                grandTotal: 'Total general',
                subTotal: 'Subtotal'
            },
            PivotPanel: {
                fields: 'Trieu els camps que afegiu a informe:',
                drag: 'Arrossega els camps entre les àrees de sota:',
                filters: 'Filtres',
                cols: 'Columnas',
                rows: 'Files',
                vals: 'Valors',
                defer: 'Ajornar les actualitzacions',
                update: 'Actualitza'
            },
            _ListContextMenu: {
                up: 'Amunt',
                down: 'Avall',
                first: 'Al començament',
                last: 'Passar a la final',
                filter: 'Desplaça-ho al filtre de l\'informe',
                rows: 'Desplaça-ho a les etiquetes de fila',
                cols: 'Desplaça-ho a les etiquetes de columna',
                vals: 'Desplaça-ho als valors',
                remove: 'Suprimeix el camp',
                edit: 'Configuració del camp…',
                detail: 'Mostra els detalls…'
            },
            PivotChart: {
                by: 'per',
                and: 'i el'
            },
            DetailDialog: {
                header: 'Vista de detall:',
                ok: 'OK',
                items: 'elements {cnt:n0}',
                item: 'element {cnt}',
                row: 'Fila',
                col: 'Columna'
            }
        },
        Viewer: {
            cancel: 'Cancel·la',
            ok: 'OK',
            bottom: 'Part inferior:',
            top: 'Part superior:',
            right: 'Dret:',
            left: 'Esquerre:',
            margins: 'Marges (polzades)',
            orientation: 'Orientació:',
            paperKind: 'Tipus de document:',
            pageSetup: 'Format de pàgina',
            landscape: 'Horitzontal',
            portrait: 'Vertical',
            pageNumber: 'Número de pàgina',
            zoomFactor: 'Factor d\'augment',
            paginated: 'Disposició de la impressió',
            print: 'Imprimeix',
            search: 'Cerca',
            matchCase: 'Distingeix entre majúscules i minúscules',
            wholeWord: 'Només paraules senceres',
            searchResults: 'Resultats de la cerca',
            previousPage: 'Pàgina anterior',
            nextPage: 'Pàgina següent',
            firstPage: 'Primera pàgina',
            lastPage: 'Última pàgina',
            backwardHistory: 'Enrere',
            forwardHistory: 'Endavant',
            pageCount: 'Recompte de pàgines',
            selectTool: 'Seleccioneu l\'eina',
            moveTool: 'Eina de moviment',
            continuousMode: 'Veure pàgina contínua',
            singleMode: 'Vista de pàgina senzilla',
            wholePage: 'Forma de pàgina sencera',
            pageWidth: 'Ajustar l\'amplada de la pàgina',
            zoomOut: 'Redueix',
            zoomIn: 'Amplia',
            exports: 'Exporta',
            fullScreen: 'Pantalla sencera',
            exitFullScreen: 'Surt de la pantalla sencera',
            hamburgerMenu: 'Eines',
            showSearchBar: 'Mostra la barra de cerca',
            viewMenu: 'Opcions de presentació',
            searchOptions: 'Opcions de cerca',
            matchCaseMenuItem: 'Distingeix entre majúscules i minúscules',
            wholeWordMenuItem: 'Paraula completa',
            thumbnails: 'Miniatures de pàgina',
            outlines: 'Mapa de documents',
            loading: 'Carregant…',
            pdfExportName: 'Adobe PDF',
            docxExportName: 'Paraula XML obert',
            xlsxExportName: 'XML obert excel·lir',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'L\'arxiu web (MHTML)',
            htmlExportName: 'HTML document',
            rtfExportName: 'RTF document',
            metafileExportName: 'Metafiles comprimit',
            csvExportName: 'CSV',
            tiffExportName: 'Imatges TIFF',
            bmpExportName: 'Imatges BMP',
            emfExportName: 'Metafitxer millorat',
            gifExportName: 'Imatges GIF',
            jpgExportName: 'Imatges de JPEG',
            jpegExportName: 'Imatges de JPEG',
            pngExportName: 'Imatges de PNG',
            abstractMethodException: 'Aquest és un mètode abstracte, si us plau implementi això.',
            cannotRenderPageNoViewPage: 'No es pot fer sense font de document i veure pàgina.',
            cannotRenderPageNoDoc: 'No es pot fer sense font de document i veure pàgina.',
            exportFormat: 'Format d\'exportació:',
            exportOptionTitle: 'Opcions d\'exportació',
            documentRestrictionsGroup: 'Restriccions de document',
            passwordSecurityGroup: 'Seguretat de contrasenya',
            outputRangeGroup: 'Gamma de sortida',
            documentInfoGroup: 'Informació del document',
            generalGroup: 'General',
            docInfoTitle: 'Càrrec',
            docInfoAuthor: 'Autor',
            docInfoManager: 'Administrador',
            docInfoOperator: 'Operador',
            docInfoCompany: 'empresa',
            docInfoSubject: 'Tema',
            docInfoComment: 'observació',
            docInfoCreator: 'Autor',
            docInfoProducer: 'Productor',
            docInfoCreationTime: 'Temps de creació',
            docInfoRevisionTime: 'Temps de revisió',
            docInfoKeywords: 'Paraules clau',
            embedFonts: 'Incrusta tipus de lletra TrueType',
            pdfACompatible: 'PDF/A compatible (nivell 2B)',
            useCompression: 'Utilitzen compressió',
            useOutlines: 'Generar esquemes',
            allowCopyContent: 'Permet copiar contingut o extracció',
            allowEditAnnotations: 'Permet l\'edició d\'anotació',
            allowEditContent: 'Permet l\'edició de continguts',
            allowPrint: 'Permeten la impressió',
            ownerPassword: 'Contrasenya permisos (propietari):',
            userPassword: 'Contrasenya oberta (usuari) document:',
            encryptionType: 'Nivell de xifrat:',
            paged: 'Paginada',
            showNavigator: 'Mostra el navegador',
            singleFile: 'Filera',
            tolerance: 'Tolerància quan detecta límits de text (punts):',
            pictureLayer: 'Capa de foto independent d\'ús',
            metafileType: 'Metafitxer del tipus:',
            monochrome: 'Monocrom',
            resolution: 'Resolució:',
            outputRange: 'Rang de pàgina:',
            outputRangeInverted: 'Invertida',
            showZoomBar: 'Bar de zoom',
            searchPrev: 'Cerca anterior',
            searchNext: 'Cerca següent',
            checkMark: '\u2713',
            exportOk: 'Exporta…',
            parameters: 'Paràmetres',
            requiringParameters: 'Si us plau, d\'entrada paràmetres.',
            nullParameterError: 'El valor no pot ser nul.',
            invalidParameterError: 'Entrada no vàlida.',
            parameterNoneItemsSelected: '(cap)',
            parameterAllItemsSelected: '(tots)',
            parameterSelectAllItemText: '(Seleccioneu-ho tot)',
            selectParameterValue: '(Seleccioneu el valor)',
            apply: 'Aplica',
            errorOccured: 'S\'ha produït un error.'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

