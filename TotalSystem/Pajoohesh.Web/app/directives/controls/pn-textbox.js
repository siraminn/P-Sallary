define(['directives/controls/pnControls'], function (control) {
    control.directive('pnTextbox', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                title: '@',
                name: '@'
            },
            template: '<input type="text"  class="form-control"  name="{{ name }}" />'
        };
    });
});