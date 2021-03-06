/*
    *
    * Wijmo Library 5.20142.6
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    * 
    * Licensed under the Wijmo Commercial License. 
    * sales@wijmo.com
    * http://wijmo.com/widgets/license/
    *
    */
/*
* Wijmo culture file: pt (Portuguese)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: 'R$', pattern: ['-$ n', '$ n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 0,
                days: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
                daysAbbr: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
                months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
                monthsAbbr: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['d.C.'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dddd, d" de "MMMM" de "yyyy',
                    f: 'dddd, d" de "MMMM" de "yyyy HH:mm', F: 'dddd, d" de "MMMM" de "yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd" de "MMMM', M: 'd" de "MMMM',
                    y: 'MMMM" de "yyyy', Y: 'MMMM" de "yyyy',
                    g: 'dd/MM/yyyy HH:mm', G: 'dd/MM/yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count} itens)'
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.pt.js.map

