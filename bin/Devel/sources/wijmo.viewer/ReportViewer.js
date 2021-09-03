var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var parametersIcon = '<path d="M24,11.9v-2h-4V7h0V5h0h-1h-5V2h0V0h0h-1H1H0h0v2h0v11h0v1h0h1h5v4h0v1h0h1h3v4h0v1h0h1h2.1v-1H11V12h2.1v-2H11h-1h0v2h0v6H7V7h12v2.9h-1v2h5V23h-4.9v1H23h1h0v-1h0L24,11.9L24,11.9z M6,5L6,5l0,2h0v6H1V2h12v3H7H6z"/>' +
            '<path d="M20,20v-3v-1h-1h-1v-1v-1h-1h-3h-1v1v3v1h1h1v2h0h1h3h1h0L20,20L20,20z M14,18v-3h3v1h-1h-1v1v1H14z M17,17v1h-1v-1H17z M16,20v-1h1h1v-1v-1h1v3H16z"/>';
        /**
         * Defines the report viewer control for displaying a FlexReport or SSRS report document source.
         */
        var ReportViewer = (function (_super) {
            __extends(ReportViewer, _super);
            /**
             * Initializes a new instance of a @see:ReportViewer control.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function ReportViewer(element, options) {
                _super.call(this, element, options);
                this._initSidePanelParameters();
            }
            Object.defineProperty(ReportViewer.prototype, "reportName", {
                /**
                * Gets or sets the report name.
                *
                * Sets it with the report name defined in the FlexReport definition file. Please ignore it for SSRS report.
                */
                get: function () {
                    return this._reportName;
                },
                set: function (value) {
                    if (value != this._reportName) {
                        this._reportName = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReportViewer.prototype, "paginated", {
                /**
                * Gets or sets a value indicating whether the content should be represented as set of fixed sized pages.
                *
                * The default value is null, means using the default value from document source.
                */
                get: function () {
                    return this._innerPaginated;
                },
                set: function (value) {
                    this._innerPaginated = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the report names defined in the specified FlexReport definition file.
             *
             * @param serviceUrl The root url of service.
             * @param reportFilePath The report file path.
             * @return An @see:wijmo.viewer.IPromise object with a string array which contians the report names.
             */
            ReportViewer.getReportNames = function (serviceUrl, reportFilePath) {
                return viewer._Report.getReportNames(serviceUrl, reportFilePath);
            };
            /**
             * Gets the catalog items in the specified folder path.
             *
             * @param serviceUrl The root url of service.
             * @param path The folder path.
             * @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
             * @return An @see:IPromise object with an array of @see:wijmo.viewer.ICatalogItem.
             */
            ReportViewer.getReports = function (serviceUrl, path, data) {
                return viewer._Report.getReports(serviceUrl, path, data);
            };
            ReportViewer._isRequiringParameters = function (parameters) {
                for (var i = 0; i < parameters.length; i++) {
                    if ((parameters[i].value === null || parameters[i].value === undefined) && !parameters[i].nullable) {
                        return true;
                    }
                }
                return false;
            };
            ReportViewer.prototype._initSidePanelParameters = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                sideTabs.addPage(wijmo.culture.Viewer.parameters, parametersIcon, 2).format(function (t) {
                    var paramsEditor = new _ParametersEditor(t.content);
                    paramsEditor.commit.addHandler(function () {
                        if (!_this._innerDocumentSource || !_this._innerDocumentSource.hasParameters) {
                            return;
                        }
                        _this._showViewPanelMessage();
                        _this._innerDocumentSource.setParameters(paramsEditor.parameters).then(function (v) {
                            var newParams = (v || []);
                            var hasError = newParams.some(function (p) { return !!p.error; });
                            if (hasError) {
                                paramsEditor.itemsSource = newParams;
                            }
                            else {
                                _this._resetDocument();
                                _this._renderDocumentSource();
                            }
                        }).catch(function (reason) {
                            _this._showViewPanelErrorMessage(_this._getErrorMessage(reason));
                        });
                    });
                    paramsEditor.validate.addHandler(function () {
                        if (!_this._innerDocumentSource || !_this._innerDocumentSource.hasParameters) {
                            return;
                        }
                        _this._innerDocumentSource.setParameters(paramsEditor.parameters).then(function (v) {
                            paramsEditor.itemsSource = v;
                        });
                    });
                    var updateParametersPanel = function () {
                        var documentSource = _this._innerDocumentSource;
                        if (documentSource.status === viewer._ExecutionStatus.cleared ||
                            documentSource.status === viewer._ExecutionStatus.notFound) {
                            viewer._removeChildren(t.content);
                            return;
                        }
                        if (documentSource.status !== viewer._ExecutionStatus.loaded) {
                            return;
                        }
                        if (!documentSource.hasParameters) {
                            sideTabs.hide(t);
                            return;
                        }
                        sideTabs.show(t);
                        sideTabs.active(t);
                        documentSource.getParameters().then(function (v) {
                            if (_this._innerDocumentSource != documentSource || documentSource.isDisposed) {
                                return;
                            }
                            paramsEditor.itemsSource = v;
                            if (ReportViewer._isRequiringParameters(v)) {
                                _this._showViewPanelMessage(wijmo.culture.Viewer.requiringParameters);
                            }
                            else {
                                _this._renderDocumentSource();
                            }
                        });
                    }, update = function () {
                        if (!_this._innerDocumentSource) {
                            return;
                        }
                        viewer._addWjHandler(_this._documentEventKey, _this._innerDocumentSource.statusChanged, updateParametersPanel);
                        updateParametersPanel();
                    };
                    _this._documentSourceChanged.addHandler(update);
                    update();
                });
            };
            ReportViewer.prototype._updateLoadingDivContent = function (content) {
                var self = this, viewPage = this._viewpanelContainer.querySelector('.wj-view-page'), loadingDiv, loadingDivList = this._viewpanelContainer.querySelectorAll('.wj-loading');
                if (loadingDivList && loadingDivList.length > 0) {
                    for (var i = 0; i < loadingDivList.length; i++) {
                        loadingDivList.item(i).innerHTML = content;
                    }
                }
                else {
                    loadingDiv = document.createElement('div');
                    loadingDiv.className = 'wj-loading';
                    loadingDiv.style.height = viewPage.offsetHeight + 'px';
                    loadingDiv.style.lineHeight = viewPage.offsetHeight + 'px';
                    loadingDiv.innerHTML = content;
                    viewPage.appendChild(loadingDiv);
                }
            };
            Object.defineProperty(ReportViewer.prototype, "_innerDocumentSource", {
                get: function () {
                    return this._getDocumentSource();
                },
                enumerable: true,
                configurable: true
            });
            ReportViewer.prototype._loadDocument = function (value) {
                var isChanged = this._innerDocumentSource !== value;
                var promise = _super.prototype._loadDocument.call(this, value);
                if (value && isChanged) {
                    viewer._addWjHandler(this._documentEventKey, value.statusChanged, this._onDocumentStatusChanged, this);
                }
                return promise;
            };
            ReportViewer.prototype._reRenderDocument = function () {
                this._renderDocumentSource();
            };
            ReportViewer.prototype._onDocumentStatusChanged = function () {
                if (!this._innerDocumentSource
                    || this._innerDocumentSource.status !== viewer._ExecutionStatus.loaded
                    || this._innerDocumentSource.hasParameters) {
                    return;
                }
                this._renderDocumentSource();
            };
            ReportViewer.prototype._renderDocumentSource = function () {
                var _this = this;
                if (!this._innerDocumentSource) {
                    return;
                }
                this._setDocumentRendering();
                var documentSource = this._innerDocumentSource;
                documentSource.render().then(function (v) { return _this._getStatusUtilCompleted(documentSource); });
            };
            ReportViewer.prototype._disposeDocument = function () {
                if (this._innerDocumentSource) {
                    viewer._removeAllWjHandlers(this._documentEventKey, this._innerDocumentSource.statusChanged);
                }
                _super.prototype._disposeDocument.call(this);
            };
            ReportViewer.prototype._setDocumentRendering = function () {
                this._innerDocumentSource._updateStatus(viewer._ExecutionStatus.rendering);
                _super.prototype._setDocumentRendering.call(this);
            };
            ReportViewer.prototype._getSource = function () {
                if (!this.filePath) {
                    return null;
                }
                return new viewer._Report({
                    serviceUrl: this.serviceUrl,
                    filePath: this.filePath,
                    reportName: this.reportName,
                    paginated: this.paginated
                });
            };
            return ReportViewer;
        }(viewer.ViewerBase));
        viewer.ReportViewer = ReportViewer;
        var _ParametersEditor = (function (_super) {
            __extends(_ParametersEditor, _super);
            function _ParametersEditor(element) {
                _super.call(this, element);
                this._parameters = {};
                this._errors = [];
                this._errorsVisible = false;
                this.commit = new wijmo.Event();
                this.validate = new wijmo.Event();
                wijmo.addClass(this.hostElement, 'wj-parameterscontainer');
                this._updateErrorsVisible();
            }
            _ParametersEditor.prototype._setErrors = function (value) {
                this._errors = value;
                this._updateErrorDiv();
            };
            Object.defineProperty(_ParametersEditor.prototype, "parameters", {
                get: function () {
                    return this._parameters;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ParametersEditor.prototype, "itemsSource", {
                get: function () {
                    return this._itemSources;
                },
                set: function (value) {
                    this._itemSources = value;
                    this._parameters = {};
                    this._render();
                    var errors = [];
                    (value || []).forEach(function (v) {
                        if (v.error) {
                            errors.push({ key: v.name, value: v.error });
                        }
                    });
                    this._setErrors(errors);
                },
                enumerable: true,
                configurable: true
            });
            _ParametersEditor.prototype._setErrorsVisible = function (value) {
                this._errorsVisible = value;
                this._updateErrorsVisible();
            };
            _ParametersEditor.prototype._updateErrorsVisible = function () {
                if (this._errorsVisible) {
                    wijmo.removeClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
                }
                else {
                    wijmo.addClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
                }
            };
            _ParametersEditor.prototype.onCommit = function () {
                this.commit.raise(this, new wijmo.EventArgs());
            };
            _ParametersEditor.prototype.onValidate = function () {
                this.validate.raise(this, new wijmo.EventArgs());
                this._setErrorsVisible(false);
            };
            _ParametersEditor.prototype._deferValidate = function (paramName, beforeValidate, afterValidate) {
                var _this = this;
                if (this._validateTimer != null) {
                    clearTimeout(this._validateTimer);
                    this._validateTimer = null;
                }
                this._validateTimer = setTimeout(function () {
                    if (beforeValidate != null) {
                        beforeValidate();
                    }
                    _this.onValidate();
                    if (afterValidate != null) {
                        afterValidate();
                    }
                    _this._lastEditedParam = paramName;
                    _this._validateTimer = null;
                }, 500);
            };
            _ParametersEditor.prototype._updateErrorDiv = function () {
                var errorList = this._errors || [], errorDivList = this.hostElement.querySelectorAll('.error');
                for (var i = 0; i < errorDivList.length; i++) {
                    errorDivList[i].parentNode.removeChild(errorDivList[i]);
                }
                for (var i = 0; i < errorList.length; i++) {
                    var errorMessageDiv, element = this.hostElement.querySelector('*[' + _ParametersEditor._paramIdAttr + '="' + errorList[i].key + '"]'), message = errorList[i].value;
                    if (element) {
                        errorMessageDiv = document.createElement('div');
                        errorMessageDiv.innerHTML = message;
                        errorMessageDiv.className = 'error';
                        element.appendChild(errorMessageDiv);
                    }
                }
            };
            _ParametersEditor.prototype._render = function () {
                var _this = this;
                var parameters = this._itemSources, lastEditor, condition = null;
                if (parameters && this._lastEditedParam) {
                    condition = function (ele) {
                        var curName = ele.getAttribute(_ParametersEditor._paramIdAttr);
                        if (curName !== _this._lastEditedParam) {
                            return true;
                        }
                        lastEditor = ele;
                        return false;
                    };
                }
                viewer._removeChildren(this.hostElement, condition);
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
                    var parameterContainer = document.createElement('div'), parameterLabel = document.createElement('span'), parameterControl = null, control;
                    parameterContainer.className = 'wj-parametercontainer';
                    parameterLabel.className = 'wj-parameterhead';
                    parameterLabel.innerHTML = curParam.prompt || curParam.name;
                    if (wijmo.isArray(curParam.allowedValues)) {
                        parameterControl = this._generateComboEditor(curParam);
                    }
                    else {
                        switch (curParam.dataType) {
                            case viewer._ParameterType.Boolean:
                                parameterControl = this._generateBoolEditor(curParam);
                                break;
                            case viewer._ParameterType.DateTime:
                            case viewer._ParameterType.Time:
                            case viewer._ParameterType.Date:
                                parameterControl = this._generateDateTimeEditor(curParam);
                                break;
                            case viewer._ParameterType.Integer:
                            case viewer._ParameterType.Float:
                                parameterControl = this._generateNumberEditor(curParam);
                                break;
                            case viewer._ParameterType.String:
                                parameterControl = this._generateStringEditor(curParam);
                                break;
                        }
                    }
                    if (parameterControl) {
                        parameterControl.className += ' wj-parametercontrol';
                        parameterContainer.setAttribute(_ParametersEditor._paramIdAttr, curParam.name);
                        parameterContainer.appendChild(parameterLabel);
                        parameterContainer.appendChild(parameterControl);
                        if (lastEditor) {
                            this.hostElement.insertBefore(parameterContainer, lastEditor);
                        }
                        else {
                            this.hostElement.appendChild(parameterContainer);
                        }
                    }
                }
                var applyBtn = document.createElement('input');
                applyBtn.type = 'button';
                applyBtn.value = wijmo.culture.Viewer.apply;
                applyBtn.className = 'wj-applybutton';
                viewer._addEvent(applyBtn, 'click', function () {
                    if (_this._validateParameters()) {
                        _this._errors = [];
                        _this.onCommit();
                    }
                    _this._setErrorsVisible(true);
                });
                this.hostElement.appendChild(applyBtn);
            };
            _ParametersEditor.prototype._validateParameters = function () {
                var textareas = this.hostElement.querySelectorAll('textarea'), element, errorList = [], parameters = this.itemsSource;
                for (var i = 0; i < parameters.length; i++) {
                    var curParam = parameters[i];
                    element = this.hostElement.querySelector('[' + _ParametersEditor._paramIdAttr + '="' + curParam.name + '"]');
                    if (!curParam.nullable && !this.parameters.hasOwnProperty(curParam.name) && !this.parameters[curParam.name]
                        && (curParam.value === null || curParam.value === undefined || curParam.value === "")) {
                        if (element) {
                            errorList.push({ key: curParam.name, value: wijmo.culture.Viewer.nullParameterError });
                        }
                    }
                }
                //check input text's format.
                for (var i = 0; i < textareas.length; i++) {
                    var textarea = textareas.item(i), dataType, values = [], currentResult = true;
                    dataType = parseInt(textarea.getAttribute('data-type'));
                    switch (dataType) {
                        case viewer._ParameterType.Date:
                        case viewer._ParameterType.DateTime:
                        case viewer._ParameterType.Time:
                            currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isDate);
                            break;
                        case viewer._ParameterType.Float:
                            currentResult = _ParametersEditor._checkValueType(textarea.value, _ParametersEditor._isFloat);
                            break;
                        case viewer._ParameterType.Integer:
                            currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isInt);
                            break;
                    }
                    if (!currentResult) {
                        errorList.push({ key: textarea.parentElement.id, value: wijmo.culture.Viewer.invalidParameterError });
                    }
                }
                this._setErrors(errorList);
                return errorList.length <= 0;
            };
            _ParametersEditor._isFloat = function (value) {
                return !isNaN(parseFloat(value));
            };
            _ParametersEditor._checkValueType = function (value, isSpecificType) {
                var values = value.split('\n');
                for (var i = 0; i < values.length; i++) {
                    if (values[i].trim().length <= 0 || isSpecificType(values[i].trim())) {
                        continue;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            };
            _ParametersEditor.prototype._generateComboEditor = function (parameter) {
                var _this = this;
                var combo, itemsSource = [], element = document.createElement('div'), multiSelect, values, checkedItems = [], isParameterResolved = (parameter.allowedValues && parameter.allowedValues.length > 0);
                if (parameter.multiValue) {
                    combo = new _MultiSelectEx(element);
                }
                else {
                    combo = new wijmo.input.ComboBox(element);
                    if (parameter.nullable) {
                        itemsSource.push({ name: wijmo.culture.Viewer.parameterNoneItemsSelected, value: null });
                    }
                    else if (parameter.value == null && isParameterResolved) {
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
                    }
                    else if (parameter.value) {
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
                    multiSelect.checkedItemsChanged.addHandler(function () {
                        _this._deferValidate(parameter.name, function () {
                            values = [];
                            for (var i = 0; i < multiSelect.checkedItems.length; i++) {
                                values.push(multiSelect.checkedItems[i]['value']);
                            }
                            _this._updateParameters(parameter, values);
                        }, function () {
                            if (values.length > 0 && !parameter.nullable) {
                                _this._validateNullValueOfParameter(element);
                            }
                        });
                    });
                }
                else {
                    if (!isParameterResolved) {
                        combo.selectedValue = null;
                    }
                    else {
                        combo.selectedValue = parameter.value;
                    }
                    var updating = false;
                    combo.selectedIndexChanged.addHandler(function (sender) {
                        _this._deferValidate(parameter.name, function () {
                            if (updating) {
                                return;
                            }
                            _this._updateParameters(parameter, sender.selectedValue);
                            if (sender.selectedValue && sender.itemsSource[0]['name'] === wijmo.culture.Viewer.selectParameterValue) {
                                setTimeout(function () {
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
                        }, function () { return _this._validateNullValueOfParameter(element); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._updateParameters = function (parameter, value) {
                var spliteNewLine = function (value, multiValues) {
                    if (multiValues && !wijmo.isArray(value)) {
                        return value.split(/[\r\n]+/);
                    }
                    else {
                        return value;
                    }
                }, item;
                this.itemsSource.some(function (v) {
                    if (v.name === parameter.name) {
                        item = v;
                        return true;
                    }
                    return false;
                });
                this._parameters[parameter.name] = item.value = parameter.value = spliteNewLine(value, parameter.multiValue);
            };
            _ParametersEditor.prototype._generateBoolEditor = function (parameter) {
                var _this = this;
                var checkEditor, itemsSource = [], element;
                if (parameter.nullable) {
                    element = document.createElement('div');
                    checkEditor = new wijmo.input.ComboBox(element);
                    checkEditor.isEditable = false;
                    checkEditor.displayMemberPath = 'name';
                    checkEditor.selectedValuePath = 'value';
                    itemsSource.push({ name: 'None', value: null });
                    itemsSource.push({ name: 'True', value: true });
                    itemsSource.push({ name: 'False', value: false });
                    checkEditor.itemsSource = itemsSource;
                    checkEditor.selectedValue = parameter.value;
                    checkEditor.selectedIndexChanged.addHandler(function (sender) {
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, sender.selectedValue); });
                    });
                }
                else {
                    element = document.createElement('input');
                    element.type = 'checkbox';
                    element.checked = parameter.value;
                    viewer._addEvent(element, 'click', function () {
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, element.checked); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._generateStringEditor = function (parameter) {
                var self = this, element;
                if (parameter.multiValue) {
                    element = self._createTextarea(parameter.value, parameter.dataType);
                }
                else {
                    element = document.createElement('input');
                    element.type = 'text';
                    if (parameter.value) {
                        element.value = parameter.value;
                    }
                }
                self._bindTextChangedEvent(element, parameter);
                return element;
            };
            _ParametersEditor.prototype._createTextarea = function (value, dataType) {
                var textarea = document.createElement('textarea'), format, dates = [];
                if (dataType === viewer._ParameterType.DateTime || dataType === viewer._ParameterType.Time || dataType === viewer._ParameterType.Date) {
                    format = _ParametersEditor._dateTimeFormat;
                }
                if (value && value.length > 0) {
                    if (format) {
                        for (var i = 0; i < value.length; i++) {
                            dates.push(wijmo.Globalize.formatDate(new Date(value[i]), format));
                        }
                        textarea.value = dates.join('\n');
                    }
                    else {
                        textarea.value = value.join('\n');
                    }
                }
                textarea.wrap = 'off';
                textarea.setAttribute('data-type', dataType.toString());
                return textarea;
            };
            _ParametersEditor.prototype._bindTextChangedEvent = function (element, parameter) {
                var _this = this;
                viewer._addEvent(element, 'change,keyup,paste,input', function () {
                    _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, element.value); }, function () {
                        if (element.value && !parameter.nullable) {
                            _this._validateNullValueOfParameter(element);
                        }
                    });
                });
            };
            _ParametersEditor.prototype._generateNumberEditor = function (parameter) {
                var _this = this;
                var element, inputNumber;
                if (parameter.multiValue) {
                    element = this._createTextarea(parameter.value, parameter.dataType);
                    this._bindTextChangedEvent(element, parameter);
                }
                else {
                    element = document.createElement('div');
                    inputNumber = new wijmo.input.InputNumber(element);
                    inputNumber.format = parameter.dataType === viewer._ParameterType.Integer ? 'n0' : 'n2';
                    inputNumber.isRequired = !parameter.nullable;
                    if (parameter.value) {
                        inputNumber.value = parameter.dataType === viewer._ParameterType.Integer ? parseInt(parameter.value) : parseFloat(parameter.value);
                    }
                    inputNumber.valueChanged.addHandler(function (sender) {
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, sender.value); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._generateDateTimeEditor = function (parameter) {
                var _this = this;
                var element, input;
                if (parameter.multiValue) {
                    element = this._createTextarea(parameter.value, parameter.dataType);
                    element.title = _ParametersEditor._dateTimeFormat;
                    this._bindTextChangedEvent(element, parameter);
                }
                else {
                    element = document.createElement('div');
                    if (parameter.dataType == viewer._ParameterType.Date
                        || parameter.dataType === viewer._ParameterType.DateTime) {
                        input = new wijmo.input.InputDate(element);
                    }
                    else {
                        input = new wijmo.input.InputTime(element);
                        input.step = 60;
                    }
                    input.isRequired = !parameter.nullable;
                    if (parameter.value) {
                        input.value = new Date(parameter.value);
                    }
                    input.valueChanged.addHandler(function () {
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, input.value.toJSON()); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._validateNullValueOfParameter = function (element) {
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
            };
            _ParametersEditor._paramIdAttr = 'param-id';
            _ParametersEditor._errorsHiddenCss = 'wj-parametererrors-hidden';
            _ParametersEditor._dateTimeFormat = 'MM/dd/yyyy HH:mm';
            return _ParametersEditor;
        }(wijmo.Control));
        viewer._ParametersEditor = _ParametersEditor;
        // Extends MultiSelect control with Select All function.
        var _MultiSelectEx = (function () {
            function _MultiSelectEx(element) {
                this._selectedAll = false;
                this._innerCheckedItemsChanged = false;
                this.checkedItemsChanged = new wijmo.Event();
                var self = this, multiSelect = new wijmo.input.MultiSelect(element);
                self._multiSelect = multiSelect;
                multiSelect.checkedItemsChanged.addHandler(self.onCheckedItemsChanged, self);
                multiSelect.isDroppedDownChanged.addHandler(self.onIsDroppedDownChanged, self);
                multiSelect.headerFormatter = function () { return self._updateHeader(); };
            }
            _MultiSelectEx.prototype._updateHeader = function () {
                var self = this, checkedItems = self.checkedItems || [], texts = [], displayMemberPath = self.displayMemberPath;
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
            };
            _MultiSelectEx.prototype.onIsDroppedDownChanged = function () {
                if (!this._multiSelect.isDroppedDown) {
                    return;
                }
                this._updateSelectedAll();
            };
            _MultiSelectEx.prototype.onCheckedItemsChanged = function (sender, e) {
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
            };
            Object.defineProperty(_MultiSelectEx.prototype, "isEditable", {
                get: function () {
                    return this._multiSelect.isEditable;
                },
                set: function (value) {
                    this._multiSelect.isEditable = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "isDisabled", {
                get: function () {
                    return this._multiSelect.isDisabled;
                },
                set: function (value) {
                    this._multiSelect.isDisabled = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "displayMemberPath", {
                get: function () {
                    return this._multiSelect.displayMemberPath;
                },
                set: function (value) {
                    this._multiSelect.displayMemberPath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "selectedValuePath", {
                get: function () {
                    return this._multiSelect.selectedValuePath;
                },
                set: function (value) {
                    this._multiSelect.selectedValuePath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "itemsSource", {
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    var self = this, displayMemberPath = self.displayMemberPath || 'name';
                    self._itemsSource = value;
                    var innerSources = [];
                    if (value) {
                        if (value.length > 1) {
                            self._selectAllItem = {};
                            self._selectAllItem[displayMemberPath] = wijmo.culture.Viewer.parameterSelectAllItemText;
                            innerSources.push(self._selectAllItem);
                        }
                        else {
                            self._selectAllItem = null;
                        }
                        innerSources = innerSources.concat(value);
                    }
                    self._multiSelect.itemsSource = innerSources;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "checkedItems", {
                get: function () {
                    var self = this, items = [];
                    if (self._multiSelect.checkedItems) {
                        items = self._multiSelect.checkedItems.slice();
                    }
                    var index = items.indexOf(self._selectAllItem);
                    if (index > -1) {
                        items.splice(index, 1);
                    }
                    return items;
                },
                set: function (value) {
                    var self = this;
                    self._multiSelect.checkedItems = value;
                    self._selectedAll = false;
                    self._updateSelectedAll();
                },
                enumerable: true,
                configurable: true
            });
            _MultiSelectEx.prototype._updateSelectedAll = function () {
                var self = this;
                if (!self._selectAllItem) {
                    return;
                }
                var checkedItems = self._multiSelect.checkedItems || [], selectedAllIndex = checkedItems.indexOf(self._selectAllItem), selectedAll = selectedAllIndex > -1, selectAllItemChanged = self._selectedAll !== selectedAll;
                if (selectAllItemChanged) {
                    self._selectedAll = selectedAll;
                    self._innerCheckedItemsChanged = true;
                    if (self._selectedAll) {
                        self._multiSelect.checkedItems = self._multiSelect.itemsSource.slice();
                    }
                    else {
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
                }
                else {
                    checkedItems = checkedItems.slice();
                    checkedItems.splice(selectedAllIndex, 1);
                    self._multiSelect.checkedItems = checkedItems;
                }
                self._innerCheckedItemsChanged = false;
            };
            return _MultiSelectEx;
        }());
        viewer._MultiSelectEx = _MultiSelectEx;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ReportViewer.js.map