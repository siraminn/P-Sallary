define(['directives/controls/pnControls'], function (control) {
    control.directive('pnTextboxNumber', function () {
        return {
            restrict: 'E',
            replace: 'true',
            template: '<input type="text" class="form-control"/> ',
            link: function (scope, elem, attrs) {

                elem.bind('keypress', function (e) {
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        return false;
                    }
                });
            }
        };
    });
});