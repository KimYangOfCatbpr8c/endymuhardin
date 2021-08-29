/*
 * Common script to be included in all Wijmo samples.
 *
 * It provides Google Analytics support and a common toolbar
 * used to download the sample, view the source, etc.
 */

/* wijmo analytics */
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-852777-12', 'gcpowertools.com.cn');
ga('send', 'pageview');

/* super toolbar */
(function () {
    // parts of sample URLs where toolbar should not be applied
    var skipUrlParts = ['/5/docs/', '/SampleExplorer/'],
        locationUrl = location.href.toLowerCase();
    if (skipUrlParts.some(function (skipPart) { return locationUrl.indexOf(skipPart.toLowerCase()) > -1; })) {
        return;
    }
    document.addEventListener('DOMContentLoaded', function () {

        // wait until everyone else is done messing with the DOM
        setTimeout(function () {

            // toolbar CSS
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(''));
            document.head.appendChild(style);

            style.sheet.insertRule(
            'ul.universal-nav {\
            outline: 1px solid rgba(255,255,255,.3);\
            background: #222;\
            width: 100%;\
            padding: 12px 60px 12px 20px;\
            margin: 0;\
            display: inline-block;\
            box-sizing: border-box;\
            color: #aaa;\
            font-family: sans-serif;\
            font-size: 12px;\
            text-align: right;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            '@media only screen and (max-width:768px) {\
            ul.universal-nav {\
                text-align: left;\
            }\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            'ul.universal-nav li {\
            display: inline;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            'ul.universal-nav li:before {\
            content: "/";\
            margin: 0 10px;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            'ul.universal-nav li:first-child:before {\
            content: "";\
            margin: 0;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            'ul.universal-nav li a:link, ul.universal-nav li a:visited {\
            color: #ccc;\
            text-decoration: none;\
            transition: all .25s;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            'ul.universal-nav li a:hover, ul.universal-nav li a:active {\
            color: #fff;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            'ul.universal-nav li span {\
            margin-right: 4px;\
        }',
            style.sheet.cssRules.length);

            style.sheet.insertRule(
            '.header {\
            padding-top: 20px;\
        }',
            style.sheet.cssRules.length);

            // toolbar HTML
            var html =
                '<ul class="universal-nav">' +
                    '<li><a href="http://wijmo.gcpowertools.com.cn" target="_blank"><span class="glyphicon glyphicon-globe"></span> Wijmo</a></li>' +
                    '<li class="hidden-xs"><a href="http://www.gcpowertools.com.cn/products/download.aspx?pid=54" target="_blank"><span class="glyphicon glyphicon-cloud-download"></span> 下载Wijmo</a></li>' +
                    '<li class="hidden-xs"><a href="http://wijmo.gcpowertools.com.cn/5/docs/" target="_blank"><span class="glyphicon glyphicon-book"></span> 文档</a></li>' +
                    
                '</ul>';

            var toolbar = document.createElement('div');
            toolbar.innerHTML = html;
            toolbar = document.body.insertBefore(toolbar.firstChild, document.body.firstChild);

            if (locationUrl.indexOf('localhost') === -1) {
                // add about the sample link if localhost is not in the url
                var path = location.pathname.split('/');
                var sampleName = path[path.length - 2];
                var sampleLink = '<li><a href="http://demos.wijmo.com/5/SampleExplorer/SampleExplorer/Sample/' + sampleName + '" target="_blank"><span class="glyphicon glyphicon-info-sign"></span> About ' + sampleName + '</a></li>';
                var sampleItem = document.createElement('div');
                sampleItem.innerHTML = sampleLink;
                sampleItem = toolbar.insertBefore(sampleItem.firstChild, toolbar.firstChild);
            }

        }, 200);
    });
})();