"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var core_1 = require('@angular/core');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var app_component_1 = require('./app.component');
var dynamic_form_component_1 = require('./dynamic-form.component');
var dynamic_form_question_component_1 = require('./dynamic-form-question.component');
var DynamicFormAppModule = (function () {
    function DynamicFormAppModule() {
    }
    DynamicFormAppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, wijmo_angular2_input_1.WjInputModule],
            declarations: [app_component_1.DynamicFormAppComponent, dynamic_form_component_1.DynamicFormComponent, dynamic_form_question_component_1.DynamicFormQuestionComponent],
            exports: [app_component_1.DynamicFormAppComponent]
        })
    ], DynamicFormAppModule);
    return DynamicFormAppModule;
}());
exports.DynamicFormAppModule = DynamicFormAppModule;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
//# sourceMappingURL=app.module.js.map