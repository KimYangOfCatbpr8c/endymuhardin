/*
 * Wijmo culture file: ja (Japanese)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            name: 'ja',
            displayName: 'Japanese',
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 0, symbol: '¥', pattern: ['-$n', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 0,
                days: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
                daysAbbr: ['日', '月', '火', '水', '木', '金', '土'],
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                monthsAbbr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                am: ['午前', '午前'],
                pm: ['午後', '午後'],
                eras: [
                        { name: '平成', symbol: 'H', start: new Date(1989, 0, 8) },
                        { name: '昭和', symbol: 'S', start: new Date(1926, 11, 25) },
                        { name: '大正', symbol: 'T', start: new Date(1912, 6, 30) },
                        { name: '明治', symbol: 'M', start: new Date(1868, 8, 8) }
                      ],
                patterns: {
                    d: 'yyyy/MM/dd', D: 'yyyy"年"M"月"d"日"',
                    f: 'yyyy"年"M"月"d"日" H:mm', F: 'yyyy"年"M"月"d"日" H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'M月d日', M: 'M月d日', 
                    y: 'yyyy"年"M"月"', Y: 'yyyy"年"M"月"', 
                    g: 'yyyy/MM/dd H:mm', G: 'yyyy/MM/dd H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                fiscalYearOffsets: [3,0],
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} 個の項目を選択中'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} 項目)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 昇順',
            descending: '\u2193 降順',
            apply: '適用',
            clear: 'クリア',
            conditions: '条件フィルタ',
            values: '値フィルタ',

            // value filter
            search: '検索',
            selectAll: 'すべて選択',
            null: '(なし)',

            // condition filter
            header: '抽出条件の指定',
            and: 'AND',
            or: 'OR',
            stringOperators: [
                { name: '(設定しない)', op: null },
                { name: '指定の値に等しい', op: 0 },
                { name: '指定の値に等しくない', op: 1 },
                { name: '指定の値で始まる', op: 6 },
                { name: '指定の値で終わる', op: 7 },
                { name: '指定の値を含む', op: 8 },
                { name: '指定の値を含まない', op: 9 }
            ],
            numberOperators: [
                { name: '(設定しない)', op: null },
                { name: '指定の値に等しい', op: 0 },
                { name: '指定の値に等しくない', op: 1 },
                { name: '指定の値より大きい', op: 2 },
                { name: '指定の値以上', op: 3 },
                { name: '指定の値より小さい', op: 4 },
                { name: '指定の値以下', op: 5 }
            ],
            dateOperators: [
                { name: '(設定しない)', op: null },
                { name: '指定の値に等しい', op: 0 },
                { name: '指定の値より前', op: 4 },
                { name: '指定の値より後', op: 3 }
            ],
            booleanOperators: [
                { name: '(設定しない)', op: null },
                { name: '指定の値に等しい', op: 0 },
                { name: '指定の値に等しくない', op: 1 }
            ]
        },
        olap: {
            PivotFieldEditor: {
                dialogHeader: 'フィールドの設定:',
                header: 'ヘッダー:',
                summary: '集計方法:',
                showAs: '計算の種類:',
                weighBy: '基準フィールド:',
                sort: '並べ替え:',
                filter: 'フィルター:',
                format: '表示形式:',
                sample: 'サンプル:',
                edit: '編集...',
                clear: 'クリア',
                ok: 'OK',
                cancel: 'キャンセル',
                none: '(なし)',
                sorts: {
                    asc: '昇順',
                    desc: '降順'
                },
                aggs: {
                    sum: '合計',
                    cnt: '個数',
                    avg: '平均',
                    max: '最大値',
                    min: '最小値',
                    rng: '範囲',
                    std: '標準偏差',
                    var: '標本分散',
                    stdp: '標準偏差',
                    varp: '分散'
                },
                calcs: {
                    noCalc: '計算なし',
                    dRow: '前の行との差分',
                    dRowPct: '前の行との差分の比率',
                    dCol: '前の列との差分',
                    dColPct: '前の列との差分の比率'
                },
                formats: {
                    n0: '整数 (n0)',
                    n2: '小数 (n2)',
                    c: '通貨 (c)',
                    p0: 'パーセンテージ (p0)',
                    p2: 'パーセンテージ (p2)', 
                    n2c: '千 (n2,)',
                    n2cc: '100万 (n2,,)',
                    n2ccc: '10億 (n2,,,)',
                    d: '日付 (d)',
                    MMMMddyyyy: '月 日 年 (MMMM dd, yyyy)',
                    dMyy: '日 月 年 (d/M/yy)',
                    ddMyy: '日 月 年 (dd/M/yy)',
                    dMyyyy: '日 月 年 (dd/M/yyyy)',
                    MMMyyyy: '月 年 (MMM yyyy)',
                    MMMMyyyy: '月 年 (MMMM yyyy)',
                    yyyyQq: '年 四半期 (yyyy "Q"q)',
                    FYEEEEQU: '会計年度 四半期 ("FY"EEEE "Q"U)'
                }
            },
            PivotEngine: {
                grandTotal: '総計',
                subTotal: '集計'
            },
            PivotPanel: {
                fields: 'レポートに追加するフィールドを選択',
                drag: '次のボックス間でフィールドをドラッグ:',
                filters: 'フィルター',
                cols: '列',
                rows: '行',
                vals: '値',
                defer: 'レイアウトの更新を保留',
                update: '更新'
            },
            _ListContextMenu: {
                up: '上へ移動',
                down: '下へ移動',
                first: '先頭へ移動',
                last: '末尾へ移動',
                filter: 'レポートフィルターに移動',
                rows: '行ラベルに移動',
                cols: '列ラベルに移動',
                vals: '値に移動',
                remove: 'フィールドの削除',
                edit: 'フィールドの設定...',
                detail: '詳細の表示...'
            },
            PivotChart: {
                by: ':',
                and: '/'
            },
            DetailDialog: {
                header: '詳細ビュー:',
                ok: 'OK',
                items: '{cnt:n0} 項目',
                item: '{cnt} 項目',
                row: '行',
                col: '列'
            }
        },
        Viewer: {
            // for ViewerBase
            cancel: 'キャンセル',
            ok: 'OK',
            bottom: '下:',
            top: '上:',
            right: '右:',
            left: '左:',
            margins: '余白(インチ)',
            orientation: '印刷の向き:',
            paperKind: '用紙サイズ:',
            pageSetup: 'ページ設定',
            landscape: '横',
            portrait: '縦',
            pageNumber: 'ページ番号',
            zoomFactor: '表示倍率',
            paginated: '印刷レイアウト',
            print: '印刷',
            search: '検索',
            matchCase: '大文字と小文字を区別',
            wholeWord: '完全に一致する単語だけ検索',
            searchResults: '検索結果',
            previousPage: '前のページ',
            nextPage: '次のページ',
            firstPage: '最初のページ',
            lastPage: '最後のページ',
            backwardHistory: '戻る',
            forwardHistory: '進む',
            pageCount: 'ページ数',
            selectTool: 'テキスト選択ツール',
            moveTool: 'Move Tool',
            continuousMode: '連続ページビュー',
            singleMode: '単一ページビュー',
            wholePage: 'ページ全体に合わせる',
            pageWidth: '幅に合わせる',
            zoomOut: '縮小',
            zoomIn: '拡大',
            exports: 'エクスポート',
            fullScreen: 'Full Screen',
            exitFullScreen: 'Exit Full Screen',
            thumbnails: 'ページサムネール',
            outlines: 'しおり',
            loading: '読み込み中...',
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

            //for ReportViewer
            parameters: 'パラメーター',
            requiringParameters: 'パラメーターを入力してください。',
            nullParameterError: '値はnullにできません。',
            invalidParameterError: '無効な入力です。',
            parameterNoneItemsSelected: '(なし)',
            parameterAllItemsSelected: '(すべて)',
            parameterSelectAllItemText: '(すべて選択)',
            selectParameterValue: '(値を選択)',
            apply: '適用',
            errorOccured: 'An error has occured.',
        }
    };
};