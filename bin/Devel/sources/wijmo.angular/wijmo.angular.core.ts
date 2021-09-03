//
// AngularJS directives for wijmo module
//
module wijmo.angular {
    //#region "Container directives registration"

    var wijmoContainers = window['angular'].module('wj.container', []);

    wijmoContainers.directive('wjTooltip', [function () {
        return new WjTooltip();
    }]);

    wijmoContainers.directive('wjValidationError', [function () {
        return new WjValidationError();
    }]);
    //#endregion "Container directives definitions"

    //#region "Container directives classes"

    /**
     * AngularJS directive for the @see:Tooltip class.
     *
     * Use the <b>wj-tooltip</b> directive to add tooltips to elements on the page. 
     * The wj-tooltip directive supports HTML content, smart positioning, and touch.
     *
     * The wj-tooltip directive is specified as a parameter added to the 
     * element that the tooltip applies to. The parameter value is the tooltip
     * text or the id of an element that contains the text. For example:
     *
     * <pre>&lt;p wj-tooltip="#fineprint" &gt;
     *     Regular paragraph content...&lt;/p&gt;
     * ...
     * &lt;div id="fineprint" style="display:none"&gt;
     *   &lt;h3&gt;Important Note&lt;/h3&gt;
     *   &lt;p&gt;
     *     Data for the current quarter is estimated 
     *     by pro-rating etc.&lt;/p&gt;
     * &lt;/div&gt;</pre>
     */
    class WjTooltip extends WjDirective {

        // Initializes a new instance of WjTooltip
        constructor() {
            super();
            this.restrict = 'A';
            this.template = '';
        }
        
        // Returns Wijmo Tooltip control constructor
        get _controlConstructor() : any { 
            return wijmo.Tooltip;
        }
        
        _initControl(element: any): any {
            return new wijmo.Tooltip();
        }

        _createLink(): WjLink {
            return new WjTooltipLink();
        }
    }

    class WjTooltipLink extends WjLink {
        //override
        public _link() {
            super._link();

            var tt = <wijmo.Tooltip><any>this.control, // hack as Tooltip is not Control
                self = this;
            (<any>this.tAttrs).$observe('wjTooltip', function (value) {
                tt.setTooltip(self.tElement[0], value);
            });
        }
    }

    /**
     * AngularJS directive for custom validations based on expressions.
     *
     * The <b>wj-validation-error</b> directive supports both AngularJS and native HTML5 
     * validation mechanisms. It accepts an arbitrary AngularJS expression that should return 
     * an error message string in case of the invalid input and an empty string if the input is valid.
     * 
     * For AngularJS validation it should be used together with the <b>ng-model</b> directive. 
     * In this case the <b>wj-validation-error</b> directive reports an error using a call
     * to the <b>NgModelController.$setValidity</b> method with the <b>wjValidationError</b> error key , 
     * in the same way as it happens with AngularJS native and custom validation directives.
     * 
     * For HTML5 validation, the <b>wj-validation-error</b> directive sets the error state to the 
     * element using the <b>setCustomValidity</b> method from the HTML5 validation API. For example:
     *
     * <pre>&lt;p&gt;HTML5 validation:&lt;/p&gt;
     * &lt;form&gt;
     *     &lt;input type="password"
     *         placeholder="Password" 
     *         name="pwd" ng-model="thePwd" 
     *         required minlength="2" /&gt;
     *     &lt;input type="password"
     *         placeholder="Check Password"
     *         name="chk" ng-model="chkPwd"
     *         wj-validation-error="chkPwd != thePwd ? 'Passwords don\'t match' : ''" /&gt;
     * &lt;/form&gt;
     *
     * &lt;p&gt;AngularJS validation:&lt;/p&gt;
     * &lt;form name="ngForm" novalidate&gt;
     *     &lt;input type="password"
     *         placeholder="Password" 
     *         name="pwd" ng-model="thePwd" 
     *         required minlength="2" /&gt;
     *     &lt;input type="password"
     *         placeholder="Check Password"
     *         name="chk" ng-model="chkPwd"
     *         wj-validation-error="chkPwd != thePwd" /&gt;
     *     &lt;div 
     *         ng-show="ngForm.chk.$error.wjValidationError && !ngForm.chk.$pristine"&gt;
     *         Sorry, the passwords don't match.
     *     &lt;/div&gt;
     * &lt;/form&gt;</pre>
     *
     */
    class WjValidationError extends WjDirective {

        // Initializes a new instance of WjValidationError
        constructor() {
            super();
            this.restrict = 'A';
            this.template = '';
            this.require = 'ngModel';
            this.scope = false;
        }

        _postLinkFn() {
            return function (scope: any, tElement: ng.IAugmentedJQuery, tAttrs: ng.IAttributes, controller: any) {
                            // scope, elm, attrs, ctl
                // directive name
                var dn = 'wjValidationError';

                // update valid state when the expression result changes
                scope.$watch(tAttrs[dn], function (errorMsg) {

                    // get input element to validate
                    var e = <any>(tElement[0].tagName == 'INPUT' ? tElement[0] : tElement[0].querySelector('input'));

                    // accept booleans as well as strings
                    if (typeof (errorMsg) == 'boolean') {
                        errorMsg = errorMsg ? 'error' : '';
                    }

                    // HTML5 validation
                    if (e && e.setCustomValidity) {
                        e.setCustomValidity(errorMsg);
                    }

                    // AngularJS validation
                    if (controller) {
                        controller.$setValidity(dn, errorMsg ? false : true);
                    }
                });
            };
        }

        _getMetaDataId(): any {
            return 'ValidationError';
        }

    }


    //#endregion "Container directives classes"
} 