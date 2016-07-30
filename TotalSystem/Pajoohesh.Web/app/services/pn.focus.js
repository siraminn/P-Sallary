define(['app'], function (app) {
    app.factory('pn.focus', function ($timeout, $window) {
        function setFocus(popertyName) {
            var element = $window.document.querySelectorAll('[ng-model=\'' + popertyName + '\']');
            $timeout(function () {
                if (element) {
                    $(element).focus();
                    $(element).select();
                }

            });
        };

        return {
            setFocus
        }
    });
});