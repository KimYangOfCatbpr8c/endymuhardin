//
// Contains utilities used by hierarchical chart.
//
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var hierarchical;
        (function (hierarchical) {
            'use strict';
            var HierarchicalUtil = (function () {
                function HierarchicalUtil() {
                }
                HierarchicalUtil.parseDataToHierarchical = function (data, binding, bindingName, childItemsPath) {
                    var arr = [], items;
                    if (data.length > 0) {
                        if (wijmo.isString(bindingName) && bindingName.indexOf(',') > -1) {
                            bindingName = bindingName.split(',');
                        }
                        if (childItemsPath) {
                            arr = HierarchicalUtil.parseItems(data, binding, bindingName, childItemsPath);
                        }
                        else {
                            //flat data
                            items = HierarchicalUtil.ConvertFlatData(data, binding, bindingName);
                            arr = HierarchicalUtil.parseItems(items, 'value', bindingName, 'items');
                        }
                    }
                    return arr;
                };
                HierarchicalUtil.parseItems = function (items, binding, bindingName, childItemsPath) {
                    var arr = [], i, len = items.length;
                    for (i = 0; i < len; i++) {
                        arr.push(HierarchicalUtil.parseItem(items[i], binding, bindingName, childItemsPath));
                    }
                    return arr;
                };
                HierarchicalUtil.isFlatItem = function (item, binding) {
                    if (wijmo.isArray(item[binding])) {
                        return false;
                    }
                    return true;
                };
                HierarchicalUtil.ConvertFlatData = function (items, binding, bindingName) {
                    var arr = [], data = {}, i, item, len = items.length;
                    for (i = 0; i < len; i++) {
                        item = items[i];
                        HierarchicalUtil.ConvertFlatItem(data, item, binding, bindingName);
                    }
                    HierarchicalUtil.ConvertFlatToHierarchical(arr, data);
                    return arr;
                };
                HierarchicalUtil.ConvertFlatToHierarchical = function (arr, data) {
                    var order = data['flatDataOrder'];
                    if (order) {
                        order.forEach(function (v) {
                            var d = {}, val = data[v], items;
                            d[data['field']] = v;
                            if (val['flatDataOrder']) {
                                items = [];
                                HierarchicalUtil.ConvertFlatToHierarchical(items, val);
                                d.items = items;
                            }
                            else {
                                d.value = val;
                            }
                            arr.push(d);
                        });
                    }
                };
                HierarchicalUtil.ConvertFlatItem = function (data, item, binding, bindingName) {
                    var newBindingName, name, len, itemName, newData, converted;
                    newBindingName = bindingName.slice();
                    name = newBindingName.shift().trim();
                    itemName = item[name];
                    if (itemName == null) {
                        return false;
                    }
                    if (newBindingName.length === 0) {
                        data[itemName] = item[binding];
                        if (data['flatDataOrder']) {
                            data['flatDataOrder'].push(itemName);
                        }
                        else {
                            data['flatDataOrder'] = [itemName];
                        }
                        data['field'] = name;
                    }
                    else {
                        if (data[itemName] == null) {
                            data[itemName] = {};
                            if (data['flatDataOrder']) {
                                data['flatDataOrder'].push(itemName);
                            }
                            else {
                                data['flatDataOrder'] = [itemName];
                            }
                            data['field'] = name;
                        }
                        newData = data[itemName];
                        converted = HierarchicalUtil.ConvertFlatItem(newData, item, binding, newBindingName);
                        if (!converted) {
                            data[itemName] = item[binding];
                        }
                    }
                    return true;
                };
                HierarchicalUtil.parseItem = function (item, binding, bindingName, childItemsPath) {
                    var data = {}, newBindingName, name, value, len, childItem, newChildItemsPath;
                    if (wijmo.isArray(childItemsPath)) {
                        newChildItemsPath = childItemsPath.slice();
                        childItem = newChildItemsPath.length ? newChildItemsPath.shift().trim() : '';
                    }
                    else {
                        newChildItemsPath = childItemsPath;
                        childItem = childItemsPath;
                    }
                    if (wijmo.isArray(bindingName)) {
                        newBindingName = bindingName.slice();
                        name = newBindingName.shift().trim();
                        data.nameField = name;
                        data.name = item[name];
                        value = item[childItem];
                        if (newBindingName.length === 0) {
                            data.value = item[binding];
                        }
                        else {
                            if (value && wijmo.isArray(value)) {
                                data.items = HierarchicalUtil.parseItems(value, binding, newBindingName, newChildItemsPath);
                            }
                            else {
                                data.value = item[binding];
                            }
                        }
                    }
                    else {
                        data.nameField = bindingName;
                        data.name = item[bindingName];
                        value = item[childItem];
                        if (value != null && wijmo.isArray(value)) {
                            data.items = HierarchicalUtil.parseItems(value, binding, bindingName, newChildItemsPath);
                        }
                        else {
                            data.value = item[binding];
                        }
                    }
                    return data;
                };
                HierarchicalUtil.parseFlatItem = function (data, item, binding, bindingName) {
                    if (!data.items) {
                        data.items = [];
                    }
                };
                return HierarchicalUtil;
            }());
            hierarchical.HierarchicalUtil = HierarchicalUtil;
        })(hierarchical = chart.hierarchical || (chart.hierarchical = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=HierarchicalUtil.js.map