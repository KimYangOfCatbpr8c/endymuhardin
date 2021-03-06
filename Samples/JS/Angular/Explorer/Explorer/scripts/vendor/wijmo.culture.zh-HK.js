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
 * Wijmo culture file: zh-HK (Chinese (Traditional, Hong Kong S.A.R.))
 */
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            name: 'zh-HK',
            displayName: 'Chinese (Traditional, Hong Kong S.A.R.)',
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: 'HK$', pattern: ['($n)', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 0,
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                daysAbbr: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthsAbbr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                am: ['上午', '上'],
                pm: ['下午', '下'],
                eras: ['公元'],
                patterns: {
                    d: 'd/M/yyyy', D: 'yyyy"年"M"月"d"日"',
                    f: 'yyyy"年"M"月"d"日" H:mm', F: 'yyyy"年"M"月"d"日" H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'M"月"d"日"', M: 'M"月"d"日"',
                    y: 'yyyy"年"M"月"', Y: 'yyyy"年"M"月"',
                    g: 'd/M/yyyy H:mm', G: 'd/M/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
            }
        },
        MultiSelect: {
            itemsSelected: '選定{count:n0}個項目'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} 項目)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 由小至大排列',
            descending: '\u2193 由大至小排列',
            apply: '套用',
            clear: '清除',
            conditions: '按狀況篩選',
            values: '按價值篩選',
            // value filter
            search: '搜尋',
            selectAll: '全部選擇',
            null: '(無)',
            // condition filter
            header: '顯示價值如下的項目',
            and: '及',
            or: '或',
            stringOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '不等於', op: 1 },
                { name: '開首為', op: 6 },
                { name: '結尾為', op: 7 },
                { name: '包含', op: 8 },
                { name: '不包含', op: 9 }
            ],
            numberOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '不等於', op: 1 },
                { name: '大於', op: 2 },
                { name: '大於或相等於', op: 3 },
                { name: '少於', op: 4 },
                { name: '少於或相等於', op: 5 }
            ],
            dateOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '先於', op: 4 },
                { name: '後於', op: 3 }
            ],
            booleanOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '不等於', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: '字段設置:',
                header: '標題:',
                summary: '摘要:',
                showAs: '顯示為:',
                weighBy: '稱重:',
                sort: '排序:',
                filter: '篩選器:',
                format: '格式:',
                sample: '樣品:',
                edit: '編輯…',
                clear: '清除',
                ok: '確定',
                cancel: '取消',
                none: '(無設定)',
                sorts: {
                    asc: '遞增',
                    desc: '遞減'
                },
                aggs: {
                    sum: '加總',
                    cnt: '計數',
                    avg: '平均值',
                    max: '最大',
                    min: '最小',
                    rng: '範圍',
                    std: 'StdDev',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop'
                },
                calcs: {
                    noCalc: '無計算',
                    dRow: '與上一行的差異',
                    dRowPct: '％與上一行的差異',
                    dCol: '與前一列的差異',
                    dColPct: '％與上一列的差異',
                    dPctGrand: '佔總數的百分比',
                    dPctRow: '佔總行數的百分比',
                    dPctCol: '列總數的％',
                    dRunTot: '累計',
                    dRunTotPct: '％累計'
                },
                formats: {
                    n0: '整數 (n0)',
                    n2: '浮點 (n2)',
                    c: '貨幣 (c)',
                    p0: '百分比 (p0)',
                    p2: '百分比 (p2)',
                    n2c: '萬聖節 (n2,)',
                    n2cc: '百萬 (n2,,)',
                    n2ccc: '十億 (n2,,,)',
                    d: '日期 (d)',
                    MMMMddyyyy: '月日年 (MMMM dd, yyyy)',
                    dMyy: '日月年 (d/M/yy)',
                    ddMyy: '日月年 (dd/M/yy)',
                    dMyyyy: '日月年 (dd/M/yyyy)',
                    MMMyyyy: '月 (MMM yyyy)',
                    MMMMyyyy: '月 (MMMM yyyy)',
                    yyyyQq: '年度季度 (yyyy "Q"q)',
                    FYEEEEQU: '財年和季度 ("FY"EEEE "Q"U)'
                }
            },
            PivotEngine: {
                grandTotal: '累計',
                subTotal: '小計'
            },
            PivotPanel: {
                fields: '選擇要添加到報告的字段:',
                drag: '在以下區域之間拖動字段:',
                filters: '篩選器',
                cols: '欄',
                rows: '列',
                vals: '值',
                defer: '延遲更新',
                update: '更新'
            },
            _ListContextMenu: {
                up: '上移',
                down: '下移',
                first: '移至開始',
                last: '移動到結束',
                filter: '移至報表過濾器',
                rows: '移至行標籤',
                cols: '移動到列標籤',
                vals: '移動到值',
                remove: '移除欄位',
                edit: '字段設置…',
                detail: '顯示詳細信息…'
            },
            PivotChart: {
                by: '通過',
                and: '及'
            },
            DetailDialog: {
                header: '詳細視圖:',
                ok: '確定',
                items: '{cnt:n0} 項目',
                item: '{cnt} 項目',
                row: '列',
                col: '直條圖​​'
            }
        },
        Viewer: {
            cancel: '取消',
            ok: '確定',
            bottom: '下:',
            top: '上:',
            right: '右:',
            left: '左:',
            margins: '邊界 (英吋)',
            orientation: '方向:',
            paperKind: '紙種:',
            pageSetup: '版面設定',
            landscape: '橫印',
            portrait: '直向',
            pageNumber: '頁數',
            zoomFactor: '縮放係數',
            paginated: '整頁模式',
            print: '打印',
            search: '搜尋',
            matchCase: '大小寫視為相異',
            wholeWord: '全字拼寫須符合',
            searchResults: '搜尋結果',
            previousPage: '上一頁',
            nextPage: '下一頁',
            firstPage: '第一頁',
            lastPage: '最後一頁',
            backwardHistory: '向後',
            forwardHistory: '下一頁',
            pageCount: '頁數',
            selectTool: '選擇工具',
            moveTool: '移動工具',
            continuousMode: '連續頁面視圖',
            singleMode: '單頁面視圖',
            wholePage: '適合整頁',
            pageWidth: '調整頁寬',
            zoomOut: '縮小',
            zoomIn: '放大',
            exports: '匯出',
            fullScreen: '全螢幕',
            exitFullScreen: '結束全螢幕',
            hamburgerMenu: '工具',
            showSearchBar: 'Show Search Bar',
            viewMenu: 'Layout Options',
            searchOptions: '搜尋選項',
            matchCaseMenuItem: '大小寫視為相異',
            wholeWordMenuItem: 'Match Whole Word',
            thumbnails: '頁面縮略圖',
            outlines: '文件引導模式',
            loading: '正在載入…',
            pdfExportName: 'Adobe PDF',
            docxExportName: '打開XML Word',
            xlsxExportName: '打開XML Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Web存檔 (MHTML)',
            htmlExportName: 'HTML文檔',
            rtfExportName: 'RTF document',
            metafileExportName: 'Compressed metafiles',
            csvExportName: 'CSV',
            tiffExportName: 'TIFF圖像',
            bmpExportName: 'BMP images',
            emfExportName: 'Enhanced metafile',
            gifExportName: 'GIF images',
            jpgExportName: 'JPG圖像',
            jpegExportName: 'JPEG圖像',
            pngExportName: 'PNG images',
            abstractMethodException: 'This is an abstract method, please implement it.',
            cannotRenderPageNoViewPage: 'Cannot render page without document source and view page.',
            cannotRenderPageNoDoc: 'Cannot render page without document source and view page.',
            exportFormat: '匯出格式',
            exportOptionTitle: '匯出選項',
            documentRestrictionsGroup: 'Document restrictions',
            passwordSecurityGroup: '密碼安全性',
            outputRangeGroup: 'Output range',
            documentInfoGroup: 'Document info',
            generalGroup: '一般',
            docInfoTitle: '職稱:',
            docInfoAuthor: '作者',
            docInfoManager: '主管',
            docInfoOperator: '運算子',
            docInfoCompany: '公司',
            docInfoSubject: '主旨',
            docInfoComment: '註解:',
            docInfoCreator: '建立者',
            docInfoProducer: '製作人',
            docInfoCreationTime: '建立時間',
            docInfoRevisionTime: 'Revision time',
            docInfoKeywords: '關鍵字:',
            embedFonts: 'Embed TrueType fonts',
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
            paged: '已分頁',
            showNavigator: 'Show Navigator',
            singleFile: 'Single File',
            tolerance: 'Tolerance when detecting text bounds (points):',
            pictureLayer: 'Use separate picture layer',
            metafileType: 'Metafile Type:',
            monochrome: '單色',
            resolution: '解決方式:',
            outputRange: '頁面範圍',
            outputRangeInverted: 'Inverted',
            showZoomBar: 'Zoom Bar',
            searchPrev: 'Search Previous',
            searchNext: 'Search Next',
            checkMark: '\u2713',
            exportOk: '匯出',
            parameters: '參數',
            requiringParameters: '輸入參數.',
            nullParameterError: '值不能為 null.',
            invalidParameterError: '錯誤的輸入',
            parameterNoneItemsSelected: '(無設定)',
            parameterAllItemsSelected: '(全部)',
            parameterSelectAllItemText: '(全選)',
            selectParameterValue: '(選擇值)',
            apply: '套用',
            errorOccured: '發生錯誤。'
        }
    };
    var updc = window['wijmo']._updateCulture;
    if (updc) {
        updc();
    }
})(wijmo || (wijmo = {}));
;

