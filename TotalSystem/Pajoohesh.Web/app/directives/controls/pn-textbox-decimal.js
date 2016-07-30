define(['directives/controls/pnControls'], function (control) {


    control.directive('pnTextboxDecimal', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                title: '@',
                name: '@'
            },
            template: '<input type="text"  class="form-control auto" name="{{ name }}" />'
        };
    });
})