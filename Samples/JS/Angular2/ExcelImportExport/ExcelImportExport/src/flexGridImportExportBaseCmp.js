"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var wjcCore = require('wijmo/wijmo');
// Angular
var core_1 = require('@angular/core');
var DataSvc_1 = require('./services/DataSvc');
'use strict';
// The Explorer application root component.
var FlexGridImportExportBaseCmp = (function () {
    function FlexGridImportExportBaseCmp(dataSvc) {
        this.includeColumnHeader = true;
        this.dataSvc = dataSvc;
        this.data = dataSvc.getProductOrders(1500);
    }
    FlexGridImportExportBaseCmp.prototype.updateGroup = function (flex) {
        var groupNames = ['Product', 'Country', 'Amount'], cv, propName, groupDesc;
        if (flex) {
            // get the collection view, start update
            cv = flex.collectionView;
            cv.beginUpdate();
            // clear existing groups
            cv.groupDescriptions.clear();
            // add new groups
            for (var i = 0; i < groupNames.length; i++) {
                propName = groupNames[i].toLowerCase();
                if (propName == 'amount') {
                    // group amounts in ranges
                    // (could use the mapping function to group countries into continents, 
                    // names into initials, etc)
                    groupDesc = new wjcCore.PropertyGroupDescription(propName, function (item, prop) {
                        var value = item[prop];
                        if (value > 1000)
                            return 'Large Amounts';
                        if (value > 100)
                            return 'Medium Amounts';
                        if (value > 0)
                            return 'Small Amounts';
                        return 'Negative';
                    });
                    cv.groupDescriptions.push(groupDesc);
                }
                else if (propName) {
                    // group other properties by their specific values
                    groupDesc = new wjcCore.PropertyGroupDescription(propName);
                    cv.groupDescriptions.push(groupDesc);
                }
            }
            // done updating
            cv.endUpdate();
        }
    };
    __decorate([
        core_1.ViewChild('flexGrid')
    ], FlexGridImportExportBaseCmp.prototype, "flexGrid", void 0);
    FlexGridImportExportBaseCmp = __decorate([
        core_1.Component({
            selector: '',
            templateUrl: ''
        }),
        __param(0, core_1.Inject(DataSvc_1.DataSvc))
    ], FlexGridImportExportBaseCmp);
    return FlexGridImportExportBaseCmp;
}());
exports.FlexGridImportExportBaseCmp = FlexGridImportExportBaseCmp;
//# sourceMappingURL=flexGridImportExportBaseCmp.js.map