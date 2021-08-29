import { FormGroup, AbstractControlDirective } from '@angular/forms';
import { QuestionBase } from './question-base';
export declare class DynamicFormQuestionComponent {
    question: QuestionBase<any>;
    form: FormGroup;
    readonly isValid: boolean;
    ngModelState(ngm: AbstractControlDirective): string;
}
