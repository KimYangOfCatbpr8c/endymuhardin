'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
// Base class for all form components.
var FrmBaseCmp = (function () {
    function FrmBaseCmp() {
        this.submit = new core_1.EventEmitter();
    }
    // Triggers the 'submit' event and shows the specified message.
    FrmBaseCmp.prototype.onSubmit = function (message) {
        this.submit.next(null);
        if (message) {
            alert(message);
        }
    };
    __decorate([
        core_1.Output()
    ], FrmBaseCmp.prototype, "submit", void 0);
    FrmBaseCmp = __decorate([
        core_1.Component({
            selector: '',
            templateUrl: ''
        })
    ], FrmBaseCmp);
    return FrmBaseCmp;
}());
exports.FrmBaseCmp = FrmBaseCmp;
//# sourceMappingURL=FrmBaseCmp.js.map