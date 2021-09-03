module wijmo {
    'use strict';

    /**
     * Gets or sets an object that contains all localizable strings in the Wijmo library.
     *
     * The culture selector is a two-letter string that represents an 
     * <a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'>ISO 639 culture</a>. 
     */
    export var culture: any = {
        Globalize: {
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '$', pattern: ['($n)', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 0,
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                daysAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthsAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['A.D.', 'B.C.'],
                patterns: {
                    d: 'M/d/yyyy', D: 'dddd, MMMM dd, yyyy',
                    f: 'dddd, MMMM dd, yyyy h:mm tt', F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
                    t: 'h:mm tt', T: 'h:mm:ss tt',
                    M: 'MMMM d', m: 'MMMM d',
                    Y: 'MMMM, yyyy', y: 'MMMM, yyyy',
                    g: 'M/d/yyyy h:mm tt', G: 'M/d/yyyy h:mm:ss tt',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss',
                    o: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss"."fffffffK',
                    O: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss"."fffffffK',
                    U: 'dddd, MMMM dd, yyyy h:mm:ss tt'
                },
                fiscalYearOffsets: [-3, -3]
            }
        }
    };

    /**
     * Class that implements formatting and parsing of numbers and Dates.
     *
     * By default, @see:Globalize uses the American English culture.
     * To switch cultures, include the appropriate <b>wijmo.culture.*.js</b> 
     * file after the wijmo files.
     */
    export class Globalize {

        /**
         * Formats a number or a date.
         *
         * The format strings used with the @see:format function are similar to 
         * the ones used by <b>Globalize.js</b> and by the .NET Globalization
         * library. The tables below contains links that describe the formats
         * available:
         *
         * <ul>
         * <li><a href="http://msdn.microsoft.com/en-us/library/dwhawy9k(v=vs.110).aspx">
         *      Standard Numeric Format Strings</a></li>
         * <li><a href="http://msdn.microsoft.com/en-us/library/az4se3k1(v=vs.110).aspx">
         *      Standard Date and Time Format Strings</a></li>
         * <li><a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx">
         *      Custom Date and Time Format Strings</a></li>
         * </ul>
         *
         * @param value Number or Date to format (all other types are converted to strings).
         * @param format Format string to use when formatting numbers or dates.
         * @param trim Whether to remove trailing zeros from numeric results.
         * @param truncate Whether to truncate the numeric values rather than round them.
         * @return A string representation of the given value.
         */
        static format(value: any, format: string, trim?: boolean, truncate?: boolean): string {

            // format numbers and dates, convert others to string
            if (isString(value)) {
                return value;
            } else if (isNumber(value)) {
                format = format || (value == Math.round(value) ? 'n0' : 'n2'); 
                return Globalize.formatNumber(value, format, trim, truncate);
            } else if (isDate(value)) {
                format = format || 'd';
                return Globalize.formatDate(value, format);
            } else {
                return value != null ? value.toString() : '';
            }
        }
        /**
         * Formats a number using the current culture.
         *
         * The @see:formatNumber method accepts most .NET-style 
         * <a href="http://msdn.microsoft.com/en-us/library/dwhawy9k(v=vs.110).aspx">
         * Standard Numeric Format Strings</a>, except for the 'e' and 'x' formats
         * (scientific notation and hexadecimal) which are not supported.
         *
         * Numeric format strings takes the form <i>Axxccss</i>, where:
         * <ul>
         * <li>
         *  <i>A</i> is a single case-insensitive alphabetic character called the 
         *  format specifier.</li>
         * <li>
         *  <i>xx</i> is an optional integer called the precision specifier. 
         *  The precision specifier affects the number of digits in the result.</li>
         * <li>
         *  <i>cc</i> is an optional string used to override the currency symbol 
         *  when formatting currency values. This is useful when formatting 
         *  currency values for cultures different than the current default 
         *  (for example, when formatting Euro or Yen values in applications
         *  that use the English culture).</li>
         * <li>
         *  <i>ss</i> is an optional string used to scale the number. If provided,
         *  it must consist of commas. The number is divided by 1000 for each comma 
         *  specified.</li>
         * </ul>
         *
         * The following table describes the standard numeric format specifiers and 
         * displays sample output produced by each format specifier for the default
         * culture.
         *
         * <b>n</b> Number: <code>formatNumber(1234.5, 'n2') => '1,234.50'</code><br/>
         * <b>f</b> Fixed-point: <code>formatNumber(1234.5, 'f2') => '1234.50'</code><br/>
         * <b>g</b> General (no trailing zeros): <code>formatNumber(1234.5, 'g2') => '1234.5'</code><br/>
         * <b>d</b> Decimal (integers): <code>formatNumber(-1234, 'd6') => '-001234'</code><br/>
         * <b>x</b> Hexadecimal (integers): <code>formatNumber(1234, 'x6') => '0004d2'</code><br/>
         * <b>c</b> Currency: <code>formatNumber(1234, 'c') => '$ 1,234.00'</code><br/>
         * <b>p</b> Percent: <code>formatNumber(0.1234, 'p2') => '12.34 %'</code>
         *
         * The scaling specifier is especially useful when charting large values. For 
         * example, the markup below creates a chart that plots population versus GDP.
         * The raw data expresses the population is units and the GDP in millions.
         * The scaling specified in the axes formats causes the chart to show population
         * in millions and GDP in trillions:
         *
         * <pre>&lt;wj-flex-chart
         *   items-source="countriesGDP" binding-x="pop" chart-type="Scatter"&gt;
         *   &lt;wj-flex-chart-series
         *     name="GDP" binding="gdp"&gt;&lt;/wj-flex-chart-series&gt;
         *   &lt;wj-flex-chart-axis
         *     wj-property="axisX" title="Population (millions)" 
         *     format="n0,,"&gt;
         *   &lt;/wj-flex-chart-axis&gt;
         *   &lt;wj-flex-chart-axis
         *     wj-property="axisY" title="GDP (US$ trillions)"
         *     format="c0,,"&gt;
         *   &lt;/wj-flex-chart-axis&gt;
         * &lt;/wj-flex-chart&gt;</pre>
         *
         * @param value Number to format.
         * @param format .NET-style standard numeric format string (e.g. 'n2', 'c4', 'p0', 'g2', 'd2').
         * @param trim Whether to remove trailing zeros from the result.
         * @param truncate Whether to truncate the value rather than round it.
         * @return A string representation of the given number.
         */
        static formatNumber(value: number, format: string, trim?: boolean, truncate?: boolean): string {
            asNumber(value);
            asString(format);

            var result,
                m = format ? format.match(/([a-z])(\d*)(,*)(.*)/i) : null,
                nf = culture.Globalize.numberFormat,
                f1 = m ? m[1].toLowerCase() : 'n',
                prec = (m && m[2]) ? parseInt(m[2]) : (f1 == 'c') ? nf.currency.decimals : value == Math.round(value) ? 0 : 2,
                scale = (m && m[3]) ? 3 * m[3].length : 0,
                curr = (m && m[4]) ? m[4] : nf.currency.symbol,
                dp = nf['.'],
                ts = nf[','];

            // scale (,:thousands ,,:millions ,,,:billions)
            if (scale) {
                value /= Math.pow(10, scale);
            }

            // d, x: integers/hexadecimal
            if (f1 == 'd' || f1 == 'x') {
                result = Math.round(Math.abs(value)).toString(f1 == 'd' ? 10 : 16);
                while (result.length < prec) {
                    result = '0' + result;
                }
                if (value < 0) {
                    result = '-' + result;
                }
                if (format && format[0] == 'X') {
                    result = result.toUpperCase();
                }
                return result;
            }

            // p: percentage
            if (f1 == 'p') {
                value = Globalize._mul100(value); // TFS 210383
                //value = toFixed(value * 100, prec, truncate); // TFS 147585
            }

            // truncate value
            if (truncate) {
                value = toFixed(value, prec, true);
            }

            // get result
            result = (f1 == 'c' || f1 == 'p')
                ? Math.abs(value).toFixed(prec)
                : value.toFixed(prec);

            // g: remove trailing zeros
            if ((trim || f1 == 'g') && result.indexOf('.') > -1) {
                result = result.replace(/(\.[0-9]*?)0+$/g, '$1');
                result = result.replace(/\.$/, '');
            }

            // replace decimal point
            if (dp != '.') {
                result = result.replace('.', dp);
            }

            // n, c, p: thousand separators
            if (ts && (f1 == 'n' || f1 == 'c' || f1 == 'p')) {
                var idx = result.indexOf(dp),
                    rx = /\B(?=(\d\d\d)+(?!\d))/g;
                result = idx > -1 ? result.substr(0, idx).replace(rx, ts) + result.substr(idx) : result.replace(rx, ts);
            }

            // c: currency pattern
            if (f1 == 'c') {
                var pat = nf.currency.pattern[value < 0 ? 0 : 1];
                result = pat.replace('n', result).replace('$', curr);
            }

            // p: percentage pattern
            if (f1 == 'p') {
                var pat = nf.percent.pattern[value < 0 ? 0 : 1];
                result = pat.replace('n', result);
            }

            // done
            return result;
        }
        /**
         * Formats a date using the current culture.
         *
         * The @see:format parameter contains a .NET-style 
         * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx">Date format string</a>
         * with the following additions:
         * <ul>
         *  <li><i>Q, q</i> Calendar quarter.</li>
         *  <li><i>U</i> Fiscal quarter (government).</li>
         *  <li><i>u</i> Fiscal quarter (private sector).</li>
         *  <li><i>EEEE, EEE, EE, E</i> Fiscal year (government).</li>
         *  <li><i>eeee, eee, ee, e</i> Fiscal year (private sector).</li>
         * </ul>
         *
         * For example:
         *
         * <pre>
         * var d = new Date(2015, 9, 1); // Oct 1, 2015
         * console.log(wijmo.Globalize.format(d, '"FY"EEEE"Q"U') + ' (US culture)');
         * &gt; FY2016Q1 (US culture)
         * </pre>
         *
         * @param value Number or Date to format.
         * @param format .NET-style Date format string.
         * @return A string representation of the given date.
         */
        static formatDate(value: Date, format: string): string {
            value = asDate(value);

            // culture-invariant formats
            switch (format) {
                case 'r':
                case 'R':
                    return value.toUTCString();
                case 'u':
                    return value.toISOString().replace(/\.\d{3}/, '');
            }

            // expand pre-defined formats
            format = Globalize._expandFormat(format);

            // parse the format string and build return value
            var parts = Globalize._parseDateFormat(format),
                str = '';
            for (var i = 0; i < parts.length; i++) {
                str += Globalize._formatDatePart(value, format, parts[i]);
            }

            // all done
            return str;
        }
        /**
         * Parses a string into an integer.
         *
         * @param value String to convert to an integer.
         * @param format Format to use when parsing the number.
         * @return The integer represented by the given string, 
         * or <b>NaN</b> if the string cannot be parsed into an integer.
         */
        static parseInt(value: string, format?: string): number {
            return Math.round(Globalize.parseFloat(value, format));
        }
        /**
         * Parses a string into a floating point number.
         *
         * @param value String to convert to a number.
         * @param format Format to use when parsing the number.
         * @return The floating point number represented by the given string, 
         * or <b>NaN</b> if the string cannot be parsed into a floating point number.
         */
        static parseFloat(value: string, format?: string): number {
            var neg = value.indexOf('-') > -1 || (value.indexOf('(') > -1 && value.indexOf(')') > -1) ? -1 : +1,
                pct = value.indexOf('%') > -1 ? .01 : 1,
                m = format ? format.match(/,+/) : null,
                scale = m ? m[0].length * 3 : 0;

            // hex
            if (format && (format[0] == 'x' || format[0] == 'X')) {
                value = value.replace(/[^0-9a-f]+.*$/gi, ''); // truncate at first invalid char
                return parseInt(value, 16) * neg * pct * Math.pow(10, scale);
            }

            // decimal
            var dp = culture.Globalize.numberFormat['.'],
                rx = new RegExp('[^\\d\\' + dp + ']', 'g'),
                val = value.replace(rx, '').replace(dp, '.'); // remove non-digits, replace decimal point
            return parseFloat(val) * neg * pct * Math.pow(10, scale);
        }
        /**
         * Parses a string into a Date.
         *
         * @param value String to convert to a Date.
         * @param format Format string used to parse the date.
         * @return The date represented by the given string, or null if the string
         * cannot be parsed into a Date.
         */
        static parseDate(value: string, format: string): Date {

            // make sure we have a value
            value = asString(value);
            if (!value) {
                return null;
            }

            // culture-invariant formats
            if (format == 'u') {
                return new Date(value);
            }

            // parse using RFC 3339 pattern ([yyyy-MM-dd] [hh:mm[:ss]])
            var d: Date;
            if (format == 'R' || format == 'r') {
                var rx = /(([0-9]+)\-([0-9]+)\-([0-9]+))?\s?(([0-9]+):([0-9]+)(:([0-9]+))?)?/,
                    match = value.match(rx);
                if (match[1] || match[5]) {
                    var d = match[1] // parse date
                        ? new Date(parseInt(match[2]), parseInt(match[3]) - 1, parseInt(match[4]))
                        : new Date();
                    if (match[5]) { // parse time
                        d.setHours(parseInt(match[6]));
                        d.setMinutes(parseInt(match[7]));
                        d.setSeconds(match[8] ? parseInt(match[9]) : 0);
                    }
                } else {
                    d = new Date(value);
                }
                return !isNaN(d.getTime()) ? d : null;
            }

            // expand the format
            format = Globalize._expandFormat(format ? format : 'd');

            // get format parts and data parts
            //
            // cjk: chars, http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
            // rxf: format (no dots in strings: 'mm.dd.yyyy' => ['mm', 'dd', 'yyyy']).
            // rxv: value (dots OK in strings: 'A.D' => 'A.D', but not by themselves)
            var cal = culture.Globalize.calendar,
                cjk = Globalize._CJK,
                rxv = new RegExp(
                    '(\\' + cal['/'] + ')|(\\' + cal[':'] + ')|' + // date/time separators
                    '(\\d+)|' + // digits
                    '([' + cjk + '\\.]{2,})|' + // strings with dots
                    '([' + cjk + ']+)', // strings with no dots
                    'gi'),
                vparts = value.match(rxv),
                fparts = Globalize._parseDateFormat(format), offset = 0,
                year = -1, month = 0, day = 1, hour = 0, min = 0, tzm = 0, sec = 0, ms = 0, era = -1,
                hasDayName, hasDay, hasQuarter, hasMonth, fiscalFmt;

            // basic validation (TFS 81465, 128359)
            if (!vparts || !vparts.length || !fparts || !fparts.length) {
                return null;
            }

            // parse each element
            for (var i = 0; i < fparts.length && vparts; i++) {
                var vpi = i - offset,
                    pval = (vpi > -1 && vpi < vparts.length) ? vparts[vpi] : '',
                    plen = fparts[i].length;
                switch (fparts[i]) {

                    // ** year
                    case 'EEEE': case 'EEE': case 'EE': case 'E': // fiscal (govt)
                    case 'eeee': case 'eee': case 'ee': case 'e': // fiscal (corp)
                        fiscalFmt = fparts[i];
                        // ** fall through **
                    case 'yyyy': case 'yyy': case 'yy': case 'y': // calendar
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        year = parseInt(pval);
                        break;

                    // ** month
                    case 'MMMM': case 'MMM':
                        hasMonth = true;
                        var monthName = pval.toLowerCase();
                        month = -1;
                        for (var j = 0; j < 12; j++) {
                            if (cal.months[j].toLowerCase().indexOf(monthName) == 0) {
                                month = j;
                                break;
                            }
                        }
                        if (month > -1) {
                            break;
                        }
                        // FALL THROUGH: 
                        // and try parsing month as a number
                        // so users can type "1/2" instead of "1/February"
                    case 'MM': case 'M':
                        hasMonth = true;
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        month = parseInt(pval) - 1;
                        break;

                    // ** day
                    case 'dddd':
                    case 'ddd':
                        hasDayName = true;
                        break; // skip day names
                    case 'dd': case 'd':
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        day = parseInt(pval);
                        hasDay = true;
                        break;

                    // ** hour
                    case 'hh': case 'h':
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        hour = parseInt(pval);
                        hour = hour == 12 ? 0 : hour; // 0-12, 12 == midnight
                        break;
                    case 'HH':
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        hour = parseInt(pval); // 0-24
                        break;
                    case 'H':
                        hour = parseInt(pval); // 0-24
                        break;

                    // ** minute
                    case 'mm': case 'm':
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        min = parseInt(pval);
                        break;

                    // ** second
                    case 'ss': case 's':
                        if (plen > 1 && pval.length > plen) {
                            vparts[vpi] = pval.substr(plen);
                            pval = pval.substr(0, plen);
                            offset++;
                        }
                        sec = parseInt(pval);
                        break;

                    // ** millisecond
                    case 'fffffff': case 'FFFFFFF':
                    case 'ffffff': case 'FFFFFF':
                    case 'fffff': case 'FFFFF':
                    case 'ffff': case 'FFFF':
                    case 'fff': case 'FFF':
                    case 'ff': case 'FF':
                    case 'f': case 'F':
                        ms = parseInt(pval) / Math.pow(10, plen - 3);
                        break;

                    // ** am/pm
                    case 'tt': case 't':
                        pval = pval.toUpperCase();
                        if ((cal.pm[0] && pval == cal.pm[0] && hour < 12) ||
                            (cal.pm[1] && pval == cal.pm[1] && hour < 12)) {
                            hour += 12;
                        }
                        break;

                    // ** quarter
                    case 'q': case 'Q': case 'u': case 'U':
                        hasQuarter = true;
                        break;

                    // ** era
                    case 'ggg': case 'gg': case 'g':
                        era = cal.eras.length > 1 ? Globalize._getEra(pval, cal) : -1;
                        break;

                    // ** localized separators (TFS 131320)
                    case cal['/']:
                    case cal[':']:
                        if (pval && pval != fparts[i]) {
                            return null; // present and wrong separator
                        }
                        break;

                    // ** time zone (skip )
                    case 'K':
                        break;

                    // ** all else: if not a match, keep using the same pval
                    default:
                        if (Globalize._unquote(fparts[i]) != pval) {
                            offset++;
                        }
                        break;
                }
            }

            // allow dates with no times even if the format requires times
            if (hasMonth && hasDay) {
                if (isNaN(hour)) hour = 0;
                if (isNaN(min)) min = 0;
                if (isNaN(sec)) sec = 0;
            }

            // basic validation
            if (month < 0 || month > 11 || isNaN(month) ||
                day < 0 || day > 31 || isNaN(day) ||
                hour < 0 || hour > 24 || isNaN(hour) ||
                min < 0 || min > 60 || isNaN(min) ||
                sec < 0 || sec > 60 || isNaN(sec)) {
                return null;
            }

            // convert fiscal year/month to calendar
            if (fiscalFmt) {
                if (!hasMonth) { // need year and month to convert fiscal to calendar
                    return null;
                }
                d = new Date(year, month);
                d = DateTime.fromFiscal(d, fiscalFmt[0] == 'E');
                year = d.getFullYear();
                month = d.getMonth();
            }

            // if the day name was specified but the day wasn't, the result is meaningless
            if (hasDayName && !hasDay) {
                return null;
            }

            // if the quarter was specified but the month wasn't, the result is meaningless
            if (hasQuarter && !hasMonth) {
                return null;
            }

            // if year not found, use current (as Globalize.js)
            if (year < 0) {
                year = new Date().getFullYear();
            }

            // apply era offset if any, or adjust for two-digit years (see Calendar.TwoDigitYearMax)
            if (era > -1) {
                year = year + cal.eras[era].start.getFullYear() - 1;
            } else if (year < 100) {
                year += year >= 30 ? 1900 : 2000;
            }

            // return result
            d = new Date(year, month, day, hour, min + tzm, sec, ms);
            return isNaN(d.getTime()) ? null : d;
        }

        // Chinese/Japanese/Korean characters
        // http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
        // http://www.programminginkorean.com/programming/hangul-in-unicode/
        // NOTE: using 'replace' to keep minifier from switching the escaped Unicode chars into real Unicode.
        // NOTE: will have to expand for other cultures? (Arabic/Hebrew/Hindi etc?)
        static _CJK = 'a-z' +
                      'u00c0-u017fu3000-u30ffu4e00-u9faf'.replace(/u/g, '\\u') + // cj
                      'u1100-u11ffu3130-u318fua960-ua97fuac00-ud7afud7b0-ud7ff'.replace(/u/g, '\\u'); // k

        /**
         * Gets the first day of the week according to the current culture.
         *
         * The value returned is between zero (Sunday) and six (Saturday).
         */
        static getFirstDayOfWeek(): number {
            var fdw = culture.Globalize.calendar.firstDay;
            return fdw ? fdw : 0;
        }
        /**
         * Gets the symbol used as a decimal separator in numbers.
         */
        static getNumberDecimalSeparator(): string {
            var ndc = culture.Globalize.numberFormat['.'];
            return ndc ? ndc : '.';
        }

        // ** implementation

        // unquotes a string
        private static _unquote(s: string): string {
            if (s.length > 1 && s[0] == s[s.length - 1]) {
                if (s[0] == '\'' || s[0] == '\"') {
                    return s.substr(1, s.length - 2);
                }
            }
            return s;
        }

        // parse a date format string into its parts
        private static _dateFomatParts = {};
        private static _parseDateFormat(format: string): string[] {

            // use cache whenever possible
            if (format in Globalize._dateFomatParts) {
                return Globalize._dateFomatParts[format];
            }

            // parse the format
            var parts = [],
                str = '',
                start, end;
            for (start = 0; start > -1 && start < format.length; start++) {
                var c = format[start];
                if (c == '\'' || c == '"') { // handle quoted parts
                    end = format.indexOf(c, start + 1); // keep quotes to distinguish from regular date parts
                    if (end > -1) {
                        parts.push(format.substring(start, end + 1));
                        start = end;
                        continue;
                    }
                }
                end = start + 1;
                for (; end < format.length; end++) {
                    if (format[end] != c) break;
                }
                parts.push(format.substring(start, end));
                start = end - 1;
            }

            // cache and return
            Globalize._dateFomatParts[format] = parts;
            return parts;
        }

        // format a date part into a string
        private static _formatDatePart(d: Date, format: string, part: string): string {
            var cal = culture.Globalize.calendar,
                era = 0, year = 0, ff = 0, fd,
                plen = part.length;
            switch (part) {

                // ** year
                case 'yyyy': case 'yyy': case 'yy': case 'y': // calendar year
                case 'EEEE': case 'EEE': case 'EE': case 'E': // fiscal year (govt)
                case 'eeee': case 'eee': case 'ee': case 'e': // fiscal year (corporate)

                    // get the year (calendar or fiscal)
                    fd = part[0] == 'E' ? DateTime.toFiscal(d, true) :
                        part[0] == 'e' ? DateTime.toFiscal(d, false) :
                        d;
                    year = fd.getFullYear();

                    // if the calendar has multiple eras and the format specifies an era,
                    // then adjust the year to count from the start of the era.
                    // if the format has no era, then use the regular (Western) year.
                    if (cal.eras.length > 1 && format.indexOf('g') > -1) {
                        era = Globalize._getEra(d, cal);
                        if (era > -1) {
                            year = year - cal.eras[era].start.getFullYear() + 1;
                        }
                    }

                    // adjust number of digits
                    return Globalize._zeroPad(year, 4).substr(4 - part.length);

                // ** month
                case 'MMMM':
                    return cal.months[d.getMonth()];
                case 'MMM':
                    return cal.monthsAbbr[d.getMonth()];
                case 'MM': case 'M':
                    return Globalize._zeroPad(d.getMonth() + 1, plen);

                // ** day
                case 'dddd':
                    return cal.days[d.getDay()];
                case 'ddd':
                    return cal.daysAbbr[d.getDay()];
                case 'dd':
                    return Globalize._zeroPad(d.getDate(), 2);
                case 'd':
                    return d.getDate().toString();

                // ** hour
                case 'hh': case 'h':
                    return Globalize._zeroPad(Globalize._h12(d), plen);
                case 'HH': case 'H':
                    return Globalize._zeroPad(d.getHours(), plen);

                // ** minute
                case 'mm': case 'm':
                    return Globalize._zeroPad(d.getMinutes(), plen);

                // ** second
                case 'ss': case 's':
                    return Globalize._zeroPad(d.getSeconds(), plen);

                // ** millisecond
                case 'fffffff': case 'FFFFFFF':
                case 'ffffff': case 'FFFFFF':
                case 'fffff': case 'FFFFF':
                case 'ffff': case 'FFFF':
                case 'fff': case 'FFF':
                case 'ff': case 'FF':
                case 'f': case 'F':
                    ff = d.getMilliseconds() * Math.pow(10, plen - 3);
                    return part[0] == 'f' ? Globalize._zeroPad(ff, plen) : ff.toFixed(0);

                // ** am/pm
                case 'tt':
                    return d.getHours() < 12 ? cal.am[0] : cal.pm[0];
                case 't':
                    return d.getHours() < 12 ? cal.am[1] : cal.pm[1];

                // ** quarter
                case 'q': case 'Q': // calendar
                    return (Math.floor(d.getMonth() / 3) + 1).toString();
                case 'u': case 'U': // quarter (U: govt; u: corp)
                    fd = DateTime.toFiscal(d, part == 'U');
                    return (Math.floor(fd.getMonth() / 3) + 1).toString();

                // ** era
                case 'ggg': case 'gg': case 'g':
                    if (cal.eras.length > 1) {
                        era = Globalize._getEra(d, cal);
                        if (era > -1) {
                            return part == 'ggg' ? cal.eras[era].name : part == 'gg' ? cal.eras[era].name[0] : cal.eras[era].symbol;
                        }
                    }
                    return cal.eras[0];

                // ** localized separators
                case ':':
                case '/':
                    return cal[part];

                // ** time zone
                case 'K':
                    var tz = d.toString().match(/(\+|\-)(\d{2})(\d{2})/);
                    return tz ? tz[1] + tz[2] + tz[3] : '';
            }

            // unquote part
            if (plen > 1 && part[0] == part[plen - 1]) {
                if (part[0] == '\"' || part[0] == '\'') {
                    return part.substr(1, plen - 2);
                }
            }

            // return part
            return part;
        }

        // get a date's era (used only in Japanese locales)
        private static _getEra(d: any, cal: any): number {
            if (isDate(d)) { // find era by start date
                for (var i = 0; i < cal.eras.length; i++) {
                    if (d >= cal.eras[i].start) {
                        return i;
                    }
                }
            } else if (isString(d)) { // find era by name or symbol
                for (var i = 0; i < cal.eras.length; i++) {
                    if (cal.eras[i].name) {
                        if (cal.eras[i].name.indexOf(d) == 0 || cal.eras[i].symbol.indexOf(d) == 0) {
                            return i;
                        }
                    }
                }
            }
            return -1; // not found
        }

        // expand date pattern into full date format
        private static _expandFormat(format: string): string {
            var fmt = culture.Globalize.calendar.patterns[format];
            return fmt ? fmt : format;
        }

        // format a number with leading zeros
        private static _zeroPad(num: number, places: number) {
            var n = num.toFixed(0),
                zero = places - n.length + 1;
            return zero > 0 ? Array(zero).join('0') + n : n;
        }

        // format an hour to 12 or 24 hour base depending on the calendar
        private static _h12(d: Date) {
            var cal = culture.Globalize.calendar,
                h = d.getHours();
            if (cal.am && cal.am[0]) {
                h = h % 12;
                if (h == 0) h = 12;
            }
            return h;
        }

        // multiply a number by 100 without round-off errors (sigh: TFS 210383)
        private static _mul100(n: number) {
            var str = n.toString(),
                pos = str.indexOf('.');
            if (pos < 0) {
                str += '00';
            } else {
                pos += 2;
                str = str.replace('.', '') + '00';
                str = str.substr(0, pos) + '.' + str.substr(pos);
            }
            return parseFloat(str);
        }
    }
}