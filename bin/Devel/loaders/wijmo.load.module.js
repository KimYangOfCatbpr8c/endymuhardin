(function () {
    var loadFile = function (url) {
        document.write('<script src="' + url + '" ></script>');

        //This approach works only if all script tags on a page are defined with wj-src attribute. A regular script tag defined
        //after wj-src script tag may execute earlier then the latter.
        //var scr = document.createElement("script");
        //scr.type = "text/javascript";
        //scr.async = false;
        //scr.src = url;
        //document.getElementsByTagName('HEAD')[0].appendChild(scr);

        //This approach provides a correct execution order, but doesn't allow TS debugging, because src attribute is not 
        //specified in this case.
        //var xhrObj = new XMLHttpRequest();
        //xhrObj.open('GET', url, false);
        //xhrObj.send('');
        //var se = document.createElement('script');
        //se.type = "text/javascript";
        //se.text = xhrObj.responseText;
        //document.getElementsByTagName('head')[0].appendChild(se);

    }

    var scripts = document.getElementsByTagName("script");
    var curScript = scripts[scripts.length - 1];
    var url = curScript.getAttribute("wj-src");
    if (!url)
        throw "wj-src attribute is not defined.";
    if (curScript["wj-processed"])
        throw "Internal error: a recurring attempt to process the same wj-src='" + url + "'";
    curScript["wj-processed"] = true;
    var pathToRoot = '';
    var relPathPatt = /^(\.\.\/)+/
    var relRes = relPathPatt.exec(curScript.getAttribute("src").trim());
    if (relRes) {
        pathToRoot = relRes[0];
    }

    var xhrObj = new XMLHttpRequest();
    xhrObj.open('GET', pathToRoot + "bin/Devel/loaders/wijmo.tsdocx.xml", false);
    //xhrObj.overrideMimeType("text/xml");
    xhrObj.send('');

    var xmlParser = new DOMParser();
    var modListXml = xmlParser.parseFromString(xhrObj.responseText, "text/xml");
    var modFileName = url + ".js";
    var modList = [].filter.call(modListXml.querySelectorAll("Item[File]"), function (element) {
        return element.getAttribute("File").split(/[\\/]/).slice(-1)[0] == modFileName;
    });
    if (modList.length === 0) {
        throw "Wijmo Loader: '" + url + "' is not recognized as Wijmo module name";
    };
    var fList = modList[0].querySelectorAll("Input");
    [].forEach.call(fList, function (elem, idx) {
        loadFile(pathToRoot + "bin/Devel/sources/" + elem.getAttribute("File").replace("\\", "/"));
    });

    //JQuery based code - obsolete
    //var modListXml = $.parseXML(xhrObj.responseText);
    //var modFileName = url + ".js";
    //var $fList = $(modListXml).find("Item[File]").
    //    filter(function () {
    //        return this.getAttribute("File").split(/[\\/]/).slice(-1)[0] == modFileName;
    //    }).
    //    find("Input");
    //if ($fList.length === 0) {
    //    throw "Wijmo Loader: '" + url + "' is not recognized as Wijmo module name";
    //};
    //$fList.each(function (idx, elem) {
    //    loadFile(pathToRoot + "/bin/Devel/sources/" + this.getAttribute("File").replace("\\", "/"));
    //});
}());