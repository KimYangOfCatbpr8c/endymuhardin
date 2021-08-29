'use strict';

// get reference to app module
var app = angular.module('app');

// controller
app.controller('appCtrl', function ($scope) {
    $scope.dialogs = {};

    // submit form
    $scope.submit = function (e) {

        // process the form variables here...
        var form = e.target;
        console.log('** submitting form ' + form.name);

        // hide the dialog
        var popup = wijmo.Control.getControl(wijmo.closest(form, '.wj-popup'));
        popup.hide('submit');
    }

    // show create account form based on dialog-result
    $scope.hiding = function (s, e) {
        switch (s.dialogResult) {
            case 'wj-hide-create':
                $scope.dialogs.create.show(true);
                break;
        }
    }

    // add/remove classes used for custom animation
    $scope.showingAnimated = function (s, e) {
        setTimeout(function () {
            wijmo.toggleClass(s.hostElement, 'custom-animation-visible', true);
        });
    }
    $scope.hidingAnimated = function (s, e) {
        setTimeout(function () {
            wijmo.toggleClass(s.hostElement, 'custom-animation-visible', false);
        });
    }

    // using the Popup control with Promises
    $scope.browserSupportsPromises = typeof Promise !== 'undefined';
    $scope.popupPromise = function () {

        // get the promise
        var promise = getPopupPromise();

        // execute the promise
        promise.then(
            function (result) {
                console.log('** Promise was resolved, handle the dialog data');
            },
            function (err) {
                console.log('** Promise was rejected, ignore the dialog data');
            });
    }

    // get a promise for a popup
    function getPopupPromise() {
        var p = new Promise(function (resolve, reject) {
            var popup = $scope.dialogs.login;
            popup.show(true);
            popup.hidden.addHandler(function () {
                popup.hidden.removeAllHandlers();
                if (popup.dialogResult == 'submit') {
                    resolve(popup);
                } else {
                    reject(popup);
                }
            });
        });
        return p;
    }
});
