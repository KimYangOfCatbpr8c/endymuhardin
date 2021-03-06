/*
 * Wijmo culture file: es (Spanish)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            name: 'es',
            displayName: 'Spanish',
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
                daysAbbr: ['do.', 'lu.', 'ma.', 'mi.', 'ju.', 'vi.', 'sá.'],
                months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
                monthsAbbr: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['d. C.'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dddd, d" de "MMMM" de "yyyy',
                    f: 'dddd, d" de "MMMM" de "yyyy H:mm', F: 'dddd, d" de "MMMM" de "yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd "de" MMMM', M: 'd "de" MMMM', 
                    y: 'MMMM" de "yyyy', Y: 'MMMM" de "yyyy', 
                    g: 'dd/MM/yyyy H:mm', G: 'dd/MM/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} ítems seleccionados'
        },
        FlexGrid: {
            groupHeaderFormat: '<b>{value} </b>({count:n0} ítems)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Ascendente',
            descending: '\u2193 Descendente',
            apply: 'Aplicar',
            clear: 'Borrar',
            conditions: 'Condiciones',
            values: 'Valores',

            // value filter
            search: 'Filtro',
            selectAll: 'Seleccionar todo',
            null: '(nulo)',

            // condition filter
            header: 'Mostrar ítems donde el valor',
            and: 'Y',
            or: 'O',
            stringOperators: [
                { name: '(ninguno)', op: null },
                { name: 'Es igual a', op: 0 },
                { name: 'No es igual a', op: 1 },
                { name: 'Comienza con', op: 6 },
                { name: 'Termina con', op: 7 },
                { name: 'Contiene', op: 8 },
                { name: 'No contiene', op: 9 }
            ],
            numberOperators: [
                { name: '(ninguno)', op: null },
                { name: 'Es igual a', op: 0 },
                { name: 'No es igual a', op: 1 },
                { name: 'Es mayor que', op: 2 },
                { name: 'Es mayor o igual a', op: 3 },
                { name: 'Es menor que', op: 4 },
                { name: 'Es menor o igual a', op: 5 }
            ],
            dateOperators: [
                { name: '(ninguno)', op: null },
                { name: 'Es igual a', op: 0 },
                { name: 'Es anterior a', op: 4 },
                { name: 'Es posterior a', op: 3 }
            ],
            booleanOperators: [
                { name: '(ninguno)', op: null },
                { name: 'Es igual a', op: 0 },
                { name: 'No es igual a', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'Configuración de los campos:',
                header: 'Encabezado:',
                summary: 'Resúmen:',
                showAs: 'Mostrar como:',
                weighBy: 'Pesar por:',
                sort: 'Ordenar:',
                filter: 'Filtrar:',
                format: 'Formato:',
                sample: 'Mustra:',
                edit: 'Editar...',
                clear: 'Borrar',
                ok: 'Aceptar',
                cancel: 'Cancelar',
                none: '(ninguno)',
                sorts: {
                    asc: 'Ascendente',
                    desc: 'Descendente'
                },
                aggs: {
                    sum: 'Suma',
                    cnt: 'Cantidad',
                    avg: 'Promedio',
                    max: 'Máximo',
                    min: 'Mínimo',
                    rng: 'Rango',
                    std: 'StdDev',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: 'No Calcular',
                    dRow: 'Diferencia con el renglón anterior',
                    dRowPct: '% de diferencia con el renglón anterior',
                    dCol: 'Diferencia con la columna anterior',
                    dColPct: '% de diferencia con la columna anterior'
                },
                formats: {
                    n0: 'Entero (n0)',
                    n2: 'Decimal (n2)',
                    c: 'Moneda (c)',
                    p0: 'Porcentaje (p0)',
                    p2: 'Porcentaje (p2)', 
                    n2c: 'Miles (n2,)',
                    n2cc: 'Millones (n2,,)',
                    n2ccc: 'Billones (n2,,,)',
                    d: 'Fecha (d)',
                    MMMMddyyyy: 'Mes Día Año (MMMM dd, yyyy)',
                    dMyy: 'Día Mes Año (d/M/yy)',
                    ddMyy: 'Día Mes Año (dd/M/yy)',
                    dMyyyy: 'Día Mes Año (dd/M/yyyy)',
                    MMMyyyy: 'Mes Año (MMM yyyy)',
                    MMMMyyyy: 'Mes Año (MMMM yyyy)',
                    yyyyQq: 'Cuatrimestre (yyyy "Q"q)',
                    FYEEEEQU: 'Cuatrimestre fiscal ("FY"EEEE "Q"U)'
                }
            },
            PivotEngine: {
                grandTotal: 'Total general',
                subTotal: 'Subtotal'
            },
            PivotPanel: {
                fields: 'Elegir campos para agregar al reporte',
                drag: 'Arrastrar campos entre las áreas debajo:',
                filters: 'Filtros',
                cols: 'Columnas',
                rows: 'Renglones',
                vals: 'Valores',
                defer: 'Diferir actualizaciones',
                update: 'Actualizar'
            },
            _ListContextMenu: {
                up: 'Mover arriba',
                down: 'Mover abajo',
                first: 'Mover al principio',
                last: 'Mover al final',
                filter: 'Mover al filtro del reporte',
                rows: 'Mover a las etiquetas del renglón',
                cols: 'Mover a las etiquetas de la columna',
                vals: 'Mover a los valores',
                remove: 'Eliminar campo',
                edit: 'Configuración de los campos...',
                detail: 'Mostrar detalles...'
            },
            PivotChart: {
                by: 'por',
                and: 'y'
            },
            DetailDialog: {
                header: 'Detalles:',
                ok: 'Aceptar',
                items: '{cnt:n0} ítems',
                item: '{cnt} ítem',
                row: 'Renglón',
                col: 'Columna'
            }
        }
    };
};