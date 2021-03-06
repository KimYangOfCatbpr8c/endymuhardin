"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var question_dropdown_1 = require('./question-dropdown');
var question_textbox_1 = require('./question-textbox');
var question_numeric_1 = require('./question-numeric');
var QuestionService = (function () {
    function QuestionService() {
    }
    // Todo: get from a remote source of question metadata
    // Todo: make asynchronous
    QuestionService.prototype.getQuestions = function () {
        var questions = [
            new question_dropdown_1.DropdownQuestion({
                key: 'brave',
                label: 'Bravery Rating',
                options: [
                    { key: 'solid', value: 'Solid' },
                    { key: 'great', value: 'Great' },
                    { key: 'good', value: 'Good' },
                    { key: 'unproven', value: 'Unproven' }
                ],
                order: 3
            }),
            new question_textbox_1.TextboxQuestion({
                key: 'firstName',
                label: 'First name',
                value: 'Bombasto',
                required: true,
                order: 1
            }),
            new question_textbox_1.TextboxQuestion({
                key: 'emailAddress',
                label: 'Email',
                type: 'email',
                order: 2
            }),
            // added by GrapeCity
            new question_numeric_1.NumericQuestion({
                key: 'age',
                label: 'Age',
                required: true,
                order: 4
            })
        ];
        return questions.sort(function (a, b) { return a.order - b.order; });
    };
    QuestionService = __decorate([
        core_1.Injectable()
    ], QuestionService);
    return QuestionService;
}());
exports.QuestionService = QuestionService;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
//# sourceMappingURL=question.service.js.map