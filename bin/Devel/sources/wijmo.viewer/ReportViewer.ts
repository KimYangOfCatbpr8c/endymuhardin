module wijmo.viewer {
    'use strict';

    var parametersIcon = '<path d="M24,11.9v-2h-4V7h0V5h0h-1h-5V2h0V0h0h-1H1H0h0v2h0v11h0v1h0h1h5v4h0v1h0h1h3v4h0v1h0h1h2.1v-1H11V12h2.1v-2H11h-1h0v2h0v6H7V7h12v2.9h-1v2h5V23h-4.9v1H23h1h0v-1h0L24,11.9L24,11.9z M6,5L6,5l0,2h0v6H1V2h12v3H7H6z"/>' +
            '<path d="M20,20v-3v-1h-1h-1v-1v-1h-1h-3h-1v1v3v1h1h1v2h0h1h3h1h0L20,20L20,20z M14,18v-3h3v1h-1h-1v1v1H14z M17,17v1h-1v-1H17z M16,20v-1h1h1v-1v-1h1v3H16z"/>';

    /**
     * Defines the report viewer control for displaying a FlexReport or SSRS report document source.
     */
    export class ReportViewer extends ViewerBase {

        private _reportName: string;

        /**
         * Initializes a new instance of a @see:ReportViewer control.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?: any) {
            super(element, options);
            this._initSidePanelParameters();
        }

        /**
        * Gets or sets the report name.
        *
        * Sets it with the report name defined in the FlexReport definition file. Please ignore it for SSRS report.
        */
        get reportName(): string {
            return this._reportName;
        }
        set reportName(value: string) {
            if (value != this._reportName) {
                this._reportName = value;
                this._needBindDocumentSource();
                this.invalidate();
            }
        }

        /**
        * Gets or sets a value indicating whether the content should be represented as set of fixed sized pages.
        * 
        * The default value is null, means using the default value from document source.
        */
        get paginated(): boolean {
            return this._innerPaginated;
        }
        set paginated(value: boolean) {
            this._innerPaginated = value;
        }

        /**
         * Gets the report names defined in the specified FlexReport definition file.
         *
         * @param serviceUrl The root url of service.
         * @param reportFilePath The report file path.
         * @return An @see:wijmo.viewer.IPromise object with a string array which contians the report names.
         */
        static getReportNames(serviceUrl: string, reportFilePath: string): IPromise {
            return _Report.getReportNames(serviceUrl, reportFilePath);
        }

        /**
         * Gets the catalog items in the specified folder path.
         *
         * @param serviceUrl The root url of service.
         * @param path The folder path.
         * @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
         * @return An @see:IPromise object with an array of @see:wijmo.viewer.ICatalogItem.
         */
        static getReports(serviceUrl: string, path: string, data?: any): IPromise {
            return _Report.getReports(serviceUrl, path, data);
        }

        private static _isRequiringParameters(parameters: _IParameter[]): boolean {
            for (var i = 0; i < parameters.length; i++) {
                if ((parameters[i].value === null || parameters[i].value === undefined) && !parameters[i].nullable) {
                    return true;
                }
            }
            return false;
        }

        private _initSidePanelParameters() {
            var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
            sideTabs.addPage(wijmo.culture.Viewer.parameters, parametersIcon, 2).format(t => {
                var paramsEditor = new _ParametersEditor(t.content);
                paramsEditor.commit.addHandler(() => {
                    if (!this._innerDocumentSource || !this._innerDocumentSource.hasParameters) {
                        return;
                    }

                    this._showViewPanelMessage();
                    this._innerDocumentSource.setParameters(paramsEditor.parameters).then(v => {
                        var newParams = <_IParameter[]>(v || []);
                        var hasError = newParams.some(p => !!p.error);
                        if (hasError) {
                            paramsEditor.itemsSource = newParams;
                        } else {
                            this._resetDocument();
                            this._renderDocumentSource();
                        }
                    }).catch(reason => {
                        this._showViewPanelErrorMessage(this._getErrorMessage(reason));
                    });
                });

                paramsEditor.validate.addHandler(() => {
                    if (!this._innerDocumentSource || !this._innerDocumentSource.hasParameters) {
                        return;
                    }

                    this._innerDocumentSource.setParameters(paramsEditor.parameters).then(v => {
                        paramsEditor.itemsSource = v;
                    });
                });

                var updateParametersPanel = () => {
                    var documentSource = this._innerDocumentSource;
                    if (documentSource.status === _ExecutionStatus.cleared ||
                        documentSource.status === _ExecutionStatus.notFound) {
                        _removeChildren(t.content);
                        return;
                    }

                    if (documentSource.status !== _ExecutionStatus.loaded) {
                        return;
                    }

                    if (!documentSource.hasParameters) {
                        sideTabs.hide(t);
                        return;
                    }

                    sideTabs.show(t);
                    sideTabs.active(t);
                    documentSource.getParameters().then(v => {
                        if (this._innerDocumentSource != documentSource ||  documentSource.isDisposed) {
                            return;
                        }

                        paramsEditor.itemsSource = v;
                        if (ReportViewer._isRequiringParameters(v)) {
                            this._showViewPanelMessage(wijmo.culture.Viewer.requiringParameters);
                        } else {
                            this._renderDocumentSource();
                        }
                    });
                }, update = () => {
                    if (!this._innerDocumentSource) {
                        return;
                    }

                    _addWjHandler(this._documentEventKey, this._innerDocumentSource.statusChanged, updateParametersPanel);
                    updateParametersPanel();
                };

                this._documentSourceChanged.addHandler(update);
                update();
            });
        }

        private _updateLoadingDivContent(content: string) {
            var self = this, viewPage: HTMLDivElement = <HTMLDivElement>this._viewpanelContainer.querySelector('.wj-view-page'),
                loadingDiv, loadingDivList = this._viewpanelContainer.querySelectorAll('.wj-loading');

            if (loadingDivList && loadingDivList.length > 0) {
                for (var i = 0; i < loadingDivList.length; i++) {
                    (<HTMLElement>loadingDivList.item(i)).innerHTML = content;
                }
            } else {
                loadingDiv = document.createElement('div');
                loadingDiv.className = 'wj-loading';
                loadingDiv.style.height = viewPage.offsetHeight + 'px';
                loadingDiv.style.lineHeight = viewPage.offsetHeight + 'px';
                loadingDiv.innerHTML = content;
                viewPage.appendChild(loadingDiv);
            }
        }

        get _innerDocumentSource(): _Report {
            return <_Report>this._getDocumentSource();
        }

        _loadDocument(value: _Report): IPromise {
            var isChanged = this._innerDocumentSource !== value;
            var promise = super._loadDocument(value);

            if (value && isChanged) {
                _addWjHandler(this._documentEventKey, value.statusChanged, this._onDocumentStatusChanged, this);
            }

            return promise;
        }

        _reRenderDocument() {
            this._renderDocumentSource();
        }

        _onDocumentStatusChanged() {
            if (!this._innerDocumentSource
                || this._innerDocumentSource.status !== _ExecutionStatus.loaded
                || this._innerDocumentSource.hasParameters) {
                return;
            }

            this._renderDocumentSource();
        }

        private _renderDocumentSource() {
            if (!this._innerDocumentSource) {
                return;
            }

            this._setDocumentRendering();
            var documentSource = this._innerDocumentSource;
            documentSource.render().then(v => this._getStatusUtilCompleted(documentSource));
        }

        _disposeDocument() {
            if (this._innerDocumentSource) {
                _removeAllWjHandlers(this._documentEventKey, this._innerDocumentSource.statusChanged);
            }

            super._disposeDocument();
        }

        _setDocumentRendering(): void {
            this._innerDocumentSource._updateStatus(_ExecutionStatus.rendering);
            super._setDocumentRendering();
        }

        _getSource(): _Report {
            if (!this.filePath) {
                return null;
            }

            return new _Report({
                serviceUrl: this.serviceUrl,
                filePath: this.filePath,
                reportName: this.reportName,
                paginated: this.paginated
            });
        }
    }

    export class _ParametersEditor extends Control {

        private _itemSources: _IParameter[];
        private _parameters: Object = {};
        private _errors: any[] = [];
        private static _paramIdAttr = 'param-id';
        private static _errorsHiddenCss = 'wj-parametererrors-hidden';
        private _errorsVisible = false;
        private _validateTimer: number;
        private _lastEditedParam: string;
        private static _dateTimeFormat = 'MM/dd/yyyy HH:mm';

        commit = new Event();
        validate = new Event();

        constructor(element: any) {
            super(element);
            addClass(this.hostElement, 'wj-parameterscontainer');
            this._updateErrorsVisible();
        }

        _setErrors(value: any[]) {
            this._errors = value;
            this._updateErrorDiv();
        }

        get parameters(): Object {
            return this._parameters;
        }

        get itemsSource(): _IParameter[] {
            return this._itemSources;
        }
        set itemsSource(value: _IParameter[]) {
            this._itemSources = value;
            this._parameters = {};
            this._render();
            var errors = [];
            (value || []).forEach(v => {
                if (v.error) {
                    errors.push({ key: v.name, value: v.error });
                }
            });

            this._setErrors(errors);
        }

        _setErrorsVisible(value: boolean) {
            this._errorsVisible = value;
            this._updateErrorsVisible();
        }

        _updateErrorsVisible() {
            if (this._errorsVisible) {
                removeClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
            } else {
                addClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
            }
        }

        onCommit() {
            this.commit.raise(this, new EventArgs());
        }

        onValidate() {
            this.validate.raise(this, new EventArgs());
            this._setErrorsVisible(false);
        }

        _deferValidate(paramName: string, beforeValidate?: Function, afterValidate?: Function) {
            if (this._validateTimer != null) {
                clearTimeout(this._validateTimer);
                this._validateTimer = null;
            }

            this._validateTimer = setTimeout(() => {
                if (beforeValidate != null) {
                    beforeValidate();
                }

                this.onValidate();

                if (afterValidate != null) {
                    afterValidate();
                }

                this._lastEditedParam = paramName;
                this._validateTimer = null;
            }, 500);
        }

        private _updateErrorDiv() {
            var errorList = this._errors || [], errorDivList = this.hostElement.querySelectorAll('.error');
            for (var i = 0; i < errorDivList.length; i++) {
                errorDivList[i].parentNode.removeChild(errorDivList[i]);
            }

            for (var i = 0; i < errorList.length; i++) {
                var errorMessageDiv: HTMLDivElement,
                    element = <HTMLElement>this.hostElement.querySelector('*[' + _ParametersEditor._paramIdAttr + '="' + errorList[i].key + '"]'),
                    message = errorList[i].value;
                if (element) {
                    errorMessageDiv = document.createElement('div');
                    errorMessageDiv.innerHTML = message;
                    errorMessageDiv.className = 'error';
                    element.appendChild(errorMessageDiv);
                }
            }
        }

        _render() {
            var parameters = this._itemSources, lastEditor: Element,
                condition: (node: Element) => boolean = null;
            if (parameters && this._lastEditedParam) {
                condition = ele => {
                    var curName = ele.getAttribute(_ParametersEditor._paramIdAttr);
                    if (curName !== this._lastEditedParam) {
                        return true;
                    }

                    lastEditor = ele;
                    return false;
                };
            }

            _removeChildren(this.hostElement, condition);
            if (!parameters) {
                return;
            }

            for (var i = 0; i < parameters.length; i++) {
                var curParam = parameters[i];
                if (this._lastEditedParam === curParam.name) {
                    this._lastEditedParam = null;
                    lastEditor = null;
                    continue;
                }

                if (!!curParam.hidden) {
                    continue;
                }

                var parameterContainer: HTMLDivElement = document.createElement('div'),
                    parameterLabel: HTMLSpanElement = document.createElement('span'),
                    parameterControl: HTMLElement = null, control: any;
                parameterContainer.className = 'wj-parametercontainer';
                parameterLabel.className = 'wj-parameterhead';
                parameterLabel.innerHTML = curParam.prompt || curParam.name;

                if (isArray(curParam.allowedValues)) {
                    parameterControl = this._generateComboEditor(curParam);
                } else {
                    switch (curParam.dataType) {
                        case _ParameterType.Boolean:
                            parameterControl = this._generateBoolEditor(curParam);
                            break;
                        case _ParameterType.DateTime:
                        case _ParameterType.Time:
                        case _ParameterType.Date:
                            parameterControl = this._generateDateTimeEditor(curParam);
                            break;
                        case _ParameterType.Integer:
                        case _ParameterType.Float:
                            parameterControl = this._generateNumberEditor(curParam);
                            break;
                        case _ParameterType.String:
                            parameterControl = this._generateStringEditor(curParam);
                            break;
                    }
                }
                if (parameterControl) {
                    parameterControl.className += ' wj-parametercontrol';
                    parameterContainer.setAttribute(_ParametersEditor._paramIdAttr, curParam.name)
                    parameterContainer.appendChild(parameterLabel);
                    parameterContainer.appendChild(parameterControl);
                    if (lastEditor) {
                        this.hostElement.insertBefore(parameterContainer, lastEditor);
                    } else {
                        this.hostElement.appendChild(parameterContainer);
                    }
                }
            }

            var applyBtn = document.createElement('input');
            applyBtn.type = 'button';
            applyBtn.value = wijmo.culture.Viewer.apply;
            applyBtn.className = 'wj-applybutton';
            _addEvent(applyBtn, 'click', () => {
                if (this._validateParameters()) {
                    this._errors = [];
                    this.onCommit();
                }

                this._setErrorsVisible(true);
            });

            this.hostElement.appendChild(applyBtn);
        }

        _validateParameters(): boolean {
            var textareas: NodeList = this.hostElement.querySelectorAll('textarea'),
                element: HTMLElement, errorList = [], parameters = this.itemsSource;

            for (var i = 0; i < parameters.length; i++) {
                var curParam = parameters[i];
                element = <HTMLElement>this.hostElement.querySelector('[' + _ParametersEditor._paramIdAttr + '="' + curParam.name + '"]');
                if (!curParam.nullable && !this.parameters.hasOwnProperty(curParam.name) && !this.parameters[curParam.name]
                    && (curParam.value === null || curParam.value === undefined || curParam.value === "")) {
                    if (element) {
                        errorList.push({ key: curParam.name, value: wijmo.culture.Viewer.nullParameterError });
                    }
                }
            }

            //check input text's format.
            for (var i = 0; i < textareas.length; i++) {
                var textarea: HTMLTextAreaElement = <HTMLTextAreaElement>textareas.item(i), dataType: number,
                    values: any[] = [], currentResult: boolean = true;
                dataType = parseInt(textarea.getAttribute('data-type'));

                switch (dataType) {
                    case _ParameterType.Date:
                    case _ParameterType.DateTime:
                    case _ParameterType.Time:
                        currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isDate);
                        break;
                    case _ParameterType.Float:
                        currentResult = _ParametersEditor._checkValueType(textarea.value, _ParametersEditor._isFloat);
                        break;
                    case _ParameterType.Integer:
                        currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isInt);
                        break;
                }

                if (!currentResult) {
                    errorList.push({ key: textarea.parentElement.id, value: wijmo.culture.Viewer.invalidParameterError });
                }
            }

            this._setErrors(errorList);
            return errorList.length <= 0;
        }

        static _isFloat(value: string) {
            return !isNaN(parseFloat(value));
        }

        static _checkValueType(value: string, isSpecificType: Function): boolean {
            var values: string[] = value.split('\n');

            for (var i = 0; i < values.length; i++) {
                if (values[i].trim().length <= 0 || isSpecificType(values[i].trim())) {
                    continue;
                } else {
                    return false;
                }
            }
            return true;
        }

        private _generateComboEditor(parameter: _IParameter): HTMLElement {
            var combo, itemsSource: Object[] = [], element = document.createElement('div'),
                multiSelect: _MultiSelectEx, values, checkedItems = [],
                isParameterResolved = (parameter.allowedValues && parameter.allowedValues.length > 0);

            if (parameter.multiValue) {
                combo = new _MultiSelectEx(element);
            } else {
                combo = new input.ComboBox(element);
                if (parameter.nullable) {
                    itemsSource.push({ name: wijmo.culture.Viewer.parameterNoneItemsSelected, value: null });
                } else if (parameter.value == null && isParameterResolved) {
                    itemsSource.push({ name: wijmo.culture.Viewer.selectParameterValue, value: null });
                }
            }
            combo.isEditable = false;
            combo.displayMemberPath = 'name';
            combo.selectedValuePath = 'value';
            combo.isDisabled = !isParameterResolved;

            for (var i = 0; i < parameter.allowedValues.length; i++) {
                itemsSource.push({ name: parameter.allowedValues[i].key, value: parameter.allowedValues[i].value });
            }
            combo.itemsSource = itemsSource;

            if (parameter.multiValue) {
                multiSelect = combo;
                if (!isParameterResolved) {
                    multiSelect.checkedItems = [];
                } else if (parameter.value) {
                    for (var i = 0; i < parameter.value.length; i++) {
                        for (var j = 0; j < multiSelect.itemsSource.length; j++) {
                            if (multiSelect.itemsSource[j].value === parameter.value[i]) {
                                checkedItems.push(multiSelect.itemsSource[j]);
                                break;
                            }
                        }
                    }
                    multiSelect.checkedItems = checkedItems;
                }

                multiSelect.checkedItemsChanged.addHandler(() => {
                    this._deferValidate(parameter.name, () => {
                        values = [];
                        for (var i = 0; i < multiSelect.checkedItems.length; i++) {
                            values.push(multiSelect.checkedItems[i]['value']);
                        }
                        this._updateParameters(parameter, values);
                    }, () => {
                        if (values.length > 0 && !parameter.nullable) {
                            this._validateNullValueOfParameter(element);
                        }
                    });
                });
            } else {
                if (!isParameterResolved) {
                    combo.selectedValue = null;
                } else {
                    combo.selectedValue = parameter.value;
                }

                var updating = false;
                combo.selectedIndexChanged.addHandler((sender) => {
                    this._deferValidate(parameter.name, () => {
                        if (updating) {
                            return;
                        }

                        this._updateParameters(parameter, sender.selectedValue);
                        if (sender.selectedValue && sender.itemsSource[0]['name'] === wijmo.culture.Viewer.selectParameterValue) {
                            setTimeout(() => {
                                updating = true;
                                var value = sender.selectedValue;
                                var index = sender.selectedIndex;
                                sender.itemsSource.shift();
                                sender.collectionView.refresh();
                                sender.selectedValue = value;
                                sender.selectedIndex = index - 1;
                                updating = false;
                            });
                        }
                    }, () => this._validateNullValueOfParameter(element));
                });
            }

            return element;
        }

        private _updateParameters(parameter: _IParameter, value: any): void {
            var spliteNewLine = (value: string, multiValues: boolean): any => {
                if (multiValues && !isArray(value)) {
                    return value.split(/[\r\n]+/);
                } else {
                    return value;
                }
            }, item: _IParameter;
            this.itemsSource.some(v => {
                if (v.name === parameter.name) {
                    item = v;
                    return true;
                }
                return false;
            });
            this._parameters[parameter.name] = item.value = parameter.value = spliteNewLine(value, parameter.multiValue);
        }

        private _generateBoolEditor(parameter: _IParameter): HTMLElement {
            var checkEditor: any, itemsSource: Object[] = [], element: any;
            if (parameter.nullable) {
                element = document.createElement('div');
                checkEditor = new input.ComboBox(element);
                checkEditor.isEditable = false;
                checkEditor.displayMemberPath = 'name';
                checkEditor.selectedValuePath = 'value';
                itemsSource.push({ name: 'None', value: null });
                itemsSource.push({ name: 'True', value: true });
                itemsSource.push({ name: 'False', value: false });
                checkEditor.itemsSource = itemsSource;
                checkEditor.selectedValue = parameter.value;
                checkEditor.selectedIndexChanged.addHandler(sender => {
                    this._deferValidate(parameter.name, () => this._updateParameters(parameter, sender.selectedValue));
                });
            } else {
                element = document.createElement('input');
                element.type = 'checkbox';
                element.checked = parameter.value;
                _addEvent(element, 'click', () => {
                    this._deferValidate(parameter.name, () => this._updateParameters(parameter, element.checked));
                });
            }
            return element;
        }

        private _generateStringEditor(parameter: _IParameter): HTMLElement {
            var self = this, element: any;

            if (parameter.multiValue) {
                element = self._createTextarea(parameter.value, parameter.dataType);
            } else {
                element = document.createElement('input');
                element.type = 'text';
                if (parameter.value) {
                    element.value = parameter.value;
                }
            }

            self._bindTextChangedEvent(element, parameter);
            return element;
        }

        private _createTextarea(value: any[], dataType: _ParameterType): HTMLTextAreaElement {
            var textarea: HTMLTextAreaElement = <HTMLTextAreaElement>document.createElement('textarea'), format: string, dates: string[] = [];

            if (dataType === _ParameterType.DateTime || dataType === _ParameterType.Time || dataType === _ParameterType.Date) {
                format = _ParametersEditor._dateTimeFormat;
            }

            if (value && value.length > 0) {
                if (format) {
                    for (var i = 0; i < value.length; i++) {
                        dates.push(Globalize.formatDate(new Date(value[i]), format));
                    }
                    textarea.value = dates.join('\n');
                } else {
                    textarea.value = value.join('\n');
                }
            }
            textarea.wrap = 'off';
            textarea.setAttribute('data-type', dataType.toString());
            return textarea;
        }

        private _bindTextChangedEvent(element: any, parameter: _IParameter) {
            _addEvent(element, 'change,keyup,paste,input', () => {
                this._deferValidate(parameter.name, () => this._updateParameters(parameter, element.value), () => {
                    if (element.value && !parameter.nullable) {
                        this._validateNullValueOfParameter(element);
                    }
                });
            });
        }

        private _generateNumberEditor(parameter: _IParameter) {
            var element: any, inputNumber: wijmo.input.InputNumber;
            if (parameter.multiValue) {
                element = this._createTextarea(parameter.value, parameter.dataType);
                this._bindTextChangedEvent(element, parameter);
            } else {
                element = document.createElement('div');
                inputNumber = new input.InputNumber(element);
                inputNumber.format = parameter.dataType === _ParameterType.Integer ? 'n0' : 'n2';
                inputNumber.isRequired = !parameter.nullable;
                if (parameter.value) {
                    inputNumber.value = parameter.dataType === _ParameterType.Integer ? parseInt(parameter.value) : parseFloat(parameter.value);
                }
                inputNumber.valueChanged.addHandler((sender) => {
                    this._deferValidate(parameter.name, () => this._updateParameters(parameter, sender.value));
                });
            }
            return element;
        }

        private _generateDateTimeEditor(parameter: _IParameter) {
            var element: any, input: any;
            if (parameter.multiValue) {
                element = this._createTextarea(parameter.value, parameter.dataType);
                element.title = _ParametersEditor._dateTimeFormat;
                this._bindTextChangedEvent(element, parameter);
            } else {
                element = document.createElement('div');
                if (parameter.dataType == _ParameterType.Date
                    || parameter.dataType === _ParameterType.DateTime) {
                    input = new wijmo.input.InputDate(element);
                } else {
                    input = new wijmo.input.InputTime(element);
                    input.step = 60;
                }
                input.isRequired = !parameter.nullable;
                if (parameter.value) {
                    input.value = new Date(parameter.value);
                }
                input.valueChanged.addHandler(() => {
                    this._deferValidate(parameter.name, () => this._updateParameters(parameter, input.value.toJSON()));
                });
            }
            return element;
        }

        private _validateNullValueOfParameter(element: HTMLElement) {
            var errors = this._errors;
            if (!errors || !errors.length) {
                return;
            }

            for (var i = 0; i < errors.length; i++) {
                if (errors[i].key !== element.parentElement.getAttribute(_ParametersEditor._paramIdAttr)) {
                    continue;
                }

                var errorDiv = element.parentElement.querySelector('.error');
                if (!errorDiv) {
                    continue;
                }

                element.parentElement.removeChild(errorDiv);
                errors.splice(i, 1);
                break;
            }
        }
    }

    // Extends MultiSelect control with Select All function.
    export class _MultiSelectEx {
        private _itemsSource: any[];
        private _selectAllItem: any;
        private _multiSelect: input.MultiSelect;
        private _selectedAll = false;
        private _innerCheckedItemsChanged = false;

        checkedItemsChanged = new Event();

        constructor(element: HTMLElement) {
            var self = this, multiSelect = new input.MultiSelect(element);
            self._multiSelect = multiSelect;
            multiSelect.checkedItemsChanged.addHandler(self.onCheckedItemsChanged, self);
            multiSelect.isDroppedDownChanged.addHandler(self.onIsDroppedDownChanged, self);
            multiSelect.headerFormatter = () => self._updateHeader();
        }

        _updateHeader(): string {
            var self = this,
                checkedItems = self.checkedItems || [],
                texts = [],
                displayMemberPath = self.displayMemberPath;
            if (!checkedItems.length) {
                return wijmo.culture.Viewer.parameterNoneItemsSelected;
            }

            if (self._selectedAll) {
                return wijmo.culture.Viewer.parameterAllItemsSelected;
            }

            if (displayMemberPath) {
                for (var i = 0; i < checkedItems.length; i++) {
                    texts[i] = checkedItems[i][displayMemberPath];
                }

                return texts.join(', ');
            }

            return checkedItems.join(', ');
        }

        onIsDroppedDownChanged() {
            if (!this._multiSelect.isDroppedDown) {
                return;
            }

            this._updateSelectedAll();
        }

        onCheckedItemsChanged(sender, e) {
            var self = this;
            if (self._innerCheckedItemsChanged) {
                return;
            }

            if (!self._selectAllItem) {
                self.checkedItemsChanged.raise(self, e);
                return;
            }

            self._updateSelectedAll();
            self.checkedItemsChanged.raise(self, e);
        }

        get isEditable(): boolean {
            return this._multiSelect.isEditable;
        }
        set isEditable(value: boolean) {
            this._multiSelect.isEditable = value;
        }

        get isDisabled(): boolean {
            return this._multiSelect.isDisabled;
        }
        set isDisabled(value: boolean) {
            this._multiSelect.isDisabled = value;
        }

        get displayMemberPath(): string {
            return this._multiSelect.displayMemberPath;
        }
        set displayMemberPath(value: string) {
            this._multiSelect.displayMemberPath = value;
        }

        get selectedValuePath(): string {
            return this._multiSelect.selectedValuePath;
        }
        set selectedValuePath(value: string) {
            this._multiSelect.selectedValuePath = value;
        }

        get itemsSource(): any[] {
            return this._itemsSource;
        }
        set itemsSource(value: any[]) {
            var self = this, displayMemberPath = self.displayMemberPath || 'name';
            self._itemsSource = value;
            var innerSources = [];
            if (value) {
                if (value.length > 1) {
                    self._selectAllItem = {};
                    self._selectAllItem[displayMemberPath] = wijmo.culture.Viewer.parameterSelectAllItemText;
                    innerSources.push(self._selectAllItem);
                } else {
                    self._selectAllItem = null;
                }

                innerSources = innerSources.concat(value);
            }

            self._multiSelect.itemsSource = innerSources;
        }

        get checkedItems(): any[] {
            var self = this, items = [];
            if (self._multiSelect.checkedItems) {
                items = self._multiSelect.checkedItems.slice();
            }

            var index = items.indexOf(self._selectAllItem);
            if (index > -1) {
                items.splice(index, 1);
            }

            return items;
        }
        set checkedItems(value: any[]) {
            var self = this;
            self._multiSelect.checkedItems = value;
            self._selectedAll = false;
            self._updateSelectedAll();
        }

        _updateSelectedAll() {
            var self = this;
            if (!self._selectAllItem) {
                return;
            }

            var checkedItems = self._multiSelect.checkedItems || [],
                selectedAllIndex = checkedItems.indexOf(self._selectAllItem),
                selectedAll = selectedAllIndex > -1,
                selectAllItemChanged = self._selectedAll !== selectedAll;

            if (selectAllItemChanged) {
                self._selectedAll = selectedAll;
                self._innerCheckedItemsChanged = true;
                if (self._selectedAll) {
                    self._multiSelect.checkedItems = self._multiSelect.itemsSource.slice();
                } else {
                    self._multiSelect.checkedItems = [];
                }

                self._innerCheckedItemsChanged = false;
                return;
            }

            self._selectedAll = checkedItems && self._itemsSource &&
                (checkedItems.length - (selectedAll ? 1 : 0) === self._itemsSource.length);
            if (self._selectedAll === selectedAll) {
                return;
            }

            self._innerCheckedItemsChanged = true;
            if (self._selectedAll) {
                self._multiSelect.checkedItems = checkedItems.concat(self._selectAllItem);
            } else {
                checkedItems = checkedItems.slice();
                checkedItems.splice(selectedAllIndex, 1);
                self._multiSelect.checkedItems = checkedItems;
            }

            self._innerCheckedItemsChanged = false;
        }
    }
}
